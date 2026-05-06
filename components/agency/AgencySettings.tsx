import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Save, Plus, Trash2 } from "lucide-react";

export function AgencySettings() {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "Manager", email: "manager@globaltravel.com", role: "Owner" },
    { id: 2, name: "Visa Agent 1", email: "agent1@globaltravel.com", role: "Operator" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Paramètres</h2>
          <p className="text-sm text-gray-500 mt-1">Gérez le profil de votre agence, les membres de l'équipe et vos préférences.</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="team">Membres de l'équipe</TabsTrigger>
          <TabsTrigger value="branding">Image de marque & B2C</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">Informations de l'agence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Nom de l'agence</Label>
                <Input defaultValue="Global Travel Experiences" />
              </div>
              <div className="space-y-2">
                <Label>Registre de commerce (En lecture seule)</Label>
                <Input defaultValue="RC-1234567" disabled className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Courriel de contact</Label>
                <Input defaultValue="contact@globaltravel.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label>Numéro de téléphone</Label>
                <Input defaultValue="+213 555 123 456" />
              </div>
            </div>
            <div className="pt-4">
              <Button className="bg-[#0a192f] text-white hover:bg-[#112240]">
                <Save className="w-4 h-4 mr-2" /> Mettre à jour le profil
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4 mt-4">
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
             <div className="flex justify-between items-center mb-4">
               <div>
                  <h3 className="text-lg font-medium">Gérer l'équipe</h3>
                  <p className="text-sm text-gray-500">Autorisez vos employés à créer des demandes.</p>
               </div>
               <Button className="bg-[#0a192f] text-white hover:bg-[#112240]">
                 <Plus className="w-4 h-4 mr-2" /> Ajouter un membre
               </Button>
             </div>

             <div className="border border-gray-200 rounded-lg overflow-x-auto">
               <Table>
                 <TableHeader className="bg-gray-50">
                   <TableRow>
                     <TableHead className="whitespace-nowrap">Nom</TableHead>
                     <TableHead className="whitespace-nowrap">Courriel</TableHead>
                     <TableHead className="whitespace-nowrap">Rôle</TableHead>
                     <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {teamMembers.map((member) => (
                     <TableRow key={member.id}>
                       <TableCell className="font-medium whitespace-nowrap">{member.name}</TableCell>
                       <TableCell className="whitespace-nowrap">{member.email}</TableCell>
                       <TableCell>
                         <Badge variant={member.role === "Owner" ? "default" : "secondary"}>
                           {member.role === "Owner" ? "Propriétaire" : (member.role === "Operator" ? "Agent" : member.role)}
                         </Badge>
                       </TableCell>
                       <TableCell className="text-right">
                         {member.role !== "Owner" && (
                           <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                             <Trash2 className="w-4 h-4" />
                           </Button>
                         )}
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </div>
           </div>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4 mt-4">
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
             <h3 className="text-lg font-medium border-b pb-2">Factures Clients (B2C)</h3>
             <p className="text-sm text-gray-500">Personnalisez l'affichage de votre agence sur les factures générées pour vos clients finaux (B2C).</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
               <div className="space-y-2">
                 <Label>Marge Personnalisée (%)</Label>
                 <div className="flex gap-2 items-center">
                    <Input type="number" defaultValue="20" className="w-24" />
                    <span className="text-sm text-gray-500">Appliquée automatiquement aux prix de base du visa sur les PDF clients.</span>
                 </div>
               </div>
               <div className="space-y-2">
                 <Label>Logo de l'agence</Label>
                 <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">
                   <div className="text-sm">Cliquez pour télécharger le logo</div>
                   <div className="text-xs mt-1">PNG, JPG jusqu'à 2Mo</div>
                 </div>
               </div>
             </div>
             
             <div className="pt-4">
               <Button className="bg-[#0a192f] text-white hover:bg-[#112240]">
                 <Save className="w-4 h-4 mr-2" /> Enregistrer l'image de marque
               </Button>
             </div>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
