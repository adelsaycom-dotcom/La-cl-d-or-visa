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

export function AdminSettings() {
  const clearData = useAppStore(state => state.clearData);
  const [platformName, setPlatformName] = useState("La Clé d'Or B2B");
  const [contactEmail, setContactEmail] = useState("admin@cle-dor-visa.com");
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFullReset = async () => {
    if (confirmText !== "REINITIALISER") return;
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
      alert("Erreur lors de la réinitialisation: " + (err.message || String(err)));
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Paramètres de la Plateforme</h2>
          <p className="text-sm text-gray-500 mt-1">Gérer les configurations mondiales et les préférences du système.</p>
        </div>
        <Button className="bg-black text-white">
          <Save className="w-4 h-4 mr-2" /> Enregistrer
        </Button>
      </div>

      {resetSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-sm font-semibold">
            La base de données a été réinitialisée avec succès ! La plateforme est désormais vierge à 100%.
          </div>
        </div>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="danger" className="text-red-600 data-[state=active]:text-red-700">Base de données & Reset</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Nom de la plateforme</Label>
                <Input value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Courriel de contact du support</Label>
                <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} type="email" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mode Maintenance</Label>
              <div className="flex items-center gap-2">
                <Switch id="maintenance" />
                <Label htmlFor="maintenance" className="font-normal text-sm text-gray-500">Désactiver temporairement l'accès aux agences.</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Politique de la plateforme / Conditions</Label>
              <Textarea placeholder="Conditions de service..." rows={5} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-lg font-medium">Politiques de Sécurité</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <Label>Authentification à Deux Facteurs (Admin)</Label>
                  <p className="text-sm text-gray-500">Exiger 2FA pour tous les comptes administrateurs.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <Label>Expiration Automatique de Session</Label>
                  <p className="text-sm text-gray-500">Déconnecter les utilisateurs après 30 minutes d'inactivité.</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-lg font-medium">Notifications par courriel</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <Label>Nouvelles Inscriptions d'Agences</Label>
                  <p className="text-sm text-gray-500">Notifier lorsqu'une nouvelle agence s'enregistre.</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <Label>Demandes de Recharge</Label>
                  <p className="text-sm text-gray-500">Notifier lorsqu'une agence a besoin d'une recharge de portefeuille.</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between pb-4">
                <div>
                  <Label>Tickets de Support Urgents</Label>
                  <p className="text-sm text-gray-500">Notifier pour les tickets de support marqués comme urgents.</p>
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
                <h3 className="text-lg font-bold text-slate-900">Zone de Réinitialisation / Base de données vierge</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Cette action réinitialise complètement la plateforme à l'état vierge (0 données). Idéal pour démarrer une nouvelle phase d'exploitation réelle.
                </p>
              </div>
            </div>

            <div className="bg-red-50/60 border border-red-100 rounded-xl p-5 space-y-3 text-sm text-slate-700">
              <div className="font-bold text-red-900">Éléments purgés et remis à zéro :</div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                <li>Tous les dossiers de visas et demandes d'études</li>
                <li>Toutes les réservations de voyages organisés</li>
                <li>Tous les flux financiers (transactions, historiques de recharge et dépenses)</li>
                <li>Toutes les notifications système et agences</li>
                <li>Tous les tickets de support client</li>
                <li>Les comptes agences de test (le compte administrateur principal est conservé avec solde à 0 DA)</li>
              </ul>
            </div>

            <div className="pt-2">
              <Button 
                variant="destructive" 
                onClick={() => setIsDialogOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/20"
              >
                <Trash2 className="w-4 h-4" />
                Réinitialiser toute la plateforme à 100%
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
                <h3 className="text-xl font-black text-slate-900">Confirmation requise</h3>
                <p className="text-xs text-red-600 font-bold uppercase tracking-wider">Action irréversible</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer tous les dossiers, transactions, notifications et dépenses pour repartir sur une base 100% vierge ?
            </p>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">
                Veuillez taper <span className="font-mono text-red-600 select-all font-black">REINITIALISER</span> pour confirmer :
              </Label>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="REINITIALISER"
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
                Annuler
              </Button>
              <Button
                variant="destructive"
                disabled={confirmText !== "REINITIALISER" || isResetting}
                onClick={handleFullReset}
                className="h-11 px-6 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Réinitialisation...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Purger définitivement
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
