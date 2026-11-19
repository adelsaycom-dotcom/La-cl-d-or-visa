import mysql, { type Pool, type PoolConnection } from "mysql2/promise";

let pool: Pool | null = null;
let mysqlReady = false;
let lastMysqlError: string | null = null;

export interface MysqlConfigInfo {
  configured: boolean;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  ssl?: boolean;
  uri?: string;
}

export function resolveMysqlConfig(): MysqlConfigInfo {
  const rawUrl = process.env.MYSQL_URL || process.env.DATABASE_URL || "";
  if (rawUrl && /^mysql2?:\/\//i.test(rawUrl.trim())) {
    return {
      configured: true,
      uri: rawUrl.trim(),
    };
  }

  const host = (process.env.MYSQL_HOST || process.env.DB_HOST || "").trim();
  const user = (process.env.MYSQL_USER || process.env.DB_USER || "").trim();
  const password = process.env.MYSQL_PASSWORD ?? process.env.DB_PASSWORD ?? "";
  const database = (process.env.MYSQL_DATABASE || process.env.DB_NAME || "").trim();
  const portRaw = process.env.MYSQL_PORT || process.env.DB_PORT || "3306";
  const port = Number.parseInt(portRaw, 10) || 3306;
  const ssl = String(process.env.MYSQL_SSL || "false").toLowerCase() === "true";

  if (host && user && database) {
    return {
      configured: true,
      host,
      port,
      user,
      password,
      database,
      ssl,
    };
  }

  return { configured: false };
}

export function isMysqlConfigured(): boolean {
  return resolveMysqlConfig().configured;
}

export function isMysqlActive(): boolean {
  return Boolean(pool && mysqlReady);
}

export function getMysqlStatus() {
  return {
    configured: isMysqlConfigured(),
    active: isMysqlActive(),
    error: lastMysqlError,
  };
}

export function getMysqlPool(): Pool {
  if (!pool) {
    throw new Error("La connexion MySQL n'est pas initialisée.");
  }
  return pool;
}

export async function withMysqlTransaction<T>(
  callback: (conn: PoolConnection) => Promise<T>
): Promise<T> {
  const activePool = getMysqlPool();
  const conn = await activePool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (err) {
    try {
      await conn.rollback();
    } catch {
      // Ignorer erreur de rollback secondaire
    }
    throw err;
  } finally {
    conn.release();
  }
}

export function parseJsonSafe<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return value as T;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    try {
      return JSON.parse(trimmed) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export function stringifyJsonSafe(value: unknown, fallback = "null"): string {
  if (value === undefined || value === null) return fallback;
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

const SCHEMA_TABLES_SQL: string[] = [
  `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    email VARCHAR(191) NOT NULL,
    name VARCHAR(255) DEFAULT '',
    agencyName VARCHAR(255) DEFAULT '',
    companyName VARCHAR(255) DEFAULT '',
    phone VARCHAR(64) DEFAULT '',
    rc VARCHAR(128) DEFAULT '',
    nif VARCHAR(128) DEFAULT '',
    managerName VARCHAR(255) DEFAULT '',
    address TEXT,
    wilaya VARCHAR(128) DEFAULT '',
    role VARCHAR(32) NOT NULL DEFAULT 'agency',
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    balance DOUBLE NOT NULL DEFAULT 0,
    applicationsCount INT NOT NULL DEFAULT 0,
    b2cMarginPercent DOUBLE NOT NULL DEFAULT 15,
    bannedUntil VARCHAR(64) DEFAULT NULL,
    banReason TEXT,
    createdAt VARCHAR(64) NOT NULL,
    updatedAt VARCHAR(64) NOT NULL,
    rawData LONGTEXT,
    INDEX idx_users_email (email),
    INDEX idx_users_role_status (role, status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS countries (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    agencyName VARCHAR(255) DEFAULT '',
    flag VARCHAR(64) DEFAULT '',
    active TINYINT(1) NOT NULL DEFAULT 1,
    visaTypes LONGTEXT,
    updatedAt VARCHAR(64) NOT NULL,
    INDEX idx_countries_active (active)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL,
    destination VARCHAR(191) NOT NULL,
    flag VARCHAR(64) DEFAULT '',
    price DOUBLE NOT NULL DEFAULT 0,
    processingTime VARCHAR(128) DEFAULT '',
    description TEXT,
    requiredDocuments LONGTEXT,
    conditions LONGTEXT,
    active TINYINT(1) NOT NULL DEFAULT 1,
    updatedAt VARCHAR(64) NOT NULL,
    INDEX idx_services_active_type (active, type)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS organized_trips (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(191) NOT NULL,
    startDate VARCHAR(64) DEFAULT '',
    endDate VARCHAR(64) DEFAULT '',
    price DOUBLE NOT NULL DEFAULT 0,
    description TEXT,
    totalSeats INT NOT NULL DEFAULT 0,
    availableSeats INT NOT NULL DEFAULT 0,
    image LONGTEXT,
    photoUrl LONGTEXT,
    featured TINYINT(1) NOT NULL DEFAULT 0,
    status VARCHAR(32) DEFAULT 'active',
    customFormFields LONGTEXT,
    createdAt VARCHAR(64) NOT NULL,
    updatedAt VARCHAR(64) NOT NULL,
    INDEX idx_trips_status (status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS study_programs (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    country VARCHAR(191) NOT NULL,
    countryFlag VARCHAR(64) DEFAULT '',
    university VARCHAR(255) NOT NULL,
    city VARCHAR(191) DEFAULT '',
    type VARCHAR(64) NOT NULL,
    description TEXT,
    admissionConditions LONGTEXT,
    conditions TEXT,
    processingTime VARCHAR(128) DEFAULT '',
    intake VARCHAR(128) DEFAULT '',
    languageOfStudy VARCHAR(128) DEFAULT '',
    price DOUBLE NOT NULL DEFAULT 0,
    tuitionFeeYear VARCHAR(128) DEFAULT '',
    requiredDocuments LONGTEXT,
    image LONGTEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    createdAt VARCHAR(64) NOT NULL,
    updatedAt VARCHAR(64) NOT NULL,
    INDEX idx_study_status (status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    agencyId VARCHAR(191) NOT NULL,
    agencyName VARCHAR(255) NOT NULL,
    serviceType VARCHAR(64) NOT NULL,
    country VARCHAR(191) NOT NULL,
    visaType VARCHAR(255) NOT NULL,
    travelerName VARCHAR(255) NOT NULL,
    passportNumber VARCHAR(128) DEFAULT '',
    status VARCHAR(32) NOT NULL DEFAULT 'Pending',
    price DOUBLE NOT NULL DEFAULT 0,
    submissionDate VARCHAR(64) NOT NULL,
    finalDocument LONGTEXT,
    finalDocumentName VARCHAR(255) DEFAULT NULL,
    finalDocumentDate VARCHAR(64) DEFAULT NULL,
    adminNotes TEXT,
    extraData LONGTEXT,
    customFormData LONGTEXT,
    attachments LONGTEXT,
    timeline LONGTEXT,
    updatedAt VARCHAR(64) NOT NULL,
    INDEX idx_apps_agency (agencyId),
    INDEX idx_apps_status (status),
    INDEX idx_apps_submission (submissionDate)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS trip_reservations (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    tripId VARCHAR(191) NOT NULL,
    agencyId VARCHAR(191) NOT NULL,
    agencyName VARCHAR(255) DEFAULT '',
    clientName VARCHAR(255) DEFAULT '',
    clientEmail VARCHAR(191) DEFAULT '',
    clientPhone VARCHAR(64) DEFAULT '',
    notes TEXT,
    customFormData LONGTEXT,
    numberOfPeople INT NOT NULL DEFAULT 1,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    totalPrice DOUBLE NOT NULL DEFAULT 0,
    paidAmount DOUBLE NOT NULL DEFAULT 0,
    passengerNames LONGTEXT,
    createdAt VARCHAR(64) NOT NULL,
    updatedAt VARCHAR(64) NOT NULL,
    INDEX idx_trip_res_agency (agencyId),
    INDEX idx_trip_res_trip (tripId)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS study_applications (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    programId VARCHAR(191) NOT NULL,
    programTitle VARCHAR(255) DEFAULT '',
    country VARCHAR(191) DEFAULT '',
    countryFlag VARCHAR(64) DEFAULT '',
    university VARCHAR(255) DEFAULT '',
    city VARCHAR(191) DEFAULT '',
    agencyId VARCHAR(191) NOT NULL,
    agencyName VARCHAR(255) NOT NULL,
    studentName VARCHAR(255) NOT NULL,
    passportNumber VARCHAR(128) DEFAULT '',
    email VARCHAR(191) DEFAULT '',
    phone VARCHAR(64) DEFAULT '',
    status VARCHAR(32) NOT NULL DEFAULT 'Pending',
    price DOUBLE NOT NULL DEFAULT 0,
    paidAmount DOUBLE NOT NULL DEFAULT 0,
    paymentStatus VARCHAR(32) NOT NULL DEFAULT 'unpaid',
    submissionDate VARCHAR(64) NOT NULL,
    finalDocument LONGTEXT,
    finalDocumentName VARCHAR(255) DEFAULT NULL,
    finalDocumentDate VARCHAR(64) DEFAULT NULL,
    adminNotes TEXT,
    documents LONGTEXT,
    attachments LONGTEXT,
    timeline LONGTEXT,
    updatedAt VARCHAR(64) NOT NULL,
    INDEX idx_study_apps_agency (agencyId),
    INDEX idx_study_apps_program (programId)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    agencyId VARCHAR(191) NOT NULL,
    agencyName VARCHAR(255) DEFAULT '',
    type VARCHAR(32) NOT NULL,
    amount DOUBLE NOT NULL DEFAULT 0,
    date VARCHAR(64) NOT NULL,
    ref VARCHAR(191) DEFAULT '',
    note TEXT,
    description TEXT,
    status VARCHAR(32) DEFAULT 'completed',
    createdAt VARCHAR(64) NOT NULL,
    INDEX idx_tx_agency (agencyId),
    INDEX idx_tx_created (createdAt)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS recharge_requests (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    agencyId VARCHAR(191) NOT NULL,
    agencyName VARCHAR(255) NOT NULL,
    amount DOUBLE NOT NULL DEFAULT 0,
    note TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'Pending',
    date VARCHAR(64) NOT NULL,
    createdAt VARCHAR(64) NOT NULL,
    updatedAt VARCHAR(64) NOT NULL,
    INDEX idx_recharge_agency (agencyId),
    INDEX idx_recharge_status (status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    agencyId VARCHAR(191) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(32) NOT NULL DEFAULT 'info',
    isRead TINYINT(1) NOT NULL DEFAULT 0,
    link VARCHAR(255) DEFAULT NULL,
    createdAt VARCHAR(64) NOT NULL,
    INDEX idx_notif_agency_read (agencyId, isRead),
    INDEX idx_notif_created (createdAt)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    agencyId VARCHAR(191) NOT NULL,
    agencyName VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(128) DEFAULT 'Général',
    priority VARCHAR(32) DEFAULT 'Moyenne',
    status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
    isUrgent TINYINT(1) NOT NULL DEFAULT 0,
    applicationId VARCHAR(191) DEFAULT NULL,
    applicationRef VARCHAR(191) DEFAULT NULL,
    applicationSummary LONGTEXT,
    attachments LONGTEXT,
    messages LONGTEXT,
    createdAt VARCHAR(64) NOT NULL,
    updatedAt VARCHAR(64) NOT NULL,
    INDEX idx_tickets_agency (agencyId),
    INDEX idx_tickets_status (status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS attachments (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    ownerUid VARCHAR(191) NOT NULL,
    mimeType VARCHAR(128) NOT NULL,
    originalName VARCHAR(255) NOT NULL,
    size INT NOT NULL DEFAULT 0,
    data LONGBLOB NOT NULL,
    createdAt VARCHAR(64) NOT NULL,
    INDEX idx_att_owner (ownerUid)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

let pendingInitPromise: Promise<boolean> | null = null;

export async function ensureMysqlConnected(): Promise<boolean> {
  if (isMysqlActive()) return true;
  if (!isMysqlConfigured()) return false;
  if (pendingInitPromise) return pendingInitPromise;
  pendingInitPromise = initMysqlDatabase().finally(() => {
    pendingInitPromise = null;
  });
  return pendingInitPromise;
}

const COMPOSITE_INDEXES: Array<{ table: string; name: string; columns: string }> = [
  { table: "applications", name: "idx_apps_agency_sub", columns: "agencyId, submissionDate" },
  { table: "study_applications", name: "idx_study_apps_agency_sub", columns: "agencyId, submissionDate" },
  { table: "trip_reservations", name: "idx_trip_res_agency_created", columns: "agencyId, createdAt" },
  { table: "transactions", name: "idx_tx_agency_created", columns: "agencyId, createdAt" },
  { table: "recharge_requests", name: "idx_recharge_agency_created", columns: "agencyId, createdAt" },
  { table: "support_tickets", name: "idx_tickets_agency_created", columns: "agencyId, createdAt" },
  { table: "notifications", name: "idx_notif_agency_created", columns: "agencyId, createdAt" },
];

async function ensureCompositeIndexes(conn: PoolConnection): Promise<void> {
  for (const idx of COMPOSITE_INDEXES) {
    try {
      const [rows] = await conn.query<any[]>(
        `SELECT 1 FROM information_schema.STATISTICS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1`,
        [idx.table, idx.name]
      );
      if (rows.length === 0) {
        await conn.query(`ALTER TABLE ${idx.table} ADD INDEX ${idx.name} (${idx.columns})`);
      }
    } catch {
      // Ignorer si privilèges restreints ou index déjà présent
    }
  }
}

export async function initMysqlDatabase(): Promise<boolean> {
  const cfg = resolveMysqlConfig();
  if (!cfg.configured) {
    mysqlReady = false;
    lastMysqlError = null;
    return false;
  }

  try {
    if (cfg.uri) {
      pool = mysql.createPool({
        uri: cfg.uri,
        waitForConnections: true,
        connectionLimit: 12,
        queueLimit: 0,
        connectTimeout: 10000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
        charset: "utf8mb4",
      });
    } else {
      pool = mysql.createPool({
        host: cfg.host,
        port: cfg.port,
        user: cfg.user,
        password: cfg.password,
        database: cfg.database,
        waitForConnections: true,
        connectionLimit: 12,
        queueLimit: 0,
        connectTimeout: 10000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
        charset: "utf8mb4",
        ...(cfg.ssl ? { ssl: { rejectUnauthorized: false } } : {}),
      });
    }

    const conn = await pool.getConnection();
    try {
      await conn.ping();
      for (const ddl of SCHEMA_TABLES_SQL) {
        await conn.query(ddl);
      }
      await ensureCompositeIndexes(conn);
    } finally {
      conn.release();
    }

    mysqlReady = true;
    lastMysqlError = null;
    console.log("[MySQL] Base de données MySQL connectée, 13 tables et index composites vérifiés.");
    return true;
  } catch (err: any) {
    mysqlReady = false;
    lastMysqlError = err?.message || "Erreur connexion MySQL";
    console.error("[MySQL] Échec connexion ou initialisation:", lastMysqlError);
    if (pool) {
      try {
        await pool.end();
      } catch {
        // Ignorer
      }
      pool = null;
    }
    return false;
  }
}
