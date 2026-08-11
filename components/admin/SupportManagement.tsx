import { useState } from "react";
import { useAppStore } from "../../src/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MessageSquare, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const MOCK_TICKETS: any[] = [];

export function SupportManagement() {
  const { supportTickets: tickets, updateSupportTicket } = useAppStore();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState("");

  const handleReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    const newMessages = [...(selectedTicket.messages || []), {
      sender: 'admin',
      text: replyText,
      date: new Date().toISOString()
    }];
    updateSupportTicket(selectedTicket.id, { messages: newMessages, status: selectedTicket.status === 'OPEN' ? 'IN_PROGRESS' : selectedTicket.status });
    setSelectedTicket({ ...selectedTicket, messages: newMessages, status: selectedTicket.status === 'OPEN' ? 'IN_PROGRESS' : selectedTicket.status });
    setReplyText("");
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN": return <Badge className="bg-amber-100 text-amber-800 border-none">Open</Badge>;
      case "IN_PROGRESS": return <Badge className="bg-blue-100 text-blue-800 border-none">In Progress</Badge>;
      case "RESOLVED": return <Badge className="bg-gray-100 text-gray-800 border-none">Resolved</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const updateStatus = (status: string) => {
    if (!selectedTicket) return;
    updateSupportTicket(selectedTicket.id, { status });
    setSelectedTicket({ ...selectedTicket, status });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Support Tickets</h2>
          <p className="text-sm text-gray-500 mt-1">Manage agency inquiries and support requests.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
        <Input placeholder="Search agency or ticket ID..." className="w-full sm:max-w-xs" />
        <Select>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="whitespace-nowrap">Ticket ID</TableHead>
              <TableHead className="whitespace-nowrap">Agency</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((t) => (
              <TableRow key={t.id} className={t.isUrgent && t.status === "OPEN" ? "bg-red-50/50" : ""}>
                <TableCell className="font-mono text-sm font-medium whitespace-nowrap">{t.id}</TableCell>
                <TableCell className="font-medium text-gray-900 whitespace-nowrap">{t.agency}</TableCell>
                <TableCell>
                  <span className="font-medium">{t.subject}</span>
                  {t.isUrgent && <AlertCircle className="w-4 h-4 inline ml-2 text-red-500" />}
                </TableCell>
                <TableCell>{getStatusBadge(t.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(t)}>
                    <MessageSquare className="w-4 h-4 mr-2" /> Reply
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View/Reply Ticket Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(o) => !o && setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl">
          {selectedTicket && (
            <div className="space-y-4">
               <div>
                 <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                   <span>{selectedTicket.id}</span>
                   <span>•</span>
                   <span className="font-semibold text-gray-900">{selectedTicket.agency}</span>
                   {selectedTicket.isUrgent && <Badge variant="outline" className="text-red-500 border-red-200">Urgent</Badge>}
                 </div>
                 <h3 className="text-xl font-bold">{selectedTicket.subject}</h3>
               </div>
               
               <div className="bg-gray-50 rounded-lg p-4 h-[50vh] min-h-[300px] border flex flex-col overflow-y-auto space-y-4">
                 
                 {/* First message (initial description) */}
                 <div className="flex flex-col items-start">
                   <div className="bg-white border rounded-lg p-3 text-sm max-w-[85%] sm:max-w-[80%] shadow-sm whitespace-pre-wrap">
                     {selectedTicket.description}
                   </div>
                   <span className="text-xs text-gray-400 mt-1 ml-1">{selectedTicket.agencyName || selectedTicket.agency} • {new Date(selectedTicket.createdAt || selectedTicket.date || Date.now()).toLocaleString()}</span>
                 </div>
                 
                 {/* Follow-up messages */}
                 {(selectedTicket.messages || []).map((msg: any, idx: number) => (
                   <div key={idx} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                     <div className={`${msg.sender === 'admin' ? 'bg-black text-white' : 'bg-white border'} rounded-lg p-3 text-sm max-w-[85%] sm:max-w-[80%] shadow-sm whitespace-pre-wrap`}>
                       {msg.text}
                     </div>
                     <span className={`text-xs text-gray-400 mt-1 ${msg.sender === 'admin' ? 'mr-1' : 'ml-1'}`}>{msg.sender === 'admin' ? 'You' : (selectedTicket.agencyName || selectedTicket.agency)} • {new Date(msg.date).toLocaleString()}</span>
                   </div>
                 ))}
               </div>
               
               <div className="flex gap-4 mt-4">
                 <div className="flex-1 space-y-2">
                   <Textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Type your response to the agency..." className="min-h-[80px]" disabled={selectedTicket.status === "RESOLVED"} />
                   <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                     <div className="flex gap-2 w-full sm:w-auto">
                       <Button size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => updateStatus("IN_PROGRESS")} disabled={selectedTicket.status === "IN_PROGRESS" || selectedTicket.status === "RESOLVED"}>
                         Set In Progress
                       </Button>
                       <Button size="sm" variant="outline" className="flex-1 sm:flex-none text-green-700 hover:text-green-800" onClick={() => updateStatus("RESOLVED")} disabled={selectedTicket.status === "RESOLVED"}>
                         Mark Resolved
                       </Button>
                     </div>
                     <Button className="bg-black text-white shrink-0 w-full sm:w-auto" onClick={handleReply} disabled={selectedTicket.status === "RESOLVED" || !replyText.trim()}>Send Reply</Button>
                   </div>
                 </div>
               </div>
            </div>
          )}
        </DialogContent>
</Dialog>
    </div>
  );
}
