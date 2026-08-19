import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, FileDown, Info } from "lucide-react";
import { DocumentPreview } from "@/components/DocumentPreview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppStore } from "../../src/store/useAppStore";

export function AgencyApplications() {
  const { applications } = useAppStore();
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-none">
            Terminé
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-none">
            En attente
          </Badge>
        );
      case "Processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-none">
            En cours de traitement
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-none">Rejeté</Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mes Demandes</h2>
        <p className="text-sm text-gray-500 mt-1">
          Suivez l'état des demandes de visa soumises par votre agence.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Rechercher par nom ou ID..."
          className="w-full sm:max-w-xs"
        />
        <Select>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            <SelectItem value="Pending">En attente</SelectItem>
            <SelectItem value="Processing">En cours de traitement</SelectItem>
            <SelectItem value="Approved">Terminé</SelectItem>
            <SelectItem value="Rejected">Rejeté</SelectItem>
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
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <div className="font-mono text-sm font-medium text-gray-900 whitespace-nowrap">
                    {app.id}
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">
                    {app.submissionDate}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-gray-900 whitespace-nowrap">
                  {app.travelerName}
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium whitespace-nowrap">
                    {app.country}
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">
                    {app.visaType}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(app.status)}</TableCell>
                <TableCell className="font-mono text-sm font-medium text-red-600 whitespace-nowrap">
                  -{app.price} DA
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedApp(app)}
                  >
                    <Eye className="w-4 h-4 mr-2" /> Voir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {applications.length === 0 && (
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

      {/* App Details Modal */}
      <Dialog
        open={!!selectedApp}
        onOpenChange={(o) => !o && setSelectedApp(null)}
      >
        <DialogContent className="max-w-3xl sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedApp && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center pr-6">
                  <span className="text-xl">Demande: {selectedApp.id}</span>
                  {getStatusBadge(selectedApp.status)}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-3">
                      Infos du Demandeur
                    </h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Nom</dt>
                        <dd className="font-medium">
                          {selectedApp.travelerName}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Passeport</dt>
                        <dd className="font-mono font-medium">
                          {selectedApp.passportNumber}
                        </dd>
                      </div>

                      {selectedApp.extraData?.dob && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Date de naissance</dt>
                          <dd className="font-medium">
                            {selectedApp.extraData.dob}
                          </dd>
                        </div>
                      )}
                      {selectedApp.extraData?.nationality && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Nationalité</dt>
                          <dd className="font-medium uppercase">
                            {selectedApp.extraData.nationality}
                          </dd>
                        </div>
                      )}
                      {selectedApp.extraData?.phoneNumber && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Téléphone</dt>
                          <dd className="font-medium">
                            {selectedApp.extraData.phoneNumber}
                          </dd>
                        </div>
                      )}
                      {selectedApp.extraData?.email && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Email</dt>
                          <dd className="font-medium">
                            {selectedApp.extraData.email}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-3">
                      Service Demandé
                    </h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Type de Service</dt>
                        <dd className="font-bold text-blue-700">
                          {selectedApp.serviceType}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Destination/Pays</dt>
                        <dd className="font-medium">{selectedApp.country}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Option/Service</dt>
                        <dd className="font-medium">{selectedApp.visaType}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Coût payé</dt>
                        <dd className="font-mono font-medium text-red-600">
                          {selectedApp.price} DA
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedApp.extraData &&
                    Object.keys(selectedApp.extraData).some(
                      (k) =>
                        ![
                          "dob",
                          "nationality",
                          "phoneNumber",
                          "email",
                        ].includes(k) && selectedApp.extraData![k],
                    ) && (
                      <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100 shadow-sm">
                        <h4 className="text-xs uppercase text-blue-800 font-bold tracking-wider mb-2 flex items-center gap-2">
                          <Info className="w-4 h-4 text-blue-600" /> Détails
                          Supplémentaires
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 text-sm">
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
                                Date départ prév.
                              </span>
                              <span className="font-medium text-slate-800">
                                {selectedApp.extraData.travelStartDate}
                              </span>
                            </div>
                          )}
                          {selectedApp.extraData.travelEndDate && (
                            <div>
                              <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                                Date retour prév.
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
                                Nom invitant
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
                              <span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                                Notes
                              </span>
                              <div className="font-medium text-slate-700 bg-white/70 p-3 rounded-lg border border-blue-100/50 leading-relaxed text-sm whitespace-pre-wrap">
                                {selectedApp.extraData.notes}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                  {selectedApp.customFormData && Object.entries(selectedApp.customFormData).filter(([_, val]) => val && (typeof val !== 'string' || !val.startsWith('data:'))).length > 0 && (
                    <div className="bg-purple-50/40 p-4 rounded-xl border border-purple-100 shadow-sm">
                      <h4 className="text-xs uppercase text-purple-800 font-bold tracking-wider mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4 text-purple-600" /> Informations Personnalisées
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 text-sm">
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

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <h4 className="text-xs uppercase text-gray-500 font-bold tracking-wider p-3 bg-gray-50 border-b">
                      Documents Soumis
                    </h4>
                    <div className="p-3 space-y-2">
                      {selectedApp.customFormData && Object.entries(selectedApp.customFormData).filter(([_, val]) => val && typeof val === 'string' && val.startsWith('data:')).length > 0 ? (
                        Object.entries(selectedApp.customFormData).filter(([_, val]) => val && typeof val === 'string' && val.startsWith('data:')).map(([key, val]) => (
                          <div key={key} className="text-sm font-medium text-gray-700 flex items-center justify-between">
                            <span className="truncate max-w-[200px]" title={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-green-600">
                                Fourni
                              </Badge>
                              <DocumentPreview url={val as string} name={key} />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 italic py-2 text-center">Aucun document soumis</div>
                      )}
                    </div>
                  </div>

                  {selectedApp.status === "Approved" && (
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                      <h4 className="font-bold text-green-900 mb-2">
                        Le document est prêt !
                      </h4>
                      <p className="text-sm text-green-700 mb-4">
                        Vous pouvez maintenant télécharger le document final.
                      </p>
                      {selectedApp.extraData?.finalDocument ? (
                        <div className="flex justify-center items-center">
                          <DocumentPreview url={selectedApp.extraData.finalDocument} name="Document Final" />
                        </div>
                      ) : (
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white opacity-50 cursor-not-allowed">
                          Document non disponible
                        </Button>
                      )}
                    </div>
                  )}

                  {selectedApp.status === "Rejected" && (
                    <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
                      <h4 className="font-bold text-red-900 mb-2">
                        Demande Refusée
                      </h4>
                      <p className="text-sm text-red-700 mb-4">
                        Cette demande a été rejetée par nos services. Veuillez nous contacter pour plus de détails.
                      </p>
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
