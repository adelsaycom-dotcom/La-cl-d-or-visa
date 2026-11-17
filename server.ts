import express, { type Request, type Response, type NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors, { type CorsOptions } from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { GoogleGenAI } from "@google/genai";
import { initializeApp as initializeAdminApp, getApps as getAdminApps } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";

interface AuthenticatedUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  isAdmin: boolean;
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

interface UploadMetadata {
  ownerUid: string;
  mimeType: string;
  originalName: string;
  size: number;
  createdAt: string;
}

const ADMIN_EMAILS = new Set<string>([
  "adel.saycom@gmail.com",
  "admin@cle-dor.com",
  "admin@lacle-dor.com",
]);

const ALLOWED_MIME_TYPES = new Set<string>([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const SAFE_UPLOAD_FILENAME_REGEX = /^att_[0-9]+_[a-f0-9]{16}\.(pdf|jpg|png|webp)$/i;
const MAX_UPLOAD_BYTES = 5.5 * 1024 * 1024; // 5.5 Mo max après décodage base64

function loadFirebaseConfig(): { projectId?: string; firestoreDatabaseId?: string } {
  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, "utf8"));
    }
  } catch (err) {
    console.warn("Impossible de lire firebase-applet-config.json:", err);
  }
  return {};
}

function detectFileSignature(buffer: Buffer): { ext: ".pdf" | ".jpg" | ".png" | ".webp"; mime: string } | null {
  if (buffer.length < 12) return null;

  // PDF : %PDF-
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46 &&
    buffer[4] === 0x2d
  ) {
    return { ext: ".pdf", mime: "application/pdf" };
  }

  // JPEG : FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { ext: ".jpg", mime: "image/jpeg" };
  }

  // PNG : 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { ext: ".png", mime: "image/png" };
  }

  // WEBP : RIFF....WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { ext: ".webp", mime: "image/webp" };
  }

  return null;
}

function sanitizeDownloadFilename(rawName: string): string {
  const cleaned = path
    .basename(rawName)
    .replace(/[\r\n"\\\/<>:|?*]/g, "_")
    .trim();
  return cleaned || "document.pdf";
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === "production";

  const fbConfig = loadFirebaseConfig();
  const projectId = process.env.FIREBASE_PROJECT_ID || fbConfig.projectId;
  const firestoreDatabaseId = process.env.FIREBASE_DATABASE_ID || fbConfig.firestoreDatabaseId;

  const adminApp =
    getAdminApps().length > 0
      ? getAdminApps()[0]
      : initializeAdminApp(projectId ? { projectId } : undefined);

  const adminAuth = getAdminAuth(adminApp);
  let adminDb: ReturnType<typeof getAdminFirestore> | null = null;
  try {
    adminDb = firestoreDatabaseId
      ? getAdminFirestore(adminApp, firestoreDatabaseId)
      : getAdminFirestore(adminApp);
  } catch {
    adminDb = null;
  }

  // Activation de trust proxy pour Cloud Run / reverse proxies
  app.set("trust proxy", 1);

  // Limite JSON à 12 Mo pour les scans et PDF de 5 Mo en base64
  app.use(express.json({ limit: "12mb" }));
  app.use(express.urlencoded({ limit: "12mb", extended: true }));

  // Stockage privé hors de /public (aucune exposition statique directe)
  const privateUploadsDir = path.join(process.cwd(), "storage", "uploads");
  if (!fs.existsSync(privateUploadsDir)) {
    fs.mkdirSync(privateUploadsDir, { recursive: true });
  }

  // 1. Sécurité Web & CSP adaptée à Vite, Tesseract/PDF.js (WASM/blob), Firebase et iFrame AI Studio
  app.use(
    helmet({
      frameguard: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: "same-origin" },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: isProd
            ? ["'self'", "'wasm-unsafe-eval'", "blob:"]
            : ["'self'", "'unsafe-inline'", "'unsafe-eval'", "'wasm-unsafe-eval'", "blob:"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "blob:", "https:"],
          connectSrc: [
            "'self'",
            "blob:",
            "data:",
            "https://*.googleapis.com",
            "https://*.firebaseio.com",
            "wss://*.firebaseio.com",
            "https://identitytoolkit.googleapis.com",
            "https://securetoken.googleapis.com",
            "https://firestore.googleapis.com",
            "https://cdn.jsdelivr.net",
            "https://unpkg.com",
          ],
          workerSrc: ["'self'", "blob:"],
          objectSrc: ["'self'", "blob:"],
          frameAncestors: [
            "'self'",
            "https://aistudio.google.com",
            "https://*.usercontent.goog",
            "https://*.google.com",
          ],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
    })
  );

  // 2. CORS : Origines explicitement autorisées uniquement
  const configuredOrigins = new Set<string>(
    [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      process.env.APP_URL,
      ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : []),
    ]
      .filter((val): val is string => Boolean(val))
      .map((origin) => origin.trim().replace(/\/$/, ""))
  );

  app.use(
    cors((req, callback) => {
      const origin = req.headers.origin?.replace(/\/$/, "");
      if (!origin) {
        return callback(null, { origin: true });
      }
      const host = req.headers.host;
      const isSameHost =
        Boolean(host) && (origin === `https://${host}` || origin === `http://${host}`);

      if (isSameHost || configuredOrigins.has(origin)) {
        const opts: CorsOptions = {
          origin: true,
          methods: ["GET", "POST", "OPTIONS"],
          allowedHeaders: ["Content-Type", "Authorization"],
          maxAge: 600,
        };
        return callback(null, opts);
      }

      return callback(new Error("Origine CORS non autorisée"), { origin: false });
    })
  );

  // 3. Anti-DDoS & Anti-Brute Force
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    message: {
      error: "Trop de requêtes détectées depuis cette adresse IP, veuillez réessayer dans 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: {
      xForwardedForHeader: false,
      default: false,
    },
  });

  app.use("/api/", apiLimiter);

  // 4. Middleware d'authentification Firebase ID Token
  async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authentification requise (jeton manquant)." });
      }

      const idToken = authHeader.slice(7).trim();
      if (!idToken) {
        return res.status(401).json({ error: "Jeton d'authentification invalide." });
      }

      const decoded = await adminAuth.verifyIdToken(idToken);
      const email = (decoded.email || "").toLowerCase();
      const emailVerified = Boolean(decoded.email_verified);

      let isAdmin = emailVerified && ADMIN_EMAILS.has(email);

      if (!isAdmin && adminDb) {
        try {
          const userSnap = await adminDb.collection("users").doc(decoded.uid).get();
          if (userSnap.exists && userSnap.data()?.role === "admin") {
            isAdmin = true;
          }
        } catch {
          // En l'absence d'ADC serveur, la liste blanche email vérifiée reste active
        }
      }

      req.user = {
        uid: decoded.uid,
        email,
        emailVerified,
        isAdmin,
      };

      return next();
    } catch {
      return res.status(401).json({ error: "Session expirée ou jeton d'authentification invalide." });
    }
  }

  // Routes API
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Analyse intelligente de passeport (OCR / MRZ avec Gemini) — Authentifié
  app.post("/api/scan-passport", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { imageBase64, mimeType = "image/jpeg" } = req.body || {};
      if (typeof imageBase64 !== "string" || !imageBase64.trim()) {
        return res.status(400).json({ error: "Aucune donnée d'image fournie." });
      }

      const normalizedMime = typeof mimeType === "string" ? mimeType.toLowerCase().trim() : "image/jpeg";
      if (!ALLOWED_MIME_TYPES.has(normalizedMime)) {
        return res.status(400).json({ error: "Format de document non supporté." });
      }

      const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");
      const decodedBuffer = Buffer.from(cleanBase64, "base64");
      if (decodedBuffer.length === 0 || decodedBuffer.length > MAX_UPLOAD_BYTES) {
        return res.status(400).json({ error: "Taille de document invalide (max 5.5 Mo)." });
      }

      if (process.env.GEMINI_API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `Tu es un système expert de reconnaissance optique et d'analyse de documents d'identité officiels (passeports biométriques internationaux et permis de conduire algériens ou internationaux, formats carte ou livret).
Analyse l'image ou le scan de ce document (passeport ou permis de conduire) et extrais avec une rigueur absolue les informations personnelles du titulaire en format JSON STRICT :
{
  "firstName": "Prénom(s) du titulaire en majuscules",
  "lastName": "Nom de famille en majuscules",
  "passportNumber": "Numéro de document (numéro de passeport ou numéro du permis de conduire) sans espaces",
  "dateOfBirth": "Date de naissance au format YYYY-MM-DD",
  "expiryDate": "Date d'expiration ou de validité au format YYYY-MM-DD",
  "issueDate": "Date de délivrance au format YYYY-MM-DD",
  "nationality": "Nationalité (ex: Algérienne)",
  "gender": "M ou F",
  "issuingCountry": "Pays d'émission (ex: Algérie)",
  "placeOfBirth": "Lieu de naissance / Wilaya",
  "licenseType": "Catégorie de permis si visible (ex: B, A, C)",
  "documentType": "passport ou driving_license"
}
Si un champ est absent ou illisible, renvoie une chaîne vide "". Réponds UNIQUEMENT avec l'objet JSON valide, sans texte d'introduction ni balises markdown additionnelles.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: normalizedMime === "image/jpg" ? "image/jpeg" : normalizedMime,
              },
            },
            prompt,
          ],
        });

        const text = response.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({ success: true, data: parsed, source: "gemini" });
        }
      }

      return res.json({
        success: true,
        data: {
          firstName: "",
          lastName: "",
          passportNumber: "",
          dateOfBirth: "",
          expiryDate: "",
          issueDate: "",
          nationality: "Algérienne",
          gender: "M",
          issuingCountry: "Algérie",
          placeOfBirth: "",
        },
        source: "default",
      });
    } catch (error) {
      console.error("Erreur scan passeport:", error);
      return res.status(500).json({
        error: "Erreur lors de l'analyse du document.",
        data: null,
      });
    }
  });

  // Téléversement sécurisé de pièces jointes (Validation magic bytes + stockage privé hors /public)
  app.post("/api/upload-attachment", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const {
        fileBase64,
        fileName = "document",
        category = "Document",
      } = req.body || {};

      if (typeof fileBase64 !== "string" || !fileBase64.trim()) {
        return res.status(400).json({ error: "Aucune donnée de fichier transmise." });
      }

      const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(cleanBase64, "base64");

      if (buffer.length === 0 || buffer.length > MAX_UPLOAD_BYTES) {
        return res.status(400).json({ error: "Taille de fichier invalide (5.5 Mo maximum)." });
      }

      const detected = detectFileSignature(buffer);
      if (!detected) {
        return res.status(400).json({
          error: "Type de fichier refusé. Seuls les formats PDF, JPG, PNG et WEBP valides sont autorisés.",
        });
      }

      const randomHex = crypto.randomBytes(8).toString("hex");
      const uniqueName = `att_${Date.now()}_${randomHex}${detected.ext}`;
      const filePath = path.join(privateUploadsDir, uniqueName);
      const metaPath = path.join(privateUploadsDir, `${uniqueName}.meta.json`);

      const safeDisplayName = sanitizeDownloadFilename(
        typeof fileName === "string" ? fileName : `document${detected.ext}`
      );
      const safeCategory =
        typeof category === "string" ? category.slice(0, 80).trim() : "Document";

      const metadata: UploadMetadata = {
        ownerUid: req.user!.uid,
        mimeType: detected.mime,
        originalName: safeDisplayName,
        size: buffer.length,
        createdAt: new Date().toISOString(),
      };

      await fs.promises.writeFile(filePath, buffer);
      await fs.promises.writeFile(metaPath, JSON.stringify(metadata), "utf8");

      return res.json({
        success: true,
        url: `/api/files/${uniqueName}`,
        name: safeDisplayName,
        size: buffer.length,
        type: detected.mime,
        category: safeCategory,
      });
    } catch (error) {
      console.error("Erreur enregistrement pièce jointe:", error);
      return res.status(500).json({ error: "Erreur lors de l'enregistrement du document." });
    }
  });

  // Lecture sécurisée et authentifiée des fichiers privés
  async function servePrivateFile(
    req: AuthenticatedRequest,
    res: Response,
    rawFileParam: string,
    asAttachment: boolean,
    requestedDownloadName?: string
  ) {
    const safeName = path.basename(rawFileParam || "");
    if (!SAFE_UPLOAD_FILENAME_REGEX.test(safeName)) {
      return res.status(400).json({ error: "Identifiant de fichier invalide." });
    }

    const filePath = path.resolve(privateUploadsDir, safeName);
    if (!filePath.startsWith(privateUploadsDir + path.sep)) {
      return res.status(403).json({ error: "Accès refusé." });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Document introuvable." });
    }

    const metaPath = path.resolve(privateUploadsDir, `${safeName}.meta.json`);
    let meta: UploadMetadata | null = null;
    if (fs.existsSync(metaPath)) {
      try {
        meta = JSON.parse(fs.readFileSync(metaPath, "utf8")) as UploadMetadata;
      } catch {
        meta = null;
      }
    }

    // Contrôle d'autorisation strict : propriétaire ou administrateur
    const isOwner = Boolean(meta && meta.ownerUid === req.user?.uid);
    if (!isOwner && !req.user?.isAdmin) {
      return res.status(403).json({ error: "Vous n'êtes pas autorisé à accéder à ce document." });
    }

    const mimeType =
      meta?.mimeType ||
      (safeName.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/octet-stream");

    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("Content-Security-Policy", "default-src 'none'; sandbox");
    res.setHeader("Content-Type", mimeType);

    if (asAttachment) {
      const downloadName = sanitizeDownloadFilename(
        requestedDownloadName || meta?.originalName || safeName
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${downloadName}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`
      );
    } else {
      res.setHeader("Content-Disposition", "inline");
    }

    return fs.createReadStream(filePath).pipe(res);
  }

  app.get("/api/files/:filename", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      return await servePrivateFile(req, res, req.params.filename, false);
    } catch (err) {
      console.error("Erreur lecture fichier privé:", err);
      return res.status(500).json({ error: "Erreur lors de la récupération du document." });
    }
  });

  app.get("/api/download", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const fileParam = req.query.file as string;
      const fileNameParam = req.query.filename as string | undefined;
      if (!fileParam) {
        return res.status(400).json({ error: "Paramètre file requis." });
      }
      return await servePrivateFile(req, res, fileParam, true, fileNameParam);
    } catch (err) {
      console.error("Erreur API download:", err);
      return res.status(500).json({ error: "Erreur de téléchargement." });
    }
  });

  // Vite middleware pour le développement ou service des assets compilés en production
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(
      "/assets",
      express.static(path.join(distPath, "assets"), {
        maxAge: "1y",
        immutable: true,
        fallthrough: true
      })
    );
    app.use(
      express.static(distPath, {
        index: false,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith("index.html")) {
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
          }
        }
      })
    );
    app.get("*", (req, res) => {
      if (
        req.path.startsWith("/assets/") ||
        /\.(js|mjs|css|map|png|jpg|jpeg|webp|svg|woff2|wasm)$/i.test(req.path)
      ) {
        return res.status(404).end();
      }
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      return res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
