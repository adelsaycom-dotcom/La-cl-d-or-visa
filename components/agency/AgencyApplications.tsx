import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, FileDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const MOCK_APPLICATIONS = [
  { id: "APP-001", country: "Émirats Arabes Unis", applicant: "John Doe", type: "e-Visa Touristique", status: "PENDING", date: "2024-05-05", cost: 150 },
  { id: "APP-002", country: "Arabie Saoudite", applicant: "Jane Smith", type: "Entrées Multiples", status: "IN_REVIEW", date: "2024-05-04", cost: 200 },
  { id: "APP-003", country: "Turquie", applicant: "Ali Benmoussa", type: "Entrée Unique", status: "APPROVED", date: "2024-05-01", cost: 60, visaUrl: "/dummy.pdf" },
];

export function AgencyApplications() {
  const [apps, setApps] = useState(MOCK_APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED": return <Badge className="bg-green-100 text-green-800 border-none">Approuvé</Badge>;
      case "PENDING": return <Badge className="bg-orange-100 text-orange-800 border-none">En attente</Badge>;
      case "IN_REVIEW": return <Badge className="bg-blue-100 text-blue-800 border-none">En révision</Badge>;
      case "MISSING_DOCS": return <Badge className="bg-purple-100 text-purple-800 border-none">Docs manquants</Badge>;
      case "REJECTED": return <Badge className="bg-red-100 text-red-800 border-none">Rejeté</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mes Demandes</h2>
        <p className="text-sm text-gray-500 mt-1">Suivez l'état des demandes de visa soumises par votre agence.</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
        <Input placeholder="Rechercher par nom ou ID..." className="w-full sm:max-w-xs" />
        <Select>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            <SelectItem value="PENDING">En attente</SelectItem>
            <SelectItem value="IN_REVIEW">En révision</SelectItem>
            <SelectItem value="APPROVED">Approuvé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="whitespace-nowrap">ID / Date</TableHead>
              <TableHead className="whitespace-nowrap">Demandeur</TableHead>
              <TableHead>Destination & Visa</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Coût</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <div className="font-mono text-sm font-medium text-gray-900 whitespace-nowrap">{app.id}</div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">{app.date}</div>
                </TableCell>
                <TableCell className="font-medium text-gray-900 whitespace-nowrap">{app.applicant}</TableCell>
                <TableCell>
                  <div className="text-sm font-medium whitespace-nowrap">{app.country}</div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">{app.type}</div>
                </TableCell>
                <TableCell>{getStatusBadge(app.status)}</TableCell>
                <TableCell className="font-mono text-sm font-medium text-red-600 whitespace-nowrap">-{app.cost} DA</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedApp(app)}>
                    <Eye className="w-4 h-4 mr-2" /> Voir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* App Details Modal */}
      <Dialog open={!!selectedApp} onOpenChange={(o) => !o && setSelectedApp(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
           {selectedApp && (
             <div className="space-y-6">
                <DialogHeader>
                  <DialogTitle className="flex justify-between items-center pr-6">
                    <span className="text-xl">Demande: {selectedApp.id}</span>
                    {getStatusBadge(selectedApp.status)}
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h4 className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-3">Infos du Demandeur</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between"><dt className="text-gray-500">Nom</dt><dd className="font-medium">{selectedApp.applicant}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Passeport</dt><dd className="font-mono font-medium">AB123456</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Nationalité</dt><dd className="font-medium">Française</dd></div>
                      </dl>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h4 className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-3">Infos Visa</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between"><dt className="text-gray-500">Pays</dt><dd className="font-medium">{selectedApp.country}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Type</dt><dd className="font-medium">{selectedApp.type}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Coût payé</dt><dd className="font-mono font-medium text-red-600">{selectedApp.cost} DA</dd></div>
                      </dl>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <div className="border border-gray-200 rounded-lg overflow-hidden">
                       <h4 className="text-xs uppercase text-gray-500 font-bold tracking-wider p-3 bg-gray-50 border-b">Documents Téléchargés</h4>
                       <div className="p-3 space-y-2">
                         <div className="text-sm font-medium text-gray-700 flex items-center justify-between">
                           Page de données du passeport <Badge variant="outline" className="text-green-600">Valide</Badge>
                         </div>
                         <div className="text-sm font-medium text-gray-700 flex items-center justify-between">
                           Photo personnelle <Badge variant="outline" className="text-green-600">Valide</Badge>
                         </div>
                       </div>
                     </div>

                     {selectedApp.status === "APPROVED" && (
                       <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                         <h4 className="font-bold text-green-900 mb-2">Le visa est prêt !</h4>
                         <p className="text-sm text-green-700 mb-4">Vous pouvez maintenant télécharger le fichier e-Visa approuvé.</p>
                         <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                           <FileDown className="w-4 h-4 mr-2" /> Télécharger le Visa PDF
                         </Button>
                       </div>
                     )}
                     
                     {selectedApp.status === "MISSING_DOCS" && (
                       <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 text-center">
                         <h4 className="font-bold text-purple-900 mb-2">Action Requise</h4>
                         <p className="text-sm text-purple-700 mb-4">L'admin a demandé des documents supplémentaires.</p>
                         <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                           Télécharger les documents manquants
                         </Button>
                       </div>
                     )}
                  </div>
                </div>
             </div>
           )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
