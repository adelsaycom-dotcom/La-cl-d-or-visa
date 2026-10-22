# Plan d'implémentation : Correction PDF, Réservations Voyages Organisés et Visa Études

Ce plan détaille la résolution module par module des 3 problématiques soulevées.

---

## Module 1 : Résolution définitive de la prévisualisation et du téléchargement des PDF

### Problème constaté
Lors de la consultation du visa officiel délivré ou des justificatifs PDF, certains navigateurs bloquent l'affichage dans l'iframe ou corrompent le binaire téléchargé lorsque le flux Base64 provient de sessions ou de Firestore.

### Solutions techniques
1. **Visualiseur PDF universel bimodal (`DocumentPreviewModal.tsx`)** :
   - Mise à disposition d'un affichage direct par `blob:` URL natif avec headers conformes.
   - En complément, ajout d'un bouton d'action principale **« Ouvrir dans un nouvel onglet »** (`target="_blank"` avec `URL.createObjectURL(blob)`) pour garantir 100% de compatibilité sur mobile, tablettes et navigateurs stricts bloquant les iframes locales.
   - Sécurisation du téléchargement avec le type MIME explicite `application/pdf` et contrôle d'intégrité de l'extension de fichier `.pdf`.
2. **Harmonisation des points d'accès** :
   - Dans `AgencyApplications.tsx` et `ApplicationManagement.tsx` : affichage systématique des boutons d'aperçu et de téléchargement dédié pour le visa actif final et pour chaque pièce jointe PDF.
   - Sécurisation de `fileUpload.ts` pour que la conversion binaire gère les encodages URI et les sauts de ligne sans dégradation d'octets.

---

## Module 2 : Sécurisation des réservations de Voyages Organisés

### Problème constaté
Risque de réservations multiples involontaires (multi-clics) et absence de confirmation formelle avec récapitulatif avant débit du solde agence, ainsi qu'absence de visibilité des réservations existantes pour l'agence.

### Solutions techniques
1. **Dialogue de confirmation d'engagement (`OrganizedTrips.tsx`)** :
   - Ajout d'une étape de récapitulatif avant validation définitive : récapitule le nom du voyage, la date de départ, le nombre de passagers, le tarif unitaire et le montant total déduit du solde.
   - Affichage du solde restant après opération pour validation explicite.
2. **Verrouillage strict anti-doublon** :
   - Désactivation immédiate du bouton d'action avec état de chargement `isSubmitting` pour empêcher tout envoi répété.
3. **Onglet « Mes Réservations » & Indication sur le catalogue** :
   - Intégration d'un système à deux onglets : `Catalogue des départs` / `Mes Réservations`.
   - L'onglet « Mes Réservations » permet à l'agence de suivre ses réservations (statut, passagers, date de réservation, coût total).
   - Sur chaque carte du catalogue, ajout d'un badge clair `Déjà réservé (X places)` si l'agence a déjà validé une réservation sur ce circuit.

---

## Module 3 : Acheminement complet et visibilité des dossiers "Visa Études"

### Problème constaté
Lors de la soumission d'une demande de Visa Études dans `StudyPrograms.tsx`, l'enregistrement échouait silencieusement ou n'apparaissait pas dans la liste principale des dossiers, car les pièces jointes (diplômes, relevés, etc.) étaient trop lourdes pour Firestore (> 1 Mo) et les dossiers n'étaient pas synchronisés avec la table centrale `applications`.

### Solutions techniques
1. **Traitement et téléversement optimisé des pièces justificatives** :
   - Remplacement de la lecture brute `FileReader` par l'utilitaire `uploadFileToServer` pour chaque pièce justificative.
   - Enregistrement des fichiers dans la collection `attachments` pour préserver le document principal sous la limite de 1 Mo.
2. **Inscription double (Centrale + Spécialisée)** :
   - Lors de la soumission dans `StudyPrograms.tsx`, création conjointe :
     - Du document dans la collection `applications` avec `serviceType: "Visa Études"`, destination, tarif, documents attachés et journal de suivi.
     - Du document dans `studyApplications` pour la gestion spécialisée universitaire.
3. **Visibilité complète** :
   - Le dossier apparaît immédiatement dans :
     - `/agency/applications` (Espace Agence - Tous les dossiers).
     - `/admin/applications` (Espace Admin - Gestion globale des demandes).
     - `/admin/study` (Espace Admin - Onglet Candidatures d'études).
