import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // 1. Sécurité Web : Protection contre XSS, Clickjacking, Sniffing
  app.use(helmet({
    contentSecurityPolicy: false, // Désactivé temporairement pour laisser Vite fonctionner en dev
    crossOriginEmbedderPolicy: false
  }));

  // 2. CORS : Contrôle des origines autorisées
  app.use(cors());

  // 3. Anti-DDoS & Anti-Brute Force : Limite de requêtes sur l'API
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limite chaque IP à 200 requêtes par fenêtre de 15 min
    message: { error: "Trop de requêtes détectées depuis cette adresse IP, veuillez réessayer dans 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  // Appliquer la limite uniquement sur les routes API
  app.use("/api/", apiLimiter);


  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
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
