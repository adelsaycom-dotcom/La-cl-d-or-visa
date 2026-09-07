import re

with open('components/agency/StudyPrograms.tsx', 'r') as f:
    content = f.read()

new_dialog = """        <DialogContent className="w-[95vw] sm:max-w-3xl md:max-w-4xl bg-white p-0 max-h-[95vh] overflow-hidden rounded-2xl flex flex-col">
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
                      <Button 
                        onClick={handleApply} 
                        disabled={isSubmitting || !formData.studentName || !formData.passportNumber || (selectedProgram.requiredDocuments?.length !== Object.keys(documents).length)}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black h-14 rounded-xl text-lg shadow-emerald-500/20 shadow-lg transition-all hover:-translate-y-0.5 whitespace-normal leading-tight"
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
        </DialogContent>"""

pattern = re.compile(r'        <DialogContent className="max-w-2xl max-h-\[90vh\] overflow-y-auto">.*?</DialogContent>', re.DOTALL)
new_content = pattern.sub(new_dialog, content)

with open('components/agency/StudyPrograms.tsx', 'w') as f:
    f.write(new_content)
