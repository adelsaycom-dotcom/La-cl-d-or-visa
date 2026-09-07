import re

with open('components/admin/StudyProgramsManagement.tsx', 'r') as f:
    content = f.read()

new_dialog = """            <Dialog open={isAddOpen} onOpenChange={(o) => !o && setIsAddOpen(false)}>
              <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-slate-50">
                <div className="bg-white border-b border-slate-200 p-6 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{editingProgId ? "Modifier le programme" : "Nouveau Programme d'Études"}</h3>
                    <p className="text-sm text-slate-500 mt-1">Définissez l'université, le tarif et les documents requis.</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsAddOpen(false)} className="rounded-full hover:bg-slate-100">
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
                    <Switch checked={newProgram.status === 'active'} onCheckedChange={v => setNewProgram({...newProgram, status: v ? 'active' : 'inactive'})} />
                    <Label className="font-bold text-slate-600 cursor-pointer">Programme Actif (Visible par les agences)</Label>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setIsAddOpen(false)} className="font-bold border-slate-200 h-12 px-6">
                      Annuler
                    </Button>
                    <Button onClick={handleSaveProgram} className="font-black h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white">
                      <Save className="w-4 h-4 mr-2" /> {editingProgId ? "Enregistrer" : "Créer le programme"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>"""

pattern = re.compile(r'            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>.*?</Dialog>', re.DOTALL)
new_content = pattern.sub(new_dialog, content)

with open('components/admin/StudyProgramsManagement.tsx', 'w') as f:
    f.write(new_content)
