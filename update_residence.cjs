const fs = require('fs');

function addStore() {
  let c = fs.readFileSync('src/store/useAppStore.ts', 'utf8');
  if (!c.includes('residenceReason')) {
    c = c.replace(/extraData\?: Record<string, string>;/, "extraData?: Record<string, string>;");
    // Actually we just use Record<string,string>, so no need to change types for extraData
  }
}

function updateWizard() {
  let c = fs.readFileSync('components/agency/VisaWizard.tsx', 'utf8');
  
  if (!c.includes("currentService.type === 'Residence'")) {
    const residenceSnippet = `
                  {currentService.type === 'Residence' && (
                    <>
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3 pb-1 pt-3 border-b border-slate-200 mt-4">
                        <h4 className="font-bold text-slate-800">Détails de la demande de résidence</h4>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Raison de la résidence</label>
                        <Select value={applicant.residenceReason} onValueChange={v => setApplicant({...applicant, residenceReason: v})}>
                          <SelectTrigger className="h-9 text-sm bg-white"><SelectValue placeholder="Sélectionnez..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Travail">Travail</SelectItem>
                            <SelectItem value="Regroupement familial">Regroupement familial</SelectItem>
                            <SelectItem value="Études">Études</SelectItem>
                            <SelectItem value="Investissement">Investissement</SelectItem>
                            <SelectItem value="Retraite">Retraite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Profession</label>
                        <Input className="h-9 text-sm bg-white" placeholder="Votre profession actuelle" value={applicant.profession} onChange={e => setApplicant({...applicant, profession: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Adresse de résidence (prévue)</label>
                        <Input className="h-9 text-sm bg-white" placeholder="Adresse dans le pays de destination" value={applicant.intendedAddress} onChange={e => setApplicant({...applicant, intendedAddress: e.target.value})} />
                      </div>
                    </>
                  )}\n`;
                  
     c = c.replace(/({currentService\.type === 'Assurance' && \()/g, residenceSnippet + '$1');
     
     // add to extraData payload
     c = c.replace(/notes: applicant.notes\n/g, 'notes: applicant.notes,\n        residenceReason: applicant.residenceReason,\n        profession: applicant.profession,\n        intendedAddress: applicant.intendedAddress\n');
  }
  
  fs.writeFileSync('components/agency/VisaWizard.tsx', c);
}

function updateAdmin() {
  let c = fs.readFileSync('components/admin/ApplicationManagement.tsx', 'utf8');
  if (!c.includes('residenceReason')) {
    const residenceFields = `
                        {selectedApp.extraData.residenceReason && <div><span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">Raison de résidence</span><span className="font-medium text-slate-800">{selectedApp.extraData.residenceReason}</span></div>}
                        {selectedApp.extraData.profession && <div><span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">Profession</span><span className="font-medium text-slate-800">{selectedApp.extraData.profession}</span></div>}
                        {selectedApp.extraData.intendedAddress && <div className="col-span-1 sm:col-span-2"><span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">Adresse de résidence prévue</span><span className="font-medium text-slate-800">{selectedApp.extraData.intendedAddress}</span></div>}
                        `;
    c = c.replace(/({selectedApp.extraData.travelStartDate &&)/g, residenceFields + '$1');
  }
  fs.writeFileSync('components/admin/ApplicationManagement.tsx', c);
}

function updateAgency() {
  let c = fs.readFileSync('components/agency/AgencyApplications.tsx', 'utf8');
  if (!c.includes('residenceReason')) {
    const residenceFields = `
                        {selectedApp.extraData.residenceReason && <div><span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">Raison de résidence</span><span className="font-medium text-slate-800">{selectedApp.extraData.residenceReason}</span></div>}
                        {selectedApp.extraData.profession && <div><span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">Profession</span><span className="font-medium text-slate-800">{selectedApp.extraData.profession}</span></div>}
                        {selectedApp.extraData.intendedAddress && <div className="col-span-1 sm:col-span-2"><span className="text-blue-900/60 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">Adresse de résidence prévue</span><span className="font-medium text-slate-800">{selectedApp.extraData.intendedAddress}</span></div>}
                        `;
    c = c.replace(/({selectedApp.extraData.travelStartDate &&)/g, residenceFields + '$1');
  }
  fs.writeFileSync('components/agency/AgencyApplications.tsx', c);
}


updateWizard();
updateAdmin();
updateAgency();
console.log('done');
