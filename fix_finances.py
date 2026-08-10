import re

content = open('components/admin/FinancesManagement.tsx').read()
content = content.replace('// Mock Data\nconst PENDING_RECHARGES = [\n  { id: "r1", agencyName: "Wanderlust Tours", date: "2024-05-05T10:30:00Z", requestedAmount: 5000, reference: "Bank Transfer 110" },\n  { id: "r2", agencyName: "Global Travel Experiences", date: "2024-05-04T15:45:00Z", requestedAmount: 2000, reference: "Check #5021" },\n];', '')

content = content.replace('import { Dialog, DialogContent } from "@/components/ui/dialog";', 'import { Dialog, DialogContent } from "@/components/ui/dialog";\nimport { useAppStore } from "../../src/store/useAppStore";')

state_line = """
  const { rechargeRequests, updateRechargeRequestStatus, addTransaction } = useAppStore();
  const recharges = (rechargeRequests || []).filter(r => r.status === 'Pending');
"""

content = content.replace('const [recharges, setRecharges] = useState(PENDING_RECHARGES);', state_line)

approve_logic = """
  const handleApprove = () => {
    if (!creditAmount) return;
    updateRechargeRequestStatus(selectedReq.id, 'Approved');
    addTransaction({
      agencyId: selectedReq.agencyId,
      type: 'CREDIT',
      amount: Number(creditAmount),
      date: new Date().toISOString(),
      ref: selectedReq.note,
      note: 'Recharge Approuvée'
    });
    // We should also update the user's balance here!
    setSelectedReq(null);
    setCreditAmount("");
  };
"""

content = content.replace("""  const handleApprove = () => {
    if (!creditAmount) return;
    setRecharges(recharges.filter(r => r.id !== selectedReq.id));
    // Here we would create a CREDIT transaction, update agency balance, and notify.
    setSelectedReq(null);
    setCreditAmount("");
    alert(`Successfully credited ${creditAmount} DA to ${selectedReq.agencyName}.`);
  };""", approve_logic)

reject_logic = """
  const handleReject = (id: string) => {
    updateRechargeRequestStatus(id, 'Rejected');
  };
"""

content = content.replace("""  const handleReject = (id: string) => {
    setRecharges(recharges.filter(r => r.id !== id));
  };""", reject_logic)

# Replace fields requestedAmount with amount, reference with note
content = content.replace('req.requestedAmount', 'req.amount')
content = content.replace('req.reference', 'req.note')
content = content.replace('selectedReq.reference', 'selectedReq.note')
content = content.replace('selectedReq.requestedAmount', 'selectedReq.amount')

open('components/admin/FinancesManagement.tsx', 'w').write(content)
