import { useState } from "react";
import { useAppStore } from "../../src/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Save, AlertTriangle, Trash2, RefreshCw, CheckCircle2 } from "lucide-react";
import { db, auth } from "../../src/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useLanguage } from "../../src/i18n/LanguageContext";

export function AdminSettings() {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const clearData = useAppStore(state => state.clearData);
  const [platformName, setPlatformName] = useState("La Clé d'Or B2B");
  const [contactEmail, setContactEmail] = useState("admin@cle-dor-visa.com");
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const resetKeyword = isEn ? "RESET" : "REINITIALISER";

  const handleFullReset = async () => {
    if (confirmText !== resetKeyword && confirmText !== "REINITIALISER") return;
    setIsResetting(true);
    try {
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
      setResetSuccess(true);
      setIsDialogOpen(false);
      setConfirmText("");
      setTimeout(() => setResetSuccess(false), 5000);
    } catch (err: any) {
      console.error("Erreur lors de la réinitialisation:", err);
      alert((isEn ? "Reset error: " : "Erreur lors de la réinitialisation : ") + (err.message || String(err)));
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEn ? "Platform Settings" : "Paramètres de la Plateforme"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isEn ? "Manage global configuration and system preferences." : "Gérer les configurations mondiales et les préférences du système."}
          </p>
        </div>
        <Button className="bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold">
          <Save className="w-4 h-4 mr-2" /> {isEn ? "Save Changes" : "Enregistrer"}
        </Button>
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
            {isEn ? "Database & Reset" : "Base de données & Reset"}
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

        <TabsContent value="danger" className="space-y-4 mt-4">
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
