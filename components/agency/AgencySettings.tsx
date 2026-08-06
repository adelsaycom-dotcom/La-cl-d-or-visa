import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Save, Plus, Trash2, Building2, Users, Image as ImageIcon, Briefcase, Mail, Phone, ExternalLink } from "lucide-react";

export function AgencySettings() {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "Manager", email: "manager@globaltravel.com", role: "Owner" },
    { id: 2, name: "Visa Agent 1", email: "agent1@globaltravel.com", role: "Operator" },
  ]);

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Paramètres du compte</h2>
          <p className="text-gray-500 mt-2 font-medium max-w-xl">Gérez le profil de votre agence, l'accès de votre équipe et personnalisez l'expérience de vos clients B2C.</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-gray-100 p-1 rounded-xl h-auto flex-wrap">
          <TabsTrigger value="profile" className="rounded-lg py-2.5 px-4 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-[var(--color-text-dark)] data-[state=active]:shadow-sm">
            <Building2 className="w-4 h-4 mr-2" /> Profil de l'agence
          </TabsTrigger>
          <TabsTrigger value="team" className="rounded-lg py-2.5 px-4 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-[var(--color-text-dark)] data-[state=active]:shadow-sm">
            <Users className="w-4 h-4 mr-2" /> Équipe & Accès
          </TabsTrigger>
          <TabsTrigger value="branding" className="rounded-lg py-2.5 px-4 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-[var(--color-text-dark)] data-[state=active]:shadow-sm">
            <ImageIcon className="w-4 h-4 mr-2" /> Personnalisation B2C
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Informations générales</h3>
                <p className="text-sm text-gray-500">Ces informations seront visibles par notre équipe de traitement et sur vos factures.</p>
             </div>
             
             <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700">Nom de l'agence</Label>
                    <div className="relative">
                       <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                       <Input defaultValue="Global Travel Experiences" className="pl-10 h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700">Registre de commerce</Label>
                    <div className="flex bg-gray-50 border border-gray-200 rounded-xl px-3 h-12 items-center text-gray-500 cursor-not-allowed">
                       RC-1234567 <Badge variant="outline" className="ml-auto bg-gray-100 text-[10px]">Vérifié</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700">Courriel de contact</Label>
                    <div className="relative">
                       <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                       <Input defaultValue="contact@globaltravel.com" type="email" className="pl-10 h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700">Numéro de téléphone</Label>
                    <div className="relative">
                       <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                       <Input defaultValue="+213 555 123 456" className="pl-10 h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white" />
                    </div>
                  </div>
               </div>
               
               <div className="pt-2 flex justify-end">
                  <Button className="bg-[var(--color-text-dark)] text-white hover:bg-[var(--color-accent-bronze)] rounded-xl px-6 h-12 font-bold transition-all">
                    <Save className="w-4 h-4 mr-2" /> Enregistrer les modifications
                  </Button>
               </div>
             </div>
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
             <div>
                <h3 className="text-lg font-bold text-gray-900">Gérer votre équipe</h3>
                <p className="text-sm text-gray-500">Ajoutez vos employés pour qu'ils puissent soumettre des demandes depuis votre compte.</p>
             </div>
             <Button className="bg-[var(--color-text-dark)] text-white hover:bg-[var(--color-accent-bronze)] rounded-xl font-bold h-11 shrink-0">
               <Plus className="w-4 h-4 mr-2" /> Inviter un membre
             </Button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="divide-y divide-gray-100">
                {teamMembers.map((member) => (
                  <div key={member.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-lg">
                           {member.name.charAt(0)}
                        </div>
                        <div>
                           <div className="font-bold text-gray-900">{member.name}</div>
                           <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pl-16 md:pl-0">
                        <Badge className={`${member.role === "Owner" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"} border-none px-3 py-1 font-bold`}>
                          {member.role === "Owner" ? "Administrateur" : "Agent"}
                        </Badge>
                        {member.role !== "Owner" && (
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Marque blanche B2C</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Personnalisez les documents (factures, reçus, suivis) envoyés à vos clients finaux avec votre propre logo et votre marge commerciale.</p>
             </div>
             
             <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
               <div className="space-y-3">
                 <Label className="text-sm font-bold text-gray-700">Marge commerciale par défaut (%)</Label>
                 <div className="flex gap-4 items-center">
                    <Input type="number" defaultValue="20" className="w-24 h-12 rounded-xl bg-gray-50 border-gray-200 text-center font-bold text-lg" />
                    <span className="text-sm font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                       Ex: Un visa à 10,000 DA sera facturé 12,000 DA à votre client.
                    </span>
                 </div>
               </div>
               
               <div className="space-y-3">
                 <Label className="text-sm font-bold text-gray-700">Logo de l'agence</Label>
                 <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
                   <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                   </div>
                   <div className="text-sm font-bold text-gray-900 mb-1">Cliquez pour télécharger ou glissez-déposez</div>
                   <div className="text-xs text-gray-500 font-medium">PNG ou JPG (max 2MB). Taille recommandée: 400x100px.</div>
                 </div>
               </div>
               
               <div className="pt-2 flex justify-end">
                 <Button className="bg-[var(--color-text-dark)] text-white hover:bg-[var(--color-accent-bronze)] rounded-xl px-6 h-12 font-bold transition-all">
                   <Save className="w-4 h-4 mr-2" /> Appliquer la marque blanche
                 </Button>
               </div>
             </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
