# Plan d'Implémentation : Tableau de Bord Agence Amélioré, Marge B2C, Support Évolué & Refonte Admin (Catalogue & Profil Agence)

Ce plan structure la réalisation des nouvelles évolutions demandées pour le volet **Agence** et le volet **Administration**, en intégrant vos choix formulés lors du cadrage.

---

## 1. Synthèse des Décisions & Choix Validés

> [!IMPORTANT]
> - **Marge B2C & Mode Comptoir** : Intégration d'un commutateur rapide « Tarif B2B » ↔ « Tarif Client B2C » avec taux de marge paramétrable par l'agence, permettant de présenter l'écran au voyageur sans dévoiler les tarifs de gros B2B.
> - **Catalogue B2B Administrateur** : Organisation en onglets intuitifs par familles complètes de services avec filtres par pays/destination, facilitant la gestion et l'ajout de prestations.
> - **Fiche Profil Agence Administrateur** : Vue détaillée exhaustive avec informations juridiques complètes (RC, NIF, gérant), historique chronologique de tous les dossiers, relevé des flux de solde, statistiques de performance, édition des données et module de suspension temporaire (durée configurable et motif).

---

## 2. Volet Agence : Expérience Utilisateur & Fonctionnalités

### A. Personnalisation & En-tête du Tableau de Bord
- **Nom réel de l'agence** : Remplacement du texte générique *« Bonjour, Mon Agence »* par le nom d'entreprise réel stocké dans le profil Firestore (`users/{uid}.agencyName` ou `companyName`).
- **Remplacement E-Visa par Invitation** :
  - Dans la grille des services rapides du tableau de bord agence (`Dashboard.tsx`), remplacer la tuile « E-Visa » par « Invitation » avec son icône dédiée, son descriptif et son lien d'accès rapide.

### B. Parcours « Nouvelle Demande » Multi-Services
- **Sélecteur complet de services** :
  - Lorsque l'agent clique sur *« Nouvelle Demande »* (bouton principal ou en-tête), il accède d'abord à la vitrine des familles de prestations :
    1. *Invitations & Affaires*
    2. *E-Visas & Visas Consulaires*
    3. *Résidences & Séjours*
    4. *Permis de Conduire Internationaux*
    5. *Rendez-vous Consulaires*
    6. *Constitution de Dossier & Traductions*
    7. *Voyages Organisés & Omra*
    8. *Études Universitaires à l'Étranger*
  - Sélection fluide qui oriente ensuite vers la destination et l'assistant intelligent en 3 étapes.

### C. Mode Marge B2C / Comptoir Voyageur
- **Configuration dans les paramètres** : Définition d'un taux de marge par défaut en pourcentage (%) ou forfaitaire en DZD.
- **Bouton bascule « Vue Comptoir B2C »** :
  - Accessible directement sur la barre supérieure ou les fiches prestations.
  - En un clic, tous les prix affichés basculent instantanément :
    - *Mode B2B (par défaut)* : Prix d'achat agence brut débité du solde.
    - *Mode B2C (Comptoir)* : Prix public final TTC calculé automatiquement avec la marge, masquant tout indice de tarification B2B pour une présentation directe et sereine au client final.

### D. Support Intelligent & Gestion des Tickets
- **Rattachement à un dossier existant** :
  - Menu déroulant alimenté dynamiquement avec tous les dossiers de l'agence (ex: `DOSS-M36LOT • Mohamed Benali - Turquie`).
  - Possibilité de lier un problème à un dossier précis ou de créer une demande générale.
- **Pièces jointes & Captures d'écran** :
  - Zone de dépôt de fichiers (images JPG/PNG, PDF) avec le système de stockage serveur sécurisé pour joindre des preuves ou captures d'erreurs.
- **Catégorisation intelligente** :
  - Urgence du départ, problème de paiement, document rejeté, question consulaire.

---

## 3. Volet Administration : Gestion & Contrôle Centralisé

### A. Refonte du Catalogue B2B (`AdminCatalog.tsx` / `ServicesManagement.tsx`)
- **Architecture par familles de services** :
  - Onglets horizontaux clairs : *Invitations, E-Visas, Résidences, Permis, Rendez-vous, Dossiers, Voyages/Omra, Études*.
- **Filtres par pays / zone** :
  - Recherche instantanée par destination (France, Espagne, Turquie, Arabie Saoudite, Chine, etc.).
- **Gestion simplifiée** :
  - Ajout rapide d'une nouvelle offre avec titre, destination, tarif B2B en DZD, délai de traitement et conditions.
  - Bascule actif/inactif en un clic.

### B. Profil Détaillé Agence & Édition Complète (`AgencyManagement.tsx`)
- **Fiche profil immersive (« Drawer » ou page dédiée)** :
  1. **Informations Administratives & Juridiques** :
     - Nom de l'agence, Registre du Commerce (RC), Numéro d'Identification Fiscale (NIF), Gérant, Téléphone, Email, Wilaya/Adresse.
     - Statut du compte (*Actif*, *En attente*, *Suspendu*).
  2. **Statistiques & Performances** :
     - Solde actuel du portefeuille (avec bouton d'ajustement/crédit direct par l'admin).
     - Nombre total de dossiers soumis, dossiers approuvés, taux de concrétisation.
     - Volume d'affaires cumulé en DZD.
  3. **Historique des Dossiers de l'Agence** :
     - Tableau complet de toutes les demandes de cette agence avec référence, voyageur, destination, date, montant et statut.
  4. **Historique des Flux Financiers** :
     - Relevé des recharges approuvées et des débits de commandes.
  5. **Édition du Compte & Sanctions / Bannissement Temporaire** :
     - Formulaire d'édition pour rectifier les informations de l'agence.
     - **Module de suspension / bannissement** : choix de la durée (ex: 7 jours, 15 jours, 30 jours, indéterminé) avec saisie obligatoire d'un motif explicatif visible par l'agence lors de sa tentative de connexion.

---

## 4. Architecture Technique & Fichiers Modifiés

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Architecture Évolutions                         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌─────────────────────────────────┐         ┌─────────────────────────────────┐
│         Espace Agence           │         │        Espace Admin             │
│ - Dashboard.tsx (Nom réel,      │         │ - AdminCatalog.tsx / Services   │
│   invitation, raccourcis)       │         │   (Onglets familles complètes,  │
│ - VisaWizard.tsx (Sélecteur     │         │   filtres pays, création agile) │
│   tous services, switch B2C)    │         │ - AgencyManagement.tsx          │
│ - AgencySupport.tsx             │         │   (Fiche agence 360°, stats,    │
│   (Tickets liés à dossiers,     │         │   historique dossiers, solde,   │
│   upload captures d'écran)      │         │   édition & bannissement tempo) │
│ - useAppStore.ts (Marge B2C,    │         │                                 │
│   ban agence, profils complets) │         │                                 │
└─────────────────────────────────┘         └─────────────────────────────────┘
```

---

## 5. Plan de Déploiement & Vérification par Étape

1. **Étape 1 : Tableau de bord agence & Nom réel**
   - Mise à jour du header de bienvenue avec le nom réel de l'agence connectée.
   - Remplacement de la carte *E-Visa* par *Invitation* sur le dashboard agence.
2. **Étape 2 : Sélecteur tous services & Mode Marge B2C**
   - Ajout du hub de choix de familles de services avant le formulaire.
   - Implémentation du switch B2B/B2C avec marge paramétrable sur les grilles tarifaires.
3. **Étape 3 : Support intelligent**
   - Intégration de la sélection de dossier référencé et de la pièce jointe (capture/scan) dans la création de ticket.
4. **Étape 4 : Catalogue B2B Admin par familles**
   - Organisation de toutes les familles consulaires et administratives avec filtres pays.
5. **Étape 5 : Fiche Profil Agence Admin & Suspension**
   - Création de la vue 360° par agence (juridique, dossiers, solde, stats, suspension temporaire).
6. **Vérification finale** :
   - Validation `compile_applet` et `lint_applet` sans régression.
