import React, { useState } from 'react';
import { useAppStore, StudyProgram, StudyApplication } from '../../src/store/useAppStore';
import { Plus, Edit, Trash2, MapPin, DollarSign, Search, Image as ImageIcon, GraduationCap, FileText, CheckCircle, Clock, XCircle, File, Settings, CreditCard, List, CheckCircle2, Save, X, Eye, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useLanguage } from '../../src/i18n/LanguageContext';
import { DocumentPreviewModal, PreviewDocData } from '../common/DocumentPreviewModal';
import { resolveAttachmentData, downloadFileSafe } from '../../src/utils/fileUpload';

const DOCUMENT_OPTIONS = [
  "Scan du Passeport",
  "Photo d'identité",
  "Diplôme le plus récent",
  "Relevé de notes",
  "Lettre de motivation",
  "Lettre de recommandation",
  "Curriculum Vitae (CV)",
  "Test de langue (IELTS/TCF...)",
  "Extrait de naissance"
];

export default function StudyProgramsManagement() {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const { studyPrograms, studyApplications, addStudyProgram, updateStudyProgram, deleteStudyProgram, updateStudyApplicationStatus } = useAppStore();
  const [activeTab, setActiveTab] = useState<'programs' | 'applications'>('programs');
  
  // Programs State
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProgId, setEditingProgId] = useState<string | null>(null);
  
  const [newProgram, setNewProgram] = useState<Partial<StudyProgram>>({
    title: '', country: '', university: '', type: 'Bachelor', description: '', price: 0, requiredDocuments: [], status: 'active', image: ''
  });
  const [newDocReq, setNewDocReq] = useState('');
  const [formError, setFormError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Applications State
  const [appSearchTerm, setAppSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<StudyApplication | null>(null);
  const [isAppDetailsOpen, setIsAppDetailsOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<PreviewDocData | null>(null);
  const [resolvingDocName, setResolvingDocName] = useState<string | null>(null);

  const handleOpenDoc = async (docName: string, rawUrl: string) => {
    setResolvingDocName(docName);
    try {
      const resolved = await resolveAttachmentData(rawUrl);
      const isPdf = resolved.startsWith('data:application/pdf') || docName.toLowerCase().endsWith('.pdf');
      setPreviewDoc({
        src: resolved,
        title: docName,
        type: isPdf ? 'application/pdf' : 'image/jpeg'
      });
    } catch (e) {
      console.error("Erreur ouverture doc:", e);
    } finally {
      setResolvingDocName(null);
    }
  };

  const handleDownloadDoc = async (docName: string, rawUrl: string) => {
    setResolvingDocName(docName);
    try {
      const resolved = await resolveAttachmentData(rawUrl);
      const ext = (resolved.startsWith('data:application/pdf') || docName.toLowerCase().endsWith('.pdf')) ? '.pdf' : '.jpg';
      const safeName = docName.endsWith(ext) ? docName : `${docName}${ext}`;
      downloadFileSafe(resolved, safeName);
    } catch (e) {
      console.error("Erreur téléchargement doc:", e);
    } finally {
      setResolvingDocName(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          setNewProgram(prev => ({ ...prev, image: canvas.toDataURL('image/jpeg', 0.7) }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDocReq = () => {
    if (newDocReq.trim()) {
      setNewProgram(prev => ({
        ...prev,
        requiredDocuments: [...(prev.requiredDocuments || []), newDocReq.trim()]
      }));
      setNewDocReq('');
    }
  };

  const handleRemoveDocReq = (index: number) => {
    setNewProgram(prev => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments?.filter((_, i) => i !== index)
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveProgram = async () => {
    setFormError('');
    if (!newProgram.title || !newProgram.country || !newProgram.university || newProgram.price === undefined) {
      setFormError("Veuillez remplir les champs obligatoires (Titre, Pays, Université, Prix).");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const progData = {
        title: newProgram.title,
        country: newProgram.country,
        university: newProgram.university,
        type: newProgram.type || 'Bachelor',
        description: newProgram.description || '',
        price: Number(newProgram.price),
        requiredDocuments: newProgram.requiredDocuments || [],
        image: newProgram.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80',
        status: newProgram.status as 'active' | 'draft'
      };
      
      if (editingProgId) {
        await updateStudyProgram(editingProgId, progData);
      } else {
        await addStudyProgram(progData as any);
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsAddOpen(false);
        setEditingProgId(null);
        setNewProgram({ title: '', country: '', university: '', type: 'Bachelor', description: '', price: 0, requiredDocuments: [], status: 'active', image: '' });
      }, 1500);
      
    } catch (error) {
      console.error(error);
      setFormError("Erreur lors de l'enregistrement du programme.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (prog: StudyProgram) => {
    setEditingProgId(prog.id);
    setNewProgram({
      title: prog.title,
      country: prog.country,
      university: prog.university,
      type: prog.type,
      description: prog.description,
      price: prog.price,
      requiredDocuments: prog.requiredDocuments || [],
      status: prog.status,
      image: prog.image
    });
    setIsAddOpen(true);
  };

  const handleDeleteProgram = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) {
      deleteStudyProgram(id);
    }
  };

  const filteredPrograms = studyPrograms.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApplications = studyApplications.filter(a =>
    a.studentName.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
    a.agencyName.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
    a.passportNumber.toLowerCase().includes(appSearchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved': return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"><CheckCircle className="w-3 h-3 mr-1"/> {isEn ? "Approved" : "Approuvé"}</Badge>;
      case 'Rejected': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1"/> {isEn ? "Rejected" : "Rejeté"}</Badge>;
      case 'Processing': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Clock className="w-3 h-3 mr-1"/> {isEn ? "Processing" : "En traitement"}</Badge>;
      case 'ActionRequired': return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{isEn ? "Action Required" : "Action Requise"}</Badge>;
      default: return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">{isEn ? "Pending" : "En attente"}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isEn ? "Study Programs & Student Visas" : "Visa Études"}
          </h2>
          <p className="text-slate-500 font-medium">
            {isEn ? "Manage study catalog and international student applications." : "Gérez le catalogue des programmes et les dossiers étudiants."}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-xl w-max">
        <button
          onClick={() => setActiveTab('programs')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'programs' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          {isEn ? "Study Programs" : "Programmes d'Études"}
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'applications' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          {isEn ? "Student Applications" : "Dossiers Étudiants"} ({studyApplications.filter(a => a.status === 'Pending' || a.status === 'Processing').length})
        </button>
      </div>

      {activeTab === 'programs' && (
        <div className="space-y-6">
          <div className="flex justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder={isEn ? "Search a program..." : "Rechercher un programme..."} 
                className="pl-9 bg-white"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold" onClick={() => {
              setEditingProgId(null);
              setNewProgram({ title: '', country: '', university: '', type: 'Bachelor', description: '', price: 0, requiredDocuments: [], status: 'active', image: '' });
              setIsAddOpen(true);
            }}>
              <Plus className="w-4 h-4 mr-2" /> {isEn ? "New Program" : "Nouveau Programme"}
            </Button>
            <Dialog open={isAddOpen} onOpenChange={(o) => !o && setIsAddOpen(false)}>
              <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-slate-50">
                <div className="bg-white border-b border-slate-200 p-6 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      {editingProgId 
                        ? (isEn ? "Modify Study Program" : "Modifier le programme") 
                        : (isEn ? "New Study Program" : "Nouveau Programme d'Études")}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {isEn ? "Configure university, tuition pricing and required documents." : "Définissez l'université, le tarif et les documents requis."}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsAddOpen(false)} className="rounded-full hover:bg-slate-100">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[70vh] space-y-8">
                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
                      <XCircle className="w-5 h-5 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-sm">Erreur</p>
                        <p className="text-sm">{formError}</p>
                      </div>
                    </div>
                  )}
                  {showSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-sm">Succès</p>
                        <p className="text-sm">Le programme a été enregistré avec succès.</p>
                      </div>
                    </div>
                  )}

                  {/* Bloc 1: Base */}
                  <section>
                    <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                      <Settings className="w-4 h-4 text-blue-600" /> 1. Informations de base
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Titre du Programme</Label>
                        <Input placeholder="Ex: Admission Universitaire" value={newProgram.title} onChange={e => setNewProgram({...newProgram, title: e.target.value})} className="h-12 bg-white border-slate-200 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Type d'Étude</Label>
                        <Select value={newProgram.type} onValueChange={(v: any) => setNewProgram({...newProgram, type: v})}>
                          <SelectTrigger className="h-12 bg-white border-slate-200"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Bachelor">Licence / Bachelor</SelectItem>
                            <SelectItem value="Master">Master</SelectItem>
                            <SelectItem value="PhD">Doctorat / PhD</SelectItem>
                            <SelectItem value="Language">Séjour Linguistique</SelectItem>
                            <SelectItem value="Other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Université / École</Label>
                        <Input placeholder="Ex: Université de Montréal" value={newProgram.university} onChange={e => setNewProgram({...newProgram, university: e.target.value})} className="h-12 bg-white border-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Pays / Destination</Label>
                        <Input placeholder="Ex: Canada" value={newProgram.country} onChange={e => setNewProgram({...newProgram, country: e.target.value})} className="h-12 bg-white border-slate-200" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="font-bold text-slate-700">Description</Label>
                        <Textarea placeholder="Détails du programme..." value={newProgram.description} onChange={e => setNewProgram({...newProgram, description: e.target.value})} rows={3} className="bg-white border-slate-200 min-h-[80px]" />
                      </div>
                    </div>
                  </section>

                  {/* Bloc 2: Tarification & Média */}
                  <section>
                    <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" /> 2. Tarification & Média
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Prix Agence (DZD)</Label>
                        <div className="relative">
                          <Input type="number" placeholder="0" value={newProgram.price || ''} onChange={e => setNewProgram({...newProgram, price: Number(e.target.value)})} className="h-14 bg-white border-slate-200 pl-4 pr-16 text-2xl font-black font-mono focus:border-emerald-500 focus:ring-emerald-500" />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <span className="font-bold text-slate-400">DZD</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Image (Upload ou URL)</Label>
                        <div className="flex items-center gap-4 mt-1">
                          {newProgram.image && (
                            <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                              <img src={newProgram.image} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 relative">
                            <Input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <div className="flex flex-col items-center justify-center h-14 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                              <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-slate-400" /> Importer
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Bloc 3: Documents Requis */}
                  <section>
                    <div className="flex justify-between items-end mb-4 border-b border-slate-200 pb-2">
                      <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-wider">
                        <List className="w-4 h-4 text-purple-600" /> 3. Documents & Prérequis
                      </h4>
                      <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded-md">
                        {(newProgram.requiredDocuments || []).length} Requis
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-4 font-medium">
                      Cochez les éléments que l'agence <strong className="text-red-600">doit obligatoirement fournir</strong> pour commander ce programme.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-inner mb-4">
                      {DOCUMENT_OPTIONS.map(docOpt => {
                        const isChecked = (newProgram.requiredDocuments || []).includes(docOpt);
                        return (
                          <div 
                            key={docOpt} 
                            onClick={() => {
                              const current = newProgram.requiredDocuments || [];
                              if (current.includes(docOpt)) {
                                setNewProgram({...newProgram, requiredDocuments: current.filter(d => d !== docOpt)});
                              } else {
                                setNewProgram({...newProgram, requiredDocuments: [...current, docOpt]});
                              }
                            }}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${
                              isChecked ? 'bg-purple-50 border-purple-500 text-purple-900' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <div className={`w-5 h-5 shrink-0 rounded flex items-center justify-center ${isChecked ? 'bg-purple-600 text-white' : 'bg-white border border-slate-300'}`}>
                              {isChecked && <CheckCircle2 className="w-4 h-4" />}
                            </div>
                            <span className={`text-sm font-bold ${isChecked ? '' : 'font-medium'}`}>{docOpt}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input placeholder="Ajouter un autre document requis..." value={newDocReq} onChange={e => setNewDocReq(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { handleAddDocReq(); e.preventDefault(); } }} className="h-12 bg-white border-slate-200" />
                      <Button type="button" variant="secondary" onClick={handleAddDocReq} className="h-12 font-bold px-6">Ajouter</Button>
                    </div>
                    
                    {/* Affichage des documents personnalisés */}
                    {(newProgram.requiredDocuments || []).filter(doc => !DOCUMENT_OPTIONS.includes(doc)).length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(newProgram.requiredDocuments || []).filter(doc => !DOCUMENT_OPTIONS.includes(doc)).map(doc => (
                          <Badge key={doc} variant="secondary" className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 py-1.5 px-3">
                            {doc}
                            <button onClick={() => {
                              const idx = newProgram.requiredDocuments?.indexOf(doc);
                              if (idx !== undefined && idx !== -1) handleRemoveDocReq(idx);
                            }} className="ml-1 hover:text-red-500"><XCircle className="w-3.5 h-3.5" /></button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </section>
                </div>

                <div className="bg-white p-6 border-t border-slate-200 flex justify-between items-center rounded-b-lg">
                  <div className="flex items-center gap-2">
                    <Switch checked={newProgram.status === 'active'} onCheckedChange={v => setNewProgram({...newProgram, status: v ? 'active' : 'draft'})} />
                    <Label className="font-bold text-slate-600 cursor-pointer">Programme Actif (Visible par les agences)</Label>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setIsAddOpen(false)} className="font-bold border-slate-200 h-12 px-6">
                      Annuler
                    </Button>
                    <Button onClick={handleSaveProgram} disabled={isSubmitting} className="font-black h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white">
                      <Save className="w-4 h-4 mr-2" /> {isSubmitting ? "..." : (editingProgId ? "Enregistrer" : "Créer le programme")}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((prog) => (
              <div key={prog.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group">
                <div className="h-40 relative">
                  <img src={prog.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80'} alt={prog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <Badge className={`absolute top-3 right-3 font-bold ${prog.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}`}>
                    {prog.status === 'active' ? 'Actif' : 'Brouillon'}
                  </Badge>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-black text-lg truncate drop-shadow-md">{prog.title}</h3>
                    <div className="flex items-center gap-2 text-sm font-medium opacity-90">
                      <MapPin className="w-3 h-3" /> {prog.university}, {prog.country}
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-bold">{prog.type}</Badge>
                    <div className="font-black text-lg text-slate-900">{prog.price.toLocaleString()} DZD</div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                    <FileText className="w-4 h-4" /> {prog.requiredDocuments?.length || 0} documents requis
                  </div>
                  
                  <div className="mt-auto flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(prog)}>
                      <Edit className="w-4 h-4 mr-2" /> Modifier
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteProgram(prog.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredPrograms.length === 0 && (
              <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">Aucun programme</h3>
                <p className="text-slate-500">Créez votre premier programme d'études.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Rechercher (nom, agence, passeport)..." 
                className="pl-9 bg-white"
                value={appSearchTerm}
                onChange={e => setAppSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase">Étudiant</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase">Programme</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase">Agence</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase">Statut</th>
                    <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{app.studentName}</div>
                        <div className="text-sm text-slate-500">{app.passportNumber}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-800">{app.programTitle || 'Programme'}</div>
                        <div className="text-xs text-slate-500">{new Date(app.submissionDate).toLocaleDateString()}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-900">{app.agencyName}</div>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="font-bold text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                          onClick={() => { setSelectedApp(app); setIsAppDetailsOpen(true); }}
                        >
                          Traiter
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredApplications.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">Aucun dossier trouvé.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isAppDetailsOpen} onOpenChange={setIsAppDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-6 border-b border-slate-100 bg-slate-50 shrink-0">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl font-black text-slate-900">Dossier Étudiant : {selectedApp?.studentName}</DialogTitle>
                <p className="text-slate-500 font-medium mt-1">Programme : {selectedApp?.programTitle}</p>
              </div>
              {selectedApp && getStatusBadge(selectedApp.status)}
            </div>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-6 bg-white">
            {selectedApp && (
              <div className="space-y-8">
                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => updateStudyApplicationStatus(selectedApp.id, "Processing")} className="font-bold text-blue-700 bg-blue-50 border-blue-200">En traitement</Button>
                  <Button variant="outline" onClick={() => updateStudyApplicationStatus(selectedApp.id, "ActionRequired")} className="font-bold text-amber-700 bg-amber-50 border-amber-200">Action Requise</Button>
                  <Button variant="outline" onClick={() => updateStudyApplicationStatus(selectedApp.id, "Approved")} className="font-bold text-emerald-700 bg-emerald-50 border-emerald-200">Approuver</Button>
                  <Button variant="outline" onClick={() => updateStudyApplicationStatus(selectedApp.id, "Rejected")} className="font-bold text-red-700 bg-red-50 border-red-200">Rejeter</Button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Informations Candidat</h4>
                    <div className="space-y-3">
                      <div><span className="text-sm text-slate-500">Nom Complet:</span> <span className="font-semibold text-slate-900">{selectedApp.studentName}</span></div>
                      <div><span className="text-sm text-slate-500">Passeport:</span> <span className="font-semibold text-slate-900">{selectedApp.passportNumber}</span></div>
                      <div><span className="text-sm text-slate-500">Email:</span> <span className="font-semibold text-slate-900">{selectedApp.email}</span></div>
                      <div><span className="text-sm text-slate-500">Téléphone:</span> <span className="font-semibold text-slate-900">{selectedApp.phone}</span></div>
                      <div><span className="text-sm text-slate-500">Agence:</span> <span className="font-semibold text-slate-900">{selectedApp.agencyName}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Documents Fournis</h4>
                    <div className="space-y-3">
                      {Object.entries(selectedApp.documents || {}).map(([docName, docUrl]) => {
                        const isResolving = resolvingDocName === docName;
                        return (
                          <div key={docName} className="flex justify-between items-center p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-colors">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 min-w-0 pr-2">
                              <File className="w-4 h-4 text-blue-600 shrink-0" />
                              <span className="truncate">{docName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={isResolving}
                                onClick={() => handleOpenDoc(docName, docUrl)}
                                className="h-8 px-2.5 text-xs font-bold text-blue-700 border-blue-200 bg-blue-50/50 hover:bg-blue-100"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1" />
                                {isResolving ? "..." : "Aperçu"}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                disabled={isResolving}
                                onClick={() => handleDownloadDoc(docName, docUrl)}
                                className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                                title="Télécharger le fichier"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                      {(!selectedApp.documents || Object.keys(selectedApp.documents).length === 0) && (
                        <div className="text-sm text-slate-500 italic p-3 bg-slate-50 rounded-xl">Aucun document téléversé.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Modal universel de prévisualisation PDF / Image */}
      <DocumentPreviewModal 
        doc={previewDoc} 
        onClose={() => setPreviewDoc(null)} 
      />

    </div>
  );
}
