import re

content = open('components/admin/SupportManagement.tsx').read()
if 'const [replyText, setReplyText]' not in content:
    content = content.replace('const [selectedTicket, setSelectedTicket] = useState<any>(null);', 
    '''const [selectedTicket, setSelectedTicket] = useState<any>(null);
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
''')

    dialog_pattern = r'<div className="bg-gray-50 rounded-lg p-4 min-h-\[300px\] border flex flex-col justify-end">.*?</Dialog>'
    
    new_dialog = '''<div className="bg-gray-50 rounded-lg p-4 h-[400px] border flex flex-col overflow-y-auto space-y-4">
                 
                 {/* First message (initial description) */}
                 <div className="flex flex-col items-start">
                   <div className="bg-white border rounded-lg p-3 text-sm max-w-[80%] shadow-sm whitespace-pre-wrap">
                     {selectedTicket.description}
                   </div>
                   <span className="text-xs text-gray-400 mt-1 ml-1">{selectedTicket.agencyName || selectedTicket.agency} • {new Date(selectedTicket.createdAt || selectedTicket.date || Date.now()).toLocaleString()}</span>
                 </div>
                 
                 {/* Follow-up messages */}
                 {(selectedTicket.messages || []).map((msg: any, idx: number) => (
                   <div key={idx} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                     <div className={`${msg.sender === 'admin' ? 'bg-black text-white' : 'bg-white border'} rounded-lg p-3 text-sm max-w-[80%] shadow-sm whitespace-pre-wrap`}>
                       {msg.text}
                     </div>
                     <span className={`text-xs text-gray-400 mt-1 ${msg.sender === 'admin' ? 'mr-1' : 'ml-1'}`}>{msg.sender === 'admin' ? 'You' : (selectedTicket.agencyName || selectedTicket.agency)} • {new Date(msg.date).toLocaleString()}</span>
                   </div>
                 ))}
               </div>
               
               <div className="flex gap-4 mt-4">
                 <div className="flex-1 space-y-2">
                   <Textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Type your response to the agency..." className="min-h-[80px]" disabled={selectedTicket.status === "RESOLVED"} />
                   <div className="flex justify-between items-center">
                     <div className="flex gap-2">
                       <Button size="sm" variant="outline" onClick={() => updateStatus("IN_PROGRESS")} disabled={selectedTicket.status === "IN_PROGRESS" || selectedTicket.status === "RESOLVED"}>
                         Set In Progress
                       </Button>
                       <Button size="sm" variant="outline" className="text-green-700 hover:text-green-800" onClick={() => updateStatus("RESOLVED")} disabled={selectedTicket.status === "RESOLVED"}>
                         Mark Resolved
                       </Button>
                     </div>
                     <Button className="bg-black text-white shrink-0" onClick={handleReply} disabled={selectedTicket.status === "RESOLVED" || !replyText.trim()}>Send Reply</Button>
                   </div>
                 </div>
               </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}'''

    content = re.sub(r'<div className="bg-gray-50 rounded-lg p-4 min-h-\[300px\] border flex flex-col justify-end">.*?</Dialog>.*?</div>.*?\)[\s\n]*\}', new_dialog, content, flags=re.DOTALL)
    
    open('components/admin/SupportManagement.tsx', 'w').write(content)

