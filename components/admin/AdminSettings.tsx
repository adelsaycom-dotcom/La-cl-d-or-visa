import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

export function AdminSettings() {
  const [platformName, setPlatformName] = useState("La Clé d'Or B2B");
  const [contactEmail, setContactEmail] = useState("admin@cle-dor-visa.com");
  
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

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
