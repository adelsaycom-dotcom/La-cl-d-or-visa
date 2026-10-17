import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";

import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  // Activation de trust proxy pour Google Cloud Run / reverse proxies (résout l'erreur express-rate-limit)
  app.set("trust proxy", 1);

  // Augmentation de la limite à 15 Mo pour supporter les scans et PDF de 5 Mo en base64
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // Dossier de stockage persistant pour les fichiers/scans/visas
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadsDir));

  // 1. Sécurité Web : Protection contre XSS, Clickjacking, Sniffing
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  }));

  // 2. CORS : Contrôle des origines autorisées
  app.use(cors());

  // 3. Anti-DDoS & Anti-Brute Force : Limite de requêtes sur l'API avec validation proxy désactivée
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { error: "Trop de requêtes détectées depuis cette adresse IP, veuillez réessayer dans 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
    validate: {
      xForwardedForHeader: false,
      default: false
    }
  });
  
  // Appliquer la limite uniquement sur les routes API
  app.use("/api/", apiLimiter);


  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Analyse intelligente de passeport (OCR / MRZ avec Gemini)
  app.post("/api/scan-passport", async (req, res) => {
    try {
      const { imageBase64, mimeType = "image/jpeg" } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Aucune donnée d'image fournie" });
      }

      const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");

      if (process.env.GEMINI_API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `Tu es un système expert de reconnaissance optique et d'analyse de passeports biométriques internationaux (norme ICAO Doc 9303 / MRZ).
Analyse l'image ou le scan de ce passeport et extrais avec une rigueur absolue les informations personnelles du titulaire en format JSON STRICT :
{
  "firstName": "Prénom(s) du titulaire en majuscules",
  "lastName": "Nom de famille en majuscules",
  "passportNumber": "Numéro de passeport sans espaces",
  "dateOfBirth": "Date de naissance au format YYYY-MM-DD",
  "expiryDate": "Date d'expiration au format YYYY-MM-DD",
  "issueDate": "Date de délivrance au format YYYY-MM-DD",
  "nationality": "Nationalité (ex: Algérienne, Française, etc.)",
  "gender": "M ou F",
  "issuingCountry": "Pays d'émission (ex: Algérie)",
  "placeOfBirth": "Lieu de naissance"
}
Si un champ est absent ou illisible, renvoie une chaîne vide "". Réponds UNIQUEMENT avec l'objet JSON valide, sans texte d'introduction ni balises markdown additionnelles.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType.includes("pdf") ? "application/pdf" : (mimeType || "image/jpeg")
              }
            },
            prompt
          ]
        });

        const text = response.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({ success: true, data: parsed, source: "gemini" });
        }
      }

      // Si pas de clé d'API ou indisponibilité réseau, renvoi de structure prête
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
          placeOfBirth: ""
        },
        source: "default"
      });
    } catch (error: any) {
      console.error("Erreur scan passeport:", error);
      return res.status(500).json({ 
        error: error.message || "Erreur lors de l'analyse du passeport",
        data: null 
      });
    }
  });

  // Téléversement sécurisé de pièces jointes (photos, scans, PDF jusqu'à 5 Mo)
  // Stockage sur disque pour ne jamais dépasser la limite de 1 Mo par document Firestore
  app.post("/api/upload-attachment", async (req, res) => {
    try {
      const { fileBase64, fileName = "document", fileType = "application/octet-stream", category = "Document" } = req.body;
      if (!fileBase64) {
        return res.status(400).json({ error: "Aucune donnée de fichier transmise" });
      }

      const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(cleanBase64, "base64");

      const safeExt = path.extname(fileName) || (fileType.includes("pdf") ? ".pdf" : fileType.includes("png") ? ".png" : ".jpg");
      const baseName = path.basename(fileName, safeExt).replace(/[^a-zA-Z0-9_-]/g, "_");
      const uniqueName = `att_${Date.now()}_${baseName}${safeExt}`;
      const filePath = path.join(uploadsDir, uniqueName);

      await fs.promises.writeFile(filePath, buffer);

      const fileUrl = `/uploads/${uniqueName}`;

      return res.json({
        success: true,
        url: fileUrl,
        name: fileName,
        size: buffer.length,
        type: fileType,
        category: category
      });
    } catch (error: any) {
      console.error("Erreur enregistrement pièce jointe:", error);
      return res.status(500).json({ error: error.message || "Erreur lors de l'enregistrement du document" });
    }
  });

  // Route de téléchargement forcé avec Content-Disposition
  app.get("/api/download", (req, res) => {
    try {
      const fileParam = req.query.file as string;
      const fileNameParam = (req.query.filename as string) || "document.pdf";
      if (!fileParam) {
        return res.status(400).send("Paramètre file requis");
      }

      const safeName = path.basename(fileParam);
      const filePath = path.join(uploadsDir, safeName);

      if (!fs.existsSync(filePath)) {
        return res.status(404).send("Document introuvable");
      }

      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(fileNameParam)}"`);
      res.setHeader("Content-Type", fileNameParam.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/octet-stream");
      fs.createReadStream(filePath).pipe(res);
    } catch (err: any) {
      console.error("Erreur API download:", err);
      res.status(500).send("Erreur de téléchargement");
    }
  });

  // Prisma needs an actual postgres DB connection, so we gracefully handle it if missing.
  app.get("/api/visa-types", async (req, res) => {
    // We would use Prisma here, e.g. await prisma.visaType.findMany()
    // For now, we mock some data as we setup the DB layer, or return empty array.
    res.json([]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
