import { useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAppStore } from "../../src/store/useAppStore";
import { CheckCircle2, XCircle } from "lucide-react";



export function FinancesManagement() {
  
  const { rechargeRequests, updateRechargeRequestStatus, addTransaction } = useAppStore();
  const recharges = (rechargeRequests || []).filter(r => r.status === 'Pending');

  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [creditAmount, setCreditAmount] = useState("");


  const handleApprove = () => {
    if (!creditAmount) return;
    updateRechargeRequestStatus(selectedReq.id, 'Approved');
    // Mettre à jour le solde
    const userRef = doc(db, 'users', selectedReq.agencyId);
    getDoc(userRef).then(docSnap => {
      if(docSnap.exists()) {
        updateDoc(userRef, { balance: (docSnap.data().balance || 0) + Number(creditAmount) });
      }
    });
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



  const handleReject = (id: string) => {
    updateRechargeRequestStatus(id, 'Rejected');
  };


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Finances & Balance</h2>
        <p className="text-gray-500 mt-1">Manage agency wallet recharges and financial transactions.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Pending Recharge Requests</h3>
        {recharges.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 shadow-sm">
            <CheckCircle2 className="mx-auto h-8 w-8 text-green-400 mb-2" />
            No pending recharge requests. All caught up!
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Agency</TableHead>
                  <TableHead>Date / Reference</TableHead>
                  <TableHead className="text-right">Requested Amount</TableHead>
                  <TableHead className="text-right w-[200px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recharges.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium text-gray-900">{req.agencyName}</TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(req.date).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{req.note}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-blue-600">
                      {req.amount.toLocaleString()} DA
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleReject(req.id)}>
                        <XCircle className="w-4 h-4 mr-1"/> Reject
                      </Button>
                      <Button size="sm" onClick={() => { setSelectedReq(req); setCreditAmount(req.amount.toString()); }} className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle2 className="w-4 h-4 mr-1"/> Process
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Global Balances Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <div className="text-sm text-blue-600 font-medium mb-1">Total System Liabilities</div>
            <div className="text-4xl font-bold tracking-tight text-blue-900">23,120 DA</div>
            <p className="text-xs text-blue-500 mt-2">Combined balances of all active agencies</p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <div className="text-sm text-green-600 font-medium mb-1">Total Processed (MTD)</div>
            <div className="text-4xl font-bold tracking-tight text-green-900">12,450 DA</div>
            <p className="text-xs text-green-500 mt-2">Value of approved visas this month</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
            <Button variant="outline" className="w-full justify-start text-left mb-2">
              <span className="font-semibold text-gray-900 flex-1">Export Finances</span>
              CSV
            </Button>
            <Button variant="outline" className="w-full justify-start text-left">
              <span className="font-semibold text-gray-900 flex-1">Manual Adjustment...</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Credit Processing Dialog */}
      <Dialog open={!!selectedReq} onOpenChange={(o) => !o && setSelectedReq(null)}>
        <DialogContent>
          {selectedReq && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold">Process Recharge Request</h3>
                <p className="text-gray-500 text-sm">{selectedReq.agencyName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-sm flex justify-between">
                <div>Reference Notes: <span className="font-medium text-gray-900">{selectedReq.note}</span></div>
                <div>Requested: <span className="font-medium text-gray-900">{selectedReq.amount} DA</span></div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Amount to Credit (DA)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">DA</span>
                  <Input 
                    type="number" 
                    className="pl-10 text-lg font-mono" 
                    value={creditAmount} 
                    onChange={e => setCreditAmount(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500">You can adjust the amount if the received transfer differs from the request.</p>
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t">
                <Button variant="outline" onClick={() => setSelectedReq(null)}>Cancel</Button>
                <Button onClick={handleApprove} className="bg-black text-white px-8">Confirm Credit</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
