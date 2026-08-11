content = open('components/agency/AgencySupport.tsx').read()

start_idx = content.find('{/* Chat body */}')
end_idx = content.find('               )}', start_idx) + len('               )}')

chat_body = '''{/* Chat body */}
               <div className="flex-1 bg-gray-50 overflow-y-auto p-4 sm:p-6 space-y-6">
                 {/* Original Ticket Description */}
                 <div className="flex gap-2 sm:gap-4">
                   <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-500 shrink-0 text-xs sm:text-sm">VO</div>
                   <div className="max-w-[85%]">
                     <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-3 sm:p-4 shadow-sm">
                       <p className="text-gray-700 text-sm font-medium leading-relaxed whitespace-pre-wrap">{selectedTicket.description || "Aucune description fournie"}</p>
                     </div>
                     <span className="text-[10px] font-bold text-gray-400 mt-2 ml-1 block">{new Date(selectedTicket.createdAt || selectedTicket.date || Date.now()).toLocaleString()} - Vous</span>
                   </div>
                 </div>

                 {/* Real Messages Map */}
                 {(selectedTicket.messages || []).map((msg: any, idx: number) => (
                   <div key={idx} className={`flex gap-2 sm:gap-4 ${msg.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                     {msg.sender === 'admin' ? (
                       <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--color-text-dark)] flex items-center justify-center font-bold text-white shrink-0">
                         <img src="https://ui-avatars.com/api/?name=Support&background=0a192f&color=fff" alt="Support" className="rounded-full w-full h-full object-cover" />
                       </div>
                     ) : (
                       <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-500 shrink-0 text-xs sm:text-sm">VO</div>
                     )}
                     <div className={`flex flex-col max-w-[85%] ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                       <div className={`${msg.sender === 'admin' ? 'bg-[var(--color-text-dark)] text-white rounded-tr-none shadow-md' : 'bg-white border border-gray-200 rounded-tl-none shadow-sm'} rounded-2xl p-3 sm:p-4`}>
                         <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                       </div>
                       <span className={`text-[10px] font-bold text-gray-400 mt-2 ${msg.sender === 'admin' ? 'mr-1' : 'ml-1'} block`}>{new Date(msg.date).toLocaleString()} - {msg.sender === 'admin' ? 'Support Client' : 'Vous'}</span>
                     </div>
                   </div>
                 ))}
               </div>
               
               {/* Footer / Input */}
               {selectedTicket.status !== "RESOLVED" ? (
                 <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                   <div className="flex items-end gap-2 sm:gap-3 bg-gray-50 rounded-2xl border border-gray-200 p-2 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all">
                     <Textarea 
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Tapez votre réponse ici..."
                        className="border-none bg-transparent shadow-none focus-visible:ring-0 resize-none min-h-[44px] py-3 font-medium placeholder:font-normal"
                        rows={1}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleReply();
                          }
                        }}
                     />
                     <Button 
                       onClick={handleReply}
                       className="bg-[var(--color-text-dark)] hover:bg-[var(--color-accent-bronze)] text-white rounded-xl h-11 px-4 sm:px-6 shrink-0 font-bold mb-1 mr-1"
                       disabled={!replyText.trim()}
                     >
                       Envoyer
                     </Button>
                   </div>
                 </div>
               ) : (
                  <div className="p-6 bg-gray-100 text-center text-gray-500 text-sm font-medium border-t border-gray-200 shrink-0">
                     Ce ticket a été marqué comme résolu et est maintenant fermé.
                  </div>
               )}'''

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + chat_body + content[end_idx:]
    open('components/agency/AgencySupport.tsx', 'w').write(new_content)
    print("Replaced!")
else:
    print("Could not find bounds")
