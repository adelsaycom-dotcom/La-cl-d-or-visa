const fs = require('fs');

function updateWizard() {
  let c = fs.readFileSync('components/agency/VisaWizard.tsx', 'utf8');
  
  if (!c.includes("currentService.type === 'Dossier'")) {
    const dossierSnippet = `
                  {currentService.type === 'Dossier' && (
                    <>
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3 pb-1 pt-3 border-b border-slate-200 mt-4">
                        <h4 className="font-bold text-slate-800">Détails du traitement de dossier</h4>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Type de demande de visa</label>
                        <Select value={applicant.applicationType} onValueChange={v => setApplicant({...applicant, applicationType: v})}>
                          <SelectTrigger className="h-9 text-sm bg-white"><SelectValue placeholder="Sélectionnez..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Touristique">Touristique</SelectItem>
                            <SelectItem value="Affaires">Affaires</SelectItem>
                            <SelectItem value="Visite familiale">Visite familiale / Amis</SelectItem>
                            <SelectItem value="Médical">Médical</SelectItem>
                            <SelectItem value="Études">Études</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Centre de dépôt</label>
                        <Input className="h-9 text-sm bg-white" placeholder="Ex: TLS, VFS, BLS" value={applicant.submissionCenter} onChange={e => setApplicant({...applicant, submissionCenter: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Date de dépôt prévue</label>
                        <Input className="h-9 text-sm bg-white" type="date" value={applicant.plannedSubmissionDate} onChange={e => setApplicant({...applicant, plannedSubmissionDate: e.target.value})} />
                      </div>
                    </>
                  )}\n`;
                  
     c = c.replace(/({currentService\.type === 'Residence' && \()/g, dossierSnippet + '$1');
     
     // add to extraData payload
     c = c.replace(/intendedAddress: applicant.intendedAddress\n/g, 'intendedAddress: applicant.intendedAddress,\n        applicationType: applicant.applicationType,\n        submissionCenter: applicant.submissionCenter,\n        plannedSubmissionDate: applicant.plannedSubmissionDate\n');
  }
  
  fs.writeFileSync('components/agency/VisaWizard.tsx', c);
}

function updateAdmin() {
  let c = fs.readFileSync('components/admin/ApplicationManagement.tsx', 'utf8');
  if (!c.includes('applicationType')) {
    const dossierFields = `
                        {selectedApp.extraData.applicationType && <div><span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">Type de demande (Dossier)</span><span className="font-medium text-slate-800">{selectedApp.extraData.applicationType}</span></div>}
                        {selectedApp.extraData.submissionCenter && <div><span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">Centre de dépôt</span><span className="font-medium text-slate-800">{selectedApp.extraData.submissionCenter}</span></div>}
                        {selectedApp.extraData.plannedSubmissionDate && <div><span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">Date de dépôt prévue</span><span className="font-medium text-slate-800">{selectedApp.extraData.plannedSubmissionDate}</span></div>}
                        `;
    c = c.replace(/({selectedApp.extraData.travelStartDate &&)/g, dossierFields + '$1');
  }
  fs.writeFileSync('components/admin/ApplicationManagement.tsx', c);
}

function updateAgency() {
  let c = fs.readFileSync('components/agency/AgencyApplications.tsx', 'utf8');
  if (!c.includes('applicationType')) {
    const dossierFields = `
                        {selectedApp.extraData.applicationType && <div><span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">Type de demande (Dossier)</span><span className="font-medium text-slate-800">{selectedApp.extraData.applicationType}</span></div>}
                        {selectedApp.extraData.submissionCenter && <div><span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">Centre de dépôt</span><span className="font-medium text-slate-800">{selectedApp.extraData.submissionCenter}</span></div>}
                        {selectedApp.extraData.plannedSubmissionDate && <div><span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">Date de dépôt prévue</span><span className="font-medium text-slate-800">{selectedApp.extraData.plannedSubmissionDate}</span></div>}
                        `;
    c = c.replace(/({selectedApp.extraData.travelStartDate &&)/g, dossierFields + '$1');
  }
  fs.writeFileSync('components/agency/AgencyApplications.tsx', c);
}

updateWizard();
updateAdmin();
updateAgency();
console.log('done');
