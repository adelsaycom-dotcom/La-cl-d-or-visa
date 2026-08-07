import { useState } from "react";
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

  const selectedApp = applications.find((a) => a.id === selectedAppId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Approuvée
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            En attente
          </Badge>
        );
      case "Processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            En cours
          </Badge>
        );
      case "Missing Docs":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Docs manquants
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejetée
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

  const filteredApplications = applications.filter((app) => {
    if (statusFilter !== "ALL" && app.status !== statusFilter) return false;
    if (serviceFilter !== "ALL" && app.serviceType !== serviceFilter)
      return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">
          Gestion des Demandes
        </h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Rechercher demandeur ou agence..."
          className="w-full md:max-w-xs"
        />

        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Tous les services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les services</SelectItem>
            <SelectItem value="Evisa">E-Visa</SelectItem>
            <SelectItem value="Residence">Résidence</SelectItem>
            <SelectItem value="Permis">Permis International</SelectItem>
            <SelectItem value="Assurance">Assurance Voyage</SelectItem>
            <SelectItem value="Etude">Visa Étude</SelectItem>
            <SelectItem value="Invitation">Invitation</SelectItem>
            <SelectItem value="Rendez-vous">Rendez-vous</SelectItem>
            <SelectItem value="Dossier">Traitement Dossier</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            <SelectItem value="Pending">En attente</SelectItem>
            <SelectItem value="Processing">En cours</SelectItem>
            <SelectItem value="Approved">Approuvée</SelectItem>
            <SelectItem value="Missing Docs">Docs manquants</SelectItem>
            <SelectItem value="Rejected">Rejetée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>ID / Date</TableHead>
              <TableHead>Demandeur</TableHead>
              <TableHead>Agence</TableHead>
              <TableHead>Service / Dest.</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <div className="font-mono text-sm font-medium">{app.id}</div>
                  <div className="text-xs text-gray-500">
                    {app.submissionDate}
                  </div>
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {app.travelerName}
                </TableCell>
                <TableCell className="text-gray-600 whitespace-nowrap">
                  {app.agencyName}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="font-semibold text-blue-700">
                    {app.serviceType}
                  </div>
                  <div className="text-xs text-gray-500">
                    {app.country} - {app.visaType}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(app.status)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAppId(app.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" /> Voir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredApplications.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  Aucune demande trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedAppId}
        onOpenChange={(open) => !open && setSelectedAppId(null)}
      >
        <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Détails de la demande : {selectedApp?.id}
            </DialogTitle>
          </DialogHeader>

          {selectedApp && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              <div className="lg:col-span-2 space-y-6">
                {/* Applicant Info */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3 border-b pb-2">
                    Informations du Demandeur
                  </h3>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <div>
                      <span className="text-gray-500 block text-xs">
                        Nom complet
                      </span>
                      <span className="font-medium">
                        {selectedApp.travelerName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs">
                        Passeport/ID
                      </span>
                      <span className="font-mono">
                        {selectedApp.passportNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs">
                        Service
                      </span>
                      <span className="font-bold text-blue-700">
                        {selectedApp.serviceType}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs">
                        Destination & Option
                      </span>
                      <span>
                        {selectedApp.country} - {selectedApp.visaType}
                      </span>
                    </div>
                    {selectedApp.extraData?.dob && (
                      <div>
                        <span className="text-gray-500 block text-xs">
                          Date de naissance
                        </span>
                        <span>{selectedApp.extraData.dob}</span>
                      </div>
                    )}
                    {selectedApp.extraData?.nationality && (
                      <div>
                        <span className="text-gray-500 block text-xs">
                          Nationalité
                        </span>
                        <span className="uppercase">
                          {selectedApp.extraData.nationality}
                        </span>
                      </div>
                    )}
                    {selectedApp.extraData?.phoneNumber && (
                      <div>
                        <span className="text-gray-500 block text-xs">
                          Téléphone
                        </span>
                        <span>{selectedApp.extraData.phoneNumber}</span>
                      </div>
                    )}
                    {selectedApp.extraData?.email && (
                      <div>
                        <span className="text-gray-500 block text-xs">
                          Email
                        </span>
                        <span>{selectedApp.extraData.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedApp.extraData &&
                  Object.keys(selectedApp.extraData).some(
                    (k) =>
                      !["dob", "nationality", "phoneNumber", "email"].includes(
                        k,
                      ) && selectedApp.extraData![k],
                  ) && (
                    <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100 shadow-sm">
                      <h4 className="text-sm border-b border-blue-100 pb-3 font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-600" /> Informations
                        Détaillées
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        {selectedApp.extraData.residenceAddress && (
                          <div className="col-span-1 sm:col-span-2">
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Adresse de résidence
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.residenceAddress}
                            </span>
                          </div>
                        )}
                        {selectedApp.extraData.fatherNameFr && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Père (Fr)
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.fatherNameFr}
                            </span>
                          </div>
                        )}
                        {selectedApp.extraData.fatherNameAr && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5 text-right">
                              Père (Ar)
                            </span>
                            <div
                              className="font-medium text-slate-800 text-right"
                              dir="rtl"
                            >
                              {selectedApp.extraData.fatherNameAr}
                            </div>
                          </div>
                        )}
                        {selectedApp.extraData.motherNameFr && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Mère (Fr)
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.motherNameFr}
                            </span>
                          </div>
                        )}
                        {selectedApp.extraData.motherNameAr && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5 text-right">
                              Mère (Ar)
                            </span>
                            <div
                              className="font-medium text-slate-800 text-right"
                              dir="rtl"
                            >
                              {selectedApp.extraData.motherNameAr}
                            </div>
                          </div>
                        )}
                        {selectedApp.extraData.passportIssueDate && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Délivrance Passeport
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.passportIssueDate}
                            </span>
                          </div>
                        )}
                        {selectedApp.extraData.passportExpiryDate && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Expiration Passeport
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.passportExpiryDate}
                            </span>
                          </div>
                        )}

                        {selectedApp.extraData.residenceReason && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Raison de résidence
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.residenceReason}
                            </span>
                          </div>
                        )}
                        {selectedApp.extraData.profession && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Profession
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.profession}
                            </span>
                          </div>
                        )}
                        {selectedApp.extraData.intendedAddress && (
                          <div className="col-span-1 sm:col-span-2">
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Adresse de résidence prévue
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.intendedAddress}
                            </span>
                          </div>
                        )}

                        {selectedApp.extraData.applicationType && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Type de demande (Dossier)
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.applicationType}
                            </span>
                          </div>
                        )}
                        {selectedApp.extraData.submissionCenter && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Centre de dépôt
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.submissionCenter}
                            </span>
                          </div>
                        )}
                        {selectedApp.extraData.plannedSubmissionDate && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Date de dépôt prévue
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.plannedSubmissionDate}
                            </span>
                          </div>
                        )}
                        {selectedApp.extraData.travelStartDate && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Date de départ (prévue)
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.travelStartDate}
                            </span>
                          </div>
                        )}
                        {selectedApp.extraData.travelEndDate && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Date de retour (prévue)
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.travelEndDate}
                            </span>
                          </div>
                        )}

                        {selectedApp.extraData.nationalLicenseNumber && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              N° Permis national
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.nationalLicenseNumber}
                            </span>
                          </div>
                        )}
                        {selectedApp.extraData.bloodType && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Groupe sanguin
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.bloodType}
                            </span>
                          </div>
                        )}

                        {selectedApp.extraData.consulate && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Consulat/Centre
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.consulate}
                            </span>
                          </div>
                        )}
                        {selectedApp.extraData.preferredDate && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Date souhaitée
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.preferredDate}
                            </span>
                          </div>
                        )}

                        {selectedApp.extraData.studyLevel && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Niveau d'étude
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.studyLevel}
                            </span>
                          </div>
                        )}
                        {selectedApp.extraData.university && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Établissement
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.university}
                            </span>
                          </div>
                        )}

                        {selectedApp.extraData.inviterName && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Nom de l'invitant
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.inviterName}
                            </span>
                          </div>
                        )}
                        {selectedApp.extraData.relationship && (
                          <div>
                            <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              Relation
                            </span>
                            <span className="font-medium text-slate-800">
                              {selectedApp.extraData.relationship}
                            </span>
                          </div>
                        )}

                        {selectedApp.extraData.notes && (
                          <div className="col-span-1 sm:col-span-2 mt-2">
                            <span className="text-blue-900/60 block text-xs font-semibold mb-2">
                              Notes Administratives
                            </span>
                            <div className="font-medium text-slate-700 bg-white p-4 rounded-lg border border-blue-100/50 leading-relaxed whitespace-pre-wrap">
                              {selectedApp.extraData.notes}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                {selectedApp.customFormData && Object.entries(selectedApp.customFormData).filter(([_, val]) => val && (typeof val !== 'string' || !val.startsWith('data:'))).length > 0 && (
                  <div className="bg-purple-50/40 p-4 rounded-xl border border-purple-100 shadow-sm">
                    <h4 className="text-sm border-b border-purple-100 pb-3 font-bold text-purple-900 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4 text-purple-600" /> Informations Personnalisées
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                      {Object.entries(selectedApp.customFormData)
                        .filter(([_, val]) => val && (typeof val !== 'string' || !val.startsWith('data:')))
                        .map(([key, val]) => (
                          <div key={key}>
                            <span className="text-purple-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                            <span className="font-medium text-slate-800">
                              {val as string}
                            </span>
                          </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div>
                  <h3 className="font-semibold mb-3">Documents Téléchargés</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedApp.customFormData && Object.entries(selectedApp.customFormData).filter(([_, val]) => val && typeof val === 'string' && val.startsWith('data:')).length > 0 ? (
                      Object.entries(selectedApp.customFormData).filter(([_, val]) => val && typeof val === 'string' && val.startsWith('data:')).map(([key, val]) => (
                        <div key={key} className="border rounded-lg p-3 flex justify-between items-center bg-white shadow-sm hover:border-blue-300 transition-colors">
                          <div className="flex items-center gap-3 w-full overflow-hidden">
                            <div className="bg-blue-100 p-2 rounded text-blue-600 shrink-0">
                              <FileDown className="w-5 h-5" />
                            </div>
                            <div className="text-sm font-medium truncate" title={key}>
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </div>
                          </div>
                          <DocumentPreview url={val as string} name={key} />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-1 sm:col-span-2 text-sm text-gray-500 italic p-4 border rounded-lg bg-gray-50">
                        Aucun document téléchargé
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Note */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Notes Administratives (interne)
                  </label>
                  <Textarea placeholder="Ajouter des notes..." />
                  <Button variant="outline" size="sm">
                    Sauvegarder
                  </Button>
                </div>
              </div>

              {/* Status Actions */}
              <div className="space-y-4">
                <div className="border rounded-lg p-4 shadow-sm bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Statut Actuel</h3>
                    {getStatusBadge(selectedApp.status)}
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-xs text-gray-500 mb-2 uppercase font-medium">
                      Changer le statut
                    </p>
                    <Button
                      onClick={() => updateStatus("Processing")}
                      variant="outline"
                      className="w-full justify-start block"
                      disabled={selectedApp.status === "Processing"}
                    >
                      Passer En Cours
                    </Button>
                    <Button
                      onClick={() => updateStatus("Rejected")}
                      variant="outline"
                      className="w-full justify-start block text-red-600 hover:text-red-700 hover:bg-red-50 mt-4"
                      disabled={selectedApp.status === "Rejected"}
                    >
                      <XCircle className="w-4 h-4 inline mr-2" /> Rejeter la
                      demande
                    </Button>
                    <Button
                      onClick={() => updateStatus("Approved")}
                      className="w-full justify-start block bg-green-600 hover:bg-green-700 text-white mt-2"
                      disabled={selectedApp.status === "Approved"}
                    >
                      <CheckCircle className="w-4 h-4 inline mr-2" /> Approuver
                      la demande
                    </Button>
                  </div>
                </div>

                {selectedApp.status === "Approved" && (
                  <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Résultat
                    </h4>
                    {selectedApp.extraData?.finalDocument ? (
                      <div className="space-y-3">
                        <div className="border rounded-lg p-3 flex justify-between items-center bg-white shadow-sm hover:border-green-300 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded text-green-600 shrink-0">
                              <FileDown className="w-5 h-5" />
                            </div>
                            <div className="text-sm font-medium">Document Final</div>
                          </div>
                          <DocumentPreview url={selectedApp.extraData.finalDocument} name="Document Final" />
                        </div>
                        <label className="block text-center text-xs text-green-700 underline cursor-pointer hover:text-green-800">
                          Remplacer le document
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  updateApplication(selectedApp.id, { 
                                    extraData: { 
                                      ...(selectedApp.extraData || {}), 
                                      finalDocument: event.target?.result as string 
                                    } 
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-green-300 p-4 rounded-lg text-center cursor-pointer hover:bg-green-100 transition-colors block">
                        <FileUp className="w-6 h-6 mx-auto text-green-600 mb-2" />
                        <span className="text-sm font-medium text-green-700 block">
                          Uploader le document final (Visa, etc.)
                        </span>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                updateApplication(selectedApp.id, { 
                                  extraData: { 
                                    ...(selectedApp.extraData || {}), 
                                    finalDocument: event.target?.result as string 
                                  } 
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
