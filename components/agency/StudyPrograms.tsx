import React, { useState } from 'react';
import { useAppStore, StudyProgram } from '../../src/store/useAppStore';
import { Search, MapPin, FileText, ChevronRight, GraduationCap, UploadCloud, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { auth } from '../../src/firebase';

export default function StudyPrograms() {
  const { studyPrograms, addStudyApplication, agencyBalance } = useAppStore();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const activePrograms = studyPrograms.filter(p => p.status === 'active');
  const filteredPrograms = activePrograms.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments(prev => ({ ...prev, [docName]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = async () => {
    if (!selectedProgram) return;
    if (!formData.studentName || !formData.passportNumber) return;
    if (agencyBalance < selectedProgram.price) {
      alert("Solde insuffisant pour cette opération.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addStudyApplication({
        programId: selectedProgram.id,
        programTitle: selectedProgram.title,
        agencyId: auth.currentUser?.uid || 'unknown',
        agencyName: "Mon Agence", // Should be real agency name from context
        studentName: formData.studentName,
        passportNumber: formData.passportNumber,
        email: formData.email,
        phone: formData.phone,
        status: "Pending",
        documents,
        price: selectedProgram.price
      });
      setSuccess(true);
      setTimeout(() => {
        setIsApplyOpen(false);
        setSuccess(false);
        setFormData({ studentName: '', passportNumber: '', email: '', phone: '' });
        setDocuments({});
      }, 2000);
    } catch (error) {
      alert("Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Visa Études</h1>
          <p className="text-slate-500 font-medium">Découvrez nos programmes d'admission universitaire et séjours linguistiques.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Rechercher (pays, uni...)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-50 border-slate-200 rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map(prog => (
          <div key={prog.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
            <div className="h-48 relative overflow-hidden">
              <img src={prog.image} alt={prog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
              <Badge className="absolute top-4 right-4 bg-blue-600/90 text-white border-none font-bold shadow-sm backdrop-blur-sm">
                {prog.type}
              </Badge>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-black text-xl leading-tight mb-1">{prog.title}</h3>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                  <MapPin className="w-3 h-3" /> {prog.university}, {prog.country}
                </div>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-slate-600 text-sm mb-6 line-clamp-3">{prog.description}</p>
              
              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{prog.requiredDocuments?.length || 0} documents requis</span>
                  </div>
                  <div className="font-black text-lg text-slate-900">{prog.price.toLocaleString()} DZD</div>
                </div>
                
                <Button 
                  className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold h-12 rounded-xl transition-colors group/btn"
                  onClick={() => {
                    setSelectedProgram(prog);
                    setIsApplyOpen(true);
                  }}
                >
                  Déposer un dossier
                  <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {filteredPrograms.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
            <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 mb-2">Aucun programme disponible</h3>
            <p className="text-slate-500 max-w-md mx-auto">Aucun programme d'études ne correspond à votre recherche ou aucun n'est actuellement ouvert.</p>
          </div>
        )}
      </div>

      <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
        <DialogContent className="w-[95vw] sm:max-w-3xl md:max-w-4xl bg-white p-0 max-h-[95vh] overflow-hidden rounded-2xl flex flex-col">
          {success ? (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">Dossier soumis avec succès !</h3>
              <p className="text-slate-500 font-medium text-lg">L'administration va examiner les documents.</p>
              <Button onClick={() => {setIsApplyOpen(false); setSuccess(false);}} className="mt-8 bg-slate-900 text-white hover:bg-slate-800 font-bold h-12 px-8 rounded-xl">Fermer</Button>
            </div>
          ) : (
            selectedProgram && (
              <>
                <div className="h-48 relative shrink-0"> 
                   <img src={selectedProgram.image} className="w-full h-full object-cover" alt="Cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                      <div>
                        <h2 className="text-white font-black text-3xl mb-2">{selectedProgram.title}</h2>
                        <p className="text-blue-100 flex items-center gap-2 font-medium text-lg"><MapPin className="w-5 h-5"/> {selectedProgram.university}, {selectedProgram.country}</p>
                      </div>
                   </div>
                </div>
                
                <div className="flex-1 overflow-y-auto min-h-0">
                  <div className="p-4 sm:p-6 md:p-8">
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-blue-500"/> Détails du Programme</h3>
                      <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {selectedProgram.description || "Aucune description fournie pour ce programme."}
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-100 pt-8 mt-8">
                      <h3 className="font-black text-slate-800 mb-6 text-xl tracking-tight">1. Informations de l'étudiant</h3>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                          <label className="text-sm font-bold text-slate-700 block mb-2">Nom complet de l'étudiant <span className="text-red-500">*</span></label>
                          <Input className="h-12 bg-white border-slate-200" value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} placeholder="Ex: Jean Dupont" />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-700 block mb-2">Numéro de passeport <span className="text-red-500">*</span></label>
                          <Input className="h-12 bg-white border-slate-200" value={formData.passportNumber} onChange={e => setFormData({...formData, passportNumber: e.target.value})} placeholder="Ex: 123456789" />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-700 block mb-2">Email de contact</label>
                          <Input type="email" className="h-12 bg-white border-slate-200" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Ex: jean@email.com" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-bold text-slate-700 block mb-2">Téléphone</label>
                          <Input className="h-12 bg-white border-slate-200" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Ex: +213..." />
                        </div>
                      </div>
                    </div>
                    
                    {selectedProgram.requiredDocuments && selectedProgram.requiredDocuments.length > 0 && (
                      <div className="border-t border-slate-100 pt-8 mt-8">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-black text-slate-800 text-xl tracking-tight">2. Documents Requis</h3>
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                            {Object.keys(documents).length} / {selectedProgram.requiredDocuments.length} fournis
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          {selectedProgram.requiredDocuments.map((doc, idx) => {
                            const isUploaded = !!documents[doc];
                            return (
                              <div key={idx} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 border rounded-2xl gap-4 transition-colors ${isUploaded ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-200 shadow-sm'}`}>
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${isUploaded ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-100 text-slate-400'}`}>
                                    {isUploaded ? <CheckCircle2 className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                  </div>
                                  <div>
                                    <div className={`font-bold ${isUploaded ? 'text-emerald-900' : 'text-slate-700'}`}>
                                      {doc} <span className="text-red-500">*</span>
                                    </div>
                                    <div className="text-xs font-medium text-slate-400 mt-0.5">Format PDF ou Image</div>
                                  </div>
                                </div>
                                <div className="relative shrink-0 sm:w-auto w-full">
                                  <Input type="file" onChange={(e) => handleFileUpload(doc, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                  <Button variant="outline" className={`w-full sm:w-auto h-11 font-bold ${isUploaded ? 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100' : 'border-slate-300 hover:bg-slate-50 text-slate-700'}`}>
                                    <UploadCloud className="w-4 h-4 mr-2" /> {isUploaded ? 'Remplacer le fichier' : 'Téléverser'}
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <div className="bg-blue-900 p-6 rounded-2xl mb-6 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                          <GraduationCap className="w-32 h-32 text-white" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex justify-between items-center text-blue-100 mb-2">
                            <span className="font-medium">Coût du dossier B2B</span>
                            <span className="font-bold">{selectedProgram.price.toLocaleString()} DZD</span>
                          </div>
                          <div className="border-t border-blue-700/50 pt-4 mt-2 flex justify-between items-end">
                            <div>
                              <span className="text-blue-200 text-sm font-bold uppercase tracking-wider block mb-1">Total B2B (à payer)</span>
                              <span className="text-xs text-blue-300">Aucun débit immédiat</span>
                            </div>
                            <span className="font-black text-3xl text-white">{selectedProgram.price.toLocaleString()} DZD</span>
                          </div>
                        </div>
                      </div>
                      {(!formData.studentName || !formData.passportNumber || ((selectedProgram.requiredDocuments?.length || 0) !== Object.keys(documents).length)) && (
                        <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-start gap-2 border border-red-100">
                          <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">!</span>
                          <div>
                            Veuillez remplir les informations obligatoires pour continuer :
                            <ul className="list-disc ml-5 mt-1 font-medium">
                              {!formData.studentName && <li>Nom complet de l'étudiant</li>}
                              {!formData.passportNumber && <li>Numéro de passeport</li>}
                              {((selectedProgram.requiredDocuments?.length || 0) !== Object.keys(documents).length) && <li>Tous les documents requis ({Object.keys(documents).length}/{selectedProgram.requiredDocuments?.length})</li>}
                            </ul>
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        onClick={handleApply} 
                        disabled={isSubmitting || !formData.studentName || !formData.passportNumber || ((selectedProgram.requiredDocuments?.length || 0) !== Object.keys(documents).length)}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black h-14 rounded-xl text-lg shadow-emerald-500/20 shadow-lg transition-all hover:-translate-y-0.5 whitespace-normal leading-tight disabled:bg-slate-300 disabled:shadow-none disabled:transform-none"
                      >
                        {isSubmitting ? 'Traitement en cours...' : 'Confirmer et soumettre le dossier'}
                      </Button>
                      <p className="text-xs text-slate-400 mt-4 text-center font-medium">Votre dossier sera étudié par l'administrateur. Vous serez notifié du statut.</p>
                    </div>

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
