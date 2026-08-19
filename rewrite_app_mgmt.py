import re

# We will just write a new component structure based on the old one, but improved.
content = """import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Eye,
  FileDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileUp,
  Info,
  Clock,
  Save
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore, ServiceType } from "../../src/store/useAppStore";
import { DocumentPreview } from "@/components/DocumentPreview";

export function ApplicationManagement() {
  const { applications, updateApplicationStatus, updateApplication } = useAppStore();
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [serviceFilter, setServiceFilter] = useState<string>("ALL");
  
  const [adminNotes, setAdminNotes] = useState("");

  const selectedApp = applications.find((a) => a.id === selectedAppId);

  // When opening a dialog, set the current notes
  const handleOpenDialog = (app: any) => {
    setSelectedAppId(app.id);
    setAdminNotes(app.adminNotes || "");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-bold border-green-200 px-3 py-1">
            Terminé
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 font-bold border-amber-200 px-3 py-1">
            En attente
          </Badge>
        );
      case "Processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 font-bold border-blue-200 px-3 py-1">
            En cours de traitement
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 font-bold border-red-200 px-3 py-1">
            Rejeté
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const updateStatus = (newStatus: any) => {
    if (!selectedApp) return;
    updateApplicationStatus(selectedApp.id, newStatus);
  };

  const saveNotes = () => {
    if (!selectedApp) return;
    updateApplication(selectedApp.id, { adminNotes });
  };

  const filteredApplications = applications.filter((app) => {
    if (statusFilter !== "ALL" && app.status !== statusFilter) return false;
    if (serviceFilter !== "ALL" && app.serviceType !== serviceFilter)
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Gestion des Dossiers
          </h2>
          <p className="text-sm text-slate-500 mt-1">Supervisez et traitez les demandes envoyées par les agences.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Rechercher demandeur ou agence..."
          className="w-full md:max-w-xs bg-slate-50 border-slate-200"
        />
        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger className="w-full md:w-[200px] bg-slate-50 border-slate-200">
            <SelectValue placeholder="Tous les services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les services</SelectItem>
            <SelectItem value="Evisa">E-Visa</SelectItem>
            <SelectItem value="Residence">Résidence</SelectItem>            
            <SelectItem value="Assurance">Assurance Voyage</SelectItem>            
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px] bg-slate-50 border-slate-200">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            <SelectItem value="Pending">En attente</SelectItem>
            <SelectItem value="Processing">En cours</SelectItem>
            <SelectItem value="Approved">Terminé</SelectItem>
            <SelectItem value="Rejected">Rejeté</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-100">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">ID / Date</TableHead>
              <TableHead className="font-semibold text-slate-700">Demandeur</TableHead>
              <TableHead className="font-semibold text-slate-700">Agence</TableHead>
              <TableHead className="font-semibold text-slate-700">Service / Dest.</TableHead>
              <TableHead className="font-semibold text-slate-700">Statut</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length === 0 ? (
              <TableRow>
                 <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                   Aucun dossier trouvé pour ces critères.
                 </TableCell>
              </TableRow>
            ) : filteredApplications.map((app) => (
              <TableRow key={app.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <div className="font-mono text-sm font-bold text-slate-900">{app.id}</div>
                  <div className="text-xs text-slate-500 font-medium">
                    {app.submissionDate}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-slate-900">{app.travelerName}</div>
                  <div className="text-xs text-slate-500">Passeport: {app.passportNumber}</div>
                </TableCell>
                <TableCell className="font-medium text-slate-700">
                  {app.agencyName}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-blue-700">{app.serviceType}</div>
                  <div className="text-xs text-slate-500">{app.country} - {app.visaType}</div>
                </TableCell>
                <TableCell>{getStatusBadge(app.status)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    onClick={() => handleOpenDialog(app)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Traiter
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedAppId} onOpenChange={(o) => !o && setSelectedAppId(null)}>
        <DialogContent className="max-w-6xl sm:max-w-6xl max-h-[90vh] overflow-y-auto p-0 sm:rounded-3xl">
          {selectedApp && (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-slate-900 p-6 text-white flex justify-between items-start shrink-0">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <DialogTitle className="text-2xl font-bold">
                      Dossier {selectedApp.id}
                    </DialogTitle>
                    {getStatusBadge(selectedApp.status)}
                  </div>
                  <p className="text-slate-400 text-sm">
                    Soumis par l'agence <span className="font-semibold text-white">{selectedApp.agencyName}</span> le {selectedApp.submissionDate}
                  </p>
                </div>
                <div className="text-right">
                   <div className="text-sm text-slate-400 mb-1">Service Demandé</div>
                   <div className="font-bold text-lg text-white">{selectedApp.serviceType} {selectedApp.country}</div>
                   <div className="text-slate-300 text-sm">{selectedApp.visaType}</div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 bg-slate-50 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Info & Docs */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Detailed Info */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                      <h3 className="font-bold text-slate-800 text-lg">Informations du Formulaire</h3>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                       <div>
                         <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Demandeur principal</span>
                         <span className="font-semibold text-slate-900 text-base">{selectedApp.travelerName}</span>
                       </div>
                       <div>
                         <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">N° Document / Passeport</span>
                         <span className="font-mono font-medium text-slate-900 text-base">{selectedApp.passportNumber}</span>
                       </div>
                       
                       {/* Inject extraData dynamically */}
                       {selectedApp.extraData && Object.entries(selectedApp.extraData).map(([k, v]) => {
                          if (!v || k === 'finalDocument') return null;
                          return (
                            <div key={k} className={k === 'residenceAddress' ? 'col-span-1 sm:col-span-2' : ''}>
                               <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                                 {k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                               </span>
                               <span className="font-medium text-slate-900">{v as string}</span>
                            </div>
                          );
                       })}
                    </div>
                  </div>

                  {/* Uploaded Documents */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                      <h3 className="font-bold text-slate-800 text-lg">Documents fournis par l'agence</h3>
                    </div>
                    <div className="p-5">
                      {selectedApp.customFormData && Object.entries(selectedApp.customFormData).filter(([_, val]) => val && typeof val === 'string' && val.startsWith('data:')).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Object.entries(selectedApp.customFormData).filter(([_, val]) => val && typeof val === 'string' && val.startsWith('data:')).map(([key, val]) => (
                            <div key={key} className="border border-slate-200 rounded-xl p-3 flex justify-between items-center bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
                              <div className="flex items-center gap-3 w-full overflow-hidden">
                                <div className="bg-white shadow-sm p-2 rounded-lg text-blue-600 shrink-0">
                                  <FileDown className="w-5 h-5" />
                                </div>
                                <div className="text-sm font-bold text-slate-700 truncate" title={key}>
                                  {key}
                                </div>
                              </div>
                              <DocumentPreview url={val as string} name={key} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          Aucun document n'a été fourni à l'étape 3.
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right Column: Tunnel de traitement */}
                <div className="space-y-6">
                  
                  {/* Status Actions */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                     <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                       <h3 className="font-bold text-slate-800">Tunnel de Traitement</h3>
                     </div>
                     <div className="p-5 flex flex-col gap-3">
                        <Button
                          onClick={() => updateStatus("Processing")}
                          variant={selectedApp.status === "Processing" ? "default" : "outline"}
                          className={`w-full justify-start h-12 font-bold ${selectedApp.status === "Processing" ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-md shadow-blue-200" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                        >
                          <Clock className="w-5 h-5 mr-3 opacity-70" /> 1. Mettre En Cours
                        </Button>
                        
                        <Button
                          onClick={() => updateStatus("Approved")}
                          variant={selectedApp.status === "Approved" ? "default" : "outline"}
                          className={`w-full justify-start h-12 font-bold ${selectedApp.status === "Approved" ? "bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-md shadow-green-200" : "bg-white text-slate-600 hover:bg-slate-50 hover:text-green-700 hover:border-green-200"}`}
                        >
                          <CheckCircle className="w-5 h-5 mr-3 opacity-70" /> 2. Marquer comme Terminé
                        </Button>
                        
                        <Button
                          onClick={() => updateStatus("Rejected")}
                          variant={selectedApp.status === "Rejected" ? "default" : "outline"}
                          className={`w-full justify-start h-12 font-bold mt-4 ${selectedApp.status === "Rejected" ? "bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-md shadow-red-200" : "bg-white text-red-600 border-red-100 hover:bg-red-50"}`}
                        >
                          <XCircle className="w-5 h-5 mr-3 opacity-70" /> Rejeter le dossier
                        </Button>
                     </div>
                  </div>

                  {/* Delivery / Final Document */}
                  {selectedApp.status === "Approved" && (
                     <div className="bg-green-50 rounded-2xl border-2 border-green-500/20 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                        <div className="px-5 py-4 border-b border-green-500/10">
                          <h3 className="font-bold text-green-900 flex items-center gap-2">
                            <FileUp className="w-5 h-5" /> Délivrance du Document
                          </h3>
                        </div>
                        <div className="p-5">
                          <p className="text-xs text-green-800/70 font-medium mb-4">
                            Transmettez le visa, l'assurance ou le document final à l'agence.
                          </p>
                          
                          {selectedApp.extraData?.finalDocument ? (
                            <div className="space-y-4">
                              <div className="border border-green-200 rounded-xl p-3 flex justify-between items-center bg-white shadow-sm">
                                <div className="flex items-center gap-3">
                                  <div className="bg-green-100 p-2 rounded-lg text-green-600 shrink-0">
                                    <FileDown className="w-5 h-5" />
                                  </div>
                                  <div className="text-sm font-bold text-green-900">Document transmis</div>
                                </div>
                                <DocumentPreview url={selectedApp.extraData.finalDocument} name="Document Final" />
                              </div>
                              <label className="block text-center text-xs font-bold text-green-700 hover:text-green-800 cursor-pointer underline transition-colors">
                                Remplacer le document
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        updateApplication(selectedApp.id, { extraData: { ...(selectedApp.extraData || {}), finalDocument: event.target?.result as string } });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          ) : (
                            <label className="border-2 border-dashed border-green-300 p-6 rounded-xl text-center cursor-pointer hover:bg-green-100 hover:border-green-400 transition-colors block">
                              <FileUp className="w-8 h-8 mx-auto text-green-600 mb-3" />
                              <span className="text-sm font-bold text-green-800 block">
                                Sélectionner un fichier
                              </span>
                              <span className="text-xs font-medium text-green-600/70 block mt-1">PDF, JPG, PNG (Max 5Mo)</span>
                              <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      updateApplication(selectedApp.id, { extraData: { ...(selectedApp.extraData || {}), finalDocument: event.target?.result as string } });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                     </div>
                  )}

                  {/* Admin Notes */}
                  <div className="bg-amber-50 rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
                     <div className="px-5 py-3 border-b border-amber-200/50 flex justify-between items-center">
                       <h3 className="font-bold text-amber-900 text-sm">Notes de l'Agent (Internes)</h3>
                     </div>
                     <div className="p-4">
                       <Textarea 
                         placeholder="Ajoutez une note, un numéro de suivi de dossier consulaire..." 
                         className="bg-white border-amber-200 min-h-[100px] text-sm resize-none focus-visible:ring-amber-400 mb-3"
                         value={adminNotes}
                         onChange={(e) => setAdminNotes(e.target.value)}
                       />
                       <Button onClick={saveNotes} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-9">
                         <Save className="w-4 h-4 mr-2" /> Enregistrer la note
                       </Button>
                     </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
"""

with open('components/admin/ApplicationManagement.tsx', 'w') as f:
    f.write(content)
