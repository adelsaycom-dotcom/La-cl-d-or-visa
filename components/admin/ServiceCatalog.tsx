import { useState } from "react";
import { useAppStore, PrestationService } from "../../src/store/useAppStore";
import { Plus, Edit, Trash2, Globe2, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ServiceCatalog() {
  const { services, addService, updateService, deleteService } = useAppStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<PrestationService>>({
    title: "", type: "Evisa", destination: "", flag: "🌍", price: 0, processingTime: "", requiredDocuments: [""], conditions: [""], active: true
  });

  const handleEdit = (s: PrestationService) => {
    setFormData(s);
    setEditingId(s.id);
    setIsEditorOpen(true);
  };

  const handleAddNew = () => {
    setFormData({ title: "", type: "Evisa", destination: "", flag: "🌍", price: 0, processingTime: "3-5 jours", requiredDocuments: ["Passeport"], conditions: [""], active: true });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Catalogue des Prestations</h2>
          <p className="text-sm text-gray-500 mt-1">Gérez vos services (Visas, Résidences, Assurances...) de manière indépendante.</p>
        </div>
        <Button onClick={handleAddNew} className="bg-black text-white hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" /> Nouvelle Prestation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
             <div className="p-5 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center text-xl">
                      {s.flag}
                   </div>
                   <div>
                     <h3 className="font-bold text-gray-900 leading-tight">{s.title}</h3>
                     <p className="text-xs font-medium text-gray-500">{s.destination}</p>
                   </div>
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {s.active ? 'Actif' : 'Inactif'}
                </div>
             </div>
             
             <div className="p-5 flex-1 flex flex-col gap-3">
               <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                 <span className="text-gray-500">Type de formulaire</span>
                 <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{s.type}</span>
               </div>
               <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                 <span className="text-gray-500">Tarif B2B</span>
                 <span className="font-bold text-primary-gold">{s.price?.toLocaleString()} DZD</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500">Documents requis</span>
                 <span className="font-semibold text-gray-700">{s.requiredDocuments?.length || 0} doc(s)</span>
               </div>
             </div>
             
             <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between gap-2">
                <Button variant="ghost" size="sm" onClick={() => deleteService(s.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEdit(s)} className="flex-1 bg-white border-gray-200">
                  <Edit className="w-4 h-4 mr-2" /> Modifier
                </Button>
             </div>
          </div>
        ))}
      </div>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden sm:rounded-3xl">
           <div className="bg-black p-6 text-white">
              <h3 className="text-xl font-bold">{editingId ? 'Modifier la prestation' : 'Nouvelle Prestation'}</h3>
              <p className="text-sm text-gray-400 mt-1">Configurez les détails et le tarif de ce service.</p>
           </div>
           
           <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
             
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Nom du Service</label>
                  <Input value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="Ex: E-Visa Touristique 30 jours" className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Destination</label>
                  <div className="flex gap-2">
                    <Input value={formData.flag} onChange={e=>setFormData({...formData, flag: e.target.value})} className="w-16 bg-gray-50 border-gray-200 text-center" placeholder="Drapeau" />
                    <Input value={formData.destination} onChange={e=>setFormData({...formData, destination: e.target.value})} placeholder="Ex: Dubaï" className="flex-1 bg-gray-50 border-gray-200" />
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Type de formulaire lié</label>
                  <Select value={formData.type} onValueChange={(v:any)=>setFormData({...formData, type: v})}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Evisa">E-Visa / Visa Standard</SelectItem>
                      <SelectItem value="Residence">Dossier Résidence</SelectItem>
                      <SelectItem value="Assurance">Assurance Voyage</SelectItem>
                      <SelectItem value="Etude">Visa Étude</SelectItem>
                      <SelectItem value="Rendez-vous">Prise de Rendez-vous</SelectItem>
                      <SelectItem value="Dossier">Traitement de Dossier</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-gray-500 font-medium">Détermine quels champs seront demandés à l'agence (Étape 2).</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Tarif B2B (DZD)</label>
                  <Input type="number" value={formData.price} onChange={e=>setFormData({...formData, price: Number(e.target.value)})} className="bg-gray-50 border-gray-200" />
                </div>
             </div>

             <div className="space-y-3 pt-4 border-t border-gray-100">
                <label className="text-sm font-bold">Documents Requis (Scans)</label>
                {(formData.requiredDocuments || []).map((doc, idx) => (
                   <div key={idx} className="flex gap-2">
                      <Input value={doc} onChange={e => {
                         const newDocs = [...(formData.requiredDocuments || [])];
                         newDocs[idx] = e.target.value;
                         setFormData({...formData, requiredDocuments: newDocs});
                      }} placeholder="Ex: Scan du passeport en couleur" className="bg-gray-50 border-gray-200" />
                      <Button variant="outline" className="shrink-0" onClick={() => {
                         const newDocs = [...(formData.requiredDocuments || [])];
                         newDocs.splice(idx, 1);
                         setFormData({...formData, requiredDocuments: newDocs});
                      }}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                   </div>
                ))}
                <Button variant="ghost" size="sm" onClick={() => setFormData({...formData, requiredDocuments: [...(formData.requiredDocuments || []), ""]})} className="text-blue-600 font-bold">+ Ajouter un document requis</Button>
             </div>

             <div className="space-y-2 pt-4 border-t border-gray-100">
               <label className="text-sm font-bold">Statut de la prestation</label>
               <div className="flex items-center gap-2">
                 <input type="checkbox" id="active" checked={formData.active} onChange={e=>setFormData({...formData, active: e.target.checked})} className="w-4 h-4 rounded text-black focus:ring-black" />
                 <label htmlFor="active" className="text-sm cursor-pointer">Service activé (visible par les agences)</label>
               </div>
             </div>

           </div>
           
           <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <Button variant="outline" className="rounded-xl px-6" onClick={() => setIsEditorOpen(false)}>Annuler</Button>
              <Button className="bg-black text-white rounded-xl px-8" onClick={handleSave}>Enregistrer</Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
