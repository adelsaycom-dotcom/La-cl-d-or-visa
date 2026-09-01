const fs = require('fs');

const content = `import { useState, useMemo } from "react";
import { useAppStore, PrestationService } from "../../src/store/useAppStore";
import { 
  Plus, Edit, Trash2, Globe2, FileText, CheckCircle2, 
  Search, AlertCircle, MapPin, List, Settings, Save, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const PREDEFINED_CATEGORIES = [
  "Visa",
  "E-Visa",
  "Dossier Résidence",
  "Prise de Rendez-vous",
  "Traitement de Dossier",
  "Permis internationnal"
];

// Document checklist options
const DOCUMENT_OPTIONS = [
  "Scan du Passeport",
  "Photo d'identité",
  "Billet d'avion / Réservation",
  "Réservation d'hôtel",
  "Fiche familiale",
  "Justificatif de revenus",
  "Nom de la mère (Texte)",
  "Profession (Texte)",
  "Adresse de résidence (Texte)"
];

export function ServiceCatalog() {
  const { services, addService, updateService, deleteService, countries } = useAppStore();
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Toutes");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PrestationService>>({
    title: "", 
    type: "E-Visa", 
    destination: "", 
    price: 0, 
    processingTime: "", 
    conditions: [""], 
    requiredDocuments: [], 
    active: true 
  });

  // Derived Data
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.destination?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Toutes" || s.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, selectedCategory]);

  const handleEdit = (s: PrestationService) => {
    setFormData({
      ...s,
      conditions: s.conditions && s.conditions.length > 0 ? s.conditions : [""],
      requiredDocuments: s.requiredDocuments || []
    });
    setEditingId(s.id);
    setIsEditorOpen(true);
  };

  const handleAddNew = () => {
    setFormData({ 
      title: "", 
      type: "E-Visa", 
      destination: "", 
      price: 0, 
      processingTime: "24h à 48h", 
      conditions: [""], 
      requiredDocuments: ["Scan du Passeport", "Photo d'identité"], 
      active: true 
    });
    setEditingId(null);
    setIsEditorOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.destination || !formData.type) {
      alert("Veuillez remplir le nom, le type et le pays.");
      return;
    }
        
    const cleanConds = (formData.conditions || []).filter(c => c.trim() !== "");
    
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateService(editingId, { ...formData, conditions: cleanConds });
      } else {
        await addService({ 
          ...formData as PrestationService, 
          id: Date.now().toString(),
          conditions: cleanConds
        });
      }
      setIsEditorOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette option de service ?")) {
      await deleteService(id);
    }
  };

  const toggleDoc = (docName: string) => {
    const current = formData.requiredDocuments || [];
    if (current.includes(docName)) {
      setFormData({ ...formData, requiredDocuments: current.filter(d => d !== docName) });
    } else {
      setFormData({ ...formData, requiredDocuments: [...current, docName] });
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Catalogue B2B</h2>
          <p className="text-slate-500 mt-1">Configurez vos services, options et prérequis documentaires par pays.</p>
        </div>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-blue-500/20">
          <Plus className="w-5 h-5 mr-2" /> Nouvelle Option
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input 
            placeholder="Rechercher une option ou un pays..." 
            className="pl-10 h-12 bg-slate-50 border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-64 h-12 bg-slate-50 border-slate-200 font-medium">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Toutes">Toutes les catégories</SelectItem>
            {PREDEFINED_CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(srv => (
          <div key={srv.id} className={\`bg-white rounded-2xl border transition-all duration-300 \${srv.active ? 'border-slate-200 shadow-sm hover:shadow-md' : 'border-slate-200 opacity-60 grayscale'}\`}>
            
            {/* Card Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-start">
              <div>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 mb-2 font-bold">
                  {srv.type}
                </Badge>
                <h3 className="font-black text-lg text-slate-900 leading-tight">{srv.title}</h3>
                <div className="flex items-center gap-1.5 text-slate-500 mt-2 text-sm font-medium">
                  <MapPin className="w-4 h-4" /> {srv.destination}
                </div>
              </div>
              <Switch 
                checked={srv.active}
                onCheckedChange={async (val) => await updateService(srv.id, { active: val })}
              />
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Tarif B2B</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {srv.price.toLocaleString()} <span className="text-sm font-bold text-slate-500">DZD</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Délai</span>
                  <div className="flex items-center gap-1 text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5" /> {srv.processingTime || "-"}
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                 <div className="flex gap-2 items-start">
                   <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                   <p className="text-xs font-medium text-amber-800 line-clamp-2">
                     {srv.conditions && srv.conditions[0] ? srv.conditions[0] : "Aucune condition particulière."}
                   </p>
                 </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2 rounded-b-2xl">
              <Button size="sm" variant="ghost" className="text-slate-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(srv)}>
                <Edit className="w-4 h-4 mr-1.5" /> Configurer
              </Button>
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(srv.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {filteredServices.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <Globe2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">Aucune option trouvée</h3>
            <p>Créez votre première offre B2B pour remplir le catalogue.</p>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      <Dialog open={isEditorOpen} onOpenChange={(o) => !o && setIsEditorOpen(false)}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-slate-50">
          <div className="bg-white border-b border-slate-200 p-6 flex justify-between items-center sticky top-0 z-10 shadow-sm">
            <div>
              <h3 className="text-xl font-black text-slate-900">{editingId ? "Modifier l'option" : "Créer une nouvelle option"}</h3>
              <p className="text-sm text-slate-500 mt-1">Définissez l'offre, le tarif et les documents requis.</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsEditorOpen(false)} className="rounded-full hover:bg-slate-100">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[70vh] space-y-8">
            
            {/* Bloc 1: Base */}
            <section>
              <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                <Settings className="w-4 h-4 text-blue-600" /> 1. Informations de base
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Famille de Service</Label>
                  <Select value={formData.type} onValueChange={(v: any) => setFormData({...formData, type: v})}>
                    <SelectTrigger className="h-12 bg-white border-slate-200">
                      <SelectValue placeholder="Catégorie..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PREDEFINED_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Pays (Destination)</Label>
                  <Input 
                    placeholder="Ex: Turquie, Espagne, Emirats..." 
                    value={formData.destination} 
                    onChange={e => setFormData({...formData, destination: e.target.value})}
                    className="h-12 bg-white border-slate-200 font-bold"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="font-bold text-slate-700">Nom de l'Option (affiché au client)</Label>
                  <Input 
                    placeholder="Ex: E-Visa 30 Jours - Entrée Multiple" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="h-12 bg-white border-slate-200 font-black text-lg text-blue-700 placeholder:font-normal placeholder:text-slate-400"
                  />
                </div>
              </div>
            </section>

            {/* Bloc 2: Pricing */}
            <section>
              <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                <CreditCard className="w-4 h-4 text-emerald-600" /> 2. Tarification & Délais
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Prix B2B (DZD)</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      className="h-14 bg-white border-slate-200 pl-4 pr-16 text-2xl font-black font-mono focus:border-emerald-500 focus:ring-emerald-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <span className="font-bold text-slate-400">DZD</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Délai estimé</Label>
                  <Input 
                    placeholder="Ex: 24h à 48h" 
                    value={formData.processingTime} 
                    onChange={e => setFormData({...formData, processingTime: e.target.value})}
                    className="h-14 bg-white border-slate-200 text-lg font-medium"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label className="font-bold text-slate-700">Conditions (Affichées en gros au client)</Label>
                  <Textarea 
                    placeholder="Ex: Le passeport doit être valide 6 mois. Réponse sous réserve des autorités." 
                    value={formData.conditions?.[0] || ""}
                    onChange={e => setFormData({...formData, conditions: [e.target.value]})}
                    className="bg-white border-slate-200 min-h-[80px]"
                  />
                </div>
              </div>
            </section>

            {/* Bloc 3: Checklist (The Core Engine) */}
            <section>
              <div className="flex justify-between items-end mb-4 border-b border-slate-200 pb-2">
                <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-wider">
                  <List className="w-4 h-4 text-purple-600" /> 3. Documents & Prérequis
                </h4>
                <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded-md">
                  {(formData.requiredDocuments || []).length} Requis
                </span>
              </div>
              
              <p className="text-sm text-slate-600 mb-4 font-medium">
                Cochez les éléments que l'agence <strong className="text-red-600">doit obligatoirement fournir</strong> pour commander cette option.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-inner">
                {DOCUMENT_OPTIONS.map(docOpt => {
                  const isChecked = (formData.requiredDocuments || []).includes(docOpt);
                  return (
                    <div 
                      key={docOpt} 
                      onClick={() => toggleDoc(docOpt)}
                      className={\`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 \${
                        isChecked ? 'bg-purple-50 border-purple-500 text-purple-900' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                      }\`}
                    >
                      <div className={\`w-5 h-5 shrink-0 rounded flex items-center justify-center \${isChecked ? 'bg-purple-600 text-white' : 'bg-white border border-slate-300'}\`}>
                        {isChecked && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <span className={\`text-sm font-bold \${isChecked ? '' : 'font-medium'}\`}>{docOpt}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="bg-white p-6 border-t border-slate-200 flex justify-between items-center rounded-b-lg">
            <div className="flex items-center gap-2">
              <Switch checked={formData.active} onCheckedChange={v => setFormData({...formData, active: v})} />
              <Label className="font-bold text-slate-600 cursor-pointer">Option Active (Visible par les agences)</Label>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsEditorOpen(false)} className="font-bold border-slate-200 h-12 px-6">
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting} className="font-black h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4 mr-2" /> {isSubmitting ? "..." : "Enregistrer l'Option"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Just an icon import fix at the top (missing CreditCard)
// I will patch it immediately
`;

const withCreditCard = content.replace(
  'List, Settings, Save, X', 
  'List, Settings, Save, X, CreditCard'
);

fs.writeFileSync('components/admin/ServiceCatalog.tsx', withCreditCard);
