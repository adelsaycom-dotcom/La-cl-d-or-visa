import re

content = open('components/agency/AgencyWallet.tsx').read()
content = content.replace('const MOCK_TRANSACTIONS = [', '// const MOCK_TRANSACTIONS = [')
content = content.replace('];\nexport function AgencyWallet', '];\nimport { auth } from "../../src/firebase";\nexport function AgencyWallet')

store_line = """
  const { agencyBalance, transactions, rechargeRequests, addRechargeRequest } = useAppStore();
  
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [rechargeNote, setRechargeNote] = useState("");
  
  const handleRechargeSubmit = () => {
    if(!rechargeAmount) return;
    addRechargeRequest({
      agencyId: auth.currentUser?.uid || "mock-id",
      agencyName: auth.currentUser?.email || "mock-agency",
      amount: Number(rechargeAmount),
      note: rechargeNote,
      status: "Pending",
      date: new Date().toISOString()
    });
    setRechargeOpen(false);
  };
"""

content = content.replace('const { agencyBalance } = useAppStore();', store_line)
content = content.replace('{MOCK_TRANSACTIONS.map((tx) => (', '{(transactions || []).map((tx) => (')
content = content.replace('onClick={() => setRechargeOpen(false)}>Soumettre la Demande', 'onClick={handleRechargeSubmit}>Soumettre la Demande')
content = content.replace('<Input type="number" placeholder="ex: 10000" />', '<Input type="number" placeholder="ex: 10000" value={rechargeAmount} onChange={(e) => setRechargeAmount(e.target.value)} />')
content = content.replace('<Input placeholder="ex: Reçu de transfert #49281" />', '<Input placeholder="ex: Reçu de transfert #49281" value={rechargeNote} onChange={(e) => setRechargeNote(e.target.value)} />')

# Fix pending requests display
pending_req = """
          { (rechargeRequests || []).filter(r => r.status === 'Pending').map(req => (
           <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 mb-2">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <div>
                  <div className="font-medium text-sm">{req.note}</div>
                  <div className="text-xs text-gray-500">Soumis le {new Date(req.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="font-mono font-bold text-lg text-amber-600">{req.amount} DA</div>
           </div>
          ))}
"""
content = re.sub(r'<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">.*?</div>\s*</div>\s*</div>', pending_req + '</div>', content, flags=re.DOTALL)

open('components/agency/AgencyWallet.tsx', 'w').write(content)
