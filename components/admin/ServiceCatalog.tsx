import { useState } from "react";
import { useAppStore, PrestationService } from "../../src/store/useAppStore";
import { Plus, Edit, Trash2, Globe2, FileText, CheckCircle2, Search, ArrowUpRight, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ServiceCatalog() {
  const { services, addService, updateService, deleteService } = useAppStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState<Partial<PrestationService>>({
    title: "", type: "Evisa", destination: "", flag: "🌍", price: 0, processingTime: "", description: "", requiredDocuments: [""], conditions: [""], active: true
  });

  const handleEdit = (s: PrestationService) => {
    setFormData(s);
    setEditingId(s.id);
    setIsEditorOpen(true);
  };

  const handleAddNew = () => {
    setFormData({ title: "", type: "Evisa", destination: "", flag: "🌍", price: 0, processingTime: "3-5 jours", description: "", requiredDocuments: ["Passeport scan couleur"], conditions: [""], active: true });
    setEditingId(null);
    setIsEditorOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.destination) return;
    
    const cleanDocs = (formData.requiredDocuments || []).filter(d => d.trim() !== "");
    const cleanConds = (formData.conditions || []).filter(c => c.trim() !== "");
    
    if (editingId) {
      updateService(editingId, { ...formData, requiredDocuments: cleanDocs, conditions: cleanConds });
    } else {
      addService({ ...formData, id: Date.now().toString(), requiredDocuments: cleanDocs, conditions: cleanConds } as PrestationService);
    }
    setIsEditorOpen(false);
  };

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Catalogue des Prestations</h2>
          <p className="text-slate-500 font-medium mt-2 max-w-xl">Configurez les visas, dossiers de résidence, assurances et autres services. Définissez les tarifs B2B, les documents requis et les conditions.</p>
        </div>
        <div className="relative z-10 w-full md:w-auto">
          <Button onClick={handleAddNew} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5">
            <Plus className="w-5 h-5 mr-2" /> Créer un service
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm max-w-md">
        <div className="bg-slate-50 p-2 rounded-lg text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <Input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher une destination ou un service..."
          className="border-0 bg-transparent focus-visible:ring-0 px-0 shadow-none text-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredServices.map(s => (
          <div key={s.id} className={`bg-white rounded-2xl border ${s.active ? 'border-slate-200 hover:border-indigo-300' : 'border-slate-200/50 opacity-75'} shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 group`}>
             <div className="p-6 border-b border-slate-100 flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border ${s.active ? 'bg-white border-slate-100' : 'bg-slate-50 border-slate-200/50 grayscale'}`}>
                  {s.flag}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-lg truncate leading-tight">{s.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Globe2 className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{s.destination}</span>
                  </div>
                </div>
             </div>
             
             <div className="p-6 flex-1 flex flex-col gap-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                   <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Type</p>
                   <p className="font-bold text-slate-800">{s.type}</p>
                 </div>
                 <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100/50">
                   <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">Tarif B2B</p>
                   <p className="font-black text-indigo-700">{s.price?.toLocaleString()} DA</p>
                 </div>
               </div>

               <div className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-100 rounded-lg p-2.5">
                 <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                 <span className="truncate"><strong>Délai:</strong> {s.processingTime || "Non spécifié"}</span>
               </div>
               
               <div className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-100 rounded-lg p-2.5">
                 <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                 <span><strong>{s.requiredDocuments?.length || 0}</strong> document(s) requis</span>
               </div>
             </div>
             
             <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${s.active ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  <span className="text-sm font-bold text-slate-600">{s.active ? 'Actif' : 'Inactif'}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(s)} className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 h-9 w-9">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteService(s.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-9 w-9">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
             </div>
          </div>
        ))}
      </div>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden sm:rounded-[2rem] border-0 shadow-2xl bg-slate-50 flex flex-col max-h-[90vh] !top-1/2 !-translate-y-1/2">
           <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <DialogTitle className="text-2xl font-black text-white">{editingId ? 'Modifier le service' : 'Créer un nouveau service'}</DialogTitle>
              <DialogDescription className="text-indigo-100 mt-2 text-base max-w-xl">
                Définissez les caractéristiques du service, les documents que l'agence devra fournir, et les conditions spécifiques.
              </DialogDescription>
           </div>
           
           <div className="flex-1 overflow-y-auto min-h-0">
             <div className="p-8 space-y-10">
               {/* Informations Générales */}
               <section>
                 <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">1</div>
                   <h3 className="text-xl font-bold text-slate-900">Informations Générales</h3>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="md:col-span-8 space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Titre du Service</Label>
                      <Input value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="Ex: E-Visa Touristique 30 jours, Assurance Schengen..." className="bg-slate-50 border-slate-200 h-11" />
                    </div>
                    
                    <div className="md:col-span-4 space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Drapeau / Icône</Label>
                      <Input value={formData.flag} onChange={e=>setFormData({...formData, flag: e.target.value})} className="bg-slate-50 border-slate-200 text-center text-xl h-11" placeholder="🌍" />
                    </div>

                    <div className="md:col-span-6 space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Destination</Label>
                      <Input value={formData.destination} onChange={e=>setFormData({...formData, destination: e.target.value})} placeholder="Ex: Dubaï, Espace Schengen, Turquie..." className="bg-slate-50 border-slate-200 h-11" />
                    </div>

                    <div className="md:col-span-6 space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Catégorie (Type de formulaire lié)</Label>
                      <Select value={formData.type} onValueChange={(v:any)=>setFormData({...formData, type: v})}>
                        <SelectTrigger className="bg-slate-50 border-slate-200 h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Evisa">E-Visa / Visa Standard</SelectItem>
                          <SelectItem value="Residence">Dossier Résidence</SelectItem>
                          <SelectItem value="Assurance">Assurance Voyage</SelectItem>
                          <SelectItem value="Etude">Visa Étude</SelectItem>
                          <SelectItem value="Rendez-vous">Prise de Rendez-vous</SelectItem>
                          <SelectItem value="Dossier">Traitement de Dossier</SelectItem>
                          <SelectItem value="Permis">Permis International / Traduction</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500">Définit les champs demandés à l'agence.</p>
                    </div>
                 </div>
               </section>

               {/* Tarification & Délais */}
               <section>
                 <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">2</div>
                   <h3 className="text-xl font-bold text-slate-900">Tarification & Traitement</h3>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Tarif B2B (DZD)</Label>
                      <div className="relative">
                        <Input type="number" value={formData.price} onChange={e=>setFormData({...formData, price: Number(e.target.value)})} className="bg-slate-50 border-slate-200 h-11 pl-4 pr-12 font-bold text-lg" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <span className="text-slate-500 font-medium">DA</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Délai de traitement estimé</Label>
                      <Input value={formData.processingTime || ""} onChange={e=>setFormData({...formData, processingTime: e.target.value})} placeholder="Ex: 3 à 5 jours ouvrables" className="bg-slate-50 border-slate-200 h-11" />
                    </div>
                 </div>
               </section>

               {/* Description et Exigences */}
               <section>
                 <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">3</div>
                   <h3 className="text-xl font-bold text-slate-900">Exigences & Conditions</h3>
                 </div>

                 <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Description et Conditions Générales</Label>
                      <Textarea 
                        value={formData.description || ""} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                        placeholder="Détaillez ici les conditions d'éligibilité, la durée de validité du visa, ou toute note importante pour l'agence..."
                        className="bg-slate-50 border-slate-200 min-h-[120px] text-base"
                      />
                      <div className="flex items-start gap-2 mt-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>Cette description sera directement visible par l'agence avant qu'elle ne confirme sa demande.</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <Label className="text-sm font-bold text-slate-700">Documents Requis (Scans à fournir)</Label>
                      <p className="text-sm text-slate-500">L'agence devra obligatoirement uploader ces documents pour soumettre la demande.</p>
                      
                      <div className="space-y-3">
                        {(formData.requiredDocuments || []).map((doc, idx) => (
                           <div key={idx} className="flex gap-2">
                              <Input value={doc} onChange={e => {
                                 const newDocs = [...(formData.requiredDocuments || [])];
                                 newDocs[idx] = e.target.value;
                                 setFormData({...formData, requiredDocuments: newDocs});
                              }} placeholder="Ex: Scan du passeport (Page bio)" className="bg-slate-50 border-slate-200 h-11" />
                              <Button variant="outline" className="shrink-0 h-11 w-11 p-0 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200" onClick={() => {
                                 const newDocs = [...(formData.requiredDocuments || [])];
                                 newDocs.splice(idx, 1);
                                 setFormData({...formData, requiredDocuments: newDocs});
                              }}><Trash2 className="w-5 h-5" /></Button>
                           </div>
                        ))}
                      </div>
                      <Button variant="outline" onClick={() => setFormData({...formData, requiredDocuments: [...(formData.requiredDocuments || []), ""]})} className="text-indigo-600 font-bold border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 mt-2">
                        <Plus className="w-4 h-4 mr-2" /> Ajouter un document
                      </Button>
                    </div>
                 </div>
               </section>

               {/* Statut */}
               <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <Label className="text-base font-bold text-slate-900">Activer ce service</Label>
                    <p className="text-sm text-slate-500 mt-1">S'il est désactivé, le service sera caché du catalogue des agences.</p>
                  </div>
                  <Switch 
                    checked={formData.active} 
                    onCheckedChange={(checked) => setFormData({...formData, active: checked})} 
                  />
               </section>
             </div>
           </div>
           
           <div className="p-6 bg-white border-t border-slate-100 rounded-b-[2rem]">
              <div className="flex flex-col sm:flex-row justify-end gap-3 w-full">
                <Button variant="outline" className="rounded-xl px-6 h-12 font-bold border-slate-200 w-full sm:w-auto" onClick={() => setIsEditorOpen(false)}>Annuler</Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-10 h-12 font-bold shadow-lg shadow-indigo-200 w-full sm:w-auto" onClick={handleSave}>
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Enregistrer le service
                </Button>
              </div>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
