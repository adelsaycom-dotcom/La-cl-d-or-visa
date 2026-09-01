const fs = require('fs');
let content = fs.readFileSync('components/admin/FinancesManagement.tsx', 'utf-8');

const oldManualTab = `<div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Sélectionner l'Agence</label>
                      <Select value={manualAgencyId} onValueChange={setManualAgencyId}>
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue placeholder="Choisir une agence..." />
                        </SelectTrigger>
                        <SelectContent>
                          {agencies.map(a => (
                            <SelectItem key={a.id} value={a.id}>
                              {a.agencyName || a.name || 'Agence Inconnue'} 
                              <span className="text-slate-400 ml-2">({(a.balance || 0).toLocaleString()} DZD)</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Type d'opération</label>
                      <Select value={manualType} onValueChange={(val: any) => setManualType(val)}>
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit">
                            <span className="text-emerald-700 font-bold flex items-center gap-2">
                              <ArrowUpRight className="w-4 h-4"/> Créditer (+)
                            </span>
                          </SelectItem>
                          <SelectItem value="debit">
                            <span className="text-red-700 font-bold flex items-center gap-2">
                              <ArrowDownRight className="w-4 h-4"/> Débiter (-)
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Montant (DZD)</label>
                    <Input 
                      type="number" 
                      placeholder="Ex: 5000" 
                      className="bg-white border-slate-200 text-lg font-mono"
                      value={manualAmount}
                      onChange={e => setManualAmount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Motif de l'ajustement (Obligatoire)</label>
                    <Input 
                      placeholder="Ex: Remboursement suite à erreur de dossier..." 
                      className="bg-white border-slate-200"
                      value={manualNote}
                      onChange={e => setManualNote(e.target.value)}
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200 flex justify-end">
                    <Button 
                      onClick={handleManualAdjustment}
                      disabled={isSubmitting || !manualAgencyId || !manualAmount || !manualNote}
                      className={\`font-bold px-8 \${manualType === 'credit' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}\`}
                    >
                      {isSubmitting ? 'Traitement...' : \`Confirmer le \${manualType === 'credit' ? 'Crédit' : 'Débit'}\`}
                    </Button>
                  </div>
                </div>`;

const newManualTab = `<div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Sélectionner l'Agence</label>
                      <Select value={manualAgencyId} onValueChange={setManualAgencyId}>
                        <SelectTrigger className="h-14 bg-white border-slate-200 text-base shadow-sm focus:ring-blue-500">
                          <SelectValue placeholder="Choisir une agence..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                          {agencies.map(a => (
                            <SelectItem key={a.id} value={a.id} className="py-3 cursor-pointer">
                              <div className="flex justify-between items-center w-full gap-4">
                                <span className="font-bold text-slate-900 truncate">{a.agencyName || a.name || 'Agence Inconnue'}</span>
                                <Badge variant="secondary" className="font-mono bg-slate-100 text-slate-600 whitespace-nowrap border border-slate-200">
                                  {(a.balance || 0).toLocaleString()} DZD
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Type d'opération</label>
                      <Select value={manualType} onValueChange={(val: any) => setManualType(val)}>
                        <SelectTrigger className={\`h-14 text-base font-bold shadow-sm border-2 \${manualType === 'credit' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500' : 'bg-red-50 text-red-700 border-red-200 focus:ring-red-500'}\`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit" className="py-3 cursor-pointer">
                            <span className="text-emerald-700 font-bold flex items-center gap-2">
                              <ArrowUpRight className="w-5 h-5"/> Créditer (+)
                            </span>
                          </SelectItem>
                          <SelectItem value="debit" className="py-3 cursor-pointer">
                            <span className="text-red-700 font-bold flex items-center gap-2">
                              <ArrowDownRight className="w-5 h-5"/> Débiter (-)
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Montant (DZD)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Wallet className="h-6 w-6 text-slate-400" />
                      </div>
                      <Input 
                        type="number" 
                        placeholder="Ex: 50000" 
                        className={\`pl-12 h-16 text-2xl font-black font-mono shadow-sm border-2 transition-colors focus-visible:ring-0 \${
                          manualType === 'credit' 
                            ? 'focus:border-emerald-500 border-slate-200' 
                            : 'focus:border-red-500 border-slate-200'
                        }\`}
                        value={manualAmount}
                        onChange={e => setManualAmount(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-slate-400 font-bold text-lg">DZD</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Motif de l'ajustement (Obligatoire)</label>
                    <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input 
                        placeholder="Ex: Remboursement suite à erreur de dossier..." 
                        className="pl-12 h-14 bg-white border-slate-200 shadow-sm text-base"
                        value={manualNote}
                        onChange={e => setManualNote(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-200 flex justify-end">
                    <Button 
                      onClick={handleManualAdjustment}
                      disabled={isSubmitting || !manualAgencyId || !manualAmount || !manualNote}
                      className={\`h-14 font-black px-10 text-lg shadow-md transition-all \${manualType === 'credit' ? 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-emerald-500/25' : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-red-500/25'}\`}
                    >
                      {isSubmitting ? 'Traitement...' : \`Confirmer le \${manualType === 'credit' ? 'Crédit' : 'Débit'}\`}
                    </Button>
                  </div>
                </div>`;

content = content.replace(oldManualTab, newManualTab);
fs.writeFileSync('components/admin/FinancesManagement.tsx', content);
