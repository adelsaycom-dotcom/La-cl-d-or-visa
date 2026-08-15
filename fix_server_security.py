import os

filepath = 'server.ts'
with open(filepath, 'r') as f:
    content = f.read()

# Add imports
if 'import helmet' not in content:
    content = content.replace(
        'import express from "express";',
        'import express from "express";\nimport helmet from "helmet";\nimport rateLimit from "express-rate-limit";\nimport cors from "cors";'
    )

# Add middlewares
if 'helmet()' not in content:
    middlewares = """  app.use(express.json());

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
"""
    content = content.replace('  app.use(express.json());', middlewares)

with open(filepath, 'w') as f:
    f.write(content)
print("Server security updated")
