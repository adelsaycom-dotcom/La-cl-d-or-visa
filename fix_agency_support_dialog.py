import re

content = open('components/agency/AgencySupport.tsx').read()
if 'const [replyText, setReplyText]' not in content:
    content = content.replace('const [isUrgent, setIsUrgent] = useState(false);', 
    '''const [isUrgent, setIsUrgent] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { updateSupportTicket } = useAppStore();
  
  const handleReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    const newMessages = [...(selectedTicket.messages || []), {
      sender: 'agency',
      text: replyText,
      date: new Date().toISOString()
    }];
    updateSupportTicket(selectedTicket.id, { messages: newMessages });
    setSelectedTicket({ ...selectedTicket, messages: newMessages });
    setReplyText("");
  };
''')

    # Now replace the chat body. First, find where it starts and ends.
    # From {/* Chat body */} to <div className="p-4 bg-white border-t border-gray-100 shrink-0">
    # Let's replace the whole View Ticket Dialog inner content.
    # Specifically, replace everything inside `<DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl">` for selectedTicket
    # Let's use regex.
    
    dialog_pattern = r'\{\/\* Chat body \*\/\}.*?\{\/\* Reply Input \*\/\}'
    # Actually it's easier to replace specific chunks.
    
    chat_body = '''{/* Chat body */}
               <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6">
                 {/* First message (initial description) */}
                 <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-500 shrink-0">VO</div>
                   <div>
                     <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
                       <p className="text-gray-700 text-sm font-medium leading-relaxed">{selectedTicket.description}</p>
                     </div>
                     <span className="text-[10px] font-bold text-gray-400 mt-2 ml-1 block">{new Date(selectedTicket.createdAt || selectedTicket.date || Date.now()).toLocaleString()} - Vous</span>
                   </div>
                 </div>
                 
                 {/* Follow-up messages */}
                 {(selectedTicket.messages || []).map((msg: any, idx: number) => (
                   <div key={idx} className={`flex gap-4 ${msg.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                     {msg.sender === 'admin' ? (
                       <div className="w-10 h-10 rounded-full bg-[var(--color-text-dark)] flex items-center justify-center font-bold text-white shrink-0">
                         <img src="https://ui-avatars.com/api/?name=Support&background=0a192f&color=fff" alt="Support" className="rounded-full" />
                       </div>
                     ) : (
                       <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-500 shrink-0">VO</div>
                     )}
                     <div className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                       <div className={`${msg.sender === 'admin' ? 'bg-[var(--color-text-dark)] text-white rounded-tr-none shadow-md' : 'bg-white border border-gray-200 rounded-tl-none shadow-sm'} rounded-2xl p-4`}>
                         <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                       </div>
                       <span className={`text-[10px] font-bold text-gray-400 mt-2 ${msg.sender === 'admin' ? 'mr-1' : 'ml-1'} block`}>{new Date(msg.date).toLocaleString()} - {msg.sender === 'admin' ? 'Support Client' : 'Vous'}</span>
                     </div>
                   </div>
                 ))}
               </div>
               
               {/* Reply Input */}'''

    content = re.sub(r'\{\/\* Chat body \*\/\}.*?\{\/\* Reply Input \*\/\}', chat_body, content, flags=re.DOTALL)
    
    reply_input = '''{/* Reply Input */}
               {selectedTicket.status !== "RESOLVED" ? (
                  <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                    <div className="flex gap-3">
                       <Input value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Écrivez votre message ici..." className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white" onKeyDown={(e) => { if (e.key === 'Enter') handleReply(); }} />
                       <Button onClick={handleReply} className="h-12 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/20">Envoyer</Button>
                    </div>
                  </div>
               ) : (
                  <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-sm font-bold text-gray-500 shrink-0">
                     Ce ticket a été marqué comme résolu et est maintenant fermé.
                  </div>
               )}'''

    content = re.sub(r'\{\/\* Reply Input \*\/\}.*?\}\)\}', reply_input + '\n            </div>\n          )}\n        </DialogContent>\n      </Dialog>\n    </div>\n  );\n}', content, flags=re.DOTALL)

    open('components/agency/AgencySupport.tsx', 'w').write(content)

