import { Router, type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";
import {
  isMysqlActive,
  ensureMysqlConnected,
  getMysqlPool,
  withMysqlTransaction,
  parseJsonSafe,
  stringifyJsonSafe,
} from "./mysqlDb";

export interface AuthenticatedUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  isAdmin: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

type RequireAuthMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<any> | any;

function genId(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${crypto.randomBytes(4).toString("hex")}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

const PLACEHOLDER_AGENCY_NAMES = new Set([
  "mon agence b2b",
  "mon agence",
  "mon agence partenaire",
  "agence b2b",
  "agence partenaire",
  "agence sans nom",
  "agence",
  "une agence",
  "my agency",
  "agency",
  "unknown",
  "inconnue",
  "non spécifiée",
  "non specifiee",
  "n/a",
  "none",
  "null",
  "undefined",
]);

function isPlaceholderAgencyName(value: any): boolean {
  if (!value || typeof value !== "string") return true;
  const normalized = value.trim().toLowerCase().replace(/\s+/g, " ");
  if (!normalized) return true;
  return PLACEHOLDER_AGENCY_NAMES.has(normalized);
}

function isEmailLike(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function cleanAgencyCandidate(value: any): string {
  if (!value || typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed || isPlaceholderAgencyName(trimmed)) return "";
  return trimmed;
}

function resolveAgencyNameFromRow(userRow: any, candidateName?: any, fallbackEmail?: string): string {
  const raw = userRow && typeof userRow.rawData === "string"
    ? parseJsonSafe<Record<string, any>>(userRow.rawData, {})
    : (userRow || {});

  const rowCandidates = [
    userRow?.agencyName,
    raw?.agencyName,
    userRow?.companyName,
    raw?.companyName,
    userRow?.name,
    raw?.name,
    userRow?.managerName,
    raw?.managerName,
  ];

  for (const c of rowCandidates) {
    const clean = cleanAgencyCandidate(c);
    if (clean && !isEmailLike(clean)) {
      return clean;
    }
  }

  const cleanCandidate = cleanAgencyCandidate(candidateName);
  if (cleanCandidate && !isEmailLike(cleanCandidate)) {
    return cleanCandidate;
  }

  const emailCandidate =
    cleanAgencyCandidate(userRow?.email) ||
    cleanAgencyCandidate(raw?.email) ||
    cleanAgencyCandidate(fallbackEmail) ||
    cleanCandidate;

  return emailCandidate || "Agence Partenaire";
}

async function fetchAuthoritativeAgencyName(
  connOrPool: any,
  agencyId: string,
  candidateName?: any,
  fallbackEmail?: string
): Promise<string> {
  try {
    if (agencyId) {
      const [rows] = await connOrPool.query(
        "SELECT id, email, name, agencyName, companyName, managerName, rawData FROM users WHERE id = ? LIMIT 1",
        [agencyId]
      );
      if (Array.isArray(rows) && rows.length > 0) {
        return resolveAgencyNameFromRow(rows[0], candidateName, fallbackEmail);
      }
    }
    const emailLookup = cleanAgencyCandidate(fallbackEmail) || (typeof candidateName === "string" && isEmailLike(candidateName) ? candidateName.trim() : "");
    if (emailLookup) {
      const [rows] = await connOrPool.query(
        "SELECT id, email, name, agencyName, companyName, managerName, rawData FROM users WHERE email = ? LIMIT 1",
        [emailLookup.toLowerCase()]
      );
      if (Array.isArray(rows) && rows.length > 0) {
        return resolveAgencyNameFromRow(rows[0], candidateName, fallbackEmail);
      }
    }
  } catch {
    // Repli silencieux sur les candidats disponibles
  }
  return resolveAgencyNameFromRow(null, candidateName, fallbackEmail);
}

function mapUserRow(row: any) {
  if (!row) return null;
  const raw = parseJsonSafe<Record<string, any>>(row.rawData, {});
  const rawAgencyName = cleanAgencyCandidate(row.agencyName) || cleanAgencyCandidate(raw.agencyName);
  const rawCompanyName = cleanAgencyCandidate(row.companyName) || cleanAgencyCandidate(raw.companyName);
  const rawName = cleanAgencyCandidate(row.name) || cleanAgencyCandidate(raw.name);
  const resolvedAgencyName = rawAgencyName || rawCompanyName || rawName || "";
  return {
    ...raw,
    id: row.id,
    email: row.email,
    name: row.name || raw.name || "",
    agencyName: resolvedAgencyName,
    companyName: row.companyName || raw.companyName || "",
    phone: row.phone || raw.phone || "",
    rc: row.rc || raw.rc || "",
    rcNumber: row.rc || raw.rcNumber || "",
    nif: row.nif || raw.nif || "",
    nifNumber: row.nif || raw.nifNumber || "",
    managerName: row.managerName || raw.managerName || "",
    address: row.address || raw.address || "",
    wilaya: row.wilaya || raw.wilaya || "",
    role: row.role || "agency",
    status: row.status || "PENDING",
    balance: Number(row.balance || 0),
    applicationsCount: Number(row.applicationsCount || 0),
    b2cMarginPercent: Number(row.b2cMarginPercent ?? 15),
    bannedUntil: row.bannedUntil || undefined,
    banReason: row.banReason || undefined,
    createdAt: row.createdAt,
  };
}

function mapCountryRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    agencyName: row.agencyName || undefined,
    flag: row.flag || "",
    active: Boolean(row.active),
    visaTypes: parseJsonSafe<any[]>(row.visaTypes, []),
  };
}

function mapServiceRow(row: any) {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    destination: row.destination,
    flag: row.flag || "",
    price: Number(row.price || 0),
    processingTime: row.processingTime || "",
    description: row.description || "",
    requiredDocuments: parseJsonSafe<string[]>(row.requiredDocuments, []),
    conditions: parseJsonSafe<string[]>(row.conditions, []),
    active: Boolean(row.active),
  };
}

function buildCatalogMediaUrl(kind: "trip" | "study-program", id: string, version?: string): string {
  const v = version ? `?v=${encodeURIComponent(version)}` : "";
  return `/api/db/media/${kind}/${encodeURIComponent(id)}${v}`;
}

function mapTripRow(row: any) {
  return {
    id: row.id,
    title: row.title,
    destination: row.destination,
    startDate: row.startDate || "",
    endDate: row.endDate || "",
    price: Number(row.price || 0),
    description: row.description || "",
    totalSeats: Number(row.totalSeats || 0),
    availableSeats: Number(row.availableSeats || 0),
    image: row.image || undefined,
    photoUrl: row.photoUrl || undefined,
    featured: Boolean(row.featured),
    status: row.status || "active",
    customFormFields: parseJsonSafe<any[]>(row.customFormFields, []),
    createdAt: row.createdAt,
  };
}

function mapTripListRow(row: any) {
  const base = mapTripRow(row);
  const version = String(row.updatedAt || row.createdAt || "1");
  const mediaUrl = buildCatalogMediaUrl("trip", String(row.id), version);
  const image =
    base.image === "__MEDIA__" || isLargeInlineDataUrl(base.image) ? mediaUrl : base.image;
  const photoUrl =
    base.photoUrl === "__MEDIA__" || isLargeInlineDataUrl(base.photoUrl) ? mediaUrl : base.photoUrl;
  return {
    ...base,
    image,
    photoUrl,
  };
}

function mapStudyProgramRow(row: any) {
  return {
    id: row.id,
    title: row.title,
    country: row.country,
    countryFlag: row.countryFlag || "",
    university: row.university,
    city: row.city || "",
    type: row.type,
    description: row.description || "",
    admissionConditions: parseJsonSafe<string[]>(row.admissionConditions, []),
    conditions: row.conditions || "",
    processingTime: row.processingTime || "",
    intake: row.intake || "",
    languageOfStudy: row.languageOfStudy || "",
    price: Number(row.price || 0),
    tuitionFeeYear: row.tuitionFeeYear || "",
    requiredDocuments: parseJsonSafe<string[]>(row.requiredDocuments, []),
    image: row.image || undefined,
    status: row.status || "active",
    createdAt: row.createdAt,
  };
}

function mapStudyProgramListRow(row: any) {
  const base = mapStudyProgramRow(row);
  const version = String(row.updatedAt || row.createdAt || "1");
  const image =
    base.image === "__MEDIA__" || isLargeInlineDataUrl(base.image)
      ? buildCatalogMediaUrl("study-program", String(row.id), version)
      : base.image;
  return {
    ...base,
    image,
  };
}

const INLINE_BLOB_THRESHOLD = 2048;

const APP_LIST_SELECT = `
  id, agencyId, agencyName, serviceType, country, visaType, travelerName, passportNumber, status, price, submissionDate,
  CASE WHEN CHAR_LENGTH(finalDocument) > 2048 AND finalDocument LIKE 'data:%' THEN CONCAT('deferred:app:', id, ':finalDocument') ELSE finalDocument END AS finalDocument,
  finalDocumentName, finalDocumentDate, adminNotes, extraData,
  CASE WHEN CHAR_LENGTH(customFormData) > 16384 AND customFormData LIKE '%data:%' THEN '__DEFERRED__' ELSE customFormData END AS customFormData,
  CASE WHEN CHAR_LENGTH(attachments) > 16384 AND attachments LIKE '%data:%' THEN '__DEFERRED__' ELSE attachments END AS attachments,
  timeline
`;

const STUDY_APP_LIST_SELECT = `
  id, programId, programTitle, country, countryFlag, university, city, agencyId, agencyName,
  studentName, passportNumber, email, phone, status, price, paidAmount, paymentStatus, submissionDate,
  CASE WHEN CHAR_LENGTH(finalDocument) > 2048 AND finalDocument LIKE 'data:%' THEN CONCAT('deferred:study:', id, ':finalDocument') ELSE finalDocument END AS finalDocument,
  finalDocumentName, finalDocumentDate, adminNotes,
  CASE WHEN CHAR_LENGTH(documents) > 16384 AND documents LIKE '%data:%' THEN '__DEFERRED__' ELSE documents END AS documents,
  CASE WHEN CHAR_LENGTH(attachments) > 16384 AND attachments LIKE '%data:%' THEN '__DEFERRED__' ELSE attachments END AS attachments,
  timeline
`;

const TICKET_LIST_SELECT = `
  id, agencyId, agencyName, subject, description, category, priority, status, isUrgent,
  applicationId, applicationRef, applicationSummary,
  CASE WHEN CHAR_LENGTH(attachments) > 16384 AND attachments LIKE '%data:%' THEN '__DEFERRED__' ELSE attachments END AS attachments,
  CASE WHEN CHAR_LENGTH(messages) > 16384 AND messages LIKE '%data:%' THEN '__DEFERRED__' ELSE messages END AS messages,
  createdAt
`;

const TRIP_LIST_SELECT = `
  id, title, destination, startDate, endDate, price, description, totalSeats, availableSeats,
  CASE WHEN CHAR_LENGTH(image) > 2048 AND image LIKE 'data:%' THEN '__MEDIA__' ELSE image END AS image,
  CASE WHEN CHAR_LENGTH(photoUrl) > 2048 AND photoUrl LIKE 'data:%' THEN '__MEDIA__' ELSE photoUrl END AS photoUrl,
  featured, status, customFormFields, createdAt, updatedAt
`;

const STUDY_PROGRAM_LIST_SELECT = `
  id, title, country, countryFlag, university, city, type, description, admissionConditions, conditions,
  processingTime, intake, languageOfStudy, price, tuitionFeeYear, requiredDocuments,
  CASE WHEN CHAR_LENGTH(image) > 2048 AND image LIKE 'data:%' THEN '__MEDIA__' ELSE image END AS image,
  status, createdAt, updatedAt
`;

function isLargeInlineDataUrl(val: unknown): val is string {
  return typeof val === "string" && val.startsWith("data:") && val.length > INLINE_BLOB_THRESHOLD;
}

function isDeferredMarker(val: unknown): boolean {
  return typeof val === "string" && val.startsWith("deferred:");
}

function stripInlineBase64FromTree(
  value: any,
  markerPrefix: string
): { value: any; stripped: boolean } {
  if (value === null || value === undefined) return { value, stripped: false };
  if (typeof value === "string") {
    if (isLargeInlineDataUrl(value)) {
      return { value: markerPrefix, stripped: true };
    }
    return { value, stripped: false };
  }
  if (Array.isArray(value)) {
    let anyStripped = false;
    const next = value.map((item, idx) => {
      const res = stripInlineBase64FromTree(item, `${markerPrefix}:${idx}`);
      if (res.stripped) anyStripped = true;
      return res.value;
    });
    return { value: next, stripped: anyStripped };
  }
  if (typeof value === "object") {
    let anyStripped = false;
    const next: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      const res = stripInlineBase64FromTree(v, `${markerPrefix}:${encodeURIComponent(k)}`);
      if (res.stripped) anyStripped = true;
      next[k] = res.value;
    }
    return { value: next, stripped: anyStripped };
  }
  return { value, stripped: false };
}

function stripAttachmentsForList(
  attachments: any[],
  markerPrefix: string
): { attachments: any[]; stripped: boolean } {
  if (!Array.isArray(attachments) || attachments.length === 0) {
    return { attachments: [], stripped: false };
  }
  let anyStripped = false;
  const next = attachments.map((att, idx) => {
    if (!att || typeof att !== "object") return att;
    const hasHeavyDataUrl = isLargeInlineDataUrl(att.dataUrl);
    const hasHeavyUrl = isLargeInlineDataUrl(att.url);
    if (!hasHeavyDataUrl && !hasHeavyUrl) return att;
    anyStripped = true;
    const marker = `${markerPrefix}:att:${encodeURIComponent(String(att.id || idx))}`;
    return {
      ...att,
      dataUrl: "",
      url: hasHeavyUrl ? marker : (att.url || marker),
      deferred: true,
    };
  });
  return { attachments: next, stripped: anyStripped };
}

function restoreDeferredTree(incoming: any, existing: any): any {
  if (isDeferredMarker(incoming)) {
    return existing !== undefined ? existing : incoming;
  }
  if (Array.isArray(incoming) && Array.isArray(existing)) {
    return incoming.map((item, idx) => restoreDeferredTree(item, existing[idx]));
  }
  if (
    incoming &&
    typeof incoming === "object" &&
    !Array.isArray(incoming) &&
    existing &&
    typeof existing === "object" &&
    !Array.isArray(existing)
  ) {
    const out: Record<string, any> = { ...incoming };
    for (const [k, v] of Object.entries(incoming)) {
      out[k] = restoreDeferredTree(v, existing[k]);
    }
    return out;
  }
  return incoming;
}

function restoreDeferredAttachments(incoming: any[], existing: any[]): any[] {
  if (!Array.isArray(incoming)) return existing || [];
  const existingArr = Array.isArray(existing) ? existing : [];
  return incoming.map((att) => {
    if (!att || typeof att !== "object") return att;
    const needsRestore = Boolean(att.deferred) || isDeferredMarker(att.url) || (!att.dataUrl && !att.url);
    if (!needsRestore) return att;
    const match = existingArr.find(
      (ex) =>
        ex &&
        ((att.id && ex.id === att.id) ||
          (att.storageId && ex.storageId === att.storageId) ||
          (att.name && ex.name === att.name))
    );
    if (!match) return att;
    const cleaned = { ...att };
    delete cleaned.deferred;
    return {
      ...cleaned,
      dataUrl: cleaned.dataUrl || match.dataUrl || "",
      url: isDeferredMarker(cleaned.url) ? (match.url || "") : (cleaned.url || match.url),
    };
  });
}

function buildAgencyInClause(agencyIds: string[]): { clause: string; params: string[] } {
  const unique = Array.from(new Set(agencyIds.map((v) => String(v || "").trim()).filter(Boolean)));
  if (unique.length <= 1) {
    return { clause: "agencyId = ?", params: [unique[0] || ""] };
  }
  return {
    clause: `agencyId IN (${unique.map(() => "?").join(", ")})`,
    params: unique,
  };
}

function mapUserListRow(row: any) {
  const mapped = mapUserRow(row);
  if (!mapped) return null;
  // Éviter de renvoyer d'éventuelles pièces jointes base64 embarquées dans rawData lors du listing admin
  const clean: Record<string, any> = {};
  for (const [k, v] of Object.entries(mapped)) {
    if (!isLargeInlineDataUrl(v)) {
      clean[k] = v;
    }
  }
  return clean;
}

function mapApplicationRow(row: any) {
  return {
    id: row.id,
    agencyId: row.agencyId,
    agencyName: row.agencyName,
    serviceType: row.serviceType,
    country: row.country,
    visaType: row.visaType,
    travelerName: row.travelerName,
    passportNumber: row.passportNumber || "",
    status: row.status,
    price: Number(row.price || 0),
    submissionDate: row.submissionDate,
    finalDocument: row.finalDocument || undefined,
    finalDocumentName: row.finalDocumentName || undefined,
    finalDocumentDate: row.finalDocumentDate || undefined,
    adminNotes: row.adminNotes || undefined,
    extraData: parseJsonSafe<Record<string, string> | undefined>(row.extraData, undefined),
    customFormData: parseJsonSafe<Record<string, any> | undefined>(row.customFormData, undefined),
    attachments: parseJsonSafe<any[]>(row.attachments, []),
    timeline: parseJsonSafe<any[]>(row.timeline, []),
  };
}

function mapApplicationListRow(row: any) {
  const rawCustomDeferred = row.customFormData === "__DEFERRED__";
  const rawAttDeferred = row.attachments === "__DEFERRED__";
  const safeRow = {
    ...row,
    customFormData: rawCustomDeferred ? null : row.customFormData,
    attachments: rawAttDeferred ? "[]" : row.attachments,
  };
  const base = mapApplicationRow(safeRow);
  let hasDeferredAssets = rawCustomDeferred || rawAttDeferred;
  let finalDocument = base.finalDocument;
  if (isDeferredMarker(finalDocument)) {
    hasDeferredAssets = true;
  } else if (isLargeInlineDataUrl(finalDocument)) {
    finalDocument = `deferred:app:${base.id}:finalDocument`;
    hasDeferredAssets = true;
  }
  const attRes = stripAttachmentsForList(base.attachments || [], `deferred:app:${base.id}`);
  if (attRes.stripped) hasDeferredAssets = true;

  const customRes = base.customFormData
    ? stripInlineBase64FromTree(base.customFormData, `deferred:app:${base.id}:customFormData`)
    : { value: undefined, stripped: false };
  if (customRes.stripped) hasDeferredAssets = true;

  return {
    ...base,
    finalDocument,
    attachments: attRes.attachments,
    customFormData: customRes.value,
    ...(hasDeferredAssets ? { hasDeferredAssets: true } : {}),
  };
}

function mapTripReservationRow(row: any) {
  return {
    id: row.id,
    tripId: row.tripId,
    agencyId: row.agencyId,
    agencyName: row.agencyName || "",
    clientName: row.clientName || "",
    clientEmail: row.clientEmail || "",
    clientPhone: row.clientPhone || "",
    notes: row.notes || "",
    customFormData: parseJsonSafe<any>(row.customFormData, undefined),
    numberOfPeople: Number(row.numberOfPeople || 1),
    status: row.status || "pending",
    totalPrice: Number(row.totalPrice || 0),
    paidAmount: Number(row.paidAmount || 0),
    passengerNames: parseJsonSafe<string[]>(row.passengerNames, []),
    createdAt: row.createdAt,
  };
}

function mapStudyApplicationRow(row: any) {
  return {
    id: row.id,
    programId: row.programId,
    programTitle: row.programTitle || "",
    country: row.country || "",
    countryFlag: row.countryFlag || "",
    university: row.university || "",
    city: row.city || "",
    agencyId: row.agencyId,
    agencyName: row.agencyName,
    studentName: row.studentName,
    passportNumber: row.passportNumber || "",
    email: row.email || "",
    phone: row.phone || "",
    status: row.status,
    price: Number(row.price || 0),
    paidAmount: Number(row.paidAmount || 0),
    paymentStatus: row.paymentStatus || "unpaid",
    submissionDate: row.submissionDate,
    finalDocument: row.finalDocument || undefined,
    finalDocumentName: row.finalDocumentName || undefined,
    finalDocumentDate: row.finalDocumentDate || undefined,
    adminNotes: row.adminNotes || undefined,
    documents: parseJsonSafe<Record<string, string>>(row.documents, {}),
    attachments: parseJsonSafe<any[]>(row.attachments, []),
    timeline: parseJsonSafe<any[]>(row.timeline, []),
  };
}

function mapStudyApplicationListRow(row: any) {
  const rawDocsDeferred = row.documents === "__DEFERRED__";
  const rawAttDeferred = row.attachments === "__DEFERRED__";
  const safeRow = {
    ...row,
    documents: rawDocsDeferred ? "{}" : row.documents,
    attachments: rawAttDeferred ? "[]" : row.attachments,
  };
  const base = mapStudyApplicationRow(safeRow);
  let hasDeferredAssets = rawDocsDeferred || rawAttDeferred;
  let finalDocument = base.finalDocument;
  if (isDeferredMarker(finalDocument)) {
    hasDeferredAssets = true;
  } else if (isLargeInlineDataUrl(finalDocument)) {
    finalDocument = `deferred:study:${base.id}:finalDocument`;
    hasDeferredAssets = true;
  }
  const attRes = stripAttachmentsForList(base.attachments || [], `deferred:study:${base.id}`);
  if (attRes.stripped) hasDeferredAssets = true;

  const docsRes = stripInlineBase64FromTree(base.documents || {}, `deferred:study:${base.id}:documents`);
  if (docsRes.stripped) hasDeferredAssets = true;

  return {
    ...base,
    finalDocument,
    attachments: attRes.attachments,
    documents: docsRes.value,
    ...(hasDeferredAssets ? { hasDeferredAssets: true } : {}),
  };
}

function mapTransactionRow(row: any) {
  return {
    id: row.id,
    agencyId: row.agencyId,
    agencyName: row.agencyName || "",
    type: row.type,
    amount: Number(row.amount || 0),
    date: row.date,
    ref: row.ref || undefined,
    note: row.note || undefined,
    description: row.description || undefined,
    status: row.status || "completed",
    createdAt: row.createdAt,
  };
}

function mapRechargeRow(row: any) {
  return {
    id: row.id,
    agencyId: row.agencyId,
    agencyName: row.agencyName,
    amount: Number(row.amount || 0),
    note: row.note || "",
    status: row.status || "Pending",
    date: row.date,
    createdAt: row.createdAt,
  };
}

function mapNotificationRow(row: any) {
  return {
    id: row.id,
    agencyId: row.agencyId,
    title: row.title,
    message: row.message,
    type: row.type || "info",
    read: Boolean(row.isRead),
    link: row.link || undefined,
    createdAt: row.createdAt,
  };
}

function mapTicketRow(row: any) {
  return {
    id: row.id,
    agencyId: row.agencyId,
    agencyName: row.agencyName,
    subject: row.subject,
    description: row.description || "",
    category: row.category || "Général",
    priority: row.priority || "Moyenne",
    status: row.status || "OPEN",
    isUrgent: Boolean(row.isUrgent),
    applicationId: row.applicationId || undefined,
    applicationRef: row.applicationRef || undefined,
    applicationSummary: parseJsonSafe<any>(row.applicationSummary, undefined),
    attachments: parseJsonSafe<any[]>(row.attachments, []),
    messages: parseJsonSafe<any[]>(row.messages, []),
    createdAt: row.createdAt,
  };
}

function mapTicketListRow(row: any) {
  const rawAttDeferred = row.attachments === "__DEFERRED__";
  const rawMsgsDeferred = row.messages === "__DEFERRED__";
  const safeRow = {
    ...row,
    attachments: rawAttDeferred ? "[]" : row.attachments,
    messages: rawMsgsDeferred ? "[]" : row.messages,
  };
  const base = mapTicketRow(safeRow);
  let hasDeferredAssets = rawAttDeferred || rawMsgsDeferred;
  const attRes = stripAttachmentsForList(base.attachments || [], `deferred:ticket:${base.id}`);
  if (attRes.stripped) hasDeferredAssets = true;

  const msgs = Array.isArray(base.messages)
    ? base.messages.map((msg, msgIdx) => {
        if (!msg || !Array.isArray(msg.attachments)) return msg;
        const msgAttRes = stripAttachmentsForList(
          msg.attachments,
          `deferred:ticket:${base.id}:msg:${msgIdx}`
        );
        if (msgAttRes.stripped) hasDeferredAssets = true;
        return { ...msg, attachments: msgAttRes.attachments };
      })
    : [];

  return {
    ...base,
    attachments: attRes.attachments,
    messages: msgs,
    ...(hasDeferredAssets ? { hasDeferredAssets: true } : {}),
  };
}

async function upsertUserRow(conn: any, user: any) {
  const id = String(user.id || "").trim();
  if (!id) return;
  const now = nowIso();
  const rawData = stringifyJsonSafe(user, "{}");
  await conn.query(
    `INSERT INTO users (
      id, email, name, agencyName, companyName, phone, rc, nif,
      managerName, address, wilaya, role, status, balance,
      applicationsCount, b2cMarginPercent, bannedUntil, banReason,
      createdAt, updatedAt, rawData
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      email = VALUES(email),
      name = VALUES(name),
      agencyName = VALUES(agencyName),
      companyName = VALUES(companyName),
      phone = VALUES(phone),
      rc = VALUES(rc),
      nif = VALUES(nif),
      managerName = VALUES(managerName),
      address = VALUES(address),
      wilaya = VALUES(wilaya),
      role = VALUES(role),
      status = VALUES(status),
      balance = VALUES(balance),
      applicationsCount = VALUES(applicationsCount),
      b2cMarginPercent = VALUES(b2cMarginPercent),
      bannedUntil = VALUES(bannedUntil),
      banReason = VALUES(banReason),
      updatedAt = VALUES(updatedAt),
      rawData = VALUES(rawData)`,
    [
      id,
      String(user.email || ""),
      String(user.name || ""),
      String(user.agencyName || user.name || ""),
      String(user.companyName || ""),
      String(user.phone || ""),
      String(user.rc || user.rcNumber || ""),
      String(user.nif || user.nifNumber || ""),
      String(user.managerName || ""),
      String(user.address || ""),
      String(user.wilaya || ""),
      String(user.role || "agency").toLowerCase(),
      String(user.status || "PENDING").toUpperCase(),
      Number(user.balance || 0),
      Number(user.applicationsCount || 0),
      typeof user.b2cMarginPercent === "number" ? user.b2cMarginPercent : 15,
      user.bannedUntil ? String(user.bannedUntil) : null,
      user.banReason ? String(user.banReason) : null,
      String(user.createdAt || now),
      now,
      rawData,
    ]
  );
}

export function createMysqlRouter(requireAuth: RequireAuthMiddleware): Router {
  const router = Router();

  const ensureMysql = async (_req: Request, res: Response, next: NextFunction) => {
    if (!isMysqlActive()) {
      const recovered = await ensureMysqlConnected();
      if (!recovered) {
        return res.status(503).json({
          error: "MYSQL_NOT_ACTIVE",
          message: "La base de données MySQL n'est pas configurée ou indisponible.",
        });
      }
    }
    return next();
  };

  const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ error: "Accès réservé aux administrateurs." });
    }
    return next();
  };

  router.use(ensureMysql);

  const getCatalogVersionOnly = async (pool: ReturnType<typeof getMysqlPool>) => {
    const [catAgg] = await pool.query<any[]>(`
      SELECT
        CONCAT_WS('|',
          (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM countries),
          (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM services),
          (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM organized_trips),
          (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM study_programs)
        ) AS ver
    `);
    return String(catAgg?.[0]?.ver || "");
  };

  const getSyncVersions = async (
    pool: ReturnType<typeof getMysqlPool>,
    agencyIds: string[],
    effectiveAdmin: boolean,
    precomputedCatalogVersion?: string
  ) => {
    const inFilter = buildAgencyInClause(agencyIds);
    const catalogSql =
      precomputedCatalogVersion !== undefined
        ? ""
        : `CONCAT_WS('|',
            (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM countries),
            (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM services),
            (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM organized_trips),
            (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM study_programs)
          ) AS catalogVersion,`;

    if (effectiveAdmin) {
      const [rows] = await pool.query<any[]>(`
        SELECT
          ${catalogSql}
          (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), ''), ':', COALESCE(SUM(balance), 0)) FROM users) AS userVer,
          CONCAT_WS('|',
            (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM applications),
            (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM study_applications),
            (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM trip_reservations),
            (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(createdAt), '')) FROM transactions),
            (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM recharge_requests),
            (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM support_tickets),
            (SELECT CONCAT(COUNT(*), ':', COALESCE(SUM(isRead), 0), ':', COALESCE(MAX(createdAt), '')) FROM notifications WHERE agencyId = 'admin')
          ) AS opsVer
      `);
      const catalogVersion = precomputedCatalogVersion !== undefined
        ? precomputedCatalogVersion
        : String(rows?.[0]?.catalogVersion || "");
      const userVer = String(rows?.[0]?.userVer || "");
      const opsVer = String(rows?.[0]?.opsVer || "");
      return {
        catalogVersion,
        syncVersion: `${catalogVersion}||${userVer}||${opsVer}`,
      };
    }

    const userIdFilter =
      inFilter.params.length <= 1
        ? { clause: "id = ?", params: [inFilter.params[0] || ""] }
        : { clause: `id IN (${inFilter.params.map(() => "?").join(", ")})`, params: inFilter.params };

    const [rows] = await pool.query<any[]>(
      `
      SELECT
        ${catalogSql}
        (SELECT CONCAT(COALESCE(MAX(updatedAt), ''), ':', COALESCE(SUM(balance), 0), ':', COALESCE(MAX(status), '')) FROM users WHERE ${userIdFilter.clause}) AS userVer,
        CONCAT_WS('|',
          (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM applications WHERE ${inFilter.clause}),
          (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM study_applications WHERE ${inFilter.clause}),
          (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM trip_reservations WHERE ${inFilter.clause}),
          (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(createdAt), '')) FROM transactions WHERE ${inFilter.clause}),
          (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM recharge_requests WHERE ${inFilter.clause}),
          (SELECT CONCAT(COUNT(*), ':', COALESCE(MAX(updatedAt), '')) FROM support_tickets WHERE ${inFilter.clause}),
          (SELECT CONCAT(COUNT(*), ':', COALESCE(SUM(isRead), 0), ':', COALESCE(MAX(createdAt), '')) FROM notifications WHERE ${inFilter.clause})
        ) AS opsVer
    `,
      [
        ...userIdFilter.params,
        ...inFilter.params,
        ...inFilter.params,
        ...inFilter.params,
        ...inFilter.params,
        ...inFilter.params,
        ...inFilter.params,
        ...inFilter.params,
      ]
    );

    const catalogVersion = precomputedCatalogVersion !== undefined
      ? precomputedCatalogVersion
      : String(rows?.[0]?.catalogVersion || "");
    const userVer = String(rows?.[0]?.userVer || "");
    const opsVer = String(rows?.[0]?.opsVer || "");
    return {
      catalogVersion,
      syncVersion: `${catalogVersion}||${userVer}||${opsVer}`,
    };
  };

  // =========================================================================
  // 1. CATALOGUE PUBLIC & MÉDIAS MIS EN CACHE (Page d'accueil + Agences)
  // =========================================================================
  const sendCatalogImageResponse = (res: Response, rawValue?: string | null) => {
    const val = typeof rawValue === "string" ? rawValue.trim() : "";
    if (!val) {
      return res.status(404).end();
    }
    if (val.startsWith("data:image/")) {
      const match = val.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/s);
      if (!match) return res.status(404).end();
      const mimeType = match[1].toLowerCase() === "image/jpg" ? "image/jpeg" : match[1].toLowerCase();
      const buffer = Buffer.from(match[2], "base64");
      res.setHeader("Content-Type", mimeType);
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
      return res.send(buffer);
    }
    if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/")) {
      return res.redirect(302, val);
    }
    return res.status(404).end();
  };

  router.get("/media/trip/:id", async (req, res) => {
    try {
      const [rows] = await getMysqlPool().query<any[]>(
        "SELECT photoUrl, image FROM organized_trips WHERE id = ? LIMIT 1",
        [req.params.id]
      );
      if (!rows || rows.length === 0) return res.status(404).end();
      return sendCatalogImageResponse(res, rows[0].photoUrl || rows[0].image);
    } catch {
      return res.status(500).end();
    }
  });

  router.get("/media/study-program/:id", async (req, res) => {
    try {
      const [rows] = await getMysqlPool().query<any[]>(
        "SELECT image FROM study_programs WHERE id = ? LIMIT 1",
        [req.params.id]
      );
      if (!rows || rows.length === 0) return res.status(404).end();
      return sendCatalogImageResponse(res, rows[0].image);
    } catch {
      return res.status(500).end();
    }
  });

  router.get("/catalog", async (_req, res) => {
    try {
      const pool = getMysqlPool();
      const [
        [countryRows],
        [serviceRows],
        [tripRows],
        [studyRows],
        catalogVersion,
      ] = await Promise.all([
        pool.query<any[]>("SELECT * FROM countries ORDER BY name ASC"),
        pool.query<any[]>("SELECT * FROM services ORDER BY updatedAt DESC"),
        pool.query<any[]>(`SELECT ${TRIP_LIST_SELECT} FROM organized_trips ORDER BY createdAt DESC`),
        pool.query<any[]>(`SELECT ${STUDY_PROGRAM_LIST_SELECT} FROM study_programs ORDER BY createdAt DESC`),
        getCatalogVersionOnly(pool),
      ]);

      res.setHeader("Cache-Control", "public, max-age=15, stale-while-revalidate=60");
      return res.json({
        catalogVersion,
        countries: countryRows.map(mapCountryRow),
        services: serviceRows.map(mapServiceRow),
        organizedTrips: tripRows.map(mapTripListRow),
        studyPrograms: studyRows.map(mapStudyProgramListRow),
      });
    } catch (err) {
      console.error("[MySQL /catalog]", err);
      return res.status(500).json({ error: "Erreur lecture catalogue MySQL." });
    }
  });

  // =========================================================================
  // 2. AUTHENTIFICATION, PROFIL & BOOTSTRAP INITIAL
  // =========================================================================
  router.get("/auth/me", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = (req.user!.email || "").toLowerCase();
      const pool = getMysqlPool();
      let [rows] = await pool.query<any[]>("SELECT * FROM users WHERE id = ? LIMIT 1", [uid]);
      if (rows.length === 0 && email) {
        [rows] = await pool.query<any[]>("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
      }
      if (rows.length > 0) {
        const userObj = mapUserRow(rows[0])!;
        if (req.user!.isAdmin && String(userObj.role || "").toLowerCase() !== "admin") {
          userObj.role = "admin";
          userObj.status = "ACTIVE";
          await upsertUserRow(pool, userObj);
        }
        return res.json({ user: userObj });
      }

      if (req.user!.isAdmin) {
        const adminProfile = {
          id: uid,
          email: req.user!.email,
          role: "admin",
          status: "ACTIVE",
          balance: 0,
          applicationsCount: 0,
          b2cMarginPercent: 15,
          createdAt: nowIso(),
        };
        await upsertUserRow(pool, adminProfile);
        return res.json({ user: adminProfile });
      }

      return res.status(404).json({ error: "Profil utilisateur introuvable." });
    } catch (err) {
      console.error("[MySQL /auth/me]", err);
      return res.status(500).json({ error: "Erreur récupération du profil." });
    }
  });

  router.post("/auth/register", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const body = req.body || {};
      const targetUid =
        req.user!.isAdmin && body.id ? String(body.id).trim() : req.user!.uid;

      if (!targetUid) {
        return res.status(400).json({ error: "Identifiant utilisateur manquant." });
      }

      const pool = getMysqlPool();
      const profile = {
        id: targetUid,
        email: String(body.email || req.user!.email || "").trim(),
        role: "agency",
        agencyName: String(body.agencyName || "").trim(),
        companyName: String(body.companyName || "").trim(),
        rc: String(body.rc || body.rcNumber || "").trim(),
        rcNumber: String(body.rcNumber || body.rc || "").trim(),
        nif: String(body.nif || body.nifNumber || "").trim(),
        nifNumber: String(body.nifNumber || body.nif || "").trim(),
        managerName: String(body.managerName || "").trim(),
        managerFirstName: String(body.managerFirstName || "").trim(),
        managerLastName: String(body.managerLastName || "").trim(),
        phone: String(body.phone || "").trim(),
        wilaya: String(body.wilaya || "").trim(),
        address: String(body.address || "").trim(),
        code: String(body.code || "").trim(),
        balance: 0,
        applicationsCount: 0,
        status: req.user!.isAdmin ? String(body.status || "ACTIVE").toUpperCase() : "PENDING",
        createdAt: nowIso(),
        notes: String(body.notes || "Inscription portail B2B"),
      };

      await upsertUserRow(pool, profile);
      return res.json({ success: true, user: profile });
    } catch (err) {
      console.error("[MySQL /auth/register]", err);
      return res.status(500).json({ error: "Erreur enregistrement agence." });
    }
  });

  router.get("/sync-version", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = (req.user!.email || "").toLowerCase();
      const isAdmin = Boolean(req.user!.isAdmin);
      const pool = getMysqlPool();

      let effectiveAdmin = isAdmin;
      let agencyIds = [uid];
      let [uRows] = await pool.query<any[]>("SELECT id, role FROM users WHERE id = ? LIMIT 1", [uid]);
      if (uRows.length === 0 && email) {
        [uRows] = await pool.query<any[]>("SELECT id, role FROM users WHERE email = ? LIMIT 1", [email]);
      }
      if (uRows.length > 0) {
        if (uRows[0].id && uRows[0].id !== uid) {
          agencyIds.push(String(uRows[0].id));
        }
        if (String(uRows[0].role || "").toLowerCase() === "admin") {
          effectiveAdmin = true;
        }
      }

      const versions = await getSyncVersions(pool, agencyIds, effectiveAdmin);
      return res.json(versions);
    } catch (err) {
      console.error("[MySQL /sync-version]", err);
      return res.status(500).json({ error: "Erreur vérification version sync." });
    }
  });

  router.get("/bootstrap", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = (req.user!.email || "").toLowerCase();
      const isAdmin = Boolean(req.user!.isAdmin);
      const explicitSkipCatalog = req.query.includeCatalog === "0";
      const clientCatalogVersion = typeof req.query.catalogVersion === "string" ? req.query.catalogVersion : "";
      const scopeRaw = typeof req.query.scope === "string" ? req.query.scope.trim().toLowerCase() : "all";
      const scope: "core" | "secondary" | "all" =
        scopeRaw === "core" ? "core" : scopeRaw === "secondary" ? "secondary" : "all";
      const pool = getMysqlPool();

      const [[userRowsById], precomputedCatalogVersion] = await Promise.all([
        pool.query<any[]>("SELECT * FROM users WHERE id = ? LIMIT 1", [uid]),
        !explicitSkipCatalog && clientCatalogVersion && scope !== "secondary"
          ? getCatalogVersionOnly(pool)
          : Promise.resolve(undefined),
      ]);

      let userRows = userRowsById;
      if (userRows.length === 0 && email) {
        [userRows] = await pool.query<any[]>("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
      }
      let currentUser: Record<string, any> | null =
        userRows.length > 0 ? mapUserRow(userRows[0]) : null;

      if (!currentUser && isAdmin) {
        currentUser = {
          id: uid,
          email: req.user!.email,
          role: "admin",
          status: "ACTIVE",
          balance: 0,
          applicationsCount: 0,
          b2cMarginPercent: 15,
          createdAt: nowIso(),
        };
        await upsertUserRow(pool, currentUser);
      }

      if (!currentUser) {
        return res.status(404).json({ error: "Profil introuvable." });
      }

      const effectiveAdmin = isAdmin || String(currentUser.role || "").toLowerCase() === "admin";
      const normalizedStatus = String(currentUser.status || "ACTIVE").toUpperCase();

      if (!effectiveAdmin && (normalizedStatus === "PENDING" || normalizedStatus === "REJECTED")) {
        return res.json({
          currentAgency: currentUser,
          role: "agency",
          restricted: true,
        });
      }

      const matchedAgencyIds = Array.from(new Set([uid, String(currentUser.id || "")].filter(Boolean)));
      const agencyFilter = buildAgencyInClause(matchedAgencyIds);

      const includeCatalog =
        !explicitSkipCatalog &&
        !(clientCatalogVersion && precomputedCatalogVersion !== undefined && clientCatalogVersion === precomputedCatalogVersion);

      const agencyLookupById = new Map<string, any>();
      const agencyLookupByEmail = new Map<string, any>();
      if (currentUser.id) agencyLookupById.set(currentUser.id, currentUser);
      if (currentUser.email) agencyLookupByEmail.set(String(currentUser.email).trim().toLowerCase(), currentUser);

      const buildEnricher = (agenciesList: any[]) => {
        for (const ag of agenciesList) {
          if (ag?.id) agencyLookupById.set(ag.id, ag);
          if (ag?.email) agencyLookupByEmail.set(String(ag.email).trim().toLowerCase(), ag);
        }
        return <T extends { agencyId?: string; agencyName?: string }>(item: T): T => {
          const stored = typeof item.agencyName === "string" ? item.agencyName.trim() : "";
          const matched =
            (item.agencyId ? agencyLookupById.get(item.agencyId) : undefined) ||
            (stored && isEmailLike(stored) ? agencyLookupByEmail.get(stored.toLowerCase()) : undefined);
          if (matched) {
            return {
              ...item,
              agencyName: resolveAgencyNameFromRow(matched, stored, matched.email),
            };
          }
          if (isPlaceholderAgencyName(stored)) {
            return {
              ...item,
              agencyName: item.agencyId ? `Agence #${String(item.agencyId).substring(0, 6)}` : "Agence Partenaire",
            };
          }
          return item;
        };
      };

      // =====================================================================
      // MODE RAPIDE "CORE" : Débloque immédiatement Dashboard & Mes Dossiers (<50ms)
      // =====================================================================
      if (scope === "core") {
        const [
          [appRows],
          [notifRows],
          [countryRows],
          [serviceRows],
          [agencyRows],
        ] = await Promise.all([
          effectiveAdmin
            ? pool.query<any[]>(`SELECT ${APP_LIST_SELECT} FROM applications ORDER BY submissionDate DESC LIMIT 300`)
            : pool.query<any[]>(
                `SELECT ${APP_LIST_SELECT} FROM applications WHERE ${agencyFilter.clause} ORDER BY submissionDate DESC LIMIT 200`,
                agencyFilter.params
              ),
          effectiveAdmin
            ? pool.query<any[]>("SELECT * FROM notifications WHERE agencyId = 'admin' ORDER BY createdAt DESC LIMIT 50")
            : pool.query<any[]>(
                `SELECT * FROM notifications WHERE ${agencyFilter.clause} ORDER BY createdAt DESC LIMIT 50`,
                agencyFilter.params
              ),
          includeCatalog ? pool.query<any[]>("SELECT * FROM countries ORDER BY name ASC") : Promise.resolve([[] as any[]]),
          includeCatalog ? pool.query<any[]>("SELECT * FROM services ORDER BY updatedAt DESC") : Promise.resolve([[] as any[]]),
          effectiveAdmin
            ? pool.query<any[]>(
                `SELECT id, email, name, agencyName, companyName, phone, rc, nif, managerName, address, wilaya, role, status, balance, applicationsCount, b2cMarginPercent, bannedUntil, banReason, createdAt
                 FROM users ORDER BY createdAt DESC`
              )
            : Promise.resolve([[] as any[]]),
        ]);

        const mappedAgencies = effectiveAdmin ? agencyRows.map(mapUserListRow).filter(Boolean) as any[] : [];
        const enrichWithAgencyName = buildEnricher(mappedAgencies);

        return res.json({
          scope: "core",
          currentAgency: currentUser,
          role: effectiveAdmin ? "admin" : "agency",
          catalogOmitted: !includeCatalog,
          ...(includeCatalog
            ? {
                countries: countryRows.map(mapCountryRow),
                services: serviceRows.map(mapServiceRow),
              }
            : {}),
          applications: appRows.map(mapApplicationListRow).map(enrichWithAgencyName),
          notifications: notifRows.map(mapNotificationRow),
          ...(effectiveAdmin ? { agencies: mappedAgencies } : {}),
        });
      }

      // =====================================================================
      // MODE SECONDAIRE OU COMPLET (exécuté en 2 lots pour ne jamais saturer le pool MySQL)
      // =====================================================================
      let mappedAgencies: any[] = [];
      let appRows: any[] = [];
      let notifRows: any[] = [];
      let countryRows: any[] = [];
      let serviceRows: any[] = [];

      if (scope === "all") {
        const [
          [appsRes],
          [notifsRes],
          [countriesRes],
          [servicesRes],
          [usersRes],
        ] = await Promise.all([
          effectiveAdmin
            ? pool.query<any[]>(`SELECT ${APP_LIST_SELECT} FROM applications ORDER BY submissionDate DESC LIMIT 300`)
            : pool.query<any[]>(
                `SELECT ${APP_LIST_SELECT} FROM applications WHERE ${agencyFilter.clause} ORDER BY submissionDate DESC LIMIT 200`,
                agencyFilter.params
              ),
          effectiveAdmin
            ? pool.query<any[]>("SELECT * FROM notifications WHERE agencyId = 'admin' ORDER BY createdAt DESC LIMIT 50")
            : pool.query<any[]>(
                `SELECT * FROM notifications WHERE ${agencyFilter.clause} ORDER BY createdAt DESC LIMIT 50`,
                agencyFilter.params
              ),
          includeCatalog ? pool.query<any[]>("SELECT * FROM countries ORDER BY name ASC") : Promise.resolve([[] as any[]]),
          includeCatalog ? pool.query<any[]>("SELECT * FROM services ORDER BY updatedAt DESC") : Promise.resolve([[] as any[]]),
          effectiveAdmin
            ? pool.query<any[]>(
                `SELECT id, email, name, agencyName, companyName, phone, rc, nif, managerName, address, wilaya, role, status, balance, applicationsCount, b2cMarginPercent, bannedUntil, banReason, createdAt
                 FROM users ORDER BY createdAt DESC`
              )
            : Promise.resolve([[] as any[]]),
        ]);
        appRows = appsRes;
        notifRows = notifsRes;
        countryRows = countriesRes;
        serviceRows = servicesRes;
        mappedAgencies = effectiveAdmin ? usersRes.map(mapUserListRow).filter(Boolean) as any[] : [];
      } else if (effectiveAdmin) {
        const [usersLookupRes] = await pool.query<any[]>(
          "SELECT id, email, name, agencyName, companyName, managerName FROM users"
        );
        mappedAgencies = usersLookupRes.map(mapUserListRow).filter(Boolean) as any[];
      }

      const [
        [tripRows],
        [studyRows],
        [studyAppRows],
        [tripResRows],
        [txRows],
        [rechargeRows],
        [ticketRows],
        versions,
      ] = await Promise.all([
        includeCatalog ? pool.query<any[]>(`SELECT ${TRIP_LIST_SELECT} FROM organized_trips ORDER BY createdAt DESC`) : Promise.resolve([[] as any[]]),
        includeCatalog ? pool.query<any[]>(`SELECT ${STUDY_PROGRAM_LIST_SELECT} FROM study_programs ORDER BY createdAt DESC`) : Promise.resolve([[] as any[]]),
        effectiveAdmin
          ? pool.query<any[]>(`SELECT ${STUDY_APP_LIST_SELECT} FROM study_applications ORDER BY submissionDate DESC LIMIT 300`)
          : pool.query<any[]>(
              `SELECT ${STUDY_APP_LIST_SELECT} FROM study_applications WHERE ${agencyFilter.clause} ORDER BY submissionDate DESC LIMIT 200`,
              agencyFilter.params
            ),
        effectiveAdmin
          ? pool.query<any[]>("SELECT * FROM trip_reservations ORDER BY createdAt DESC LIMIT 300")
          : pool.query<any[]>(
              `SELECT * FROM trip_reservations WHERE ${agencyFilter.clause} ORDER BY createdAt DESC LIMIT 200`,
              agencyFilter.params
            ),
        effectiveAdmin
          ? pool.query<any[]>("SELECT * FROM transactions ORDER BY createdAt DESC LIMIT 500")
          : pool.query<any[]>(
              `SELECT * FROM transactions WHERE ${agencyFilter.clause} ORDER BY createdAt DESC LIMIT 250`,
              agencyFilter.params
            ),
        effectiveAdmin
          ? pool.query<any[]>("SELECT * FROM recharge_requests ORDER BY createdAt DESC LIMIT 300")
          : pool.query<any[]>(
              `SELECT * FROM recharge_requests WHERE ${agencyFilter.clause} ORDER BY createdAt DESC LIMIT 100`,
              agencyFilter.params
            ),
        effectiveAdmin
          ? pool.query<any[]>(`SELECT ${TICKET_LIST_SELECT} FROM support_tickets ORDER BY createdAt DESC LIMIT 300`)
          : pool.query<any[]>(
              `SELECT ${TICKET_LIST_SELECT} FROM support_tickets WHERE ${agencyFilter.clause} ORDER BY createdAt DESC LIMIT 150`,
              agencyFilter.params
            ),
        getSyncVersions(pool, matchedAgencyIds, effectiveAdmin, precomputedCatalogVersion),
      ]);

      const enrichWithAgencyName = buildEnricher(mappedAgencies);

      return res.json({
        scope,
        currentAgency: currentUser,
        role: effectiveAdmin ? "admin" : "agency",
        catalogOmitted: !includeCatalog,
        syncVersion: versions.syncVersion,
        catalogVersion: versions.catalogVersion,
        ...(includeCatalog
          ? {
              ...(scope === "all"
                ? {
                    countries: countryRows.map(mapCountryRow),
                    services: serviceRows.map(mapServiceRow),
                  }
                : {}),
              organizedTrips: tripRows.map(mapTripListRow),
              studyPrograms: studyRows.map(mapStudyProgramListRow),
            }
          : {}),
        ...(scope === "all"
          ? {
              applications: appRows.map(mapApplicationListRow).map(enrichWithAgencyName),
              notifications: notifRows.map(mapNotificationRow),
              agencies: mappedAgencies,
            }
          : {}),
        studyApplications: studyAppRows.map(mapStudyApplicationListRow).map(enrichWithAgencyName),
        tripReservations: tripResRows.map(mapTripReservationRow).map(enrichWithAgencyName),
        transactions: txRows.map(mapTransactionRow).map(enrichWithAgencyName),
        rechargeRequests: rechargeRows.map(mapRechargeRow).map(enrichWithAgencyName),
        supportTickets: ticketRows.map(mapTicketListRow).map(enrichWithAgencyName),
      });
    } catch (err) {
      console.error("[MySQL /bootstrap]", err);
      return res.status(500).json({ error: "Erreur chargement initial MySQL." });
    }
  });

  // =========================================================================
  // 3. GESTION UTILISATEURS / AGENCES
  // =========================================================================
  router.patch("/users/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const targetId = req.params.id;
      const isAdmin = Boolean(req.user!.isAdmin);
      if (!isAdmin && req.user!.uid !== targetId) {
        return res.status(403).json({ error: "Non autorisé." });
      }

      const pool = getMysqlPool();
      const [rows] = await pool.query<any[]>("SELECT * FROM users WHERE id = ? LIMIT 1", [targetId]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "Utilisateur introuvable." });
      }

      const existing = mapUserRow(rows[0])!;
      const updates = { ...(req.body || {}) };

      // Sécurité anti-escalade : ne jamais modifier le solde ou le rôle directement via PATCH non-admin
      delete updates.balance;
      delete updates.id;
      if (!isAdmin) {
        delete updates.role;
        delete updates.status;
        delete updates.bannedUntil;
        delete updates.banReason;
        delete updates.applicationsCount;
      }

      const merged = { ...existing, ...updates };
      await upsertUserRow(pool, merged);
      return res.json({ success: true, user: merged });
    } catch (err) {
      console.error("[MySQL PATCH /users/:id]", err);
      return res.status(500).json({ error: "Erreur mise à jour utilisateur." });
    }
  });

  // =========================================================================
  // 4. CRUD CATALOGUE (ADMIN UNIQUEMENT)
  // =========================================================================
  router.post("/countries", requireAuth, requireAdmin, async (req, res) => {
    try {
      const c = req.body || {};
      const id = String(c.id || genId("cnt"));
      const pool = getMysqlPool();
      await pool.query(
        `INSERT INTO countries (id, name, agencyName, flag, active, visaTypes, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           agencyName = VALUES(agencyName),
           flag = VALUES(flag),
           active = VALUES(active),
           visaTypes = VALUES(visaTypes),
           updatedAt = VALUES(updatedAt)`,
        [
          id,
          String(c.name || ""),
          String(c.agencyName || ""),
          String(c.flag || ""),
          c.active !== false ? 1 : 0,
          stringifyJsonSafe(c.visaTypes || [], "[]"),
          nowIso(),
        ]
      );
      return res.json({ success: true, country: { ...c, id } });
    } catch (err) {
      console.error("[MySQL POST /countries]", err);
      return res.status(500).json({ error: "Erreur sauvegarde pays." });
    }
  });

  router.patch("/countries/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const pool = getMysqlPool();
      const [rows] = await pool.query<any[]>("SELECT * FROM countries WHERE id = ? LIMIT 1", [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Pays introuvable." });
      const current = mapCountryRow(rows[0]);
      const merged = { ...current, ...(req.body || {}), id: req.params.id };
      await pool.query(
        `UPDATE countries SET name = ?, agencyName = ?, flag = ?, active = ?, visaTypes = ?, updatedAt = ? WHERE id = ?`,
        [
          String(merged.name || ""),
          String(merged.agencyName || ""),
          String(merged.flag || ""),
          merged.active !== false ? 1 : 0,
          stringifyJsonSafe(merged.visaTypes || [], "[]"),
          nowIso(),
          req.params.id,
        ]
      );
      return res.json({ success: true, country: merged });
    } catch (err) {
      console.error("[MySQL PATCH /countries/:id]", err);
      return res.status(500).json({ error: "Erreur mise à jour pays." });
    }
  });

  router.delete("/countries/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      await getMysqlPool().query("DELETE FROM countries WHERE id = ?", [req.params.id]);
      return res.json({ success: true });
    } catch (err) {
      console.error("[MySQL DELETE /countries/:id]", err);
      return res.status(500).json({ error: "Erreur suppression pays." });
    }
  });

  router.post("/services", requireAuth, requireAdmin, async (req, res) => {
    try {
      const s = req.body || {};
      const id = String(s.id || genId("srv"));
      await getMysqlPool().query(
        `INSERT INTO services (id, title, type, destination, flag, price, processingTime, description, requiredDocuments, conditions, active, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title), type = VALUES(type), destination = VALUES(destination),
           flag = VALUES(flag), price = VALUES(price), processingTime = VALUES(processingTime),
           description = VALUES(description), requiredDocuments = VALUES(requiredDocuments),
           conditions = VALUES(conditions), active = VALUES(active), updatedAt = VALUES(updatedAt)`,
        [
          id,
          String(s.title || ""),
          String(s.type || "Visa"),
          String(s.destination || "Monde"),
          String(s.flag || ""),
          Number(s.price || 0),
          String(s.processingTime || ""),
          String(s.description || ""),
          stringifyJsonSafe(s.requiredDocuments || [], "[]"),
          stringifyJsonSafe(s.conditions || [], "[]"),
          s.active !== false ? 1 : 0,
          nowIso(),
        ]
      );
      return res.json({ success: true, service: { ...s, id } });
    } catch (err) {
      console.error("[MySQL POST /services]", err);
      return res.status(500).json({ error: "Erreur création service." });
    }
  });

  router.patch("/services/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const pool = getMysqlPool();
      const [rows] = await pool.query<any[]>("SELECT * FROM services WHERE id = ? LIMIT 1", [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Service introuvable." });
      const merged = { ...mapServiceRow(rows[0]), ...(req.body || {}), id: req.params.id };
      await pool.query(
        `UPDATE services SET title = ?, type = ?, destination = ?, flag = ?, price = ?, processingTime = ?, description = ?, requiredDocuments = ?, conditions = ?, active = ?, updatedAt = ? WHERE id = ?`,
        [
          String(merged.title || ""),
          String(merged.type || "Visa"),
          String(merged.destination || "Monde"),
          String(merged.flag || ""),
          Number(merged.price || 0),
          String(merged.processingTime || ""),
          String(merged.description || ""),
          stringifyJsonSafe(merged.requiredDocuments || [], "[]"),
          stringifyJsonSafe(merged.conditions || [], "[]"),
          merged.active !== false ? 1 : 0,
          nowIso(),
          req.params.id,
        ]
      );
      return res.json({ success: true, service: merged });
    } catch (err) {
      console.error("[MySQL PATCH /services/:id]", err);
      return res.status(500).json({ error: "Erreur mise à jour service." });
    }
  });

  router.delete("/services/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      await getMysqlPool().query("DELETE FROM services WHERE id = ?", [req.params.id]);
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: "Erreur suppression service." });
    }
  });

  router.post("/trips", requireAuth, requireAdmin, async (req, res) => {
    try {
      const t = req.body || {};
      const id = String(t.id || genId("trip"));
      const createdAt = String(t.createdAt || nowIso());
      const updatedAt = nowIso();
      const availableSeats =
        t.availableSeats !== undefined ? Number(t.availableSeats) : Number(t.totalSeats || 0);
      await getMysqlPool().query(
        `INSERT INTO organized_trips (id, title, destination, startDate, endDate, price, description, totalSeats, availableSeats, image, photoUrl, featured, status, customFormFields, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title), destination = VALUES(destination), startDate = VALUES(startDate),
           endDate = VALUES(endDate), price = VALUES(price), description = VALUES(description),
           totalSeats = VALUES(totalSeats), availableSeats = VALUES(availableSeats), image = VALUES(image),
           photoUrl = VALUES(photoUrl), featured = VALUES(featured), status = VALUES(status),
           customFormFields = VALUES(customFormFields), updatedAt = VALUES(updatedAt)`,
        [
          id,
          String(t.title || ""),
          String(t.destination || ""),
          String(t.startDate || ""),
          String(t.endDate || ""),
          Number(t.price || 0),
          String(t.description || ""),
          Number(t.totalSeats || 0),
          availableSeats,
          t.image || null,
          t.photoUrl || null,
          t.featured ? 1 : 0,
          String(t.status || "active"),
          stringifyJsonSafe(t.customFormFields || [], "[]"),
          createdAt,
          updatedAt,
        ]
      );
      return res.json({
        success: true,
        trip: mapTripListRow({ ...t, id, createdAt, updatedAt, availableSeats }),
      });
    } catch (err) {
      console.error("[MySQL POST /trips]", err);
      return res.status(500).json({ error: "Erreur création voyage." });
    }
  });

  router.patch("/trips/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const pool = getMysqlPool();
      const [rows] = await pool.query<any[]>("SELECT * FROM organized_trips WHERE id = ? LIMIT 1", [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Voyage introuvable." });
      const existing = mapTripRow(rows[0]);
      const incoming = { ...(req.body || {}) };
      if (typeof incoming.image === "string" && incoming.image.startsWith("/api/db/media/")) {
        incoming.image = existing.image;
      }
      if (typeof incoming.photoUrl === "string" && incoming.photoUrl.startsWith("/api/db/media/")) {
        incoming.photoUrl = existing.photoUrl;
      }
      const merged = { ...existing, ...incoming, id: req.params.id };
      const updatedAt = nowIso();
      await pool.query(
        `UPDATE organized_trips SET title = ?, destination = ?, startDate = ?, endDate = ?, price = ?, description = ?, totalSeats = ?, availableSeats = ?, image = ?, photoUrl = ?, featured = ?, status = ?, customFormFields = ?, updatedAt = ? WHERE id = ?`,
        [
          String(merged.title || ""),
          String(merged.destination || ""),
          String(merged.startDate || ""),
          String(merged.endDate || ""),
          Number(merged.price || 0),
          String(merged.description || ""),
          Number(merged.totalSeats || 0),
          Number(merged.availableSeats || 0),
          merged.image || null,
          merged.photoUrl || null,
          merged.featured ? 1 : 0,
          String(merged.status || "active"),
          stringifyJsonSafe(merged.customFormFields || [], "[]"),
          updatedAt,
          req.params.id,
        ]
      );
      return res.json({ success: true, trip: mapTripListRow({ ...merged, updatedAt }) });
    } catch (err) {
      return res.status(500).json({ error: "Erreur mise à jour voyage." });
    }
  });

  router.delete("/trips/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      await getMysqlPool().query("DELETE FROM organized_trips WHERE id = ?", [req.params.id]);
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: "Erreur suppression voyage." });
    }
  });

  router.post("/study-programs", requireAuth, requireAdmin, async (req, res) => {
    try {
      const p = req.body || {};
      const id = String(p.id || genId("prog"));
      const createdAt = String(p.createdAt || nowIso());
      const updatedAt = nowIso();
      await getMysqlPool().query(
        `INSERT INTO study_programs (id, title, country, countryFlag, university, city, type, description, admissionConditions, conditions, processingTime, intake, languageOfStudy, price, tuitionFeeYear, requiredDocuments, image, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title), country = VALUES(country), countryFlag = VALUES(countryFlag),
           university = VALUES(university), city = VALUES(city), type = VALUES(type),
           description = VALUES(description), admissionConditions = VALUES(admissionConditions),
           conditions = VALUES(conditions), processingTime = VALUES(processingTime),
           intake = VALUES(intake), languageOfStudy = VALUES(languageOfStudy),
           price = VALUES(price), tuitionFeeYear = VALUES(tuitionFeeYear),
           requiredDocuments = VALUES(requiredDocuments), image = VALUES(image),
           status = VALUES(status), updatedAt = VALUES(updatedAt)`,
        [
          id,
          String(p.title || ""),
          String(p.country || ""),
          String(p.countryFlag || ""),
          String(p.university || ""),
          String(p.city || ""),
          String(p.type || "Bachelor"),
          String(p.description || ""),
          stringifyJsonSafe(p.admissionConditions || [], "[]"),
          String(p.conditions || ""),
          String(p.processingTime || ""),
          String(p.intake || ""),
          String(p.languageOfStudy || ""),
          Number(p.price || 0),
          String(p.tuitionFeeYear || ""),
          stringifyJsonSafe(p.requiredDocuments || [], "[]"),
          p.image || null,
          String(p.status || "active"),
          createdAt,
          updatedAt,
        ]
      );
      return res.json({
        success: true,
        program: mapStudyProgramListRow({ ...p, id, createdAt, updatedAt }),
      });
    } catch (err) {
      console.error("[MySQL POST /study-programs]", err);
      return res.status(500).json({ error: "Erreur création programme études." });
    }
  });

  router.patch("/study-programs/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const pool = getMysqlPool();
      const [rows] = await pool.query<any[]>("SELECT * FROM study_programs WHERE id = ? LIMIT 1", [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Programme introuvable." });
      const existing = mapStudyProgramRow(rows[0]);
      const incoming = { ...(req.body || {}) };
      if (typeof incoming.image === "string" && incoming.image.startsWith("/api/db/media/")) {
        incoming.image = existing.image;
      }
      const merged = { ...existing, ...incoming, id: req.params.id };
      const updatedAt = nowIso();
      await pool.query(
        `UPDATE study_programs SET title = ?, country = ?, countryFlag = ?, university = ?, city = ?, type = ?, description = ?, admissionConditions = ?, conditions = ?, processingTime = ?, intake = ?, languageOfStudy = ?, price = ?, tuitionFeeYear = ?, requiredDocuments = ?, image = ?, status = ?, updatedAt = ? WHERE id = ?`,
        [
          String(merged.title || ""),
          String(merged.country || ""),
          String(merged.countryFlag || ""),
          String(merged.university || ""),
          String(merged.city || ""),
          String(merged.type || "Bachelor"),
          String(merged.description || ""),
          stringifyJsonSafe(merged.admissionConditions || [], "[]"),
          String(merged.conditions || ""),
          String(merged.processingTime || ""),
          String(merged.intake || ""),
          String(merged.languageOfStudy || ""),
          Number(merged.price || 0),
          String(merged.tuitionFeeYear || ""),
          stringifyJsonSafe(merged.requiredDocuments || [], "[]"),
          merged.image || null,
          String(merged.status || "active"),
          updatedAt,
          req.params.id,
        ]
      );
      return res.json({ success: true, program: mapStudyProgramListRow({ ...merged, updatedAt }) });
    } catch (err) {
      return res.status(500).json({ error: "Erreur mise à jour programme." });
    }
  });

  router.delete("/study-programs/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      await getMysqlPool().query("DELETE FROM study_programs WHERE id = ?", [req.params.id]);
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: "Erreur suppression programme." });
    }
  });

  // =========================================================================
  // 5. DOSSIERS VISAS (AVEC DÉBIT ATOMIQUE FOR UPDATE)
  // =========================================================================
  router.post("/applications", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const app = req.body || {};
      const uid = req.user!.uid;
      const targetAgencyId = req.user!.isAdmin && app.agencyId ? String(app.agencyId) : uid;
      const appId = String(app.id || genId("APP").toUpperCase());
      const serviceId = app.customFormData?.serviceId ? String(app.customFormData.serviceId) : null;

      const result = await withMysqlTransaction(async (conn) => {
        const [uRows] = await conn.query<any[]>(
          "SELECT * FROM users WHERE id = ? LIMIT 1 FOR UPDATE",
          [targetAgencyId]
        );
        if (uRows.length === 0) {
          throw new Error("Agence introuvable.");
        }
        const userRow = uRows[0];
        if (String(userRow.status || "").toUpperCase() !== "ACTIVE") {
          throw new Error("Votre compte agence doit être actif pour soumettre une demande.");
        }

        let authoritativePrice = Number(app.price ?? 0);
        if (serviceId) {
          const [sRows] = await conn.query<any[]>(
            "SELECT price, active FROM services WHERE id = ? LIMIT 1",
            [serviceId]
          );
          if (sRows.length === 0 || !sRows[0].active) {
            throw new Error("Cette prestation n'est plus disponible au catalogue.");
          }
          authoritativePrice = Number(sRows[0].price ?? 0);
        }

        if (!Number.isFinite(authoritativePrice) || authoritativePrice < 0) {
          throw new Error("Tarif de la prestation invalide.");
        }

        const currentBalance = Number(userRow.balance || 0);
        if (currentBalance < authoritativePrice) {
          throw new Error("Solde insuffisant pour cette opération.");
        }

        const newBalance = currentBalance - authoritativePrice;
        const newAppsCount = Number(userRow.applicationsCount || 0) + 1;
        const now = nowIso();
        const submissionDate = String(app.submissionDate || now);

        await conn.query(
          "UPDATE users SET balance = ?, applicationsCount = ?, updatedAt = ? WHERE id = ?",
          [newBalance, newAppsCount, now, targetAgencyId]
        );

        const resolvedAgencyName = resolveAgencyNameFromRow(userRow, app.agencyName, req.user?.email);
        const finalApp = {
          ...app,
          id: appId,
          agencyId: targetAgencyId,
          agencyName: resolvedAgencyName,
          price: authoritativePrice,
          status: "Pending",
          submissionDate,
        };

        await conn.query(
          `INSERT INTO applications (
            id, agencyId, agencyName, serviceType, country, visaType, travelerName,
            passportNumber, status, price, submissionDate, finalDocument, finalDocumentName,
            finalDocumentDate, adminNotes, extraData, customFormData, attachments, timeline, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            appId,
            targetAgencyId,
            String(finalApp.agencyName || ""),
            String(finalApp.serviceType || "Visa"),
            String(finalApp.country || ""),
            String(finalApp.visaType || ""),
            String(finalApp.travelerName || ""),
            String(finalApp.passportNumber || ""),
            "Pending",
            authoritativePrice,
            submissionDate,
            finalApp.finalDocument || null,
            finalApp.finalDocumentName || null,
            finalApp.finalDocumentDate || null,
            finalApp.adminNotes || null,
            stringifyJsonSafe(finalApp.extraData, "null"),
            stringifyJsonSafe(finalApp.customFormData, "null"),
            stringifyJsonSafe(finalApp.attachments || [], "[]"),
            stringifyJsonSafe(finalApp.timeline || [], "[]"),
            now,
          ]
        );

        const txId = genId("tx");
        const tx = {
          id: txId,
          agencyId: targetAgencyId,
          agencyName: finalApp.agencyName,
          amount: authoritativePrice,
          type: "debit",
          status: "completed",
          date: now.split("T")[0],
          description: `Paiement pour visa ${finalApp.visaType || "Service"} (${finalApp.travelerName || ""})`.slice(0, 480),
          createdAt: now,
        };
        await conn.query(
          `INSERT INTO transactions (id, agencyId, agencyName, type, amount, date, description, status, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [tx.id, tx.agencyId, tx.agencyName, tx.type, tx.amount, tx.date, tx.description, tx.status, tx.createdAt]
        );

        const notifId = genId("notif");
        await conn.query(
          `INSERT INTO notifications (id, agencyId, title, message, type, isRead, link, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            notifId,
            "admin",
            "Nouvelle demande de Visa",
            `${finalApp.agencyName} a soumis une demande pour ${finalApp.travelerName || "un client"}.`.slice(0, 580),
            "info",
            0,
            "/admin/applications",
            now,
          ]
        );

        return { application: finalApp, newBalance, transaction: tx };
      });

      return res.json({ success: true, ...result });
    } catch (err: any) {
      console.error("[MySQL POST /applications]", err);
      const msg = err?.message || "Erreur lors du dépôt du dossier.";
      const status = msg.includes("Solde") || msg.includes("actif") || msg.includes("disponible") ? 400 : 500;
      return res.status(status).json({ error: msg });
    }
  });

  router.get("/applications/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const pool = getMysqlPool();
      const [rows] = await pool.query<any[]>("SELECT * FROM applications WHERE id = ? LIMIT 1", [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Dossier introuvable." });

      const app = mapApplicationRow(rows[0]);
      const isAdmin = Boolean(req.user!.isAdmin);
      if (!isAdmin && app.agencyId !== req.user!.uid) {
        const email = (req.user!.email || "").toLowerCase();
        let ownerMatched = false;
        if (email) {
          const [uRows] = await pool.query<any[]>("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
          if (uRows.length > 0 && uRows[0].id === app.agencyId) ownerMatched = true;
        }
        if (!ownerMatched) return res.status(403).json({ error: "Accès refusé." });
      }
      return res.json({ application: app });
    } catch (err) {
      console.error("[MySQL GET /applications/:id]", err);
      return res.status(500).json({ error: "Erreur chargement dossier." });
    }
  });

  router.patch("/applications/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const pool = getMysqlPool();
      const [rows] = await pool.query<any[]>("SELECT * FROM applications WHERE id = ? LIMIT 1", [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Dossier introuvable." });

      const current = mapApplicationRow(rows[0]);
      const isAdmin = Boolean(req.user!.isAdmin);
      if (!isAdmin && current.agencyId !== req.user!.uid) {
        const email = (req.user!.email || "").toLowerCase();
        let ownerMatched = false;
        if (email) {
          const [uRows] = await pool.query<any[]>("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
          if (uRows.length > 0 && uRows[0].id === current.agencyId) ownerMatched = true;
        }
        if (!ownerMatched) return res.status(403).json({ error: "Accès refusé." });
      }

      const updates = { ...(req.body || {}) };
      if (!isAdmin) {
        delete updates.status;
        delete updates.price;
        delete updates.adminNotes;
        delete updates.finalDocument;
      }

      if (isDeferredMarker(updates.finalDocument)) {
        updates.finalDocument = current.finalDocument;
      }
      if (Array.isArray(updates.attachments)) {
        updates.attachments = restoreDeferredAttachments(updates.attachments, current.attachments || []);
      }
      if (updates.customFormData) {
        updates.customFormData = restoreDeferredTree(updates.customFormData, current.customFormData);
      }

      const merged = { ...current, ...updates, id: req.params.id };
      const now = nowIso();
      await pool.query(
        `UPDATE applications SET
          status = ?, finalDocument = ?, finalDocumentName = ?, finalDocumentDate = ?,
          adminNotes = ?, extraData = ?, customFormData = ?, attachments = ?, timeline = ?, updatedAt = ?
         WHERE id = ?`,
        [
          merged.status,
          merged.finalDocument || null,
          merged.finalDocumentName || null,
          merged.finalDocumentDate || null,
          merged.adminNotes || null,
          stringifyJsonSafe(merged.extraData, "null"),
          stringifyJsonSafe(merged.customFormData, "null"),
          stringifyJsonSafe(merged.attachments || [], "[]"),
          stringifyJsonSafe(merged.timeline || [], "[]"),
          now,
          req.params.id,
        ]
      );

      if (isAdmin && updates.status && updates.status !== current.status) {
        const notifId = genId("notif");
        await pool.query(
          `INSERT INTO notifications (id, agencyId, title, message, type, isRead, link, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            notifId,
            current.agencyId,
            `Visa ${updates.status}`,
            `Le statut de la demande de visa pour ${current.travelerName || "votre client"} est maintenant: ${updates.status}.`,
            updates.status === "Approved" ? "success" : updates.status === "Rejected" ? "error" : "info",
            0,
            "/agency/applications",
            now,
          ]
        );
      }

      return res.json({ success: true, application: merged });
    } catch (err) {
      console.error("[MySQL PATCH /applications/:id]", err);
      return res.status(500).json({ error: "Erreur mise à jour dossier." });
    }
  });

  // =========================================================================
  // 6. DOSSIERS VISA ÉTUDES
  // =========================================================================
  router.post("/study-applications", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const application = req.body || {};
      const uid = req.user!.uid;
      const targetAgencyId = req.user!.isAdmin && application.agencyId ? String(application.agencyId) : uid;
      const appId = String(application.id || `ETUD-${crypto.randomBytes(3).toString("hex").toUpperCase()}`);
      const now = nowIso();
      const price = Number(application.price || 0);

      const newStudyApp: any = {
        ...application,
        id: appId,
        agencyId: targetAgencyId,
        price,
        paidAmount: Number(application.paidAmount || 0),
        paymentStatus: application.paymentStatus || "unpaid",
        submissionDate: String(application.submissionDate || now),
        status: "Pending",
        documents: application.documents || {},
        attachments: application.attachments || [],
        timeline: application.timeline || [
          {
            id: `entry_${Date.now()}`,
            date: now,
            title: "Dossier Études Déposé",
            message: `Dossier d'admission pour « ${application.programTitle || "Programme Études"} » (${application.university || ""} - ${application.country || ""}) déposé par l'agence.`,
            sender: "Agency",
          },
        ],
      };

      await withMysqlTransaction(async (conn) => {
        const authoritativeAgencyName = await fetchAuthoritativeAgencyName(
          conn,
          targetAgencyId,
          application.agencyName,
          req.user?.email
        );
        newStudyApp.agencyName = authoritativeAgencyName;

        await conn.query(
          `INSERT INTO study_applications (
            id, programId, programTitle, country, countryFlag, university, city,
            agencyId, agencyName, studentName, passportNumber, email, phone,
            status, price, paidAmount, paymentStatus, submissionDate,
            documents, attachments, timeline, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            appId,
            String(newStudyApp.programId || ""),
            String(newStudyApp.programTitle || ""),
            String(newStudyApp.country || ""),
            String(newStudyApp.countryFlag || ""),
            String(newStudyApp.university || ""),
            String(newStudyApp.city || ""),
            targetAgencyId,
            authoritativeAgencyName,
            String(newStudyApp.studentName || ""),
            String(newStudyApp.passportNumber || ""),
            String(newStudyApp.email || ""),
            String(newStudyApp.phone || ""),
            "Pending",
            price,
            newStudyApp.paidAmount,
            newStudyApp.paymentStatus,
            newStudyApp.submissionDate,
            stringifyJsonSafe(newStudyApp.documents, "{}"),
            stringifyJsonSafe(newStudyApp.attachments, "[]"),
            stringifyJsonSafe(newStudyApp.timeline, "[]"),
            now,
          ]
        );

        await conn.query(
          `INSERT INTO applications (
            id, agencyId, agencyName, serviceType, country, visaType, travelerName,
            passportNumber, status, price, submissionDate, customFormData, attachments, timeline, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            appId,
            targetAgencyId,
            authoritativeAgencyName,
            "Etude",
            String(newStudyApp.country || "Destination Universitaire"),
            `Visa Études - ${newStudyApp.programTitle || "Admission Universitaire"}`,
            String(newStudyApp.studentName || ""),
            String(newStudyApp.passportNumber || ""),
            "Pending",
            price,
            newStudyApp.submissionDate,
            stringifyJsonSafe({
              programId: newStudyApp.programId,
              programTitle: newStudyApp.programTitle,
              university: newStudyApp.university,
              country: newStudyApp.country,
              city: newStudyApp.city,
              email: newStudyApp.email,
              phone: newStudyApp.phone,
              documents: newStudyApp.documents,
            }),
            stringifyJsonSafe(newStudyApp.attachments, "[]"),
            stringifyJsonSafe(newStudyApp.timeline, "[]"),
            now,
          ]
        );

        await conn.query(
          `INSERT INTO notifications (id, agencyId, title, message, type, isRead, link, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            genId("notif"),
            "admin",
            "Nouveau dossier Visa Études",
            `${authoritativeAgencyName} a soumis un dossier d'études pour ${newStudyApp.studentName} (${newStudyApp.university || ""} - ${newStudyApp.country || ""}).`,
            "info",
            0,
            "/admin/study",
            now,
            genId("notif"),
            targetAgencyId,
            "Dossier Études Enregistré",
            `Votre dossier pour ${newStudyApp.studentName} (${newStudyApp.university || ""}) est bien enregistré sous la référence ${appId}.`,
            "success",
            0,
            "/agency/study",
            now,
          ]
        );
      });

      return res.json({ success: true, studyApplication: newStudyApp });
    } catch (err) {
      console.error("[MySQL POST /study-applications]", err);
      return res.status(500).json({ error: "Erreur dépôt dossier études." });
    }
  });

  router.get("/study-applications/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const pool = getMysqlPool();
      const [rows] = await pool.query<any[]>("SELECT * FROM study_applications WHERE id = ? LIMIT 1", [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Dossier études introuvable." });

      const item = mapStudyApplicationRow(rows[0]);
      const isAdmin = Boolean(req.user!.isAdmin);
      if (!isAdmin && item.agencyId !== req.user!.uid) {
        const email = (req.user!.email || "").toLowerCase();
        let ownerMatched = false;
        if (email) {
          const [uRows] = await pool.query<any[]>("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
          if (uRows.length > 0 && uRows[0].id === item.agencyId) ownerMatched = true;
        }
        if (!ownerMatched) return res.status(403).json({ error: "Accès refusé." });
      }
      return res.json({ studyApplication: item });
    } catch (err) {
      console.error("[MySQL GET /study-applications/:id]", err);
      return res.status(500).json({ error: "Erreur chargement dossier études." });
    }
  });

  router.patch("/study-applications/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const pool = getMysqlPool();
      const [rows] = await pool.query<any[]>("SELECT * FROM study_applications WHERE id = ? LIMIT 1", [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Dossier études introuvable." });

      const current = mapStudyApplicationRow(rows[0]);
      const isAdmin = Boolean(req.user!.isAdmin);
      if (!isAdmin && current.agencyId !== req.user!.uid) {
        const email = (req.user!.email || "").toLowerCase();
        let ownerMatched = false;
        if (email) {
          const [uRows] = await pool.query<any[]>("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
          if (uRows.length > 0 && uRows[0].id === current.agencyId) ownerMatched = true;
        }
        if (!ownerMatched) return res.status(403).json({ error: "Accès refusé." });
      }

      const updates = { ...(req.body || {}) };
      if (!isAdmin) {
        delete updates.status;
        delete updates.price;
        delete updates.paidAmount;
        delete updates.paymentStatus;
        delete updates.adminNotes;
      }

      if (isDeferredMarker(updates.finalDocument)) {
        updates.finalDocument = current.finalDocument;
      }
      if (Array.isArray(updates.attachments)) {
        updates.attachments = restoreDeferredAttachments(updates.attachments, current.attachments || []);
      }
      if (updates.documents) {
        updates.documents = restoreDeferredTree(updates.documents, current.documents);
      }

      if (isAdmin && typeof updates.addPaymentAmount === "number" && updates.addPaymentAmount > 0) {
        const newPaid = Number(current.paidAmount || 0) + Number(updates.addPaymentAmount);
        updates.paidAmount = newPaid;
        updates.paymentStatus = newPaid >= current.price ? "paid" : newPaid > 0 ? "partial" : "unpaid";
        delete updates.addPaymentAmount;
      }

      const merged = { ...current, ...updates, id: req.params.id };
      const now = nowIso();
      await pool.query(
        `UPDATE study_applications SET
          status = ?, paidAmount = ?, paymentStatus = ?, finalDocument = ?, finalDocumentName = ?,
          finalDocumentDate = ?, adminNotes = ?, documents = ?, attachments = ?, timeline = ?, updatedAt = ?
         WHERE id = ?`,
        [
          merged.status,
          Number(merged.paidAmount || 0),
          merged.paymentStatus || "unpaid",
          merged.finalDocument || null,
          merged.finalDocumentName || null,
          merged.finalDocumentDate || null,
          merged.adminNotes || null,
          stringifyJsonSafe(merged.documents || {}, "{}"),
          stringifyJsonSafe(merged.attachments || [], "[]"),
          stringifyJsonSafe(merged.timeline || [], "[]"),
          now,
          req.params.id,
        ]
      );

      if (isAdmin && updates.status && updates.status !== current.status) {
        await pool.query(
          `INSERT INTO notifications (id, agencyId, title, message, type, isRead, link, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            genId("notif"),
            current.agencyId,
            `Dossier Études : ${updates.status}`,
            `Le statut du dossier de ${current.studentName} (${current.university || "Université"}) est maintenant : ${updates.status}.`,
            updates.status === "Approved" ? "success" : updates.status === "Rejected" ? "error" : "info",
            0,
            "/agency/study",
            now,
          ]
        );
      }

      return res.json({ success: true, studyApplication: merged });
    } catch (err) {
      console.error("[MySQL PATCH /study-applications/:id]", err);
      return res.status(500).json({ error: "Erreur mise à jour dossier études." });
    }
  });

  // =========================================================================
  // 7. RÉSERVATIONS VOYAGES ORGANISÉS (VERROU SQL DES PLACES)
  // =========================================================================
  router.post("/trip-reservations", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const body = req.body || {};
      const peopleCount = Number(body.numberOfPeople);
      if (!Number.isInteger(peopleCount) || peopleCount < 1 || peopleCount > 50) {
        return res.status(400).json({ error: "Le nombre de voyageurs doit être compris entre 1 et 50." });
      }

      const uid = req.user!.uid;
      const targetAgencyId = req.user!.isAdmin && body.agencyId ? String(body.agencyId) : uid;
      const resId = `RES-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

      const result = await withMysqlTransaction(async (conn) => {
        const [tripRows] = await conn.query<any[]>(
          "SELECT * FROM organized_trips WHERE id = ? LIMIT 1 FOR UPDATE",
          [String(body.tripId || "")]
        );
        if (tripRows.length === 0) {
          throw new Error("Ce voyage organisé n'est plus disponible.");
        }

        const trip = mapTripRow(tripRows[0]);
        if (trip.status && trip.status !== "active") {
          throw new Error("Ce voyage organisé n'est actuellement pas ouvert aux réservations.");
        }
        if (trip.availableSeats < peopleCount) {
          throw new Error(`Nombre de places insuffisant : seulement ${trip.availableSeats} place(s) disponible(s).`);
        }

        const totalPrice = Number(trip.price || 0) * peopleCount;
        const newSeats = Math.max(0, trip.availableSeats - peopleCount);
        const now = nowIso();

        await conn.query("UPDATE organized_trips SET availableSeats = ?, updatedAt = ? WHERE id = ?", [
          newSeats,
          now,
          trip.id,
        ]);

        const authoritativeAgencyName = await fetchAuthoritativeAgencyName(
          conn,
          targetAgencyId,
          body.agencyName,
          req.user?.email
        );

        const reservation = {
          ...body,
          id: resId,
          agencyId: targetAgencyId,
          agencyName: authoritativeAgencyName,
          numberOfPeople: peopleCount,
          status: "pending",
          totalPrice,
          paidAmount: 0,
          createdAt: now,
        };

        await conn.query(
          `INSERT INTO trip_reservations (
            id, tripId, agencyId, agencyName, clientName, clientEmail, clientPhone,
            notes, customFormData, numberOfPeople, status, totalPrice, paidAmount, passengerNames, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            resId,
            trip.id,
            targetAgencyId,
            authoritativeAgencyName,
            String(reservation.clientName || ""),
            String(reservation.clientEmail || ""),
            String(reservation.clientPhone || ""),
            String(reservation.notes || ""),
            stringifyJsonSafe(reservation.customFormData, "null"),
            peopleCount,
            "pending",
            totalPrice,
            0,
            stringifyJsonSafe(reservation.passengerNames || [], "[]"),
            now,
            now,
          ]
        );

        await conn.query(
          `INSERT INTO notifications (id, agencyId, title, message, type, isRead, link, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            genId("notif"),
            "admin",
            "Nouvelle réservation Voyage Organisé",
            `${authoritativeAgencyName} a réservé ${peopleCount} place(s) pour « ${trip.title} » (Client: ${reservation.clientName || "N/A"}).`.slice(0, 580),
            "info",
            0,
            "/admin/trips",
            now,
            genId("notif"),
            targetAgencyId,
            "Réservation Enregistrée avec Succès",
            `Votre réservation pour « ${trip.title} » (${peopleCount} personne(s)) est enregistrée sous la référence ${resId}.`.slice(0, 580),
            "success",
            0,
            "/agency/trips",
            now,
          ]
        );

        return { reservation, availableSeats: newSeats };
      });

      return res.json({ success: true, ...result });
    } catch (err: any) {
      const msg = err?.message || "Erreur lors de la réservation.";
      return res.status(400).json({ error: msg });
    }
  });

  router.patch("/trip-reservations/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { status, addPaymentAmount } = req.body || {};
      const result = await withMysqlTransaction(async (conn) => {
        const [rows] = await conn.query<any[]>(
          "SELECT * FROM trip_reservations WHERE id = ? LIMIT 1 FOR UPDATE",
          [req.params.id]
        );
        if (rows.length === 0) throw new Error("Réservation introuvable.");
        const resRow = mapTripReservationRow(rows[0]);
        const now = nowIso();

        if (typeof addPaymentAmount === "number" && addPaymentAmount > 0) {
          const newPaid = Math.min(resRow.totalPrice, resRow.paidAmount + addPaymentAmount);
          await conn.query("UPDATE trip_reservations SET paidAmount = ?, updatedAt = ? WHERE id = ?", [
            newPaid,
            now,
            resRow.id,
          ]);
          return { ...resRow, paidAmount: newPaid };
        }

        if (status) {
          await conn.query("UPDATE trip_reservations SET status = ?, updatedAt = ? WHERE id = ?", [
            status,
            now,
            resRow.id,
          ]);
          if (status === "cancelled" && resRow.status !== "cancelled") {
            const [tripRows] = await conn.query<any[]>(
              "SELECT totalSeats, availableSeats FROM organized_trips WHERE id = ? LIMIT 1 FOR UPDATE",
              [resRow.tripId]
            );
            if (tripRows.length > 0) {
              const maxSeats = Number(tripRows[0].totalSeats || 0);
              const restored = Number(tripRows[0].availableSeats || 0) + Number(resRow.numberOfPeople || 0);
              const finalSeats = maxSeats > 0 ? Math.min(maxSeats, restored) : restored;
              await conn.query("UPDATE organized_trips SET availableSeats = ?, updatedAt = ? WHERE id = ?", [
                finalSeats,
                now,
                resRow.tripId,
              ]);
            }
          }
          return { ...resRow, status };
        }

        return resRow;
      });
      return res.json({ success: true, reservation: result });
    } catch (err: any) {
      return res.status(400).json({ error: err?.message || "Erreur mise à jour réservation." });
    }
  });

  // =========================================================================
  // 8. TRÉSORERIE : RECHARGES & AJUSTEMENTS ATOMIQUES
  // =========================================================================
  router.post("/recharge-requests", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const body = req.body || {};
      const uid = req.user!.uid;
      const targetAgencyId = req.user!.isAdmin && body.agencyId ? String(body.agencyId) : uid;
      const id = String(body.id || genId("rch"));
      const now = nowIso();
      const amount = Number(body.amount || 0);
      if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({ error: "Montant de recharge invalide." });
      }

      const pool = getMysqlPool();
      const authoritativeAgencyName = await fetchAuthoritativeAgencyName(
        pool,
        targetAgencyId,
        body.agencyName,
        req.user?.email
      );

      const item = {
        id,
        agencyId: targetAgencyId,
        agencyName: authoritativeAgencyName,
        amount,
        note: String(body.note || ""),
        status: "Pending",
        date: String(body.date || now),
        createdAt: now,
      };

      await pool.query(
        `INSERT INTO recharge_requests (id, agencyId, agencyName, amount, note, status, date, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [item.id, item.agencyId, item.agencyName, item.amount, item.note, item.status, item.date, item.createdAt, now]
      );

      return res.json({ success: true, rechargeRequest: item });
    } catch (err) {
      console.error("[MySQL POST /recharge-requests]", err);
      return res.status(500).json({ error: "Erreur création demande de recharge." });
    }
  });

  router.post("/recharge-requests/:id/approve", requireAuth, requireAdmin, async (req, res) => {
    try {
      const amountNum = Number(req.body?.amount);
      if (!Number.isFinite(amountNum) || amountNum <= 0) {
        return res.status(400).json({ error: "Montant invalide." });
      }

      const result = await withMysqlTransaction(async (conn) => {
        const [reqRows] = await conn.query<any[]>(
          "SELECT * FROM recharge_requests WHERE id = ? LIMIT 1 FOR UPDATE",
          [req.params.id]
        );
        if (reqRows.length === 0) throw new Error("Demande de recharge introuvable.");
        const reqRow = mapRechargeRow(reqRows[0]);
        if (String(reqRow.status).toLowerCase() === "approved") {
          throw new Error("Cette demande de recharge a déjà été approuvée.");
        }

        const [uRows] = await conn.query<any[]>(
          "SELECT * FROM users WHERE id = ? LIMIT 1 FOR UPDATE",
          [reqRow.agencyId]
        );
        if (uRows.length === 0) throw new Error("Agence introuvable.");

        const newBalance = Number(uRows[0].balance || 0) + amountNum;
        const now = nowIso();

        await conn.query("UPDATE users SET balance = ?, updatedAt = ? WHERE id = ?", [
          newBalance,
          now,
          reqRow.agencyId,
        ]);

        await conn.query(
          "UPDATE recharge_requests SET status = 'Approved', amount = ?, updatedAt = ? WHERE id = ?",
          [amountNum, now, reqRow.id]
        );

        const noteStr = reqRow.note ? String(reqRow.note) : "";
        const noteText =
          noteStr && !noteStr.startsWith("data:image") && !noteStr.startsWith("/api/files/")
            ? ` - ${noteStr}`
            : "";

        const tx = {
          id: genId("tx"),
          agencyId: reqRow.agencyId,
          agencyName: resolveAgencyNameFromRow(uRows[0], reqRow.agencyName),
          type: "credit",
          amount: amountNum,
          description: `Validation de recharge${noteText}`,
          date: now,
          status: "completed",
          createdAt: now,
        };
        await conn.query(
          `INSERT INTO transactions (id, agencyId, agencyName, type, amount, date, description, status, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [tx.id, tx.agencyId, tx.agencyName, tx.type, tx.amount, tx.date, tx.description, tx.status, tx.createdAt]
        );

        await conn.query(
          `INSERT INTO notifications (id, agencyId, title, message, type, isRead, link, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            genId("notif"),
            reqRow.agencyId,
            "Recharge Approuvée",
            `Votre compte a été crédité de ${amountNum.toLocaleString()} DZD.`,
            "success",
            0,
            "/agency/wallet",
            now,
          ]
        );

        return { newBalance, transaction: tx };
      });

      return res.json({ success: true, ...result });
    } catch (err: any) {
      return res.status(400).json({ error: err?.message || "Impossible de valider la recharge." });
    }
  });

  router.post("/recharge-requests/:id/reject", requireAuth, requireAdmin, async (req, res) => {
    try {
      const reason = String(req.body?.reason || "").trim();
      if (!reason) return res.status(400).json({ error: "Motif obligatoire." });

      await withMysqlTransaction(async (conn) => {
        const [reqRows] = await conn.query<any[]>(
          "SELECT * FROM recharge_requests WHERE id = ? LIMIT 1 FOR UPDATE",
          [req.params.id]
        );
        if (reqRows.length === 0) throw new Error("Demande introuvable.");
        const reqRow = mapRechargeRow(reqRows[0]);
        const now = nowIso();

        await conn.query(
          "UPDATE recharge_requests SET status = 'Rejected', note = ?, updatedAt = ? WHERE id = ?",
          [`Rejeté: ${reason}`, now, reqRow.id]
        );

        await conn.query(
          `INSERT INTO notifications (id, agencyId, title, message, type, isRead, link, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            genId("notif"),
            reqRow.agencyId,
            "Recharge Rejetée",
            `Demande de ${reqRow.amount} DZD refusée. Motif : ${reason}`,
            "error",
            0,
            "/agency/wallet",
            now,
          ]
        );
      });

      return res.json({ success: true });
    } catch (err: any) {
      return res.status(400).json({ error: err?.message || "Erreur rejet demande." });
    }
  });

  router.post("/wallet/adjust", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { agencyId, type, amount, reason } = req.body || {};
      const amountNum = Number(amount);
      if (!agencyId || (type !== "credit" && type !== "debit") || !Number.isFinite(amountNum) || amountNum <= 0) {
        return res.status(400).json({ error: "Paramètres d'ajustement invalides." });
      }
      const cleanReason = String(reason || "").trim();
      if (!cleanReason) {
        return res.status(400).json({ error: "Motif administratif obligatoire." });
      }

      const result = await withMysqlTransaction(async (conn) => {
        const [uRows] = await conn.query<any[]>(
          "SELECT * FROM users WHERE id = ? LIMIT 1 FOR UPDATE",
          [String(agencyId)]
        );
        if (uRows.length === 0) throw new Error("Agence introuvable.");
        const u = uRows[0];
        const currentBal = Number(u.balance || 0);
        const diff = type === "credit" ? amountNum : -amountNum;
        const newBalance = Math.max(0, currentBal + diff);
        const actualDelta = type === "credit" ? amountNum : Math.min(currentBal, amountNum);
        const now = nowIso();

        await conn.query("UPDATE users SET balance = ?, updatedAt = ? WHERE id = ?", [
          newBalance,
          now,
          u.id,
        ]);

        const tx = {
          id: genId("tx"),
          agencyId: u.id,
          agencyName: resolveAgencyNameFromRow(u),
          type,
          amount: actualDelta,
          date: now,
          note: `Ajustement administratif : ${cleanReason}`.slice(0, 480),
          description: `${type === "credit" ? "Crédit Manuel Admin" : "Débit Manuel Admin"} - ${cleanReason}`.slice(0, 480),
          status: "completed",
          createdAt: now,
        };
        await conn.query(
          `INSERT INTO transactions (id, agencyId, agencyName, type, amount, date, note, description, status, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [tx.id, tx.agencyId, tx.agencyName, tx.type, tx.amount, tx.date, tx.note, tx.description, tx.status, tx.createdAt]
        );

        await conn.query(
          `INSERT INTO notifications (id, agencyId, title, message, type, isRead, link, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            genId("notif"),
            u.id,
            type === "credit" ? "Compte Crédité" : "Compte Débité",
            `Votre solde a été ${type === "credit" ? "crédité" : "débité"} de ${actualDelta.toLocaleString()} DZD (${cleanReason}).`.slice(0, 580),
            type === "credit" ? "success" : "info",
            0,
            "/agency/wallet",
            now,
          ]
        );

        return { newBalance, transaction: tx };
      });

      return res.json({ success: true, ...result });
    } catch (err: any) {
      return res.status(400).json({ error: err?.message || "Erreur ajustement solde." });
    }
  });

  router.post("/transactions", requireAuth, requireAdmin, async (req, res) => {
    try {
      const tx = req.body || {};
      const id = String(tx.id || genId("tx"));
      const now = nowIso();
      const createdAt = String(tx.createdAt || now);
      const pool = getMysqlPool();
      const txAgencyId = String(tx.agencyId || "");
      const resolvedAgencyName = await fetchAuthoritativeAgencyName(pool, txAgencyId, tx.agencyName);
      await pool.query(
        `INSERT INTO transactions (id, agencyId, agencyName, type, amount, date, ref, note, description, status, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          txAgencyId,
          resolvedAgencyName,
          String(tx.type || "debit"),
          Number(tx.amount || 0),
          String(tx.date || now),
          tx.ref || null,
          tx.note || null,
          tx.description || null,
          String(tx.status || "completed"),
          createdAt,
        ]
      );
      return res.json({ success: true, transaction: { ...tx, id, agencyName: resolvedAgencyName, createdAt } });
    } catch (err) {
      console.error("[MySQL POST /transactions]", err);
      return res.status(500).json({ error: "Erreur création transaction." });
    }
  });

  // =========================================================================
  // 9. SUPPORT TICKETS & NOTIFICATIONS
  // =========================================================================
  router.post("/support-tickets", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const body = req.body || {};
      const uid = req.user!.uid;
      const targetAgencyId = req.user!.isAdmin && body.agencyId ? String(body.agencyId) : uid;
      const id = String(body.id || genId("tkt"));
      const now = nowIso();
      const pool = getMysqlPool();
      const authoritativeAgencyName = await fetchAuthoritativeAgencyName(
        pool,
        targetAgencyId,
        body.agencyName,
        req.user?.email
      );

      const ticket = {
        ...body,
        id,
        agencyId: targetAgencyId,
        agencyName: authoritativeAgencyName,
        createdAt: String(body.createdAt || now),
      };

      await pool.query(
        `INSERT INTO support_tickets (
          id, agencyId, agencyName, subject, description, category, priority, status,
          isUrgent, applicationId, applicationRef, applicationSummary, attachments, messages, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          targetAgencyId,
          authoritativeAgencyName,
          String(ticket.subject || ""),
          String(ticket.description || ""),
          String(ticket.category || "Général"),
          String(ticket.priority || "Moyenne"),
          String(ticket.status || "OPEN"),
          ticket.isUrgent ? 1 : 0,
          ticket.applicationId || null,
          ticket.applicationRef || null,
          stringifyJsonSafe(ticket.applicationSummary, "null"),
          stringifyJsonSafe(ticket.attachments || [], "[]"),
          stringifyJsonSafe(ticket.messages || [], "[]"),
          ticket.createdAt,
          now,
        ]
      );

      return res.json({ success: true, ticket });
    } catch (err) {
      console.error("[MySQL POST /support-tickets]", err);
      return res.status(500).json({ error: "Erreur création ticket." });
    }
  });

  router.get("/support-tickets/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const pool = getMysqlPool();
      const [rows] = await pool.query<any[]>("SELECT * FROM support_tickets WHERE id = ? LIMIT 1", [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Ticket introuvable." });

      const item = mapTicketRow(rows[0]);
      const isAdmin = Boolean(req.user!.isAdmin);
      if (!isAdmin && item.agencyId !== req.user!.uid) {
        const email = (req.user!.email || "").toLowerCase();
        let ownerMatched = false;
        if (email) {
          const [uRows] = await pool.query<any[]>("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
          if (uRows.length > 0 && uRows[0].id === item.agencyId) ownerMatched = true;
        }
        if (!ownerMatched) return res.status(403).json({ error: "Accès refusé." });
      }
      return res.json({ ticket: item });
    } catch (err) {
      console.error("[MySQL GET /support-tickets/:id]", err);
      return res.status(500).json({ error: "Erreur chargement ticket." });
    }
  });

  router.patch("/support-tickets/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const pool = getMysqlPool();
      const [rows] = await pool.query<any[]>("SELECT * FROM support_tickets WHERE id = ? LIMIT 1", [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Ticket introuvable." });

      const current = mapTicketRow(rows[0]);
      const isAdmin = Boolean(req.user!.isAdmin);
      if (!isAdmin && current.agencyId !== req.user!.uid) {
        const email = (req.user!.email || "").toLowerCase();
        let ownerMatched = false;
        if (email) {
          const [uRows] = await pool.query<any[]>("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
          if (uRows.length > 0 && uRows[0].id === current.agencyId) ownerMatched = true;
        }
        if (!ownerMatched) return res.status(403).json({ error: "Accès refusé." });
      }

      const updates = { ...(req.body || {}) };
      if (Array.isArray(updates.attachments)) {
        updates.attachments = restoreDeferredAttachments(updates.attachments, current.attachments || []);
      }
      if (Array.isArray(updates.messages)) {
        const currentMsgs = Array.isArray(current.messages) ? current.messages : [];
        updates.messages = updates.messages.map((m: any, idx: number) => {
          if (!m || !Array.isArray(m.attachments)) return m;
          const prevAttachments = currentMsgs[idx]?.attachments || [];
          return { ...m, attachments: restoreDeferredAttachments(m.attachments, prevAttachments) };
        });
      }

      const merged = { ...current, ...updates, id: req.params.id };
      const now = nowIso();

      await pool.query(
        `UPDATE support_tickets SET status = ?, priority = ?, messages = ?, attachments = ?, updatedAt = ? WHERE id = ?`,
        [
          String(merged.status || current.status),
          String(merged.priority || current.priority),
          stringifyJsonSafe(merged.messages || [], "[]"),
          stringifyJsonSafe(merged.attachments || [], "[]"),
          now,
          req.params.id,
        ]
      );

      if (Array.isArray(updates.messages) && updates.messages.length > 0) {
        const lastMsg = updates.messages[updates.messages.length - 1];
        if (lastMsg?.sender === "agency") {
          const senderAgencyName = await fetchAuthoritativeAgencyName(pool, current.agencyId, current.agencyName);
          await pool.query(
            `INSERT INTO notifications (id, agencyId, title, message, type, isRead, link, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              genId("notif"),
              "admin",
              "Nouveau message Support",
              `${senderAgencyName} a répondu au ticket: "${current.subject}"`,
              "info",
              0,
              "/admin/support",
              now,
            ]
          );
        } else if (lastMsg?.sender === "admin") {
          await pool.query(
            `INSERT INTO notifications (id, agencyId, title, message, type, isRead, link, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              genId("notif"),
              current.agencyId,
              "Réponse Support",
              `L'administrateur a répondu à votre ticket: "${current.subject}"`,
              "info",
              0,
              "/agency/support",
              now,
            ]
          );
        }
      }

      return res.json({ success: true, ticket: merged });
    } catch (err) {
      return res.status(500).json({ error: "Erreur mise à jour ticket." });
    }
  });

  router.post("/notifications/:id/read", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const pool = getMysqlPool();
      if (req.user!.isAdmin) {
        await pool.query("UPDATE notifications SET isRead = 1 WHERE id = ?", [req.params.id]);
      } else {
        await pool.query("UPDATE notifications SET isRead = 1 WHERE id = ? AND agencyId = ?", [
          req.params.id,
          req.user!.uid,
        ]);
      }
      return res.json({ success: true });
    } catch {
      return res.status(500).json({ error: "Erreur mise à jour notification." });
    }
  });

  router.post("/notifications/read-all", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const target = req.user!.isAdmin && req.body?.agencyId === "admin" ? "admin" : req.user!.uid;
      await getMysqlPool().query("UPDATE notifications SET isRead = 1 WHERE agencyId = ? AND isRead = 0", [target]);
      return res.json({ success: true });
    } catch {
      return res.status(500).json({ error: "Erreur mise à jour notifications." });
    }
  });

  // =========================================================================
  // 10. MIGRATION SANS PERTE FIRESTORE -> MYSQL & RESET ADMIN
  // =========================================================================
  router.post("/admin/import-backup", requireAuth, requireAdmin, async (req, res) => {
    try {
      const data = req.body || {};
      const now = nowIso();
      const stats: Record<string, number> = {};

      await withMysqlTransaction(async (conn) => {
        const users: any[] = Array.isArray(data.users) ? data.users : [];
        for (const u of users) {
          await upsertUserRow(conn, u);
        }
        stats.users = users.length;

        const countries: any[] = Array.isArray(data.countries) ? data.countries : [];
        for (const c of countries) {
          if (!c?.id) continue;
          await conn.query(
            `INSERT INTO countries (id, name, agencyName, flag, active, visaTypes, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE name=VALUES(name), agencyName=VALUES(agencyName), flag=VALUES(flag), active=VALUES(active), visaTypes=VALUES(visaTypes), updatedAt=VALUES(updatedAt)`,
            [String(c.id), String(c.name || ""), String(c.agencyName || ""), String(c.flag || ""), c.active !== false ? 1 : 0, stringifyJsonSafe(c.visaTypes || [], "[]"), now]
          );
        }
        stats.countries = countries.length;

        const services: any[] = Array.isArray(data.services) ? data.services : [];
        for (const s of services) {
          if (!s?.id) continue;
          await conn.query(
            `INSERT INTO services (id, title, type, destination, flag, price, processingTime, description, requiredDocuments, conditions, active, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE title=VALUES(title), type=VALUES(type), destination=VALUES(destination), flag=VALUES(flag), price=VALUES(price), processingTime=VALUES(processingTime), description=VALUES(description), requiredDocuments=VALUES(requiredDocuments), conditions=VALUES(conditions), active=VALUES(active), updatedAt=VALUES(updatedAt)`,
            [String(s.id), String(s.title || ""), String(s.type || "Visa"), String(s.destination || "Monde"), String(s.flag || ""), Number(s.price || 0), String(s.processingTime || ""), String(s.description || ""), stringifyJsonSafe(s.requiredDocuments || [], "[]"), stringifyJsonSafe(s.conditions || [], "[]"), s.active !== false ? 1 : 0, now]
          );
        }
        stats.services = services.length;

        const trips: any[] = Array.isArray(data.organizedTrips) ? data.organizedTrips : [];
        for (const t of trips) {
          if (!t?.id) continue;
          await conn.query(
            `INSERT INTO organized_trips (id, title, destination, startDate, endDate, price, description, totalSeats, availableSeats, image, photoUrl, featured, status, customFormFields, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE title=VALUES(title), destination=VALUES(destination), startDate=VALUES(startDate), endDate=VALUES(endDate), price=VALUES(price), description=VALUES(description), totalSeats=VALUES(totalSeats), availableSeats=VALUES(availableSeats), image=VALUES(image), photoUrl=VALUES(photoUrl), featured=VALUES(featured), status=VALUES(status), customFormFields=VALUES(customFormFields), updatedAt=VALUES(updatedAt)`,
            [String(t.id), String(t.title || ""), String(t.destination || ""), String(t.startDate || ""), String(t.endDate || ""), Number(t.price || 0), String(t.description || ""), Number(t.totalSeats || 0), Number(t.availableSeats ?? t.totalSeats ?? 0), t.image || null, t.photoUrl || null, t.featured ? 1 : 0, String(t.status || "active"), stringifyJsonSafe(t.customFormFields || [], "[]"), String(t.createdAt || now), now]
          );
        }
        stats.organizedTrips = trips.length;

        const programs: any[] = Array.isArray(data.studyPrograms) ? data.studyPrograms : [];
        for (const p of programs) {
          if (!p?.id) continue;
          await conn.query(
            `INSERT INTO study_programs (id, title, country, countryFlag, university, city, type, description, admissionConditions, conditions, processingTime, intake, languageOfStudy, price, tuitionFeeYear, requiredDocuments, image, status, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE title=VALUES(title), country=VALUES(country), countryFlag=VALUES(countryFlag), university=VALUES(university), city=VALUES(city), type=VALUES(type), description=VALUES(description), admissionConditions=VALUES(admissionConditions), conditions=VALUES(conditions), processingTime=VALUES(processingTime), intake=VALUES(intake), languageOfStudy=VALUES(languageOfStudy), price=VALUES(price), tuitionFeeYear=VALUES(tuitionFeeYear), requiredDocuments=VALUES(requiredDocuments), image=VALUES(image), status=VALUES(status), updatedAt=VALUES(updatedAt)`,
            [String(p.id), String(p.title || ""), String(p.country || ""), String(p.countryFlag || ""), String(p.university || ""), String(p.city || ""), String(p.type || "Bachelor"), String(p.description || ""), stringifyJsonSafe(p.admissionConditions || [], "[]"), String(p.conditions || ""), String(p.processingTime || ""), String(p.intake || ""), String(p.languageOfStudy || ""), Number(p.price || 0), String(p.tuitionFeeYear || ""), stringifyJsonSafe(p.requiredDocuments || [], "[]"), p.image || null, String(p.status || "active"), String(p.createdAt || now), now]
          );
        }
        stats.studyPrograms = programs.length;

        const apps: any[] = Array.isArray(data.applications) ? data.applications : [];
        for (const a of apps) {
          if (!a?.id) continue;
          await conn.query(
            `INSERT INTO applications (id, agencyId, agencyName, serviceType, country, visaType, travelerName, passportNumber, status, price, submissionDate, finalDocument, finalDocumentName, finalDocumentDate, adminNotes, extraData, customFormData, attachments, timeline, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE status=VALUES(status), price=VALUES(price), finalDocument=VALUES(finalDocument), finalDocumentName=VALUES(finalDocumentName), finalDocumentDate=VALUES(finalDocumentDate), adminNotes=VALUES(adminNotes), extraData=VALUES(extraData), customFormData=VALUES(customFormData), attachments=VALUES(attachments), timeline=VALUES(timeline), updatedAt=VALUES(updatedAt)`,
            [String(a.id), String(a.agencyId || ""), String(a.agencyName || ""), String(a.serviceType || "Visa"), String(a.country || ""), String(a.visaType || ""), String(a.travelerName || ""), String(a.passportNumber || ""), String(a.status || "Pending"), Number(a.price || 0), String(a.submissionDate || now), a.finalDocument || null, a.finalDocumentName || null, a.finalDocumentDate || null, a.adminNotes || null, stringifyJsonSafe(a.extraData, "null"), stringifyJsonSafe(a.customFormData, "null"), stringifyJsonSafe(a.attachments || [], "[]"), stringifyJsonSafe(a.timeline || [], "[]"), now]
          );
        }
        stats.applications = apps.length;

        const studyApps: any[] = Array.isArray(data.studyApplications) ? data.studyApplications : [];
        for (const sa of studyApps) {
          if (!sa?.id) continue;
          await conn.query(
            `INSERT INTO study_applications (id, programId, programTitle, country, countryFlag, university, city, agencyId, agencyName, studentName, passportNumber, email, phone, status, price, paidAmount, paymentStatus, submissionDate, finalDocument, finalDocumentName, finalDocumentDate, adminNotes, documents, attachments, timeline, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE status=VALUES(status), paidAmount=VALUES(paidAmount), paymentStatus=VALUES(paymentStatus), finalDocument=VALUES(finalDocument), finalDocumentName=VALUES(finalDocumentName), finalDocumentDate=VALUES(finalDocumentDate), adminNotes=VALUES(adminNotes), documents=VALUES(documents), attachments=VALUES(attachments), timeline=VALUES(timeline), updatedAt=VALUES(updatedAt)`,
            [String(sa.id), String(sa.programId || ""), String(sa.programTitle || ""), String(sa.country || ""), String(sa.countryFlag || ""), String(sa.university || ""), String(sa.city || ""), String(sa.agencyId || ""), String(sa.agencyName || ""), String(sa.studentName || ""), String(sa.passportNumber || ""), String(sa.email || ""), String(sa.phone || ""), String(sa.status || "Pending"), Number(sa.price || 0), Number(sa.paidAmount || 0), String(sa.paymentStatus || "unpaid"), String(sa.submissionDate || now), sa.finalDocument || null, sa.finalDocumentName || null, sa.finalDocumentDate || null, sa.adminNotes || null, stringifyJsonSafe(sa.documents || {}, "{}"), stringifyJsonSafe(sa.attachments || [], "[]"), stringifyJsonSafe(sa.timeline || [], "[]"), now]
          );
        }
        stats.studyApplications = studyApps.length;

        const tripRes: any[] = Array.isArray(data.tripReservations) ? data.tripReservations : [];
        for (const tr of tripRes) {
          if (!tr?.id) continue;
          await conn.query(
            `INSERT INTO trip_reservations (id, tripId, agencyId, agencyName, clientName, clientEmail, clientPhone, notes, customFormData, numberOfPeople, status, totalPrice, paidAmount, passengerNames, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE status=VALUES(status), paidAmount=VALUES(paidAmount), updatedAt=VALUES(updatedAt)`,
            [String(tr.id), String(tr.tripId || ""), String(tr.agencyId || ""), String(tr.agencyName || ""), String(tr.clientName || ""), String(tr.clientEmail || ""), String(tr.clientPhone || ""), String(tr.notes || ""), stringifyJsonSafe(tr.customFormData, "null"), Number(tr.numberOfPeople || 1), String(tr.status || "pending"), Number(tr.totalPrice || 0), Number(tr.paidAmount || 0), stringifyJsonSafe(tr.passengerNames || [], "[]"), String(tr.createdAt || now), now]
          );
        }
        stats.tripReservations = tripRes.length;

        const txs: any[] = Array.isArray(data.transactions) ? data.transactions : [];
        for (const tx of txs) {
          if (!tx?.id) continue;
          await conn.query(
            `INSERT INTO transactions (id, agencyId, agencyName, type, amount, date, ref, note, description, status, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE status=VALUES(status), amount=VALUES(amount)`,
            [String(tx.id), String(tx.agencyId || ""), String(tx.agencyName || ""), String(tx.type || "debit"), Number(tx.amount || 0), String(tx.date || now), tx.ref || null, tx.note || null, tx.description || null, String(tx.status || "completed"), String(tx.createdAt || tx.date || now)]
          );
        }
        stats.transactions = txs.length;

        const recharges: any[] = Array.isArray(data.rechargeRequests) ? data.rechargeRequests : [];
        for (const r of recharges) {
          if (!r?.id) continue;
          await conn.query(
            `INSERT INTO recharge_requests (id, agencyId, agencyName, amount, note, status, date, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE status=VALUES(status), amount=VALUES(amount), note=VALUES(note), updatedAt=VALUES(updatedAt)`,
            [String(r.id), String(r.agencyId || ""), String(r.agencyName || ""), Number(r.amount || 0), String(r.note || ""), String(r.status || "Pending"), String(r.date || now), String(r.createdAt || r.date || now), now]
          );
        }
        stats.rechargeRequests = recharges.length;

        const notifs: any[] = Array.isArray(data.notifications) ? data.notifications : [];
        for (const n of notifs) {
          if (!n?.id) continue;
          await conn.query(
            `INSERT INTO notifications (id, agencyId, title, message, type, isRead, link, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE isRead=VALUES(isRead)`,
            [String(n.id), String(n.agencyId || ""), String(n.title || ""), String(n.message || ""), String(n.type || "info"), n.read ? 1 : 0, n.link || null, String(n.createdAt || now)]
          );
        }
        stats.notifications = notifs.length;

        const tickets: any[] = Array.isArray(data.supportTickets) ? data.supportTickets : [];
        for (const tk of tickets) {
          if (!tk?.id) continue;
          await conn.query(
            `INSERT INTO support_tickets (id, agencyId, agencyName, subject, description, category, priority, status, isUrgent, applicationId, applicationRef, applicationSummary, attachments, messages, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE status=VALUES(status), messages=VALUES(messages), updatedAt=VALUES(updatedAt)`,
            [String(tk.id), String(tk.agencyId || ""), String(tk.agencyName || ""), String(tk.subject || ""), String(tk.description || ""), String(tk.category || "Général"), String(tk.priority || "Moyenne"), String(tk.status || "OPEN"), tk.isUrgent ? 1 : 0, tk.applicationId || null, tk.applicationRef || null, stringifyJsonSafe(tk.applicationSummary, "null"), stringifyJsonSafe(tk.attachments || [], "[]"), stringifyJsonSafe(tk.messages || [], "[]"), String(tk.createdAt || now), now]
          );
        }
        stats.supportTickets = tickets.length;
      });

      return res.json({ success: true, imported: stats });
    } catch (err: any) {
      console.error("[MySQL /admin/import-backup]", err);
      return res.status(500).json({ error: err?.message || "Erreur lors de l'importation MySQL." });
    }
  });

  router.post("/admin/reset", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      await withMysqlTransaction(async (conn) => {
        const tables = [
          "applications",
          "study_applications",
          "trip_reservations",
          "transactions",
          "recharge_requests",
          "notifications",
          "support_tickets",
          "organized_trips",
          "study_programs",
          "countries",
          "services",
        ];
        for (const tbl of tables) {
          await conn.query(`DELETE FROM ${tbl}`);
        }
        await conn.query("DELETE FROM users WHERE role != 'admin' AND id != ?", [req.user!.uid]);
        await conn.query("UPDATE users SET balance = 0, applicationsCount = 0 WHERE id = ? OR role = 'admin'", [
          req.user!.uid,
        ]);
      });
      return res.json({ success: true });
    } catch (err) {
      console.error("[MySQL /admin/reset]", err);
      return res.status(500).json({ error: "Erreur réinitialisation MySQL." });
    }
  });

  return router;
}
