import { useState, useEffect } from "react";
import { useAppStore } from "../../src/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Save, AlertTriangle, Trash2, RefreshCw, CheckCircle2,
  Database, ArrowRightLeft, Server
} from "lucide-react";
import { db, auth } from "../../src/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useLanguage } from "../../src/i18n/LanguageContext";
import { useToast } from "@/components/ui/toast";
import { getBackendMode, apiFetch, type BackendDatabaseMode } from "../../src/services/apiClient";

export function AdminSettings() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const toast = useToast();

  const clearData = useAppStore(state => state.clearData);
  const authRole = useAppStore(state => state.authRole);
  const [platformName, setPlatformName] = useState("La Clé d'Or B2B");
  const [contactEmail, setContactEmail] = useState("admin@cle-dor-visa.com");
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // État base de données & Migration Firestore -> MySQL
  const [dbMode, setDbMode] = useState<BackendDatabaseMode>("firestore");
  const [isCheckingDb, setIsCheckingDb] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string>("");
  const [migrationError, setMigrationError] = useState<string | null>(null);
  const [migrationStats, setMigrationStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let active = true;
    setIsCheckingDb(true);
    getBackendMode(true)
      .then((mode) => {
        if (active) setDbMode(mode);
      })
      .finally(() => {
        if (active) setIsCheckingDb(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const resetKeyword = isEn ? "RESET" : "REINITIALISER";

  const handleMigrateFirestoreToMysql = async () => {
    if (authRole !== "admin" || !auth.currentUser) {
      toast.error("Accès refusé", "Action réservée aux administrateurs.");
      return;
    }

    setIsMigrating(true);
    setMigrationError(null);
    setMigrationStats(null);
    setMigrationStatus("Vérification de la connexion MySQL Hostinger...");

    try {
      const currentMode = await getBackendMode(true);
      setDbMode(currentMode);
      if (currentMode !== "mysql") {
        throw new Error(
          "MySQL n'est pas encore actif sur le serveur. Configurez MYSQL_HOST, MYSQL_DATABASE, MYSQL_USER et MYSQL_PASSWORD dans Hostinger avant de lancer la migration."
        );
      }

      const collectionMap: Array<{ firestoreKey: string; payloadKey: string; label: string }> = [
        { firestoreKey: "users", payloadKey: "users", label: "Comptes agences & admin" },
        { firestoreKey: "countries", payloadKey: "countries", label: "Pays & visas" },
        { firestoreKey: "services", payloadKey: "services", label: "Services catalogue" },
        { firestoreKey: "organizedTrips", payloadKey: "organizedTrips", label: "Voyages organisés" },
        { firestoreKey: "studyPrograms", payloadKey: "studyPrograms", label: "Programmes Visa Études" },
        { firestoreKey: "applications", payloadKey: "applications", label: "Dossiers visas" },
        { firestoreKey: "studyApplications", payloadKey: "studyApplications", label: "Dossiers études" },
        { firestoreKey: "tripReservations", payloadKey: "tripReservations", label: "Réservations voyages" },
        { firestoreKey: "transactions", payloadKey: "transactions", label: "Transactions financières" },
        { firestoreKey: "rechargeRequests", payloadKey: "rechargeRequests", label: "Demandes de recharge" },
        { firestoreKey: "supportTickets", payloadKey: "supportTickets", label: "Tickets support" },
        { firestoreKey: "notifications", payloadKey: "notifications", label: "Notifications" },
      ];

      const summary: Record<string, number> = {};
      const CHUNK_SIZE = 25;

      for (const col of collectionMap) {
        setMigrationStatus(`Lecture Firestore : ${col.label}...`);
        const snap = await getDocs(collection(db, col.firestoreKey));
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        summary[col.payloadKey] = docs.length;

        if (docs.length === 0) continue;

        for (let i = 0; i < docs.length; i += CHUNK_SIZE) {
          const batch = docs.slice(i, i + CHUNK_SIZE);
          const partLabel =
            docs.length > CHUNK_SIZE
              ? ` (lot ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(docs.length / CHUNK_SIZE)})`
              : "";
          setMigrationStatus(`Importation MySQL : ${col.label}${partLabel}...`);
          await apiFetch("/api/db/admin/import-backup", {
            method: "POST",
            body: JSON.stringify({ [col.payloadKey]: batch }),
          });
        }
      }

      setMigrationStatus("Synchronisation finale de l'interface...");
      await useAppStore.getState().refreshAllFromMysql();
      setMigrationStats(summary);
      setMigrationStatus("Migration terminée avec succès !");
      toast.success(
        "Migration Firestore → MySQL réussie",
        "Toutes vos agences, soldes et dossiers ont été transférés sans aucune perte."
      );
    } catch (err: any) {
      console.error("Erreur migration Firestore -> MySQL:", err);
      const msg = err?.message || "Impossible de finaliser l'importation vers MySQL.";
      setMigrationError(msg);
      setMigrationStatus("");
      toast.error("Échec de la migration", msg);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleFullReset = async () => {
    if (authRole !== 'admin' || !auth.currentUser) {
      toast.error(isEn ? "Unauthorized" : "Accès refusé", isEn ? "Administrator privileges required." : "Action strictement réservée aux administrateurs.");
      return;
    }
    if (confirmText !== resetKeyword && confirmText !== "REINITIALISER") return;
    setIsResetting(true);
    setResetError(null);
    try {
      const currentMode = await getBackendMode();
      if (currentMode === "mysql") {
        await apiFetch("/api/db/admin/reset", { method: "POST" });
        clearData();
        await useAppStore.getState().refreshAllFromMysql();
      } else {
        const collectionsToPurge = [
          'applications',
          'studyApplications',
          'tripReservations',
          'transactions',
          'rechargeRequests',
          'notifications',
          'supportTickets',
          'organizedTrips',
          'studyPrograms',
          'countries',
          'services'
        ];

        for (const colName of collectionsToPurge) {
          const snap = await getDocs(collection(db, colName));
          for (const d of snap.docs) {
            await deleteDoc(doc(db, colName, d.id));
          }
        }

        // Clean users except preserving current admin user
        const usersSnap = await getDocs(collection(db, 'users'));
        for (const d of usersSnap.docs) {
          const uData = d.data();
          if (d.id === auth.currentUser?.uid || uData.role === 'admin' || uData.email === 'adel.saycom@gmail.com') {
            await updateDoc(doc(db, 'users', d.id), {
              balance: 0,
              applicationsCount: 0,
              role: 'admin'
            });
          } else {
            await deleteDoc(doc(db, 'users', d.id));
          }
        }

        clearData();
      }
      setResetSuccess(true);
      setIsDialogOpen(false);
      setConfirmText("");
      toast.success(isEn ? "Reset complete" : "Réinitialisation réussie", isEn ? "Database has been purged." : "La base de données a été purgée.");
      setTimeout(() => setResetSuccess(false), 5000);
    } catch (err: any) {
      console.error("Erreur lors de la réinitialisation:", err);
      const msg = (isEn ? "Reset error: " : "Erreur lors de la réinitialisation : ") + (err?.message || String(err));
      setResetError(msg);
      toast.error(isEn ? "Reset failed" : "Échec de la réinitialisation", msg);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEn ? "Platform Settings" : "Paramètres de la Plateforme"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isEn ? "Manage global configuration and system preferences." : "Gérer les configurations mondiales et les préférences du système."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold ${
              dbMode === "mysql"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-amber-50 border-amber-200 text-amber-800"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>
              {isCheckingDb
                ? "Vérification BDD..."
                : dbMode === "mysql"
                  ? "Base active : MySQL Hostinger"
                  : "Base active : Firebase Firestore"}
            </span>
          </div>
          <Button className="bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold">
            <Save className="w-4 h-4 mr-2" /> {isEn ? "Save Changes" : "Enregistrer"}
          </Button>
        </div>
      </div>

      {resetSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-sm font-semibold">
            {isEn 
              ? "The database has been successfully purged! Platform is 100% clean."
              : "La base de données a été réinitialisée avec succès ! La plateforme est désormais vierge à 100%."}
          </div>
        </div>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">{isEn ? "General" : "Général"}</TabsTrigger>
          <TabsTrigger value="security">{isEn ? "Security" : "Sécurité"}</TabsTrigger>
          <TabsTrigger value="notifications">{isEn ? "Notifications" : "Notifications"}</TabsTrigger>
          <TabsTrigger value="danger" className="text-red-600 data-[state=active]:text-red-700">
            {isEn ? "Database & Migration" : "Base de données & Migration"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{isEn ? "Platform Name" : "Nom de la plateforme"}</Label>
                <Input value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{isEn ? "Support Contact Email" : "Courriel de contact du support"}</Label>
                <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} type="email" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{isEn ? "Maintenance Mode" : "Mode Maintenance"}</Label>
              <div className="flex items-center gap-2">
                <Switch id="maintenance" />
                <Label htmlFor="maintenance" className="font-normal text-sm text-gray-500">
                  {isEn ? "Temporarily disable agency access." : "Désactiver temporairement l'accès aux agences."}
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{isEn ? "Platform Terms & Policy" : "Politique de la plateforme / Conditions"}</Label>
              <Textarea placeholder={isEn ? "Terms of service..." : "Conditions de service..."} rows={5} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-lg font-medium">{isEn ? "Security Policies" : "Politiques de Sécurité"}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <Label>{isEn ? "Two-Factor Authentication (Admin)" : "Authentification à Deux Facteurs (Admin)"}</Label>
                  <p className="text-sm text-gray-500">{isEn ? "Enforce 2FA for all administrator accounts." : "Exiger 2FA pour tous les comptes administrateurs."}</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <Label>{isEn ? "Automatic Session Timeout" : "Expiration Automatique de Session"}</Label>
                  <p className="text-sm text-gray-500">{isEn ? "Disconnect users after 30 minutes of inactivity." : "Déconnecter les utilisateurs après 30 minutes d'inactivité."}</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-lg font-medium">{isEn ? "Email Notifications" : "Notifications par courriel"}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <Label>{isEn ? "New Agency Registrations" : "Nouvelles Inscriptions d'Agences"}</Label>
                  <p className="text-sm text-gray-500">{isEn ? "Notify whenever a new partner agency signs up." : "Notifier lorsqu'une nouvelle agence s'enregistre."}</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <Label>{isEn ? "Top-up Requests" : "Demandes de Recharge"}</Label>
                  <p className="text-sm text-gray-500">{isEn ? "Notify when an agency submits a wallet top-up." : "Notifier lorsqu'une agence a besoin d'une recharge de portefeuille."}</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between pb-4">
                <div>
                  <Label>{isEn ? "Urgent Support Tickets" : "Tickets de Support Urgents"}</Label>
                  <p className="text-sm text-gray-500">{isEn ? "Immediate alert for tickets marked as high priority." : "Notifier pour les tickets de support marqués comme urgents."}</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="danger" className="space-y-6 mt-4">
          {/* BLOC MIGRATION FIRESTORE -> MYSQL HOSTINGER SANS PERTE */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#7B1B38]/10 text-[#7B1B38] flex items-center justify-center shrink-0">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Migration sans perte : Firestore → MySQL Hostinger
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                    Copiez l&apos;intégralité de vos données existantes (agences, soldes, dossiers visas/études, voyages, transactions, catalogue et tickets) depuis Firebase Firestore vers votre base MySQL Hostinger en un clic, sans aucune suppression ni perte client.
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap self-start ${
                  dbMode === "mysql"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {dbMode === "mysql" ? "MySQL Connecté" : "En attente config MySQL"}
              </span>
            </div>

            {dbMode !== "mysql" && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                <strong>Configuration requise sur Hostinger :</strong> Renseignez vos variables d&apos;environnement MySQL (<code className="font-mono font-bold">MYSQL_HOST</code>, <code className="font-mono font-bold">MYSQL_DATABASE</code>, <code className="font-mono font-bold">MYSQL_USER</code>, <code className="font-mono font-bold">MYSQL_PASSWORD</code>) dans hPanel puis redémarrez l&apos;application Node.js. Ce bouton deviendra immédiatement actif.
              </div>
            )}

            {migrationStatus && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2.5">
                {isMigrating ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#7B1B38] shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>{migrationStatus}</span>
              </div>
            )}

            {migrationError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {migrationError}
              </div>
            )}

            {migrationStats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs">
                <div><span className="text-slate-500">Agences/Admin :</span> <strong className="text-slate-900">{migrationStats.users || 0}</strong></div>
                <div><span className="text-slate-500">Pays :</span> <strong className="text-slate-900">{migrationStats.countries || 0}</strong></div>
                <div><span className="text-slate-500">Services :</span> <strong className="text-slate-900">{migrationStats.services || 0}</strong></div>
                <div><span className="text-slate-500">Dossiers Visas :</span> <strong className="text-slate-900">{migrationStats.applications || 0}</strong></div>
                <div><span className="text-slate-500">Dossiers Études :</span> <strong className="text-slate-900">{migrationStats.studyApplications || 0}</strong></div>
                <div><span className="text-slate-500">Résas Voyages :</span> <strong className="text-slate-900">{migrationStats.tripReservations || 0}</strong></div>
                <div><span className="text-slate-500">Transactions :</span> <strong className="text-slate-900">{migrationStats.transactions || 0}</strong></div>
                <div><span className="text-slate-500">Recharges :</span> <strong className="text-slate-900">{migrationStats.rechargeRequests || 0}</strong></div>
              </div>
            )}

            <div className="pt-1">
              <Button
                onClick={handleMigrateFirestoreToMysql}
                disabled={isMigrating || dbMode !== "mysql"}
                className="bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold h-11 px-6 rounded-xl flex items-center gap-2 disabled:opacity-50"
              >
                {isMigrating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRightLeft className="w-4 h-4" />
                )}
                <span>
                  {isMigrating
                    ? "Importation en cours..."
                    : "Importer les données Firestore vers MySQL"}
                </span>
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isEn ? "Reset Zone / Clean Database" : "Zone de Réinitialisation / Base de données vierge"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {isEn 
                    ? "This action completely purges test records and resets the platform to 0 items."
                    : "Cette action réinitialise complètement la plateforme à l'état vierge (0 données). Idéal pour démarrer une nouvelle phase d'exploitation réelle."}
                </p>
              </div>
            </div>

            <div className="bg-red-50/60 border border-red-100 rounded-xl p-5 space-y-3 text-sm text-slate-700">
              <div className="font-bold text-red-900">{isEn ? "Purged elements:" : "Éléments purgés et remis à zéro :"}</div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                <li>{isEn ? "All visa dossiers and study applications" : "Tous les dossiers de visas et demandes d'études"}</li>
                <li>{isEn ? "All organized trip bookings" : "Toutes les réservations de voyages organisés"}</li>
                <li>{isEn ? "All financial logs (transactions, top-ups, expenses)" : "Tous les flux financiers (transactions, historiques de recharge et dépenses)"}</li>
                <li>{isEn ? "All system and agency notifications" : "Toutes les notifications système et agences"}</li>
                <li>{isEn ? "All client support tickets" : "Tous les tickets de support client"}</li>
                <li>{isEn ? "Test agency accounts (main admin account kept with 0 DZD)" : "Les comptes agences de test (le compte administrateur principal est conservé avec solde à 0 DA)"}</li>
              </ul>
            </div>

            <div className="pt-2">
              <Button 
                variant="destructive" 
                onClick={() => setIsDialogOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/20"
              >
                <Trash2 className="w-4 h-4" />
                {isEn ? "Purge & Reset Entire Platform" : "Réinitialiser toute la plateforme à 100%"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 text-red-600">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{isEn ? "Confirmation Required" : "Confirmation requise"}</h3>
                <p className="text-xs text-red-600 font-bold uppercase tracking-wider">{isEn ? "Irreversible action" : "Action irréversible"}</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {isEn 
                ? "Are you sure you want to permanently erase all dossiers, transactions and notifications?"
                : "Êtes-vous sûr de vouloir supprimer tous les dossiers, transactions, notifications et dépenses pour repartir sur une base 100% vierge ?"}
            </p>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">
                {isEn ? (
                  <>Please type <span className="font-mono text-red-600 select-all font-black">{resetKeyword}</span> to confirm:</>
                ) : (
                  <>Veuillez taper <span className="font-mono text-red-600 select-all font-black">{resetKeyword}</span> pour confirmer :</>
                )}
              </Label>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={resetKeyword}
                className="h-12 font-mono font-bold tracking-wider"
              />
            </div>

            {resetError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-3.5 py-2.5 rounded-xl text-xs font-semibold">
                {resetError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setConfirmText("");
                }}
                disabled={isResetting}
                className="h-11 px-5 rounded-xl font-bold"
              >
                {isEn ? "Cancel" : "Annuler"}
              </Button>
              <Button
                variant="destructive"
                disabled={(confirmText !== resetKeyword && confirmText !== "REINITIALISER") || isResetting}
                onClick={handleFullReset}
                className="h-11 px-6 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {isEn ? "Purging..." : "Réinitialisation..."}
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    {isEn ? "Permanently Reset" : "Purger définitivement"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
