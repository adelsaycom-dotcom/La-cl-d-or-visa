# Plan d'Implémentation : Traduction Intégrale & Scanner Passeport Autonome Hostinger

Ce projet apporte une traduction bilingue (FR / EN) parfaite et exhaustive sur l'ensemble de la plateforme (en particulier le tableau de bord agence et le wizard de nouvelle demande de visa étape par étape), la mémorisation de la langue préférée via `localStorage`, ainsi qu'une refonte complète du scanner de passeports biométriques pour garantir un fonctionnement à 100% côté navigateur sans dépendance externe ni clé API sur l'hébergement Hostinger.

---

### Décisions Validées avec l'Utilisateur

> [!IMPORTANT]
> - **Environnement de déploiement** : Hébergement Hostinger (nécessitant un fonctionnement résilient et autonome).
> - **Moteur de scan de passeport** : Scanner 100% exécuté dans le navigateur, sans dépendance externe bloquante ni obligation de clé API serveur.
> - **Règle de langue** : Mémorisation persistante dans le navigateur (`localStorage`) de la dernière langue choisie (FR ou EN) avec français par défaut.

---

## 1. Vue d'Ensemble & Périmètre Fonctionnel

### A. Traduction Exhaustive & Parfaite
1. **Tableau de Bord Agence (`components/agency/Dashboard.tsx`)** :
   - Cartes de statistiques (Dossiers en cours, validés, complétés, solde disponible).
   - Graphiques d'activité et historiques de demandes.
   - Section des services rapides (Visas touristiques, d'affaires, études, voyages organisés).
   - Tableau des dernières demandes avec statuts traduits en temps réel.
2. **Formulaire de Nouvelle Demande / Wizard Visa (`components/agency/VisaWizard.tsx`)** :
   - Traduction méticuleuse des 4 étapes du processus :
     - *Étape 1* : Choix du pays de destination, formule consulaire, type de démarche, calcul des frais et marge B2C.
     - *Étape 2* : Import du scan passeport, données du voyageur (nom, prénom, nationalité, sexe, n° passeport, dates de délivrance/expiration, coordonnées).
     - *Étape 3* : Documents requis personnalisés par pays/consulat (photos conformes, réservations d'hôtel, attestations, formulaires).
     - *Étape 4* : Récapitulatif global, vérification des données, débit du solde agence et accusé de dépôt.
3. **Persistance de la Langue (`src/i18n/LanguageContext.tsx`)** :
   - Sauvegarde automatique dans `localStorage.getItem('app_language')`.
   - Restauration immédiate au rechargement de la page pour une expérience fluide.

### B. Scanner de Passeport 100% Navigateur pour Hostinger
1. **Élimination des blocages réseau Hostinger** :
   - Suppression du timeout d'attente vers `/api/scan-passport` lorsqu'aucun serveur backend n'est présent sur Hostinger.
   - Intégration d'un parseur MRZ ICAO 9303 TD3 local ultra-robuste avec tolérance aux erreurs de binarisation et aux caractères spéciaux (`<`, chevrons, chiffres).
2. **Double passe d'analyse d'image locale (Canvas HTML5)** :
   - Passe 1 : Détection et recadrage de la zone MRZ inférieure (2 lignes de 44 caractères).
   - Passe 2 : Extraction directe avec expressions régulières adaptées aux passeports algériens, français et internationaux (numéro de passeport, date de naissance, expiration, sexe, nom/prénom).
3. **Indicateurs visuels et feedback instantané** :
   - Barre de progression fluide lors du scan de l'image.
   - Remplissage automatique instantané des champs avec confirmation visuelle sans bloquer l'utilisateur si la photo est floue.

---

## 2. Expérience Utilisateur & Design

### Flux Utilisateur
```
┌────────────────────────┐      ┌───────────────────────────┐      ┌─────────────────────────────┐
│ 1. Choix du Service    │ ───> │ 2. Scan Passeport         │ ───> │ 3. Pièces & Validation      │
│ Pays, Formule, Tarifs  │      │ Auto-remplissage instant  │      │ Récapitulatif bilingue      │
└────────────────────────┘      └───────────────────────────┘      └─────────────────────────────┘
```

- **Typographie et Contraste** : Conformité aux règles de design avec typographies sombres (`text-slate-900`) sur fond clair, statuts sans pilules encombrantes et accent bordeaux officiel `#7B1B38`.
- **Commutateur de Langue** : Reste accessible dans le haut de chaque page avec mise à jour instantanée du texte sans rechargement de page.

---

## 3. Architecture Technique

### Diagramme de Flux de Données
```
[ Utilisateur importe une image de passeport ]
                   │
                   ▼
[ Canvas HTML5 : Normalisation de contraste & Redimensionnement ]
                   │
                   ▼
[ Détecteur MRZ ICAO Doc 9303 & OCR Client Local ]
                   │
                   ▼
┌────────────────────────────────────────────────────────┐
│ Données extraites :                                    │
│ - Nom, Prénom                                          │
│ - N° Passeport (9 caractères)                          │
│ - Date de Naissance & Date d'Expiration (YYYY-MM-DD)   │
│ - Sexe (M/F) & Nationalité                             │
└────────────────────────────────────────────────────────┘
                   │
                   ▼
[ Auto-remplissage des champs de l'Étape 2 du Wizard ]
```

---

## 4. Fichiers Concernés

1. `src/i18n/LanguageContext.tsx` : Gestion et mémorisation persistante dans `localStorage`.
2. `src/i18n/translations.ts` : Enrichissement exhaustif de toutes les clés de traduction pour Dashboard, Wizard, étapes et messages de validation.
3. `src/utils/passportScanner.ts` : Moteur de scan 100% client autonome, résilient à Hostinger.
4. `components/agency/Dashboard.tsx` : Traduction intégrale et réactivité à `useLanguage`.
5. `components/agency/VisaWizard.tsx` : Traduction méticuleuse des 4 étapes, statuts, documents requis et intégration fluide du nouveau scan.

---

## 5. Plan de Vérification

- Vérification de la compilation sans erreur avec `compile_applet`.
- Vérification du typage TypeScript avec `lint_applet` (`tsc --noEmit`).
- Test de la mémorisation de langue et du basculement FR/EN sur le tableau de bord et la page de nouvelle demande.
- Test de l'analyse automatique d'image de passeport et du pré-remplissage des champs.
