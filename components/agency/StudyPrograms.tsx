import React, { useState } from 'react';
import { useAppStore, StudyProgram, StudyApplication } from '../../src/store/useAppStore';
import { 
  Search, MapPin, FileText, ChevronRight, GraduationCap, 
  UploadCloud, CheckCircle2, Clock, AlertCircle, Eye, 
  Download, Loader2, ArrowLeft 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent } from '../ui/dialog';
import { auth } from '../../src/firebase';
import { useLanguage } from "../../src/i18n/LanguageContext";
import { uploadFileToServer, downloadFileSafe } from '../../src/utils/fileUpload';
import { DocumentPreviewModal, PreviewDocData } from '../common/DocumentPreviewModal';

export default function StudyPrograms() {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const { studyPrograms, studyApplications, addStudyApplication, agencyBalance } = useAppStore();
  const currentAgencyId = auth.currentUser?.uid || 'unknown';

  const [activeTab, setActiveTab] = useState<'programs' | 'my-applications'>('programs');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedProgram, setSelectedProgram] = useState<StudyProgram | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    studentName: '',
    passportNumber: '',
    email: '',
    phone: ''
  });

  const [documents, setDocuments] = useState<Record<string, string>>({});
  const [uploadedAttachments, setUploadedAttachments] = useState<Record<string, any>>({});
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<PreviewDocData | null>(null);

  const activePrograms = (studyPrograms || []).filter(p => p.status === 'active');
  const filteredPrograms = activePrograms.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dossiers de l'agence connectée
  const myApplications = (studyApplications || []).filter(a => 
    a.agencyId === currentAgencyId || a.agencyName === auth.currentUser?.email
  ).sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());

  const handleFileUpload = async (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(isEn ? "File size cannot exceed 5 MB." : "Le fichier ne doit pas dépasser 5 Mo.");
      return;
    }

    setUploadingDoc(docName);
    try {
      const uploadRes = await uploadFileToServer(file, docName);
      setDocuments(prev => ({ ...prev, [docName]: uploadRes.dataUrl || uploadRes.url }));
      setUploadedAttachments(prev => ({
        ...prev,
        [docName]: {
          id: uploadRes.storageId,
          name: file.name,
          category: docName,
          type: file.type || (file.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/jpeg"),
          size: uploadRes.size,
          dataUrl: uploadRes.dataUrl,
          url: uploadRes.url,
          uploadedAt: new Date().toISOString(),
          uploadedBy: "Agency"
        }
      }));
    } catch (err: any) {
      console.error("Erreur téléversement:", err);
      alert(isEn ? "Failed to upload document." : "Erreur lors du téléversement du document.");
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleApply = async () => {
    if (!selectedProgram) return;
    if (!formData.studentName.trim() || !formData.passportNumber.trim()) {
      alert(isEn ? "Please fill in student name and passport number." : "Veuillez renseigner le nom de l'étudiant et son numéro de passeport.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addStudyApplication({
        programId: selectedProgram.id,
        programTitle: selectedProgram.title,
        agencyId: currentAgencyId,
        agencyName: auth.currentUser?.email || "Mon Agence B2B",
        studentName: formData.studentName.trim(),
        passportNumber: formData.passportNumber.toUpperCase().trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        status: "Pending",
        documents,
        price: selectedProgram.price,
        country: selectedProgram.country,
        attachments: Object.values(uploadedAttachments)
      } as any);

      setSuccess(true);
      setTimeout(() => {
        setIsApplyOpen(false);
        setSuccess(false);
        setFormData({ studentName: '', passportNumber: '', email: '', phone: '' });
        setDocuments({});
        setUploadedAttachments({});
        setActiveTab('my-applications');
      }, 1800);
    } catch (error: any) {
      console.error("Erreur addStudyApplication:", error);
      alert((isEn ? "Submission error: " : "Erreur lors de la soumission : ") + (error.message || "Une erreur est survenue."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved": return <Badge className="bg-emerald-100 text-emerald-700 font-bold border-emerald-200"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {isEn ? "Approved" : "Approuvé"}</Badge>;
      case "Rejected": return <Badge className="bg-rose-100 text-rose-700 font-bold border-rose-200"><AlertCircle className="w-3.5 h-3.5 mr-1" /> {isEn ? "Rejected" : "Rejeté"}</Badge>;
      case "Processing": return <Badge className="bg-blue-100 text-blue-700 font-bold border-blue-200"><Clock className="w-3.5 h-3.5 mr-1" /> {isEn ? "In Progress" : "En cours d'instruction"}</Badge>;
      default: return <Badge className="bg-amber-100 text-amber-800 font-bold border-amber-200"><Clock className="w-3.5 h-3.5 mr-1" /> {isEn ? "Pending" : "En attente"}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Modal de prévisualisation PDF / Images */}
      <DocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#7B1B38] rounded-full"></div>
            {isEn ? "Student Visa & University Admissions" : "Visa Études"}
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">
            {isEn ? "Explore higher education admissions, language stays, and student visa pathways." : "Découvrez nos programmes d'admission universitaire et séjours linguistiques."}
          </p>
        </div>

        {/* Sélecteur d'onglets */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 self-stretch sm:self-auto">
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'programs' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isEn ? "Programs Catalog" : "Programmes d'Études"}
          </button>
          <button
            onClick={() => setActiveTab('my-applications')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'my-applications' 
                ? 'bg-[#7B1B38] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{isEn ? "My Applications" : "Mes Dossiers Étudiants"}</span>
            {myApplications.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'my-applications' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
              }`}>
                {myApplications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ONGLET 1 : CATALOGUE DES PROGRAMMES */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder={isEn ? "Search (country, uni, program...)" : "Rechercher (pays, université, programme...)"} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-slate-200 rounded-2xl text-xs h-11"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map(prog => (
              <div key={prog.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg hover:border-[#7B1B38]/30 transition-all">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={prog.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80"} 
                    alt={prog.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent"></div>
                  <Badge className="absolute top-4 right-4 bg-[#7B1B38] text-white border-none font-black shadow-sm text-xs">
                    {prog.type}
                  </Badge>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-black text-lg leading-tight mb-1">{prog.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-rose-300" /> {prog.university}, {prog.country}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-slate-600 text-xs mb-5 line-clamp-3 leading-relaxed">{prog.description}</p>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <FileText className="w-4 h-4 text-[#7B1B38]" />
                        <span className="text-xs">
                          {prog.requiredDocuments?.length || 0} {isEn ? "required document(s)" : "documents requis"}
                        </span>
                      </div>
                      <div className="font-black text-base text-slate-900 font-mono">{prog.price.toLocaleString()} DZD</div>
                    </div>
                    
                    <Button 
                      className="w-full bg-[#7B1B38] hover:bg-[#63142c] text-white font-black text-xs h-12 rounded-xl transition-colors group/btn shadow-md shadow-[#7B1B38]/20"
                      onClick={() => {
                        setSelectedProgram(prog);
                        setDocuments({});
                        setUploadedAttachments({});
                        setIsApplyOpen(true);
                      }}
                    >
                      {isEn ? "Apply for Student Visa" : "Déposer un dossier d'études"}
                      <ChevronRight className="w-4 h-4 ml-1.5 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredPrograms.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <GraduationCap className="w-14 h-14 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  {isEn ? "No programs available" : "Aucun programme disponible"}
                </h3>
                <p className="text-slate-500 text-xs max-w-md mx-auto">
                  {isEn ? "No study program matches your search or is currently open." : "Aucun programme d'études ne correspond à votre recherche."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ONGLET 2 : MES CANDIDATURES ÉTUDIANTES */}
      {activeTab === 'my-applications' && (
        <div className="space-y-6">
          {myApplications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <GraduationCap className="w-14 h-14 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">{isEn ? "No study applications yet" : "Aucun dossier étudiant déposé"}</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                {isEn ? "Select an academic program from the catalog to submit your student's visa application." : "Choisissez un programme dans le catalogue pour déposer le dossier d'admission de votre étudiant."}
              </p>
              <Button onClick={() => setActiveTab('programs')} className="bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-xs h-10 px-6 rounded-xl">
                {isEn ? "Browse Programs" : "Parcourir les programmes"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myApplications.map(app => (
                <div key={app.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:border-[#7B1B38]/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className="font-mono text-xs font-bold text-slate-400">Réf: {app.id}</span>
                      {getStatusBadge(app.status)}
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-0.5">
                      {app.studentName}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mb-4">
                      {isEn ? "Passport: " : "Passeport : "}<span className="font-mono text-slate-800">{app.passportNumber}</span>
                    </p>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 mb-4 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">{isEn ? "Program" : "Programme"} :</span>
                        <span className="font-bold text-slate-800 text-right">{app.programTitle}</span>
                      </div>
                      {app.email && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Email :</span>
                          <span className="font-bold text-slate-800">{app.email}</span>
                        </div>
                      )}
                      {app.phone && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">{isEn ? "Phone" : "Téléphone"} :</span>
                          <span className="font-bold text-slate-800">{app.phone}</span>
                        </div>
                      )}

                      {/* Pièces jointes fournies */}
                      {app.documents && Object.keys(app.documents).length > 0 && (
                        <div className="pt-2 border-t border-slate-200/60">
                          <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                            {isEn ? "Uploaded Supporting Documents:" : "Pièces justificatives transmises :"}
                          </span>
                          <div className="space-y-1.5">
                            {Object.entries(app.documents).map(([docKey, docVal]) => {
                              const isPdf = typeof docVal === "string" && (docVal.startsWith("data:application/pdf") || docVal.toLowerCase().endsWith(".pdf"));

                              return (
                                <div key={docKey} className="bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                                  <span className="text-[11px] font-semibold text-slate-700 truncate">{docKey}</span>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setPreviewDoc({ src: docVal, title: docKey, type: isPdf ? 'application/pdf' : 'image/jpeg' })}
                                      className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 rounded-lg"
                                      title="Aperçu"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => downloadFileSafe(docVal, `${docKey}.${isPdf ? 'pdf' : 'jpg'}`)}
                                      className="h-7 px-2 text-[10px] font-bold rounded-lg border-slate-300"
                                    >
                                      <Download className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">{new Date(app.submissionDate).toLocaleDateString()}</span>
                    <span className="font-black text-[#7B1B38] text-sm font-mono">
                      {app.price?.toLocaleString()} DZD
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL DE DÉPÔT DE CANDIDATURE */}
      <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl md:max-w-3xl bg-white p-0 max-h-[92vh] overflow-hidden rounded-3xl flex flex-col">
          {success ? (
            <div className="py-20 flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5 animate-in zoom-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                {isEn ? "Application Submitted Successfully!" : "Dossier Études soumis avec succès !"}
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                {isEn 
                  ? "Your application has been registered and is now available in your central dossier list and with the administration." 
                  : "Votre dossier a été enregistré et apparaît désormais dans votre liste générale des demandes ainsi qu'auprès de l'administration."}
              </p>
            </div>
          ) : (
            selectedProgram && (
              <>
                <div className="h-40 relative shrink-0"> 
                   <img src={selectedProgram.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" alt="Cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end p-5">
                      <div>
                        <h2 className="text-white font-black text-xl mb-1">{selectedProgram.title}</h2>
                        <p className="text-rose-100 flex items-center gap-1.5 text-xs font-semibold">
                          <MapPin className="w-4 h-4"/> {selectedProgram.university}, {selectedProgram.country}
                        </p>
                      </div>
                   </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                  
                  {/* Coordonnées étudiant */}
                  <div className="space-y-4">
                    <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#7B1B38]" /> {isEn ? "Student Information" : "1. Coordonnées de l'Étudiant"}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          {isEn ? "Full Student Name *" : "Nom & Prénom de l'étudiant *"}
                        </label>
                        <Input 
                          required 
                          className="h-11 bg-slate-50 rounded-xl text-xs" 
                          value={formData.studentName} 
                          onChange={e => setFormData({...formData, studentName: e.target.value})} 
                          placeholder="Ex: BENALI Amine" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          {isEn ? "Passport Number *" : "Numéro de Passeport *"}
                        </label>
                        <Input 
                          required 
                          className="h-11 bg-slate-50 rounded-xl text-xs font-mono font-bold" 
                          value={formData.passportNumber} 
                          onChange={e => setFormData({...formData, passportNumber: e.target.value})} 
                          placeholder="Ex: 210000000" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          {isEn ? "Contact Phone" : "Téléphone de contact"}
                        </label>
                        <Input 
                          className="h-11 bg-slate-50 rounded-xl text-xs" 
                          value={formData.phone} 
                          onChange={e => setFormData({...formData, phone: e.target.value})} 
                          placeholder="Ex: 0550 00 00 00" 
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          {isEn ? "Contact Email" : "Adresse Email de l'étudiant"}
                        </label>
                        <Input 
                          type="email" 
                          className="h-11 bg-slate-50 rounded-xl text-xs" 
                          value={formData.email} 
                          onChange={e => setFormData({...formData, email: e.target.value})} 
                          placeholder="etudiant@domaine.com" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Documents requis */}
                  {selectedProgram.requiredDocuments && selectedProgram.requiredDocuments.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#7B1B38]" /> {isEn ? "Required Documents" : "2. Pièces Justificatives Requises"}
                        </h3>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {Object.keys(uploadedAttachments).length} / {selectedProgram.requiredDocuments.length} {isEn ? "uploaded" : "téléversés"}
                        </span>
                      </div>
                      
                      <div className="space-y-2.5">
                        {selectedProgram.requiredDocuments.map((docName, idx) => {
                          const isUploaded = !!uploadedAttachments[docName];
                          const isUploadingThis = uploadingDoc === docName;

                          return (
                            <div key={idx} className={`p-3.5 border rounded-2xl flex items-center justify-between gap-3 transition-colors ${
                              isUploaded ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'
                            }`}>
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                  isUploaded ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                                }`}>
                                  {isUploaded ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                </div>
                                <div className="overflow-hidden">
                                  <span className={`text-xs font-bold block truncate ${isUploaded ? 'text-emerald-950' : 'text-slate-800'}`}>
                                    {docName} *
                                  </span>
                                  <span className="text-[10px] text-slate-400 block">PDF, JPG, PNG (Max 5 Mo)</span>
                                </div>
                              </div>

                              <div className="relative shrink-0">
                                <input 
                                  type="file" 
                                  accept="image/jpeg,image/png,image/webp,application/pdf"
                                  disabled={isUploadingThis}
                                  onChange={(e) => handleFileUpload(docName, e)} 
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" 
                                />
                                <Button 
                                  type="button"
                                  size="sm"
                                  variant={isUploaded ? "outline" : "default"}
                                  disabled={isUploadingThis}
                                  className={`text-xs font-bold h-9 px-3 rounded-xl gap-1.5 pointer-events-none ${
                                    isUploaded 
                                      ? 'border-emerald-300 text-emerald-800 bg-emerald-50' 
                                      : 'bg-[#7B1B38] hover:bg-[#63142c] text-white'
                                  }`}
                                >
                                  {isUploadingThis ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      <span>Téléversement...</span>
                                    </>
                                  ) : isUploaded ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Remplacer</span>
                                    </>
                                  ) : (
                                    <>
                                      <UploadCloud className="w-3.5 h-3.5" />
                                      <span>Téléverser</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Facturation et validation */}
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="bg-slate-900 p-5 rounded-2xl text-white flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Frais de dossier B2B</span>
                        <span className="text-xs text-rose-200">Facturé sur votre compte agence</span>
                      </div>
                      <span className="font-black text-2xl font-mono text-white">
                        {selectedProgram.price.toLocaleString()} DZD
                      </span>
                    </div>

                    <Button 
                      onClick={handleApply} 
                      disabled={isSubmitting || !formData.studentName.trim() || !formData.passportNumber.trim() || (selectedProgram.requiredDocuments && selectedProgram.requiredDocuments.length > 0 && Object.keys(uploadedAttachments).length < selectedProgram.requiredDocuments.length)}
                      className="w-full bg-[#7B1B38] hover:bg-[#63142c] text-white font-black h-13 rounded-xl text-sm shadow-md shadow-[#7B1B38]/20 gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Transmission du dossier à l'administration...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirmer et soumettre la candidature</span>
                        </>
                      )}
                    </Button>
                  </div>

                </div>
              </>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
