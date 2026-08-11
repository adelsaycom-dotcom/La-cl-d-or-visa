import re

content = open('components/agency/AgencySupport.tsx').read()

# Replace the header of the dialog
head_pattern = r'\{\/\* Head \*\/\}.*?\{\/\* Chat body \*\/\}'
new_head = '''{/* Head */}
               <div className="p-4 sm:p-6 border-b border-gray-100 bg-white shrink-0 pr-12">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <div className="w-full">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2 font-medium">
                        <Badge variant="outline" className="bg-gray-100 border-none text-gray-600 rounded-md font-mono shrink-0">{selectedTicket.id}</Badge>
                        <span className="shrink-0">Créé le {new Date(selectedTicket.createdAt || selectedTicket.date || Date.now()).toLocaleDateString()}</span>
                        {selectedTicket.isUrgent && <span className="flex items-center text-red-500 text-xs font-bold bg-red-50 px-2 py-0.5 rounded-full shrink-0"><AlertCircle className="w-3 h-3 mr-1" /> URGENT</span>}
                        <div className="sm:hidden ml-auto">{getStatusBadge(selectedTicket.status)}</div>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 leading-tight break-words">{selectedTicket.subject}</h3>
                    </div>
                    <div className="hidden sm:block shrink-0">{getStatusBadge(selectedTicket.status)}</div>
                 </div>
               </div>
                              
               {/* Chat body */}'''

content = re.sub(head_pattern, new_head, content, flags=re.DOTALL)

# Replace the Footer / Input of the dialog
footer_pattern = r'\{\/\* Footer / Input \*\/\}.*?\}\)'
new_footer = '''{/* Footer / Input */}
               {selectedTicket.status !== "RESOLVED" ? (
                 <div className="p-3 sm:p-4 bg-white border-t border-gray-100 shrink-0">
                   <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 p-2 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all w-full">
                     <Textarea 
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Tapez votre réponse ici..."
                        className="border-none bg-transparent shadow-none focus-visible:ring-0 resize-none min-h-[44px] py-3 font-medium placeholder:font-normal flex-1 w-full"
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
                       className="bg-[var(--color-text-dark)] hover:bg-[var(--color-accent-bronze)] text-white rounded-xl h-11 px-4 sm:px-6 shrink-0 font-bold"
                       disabled={!replyText.trim()}
                     >
                       Envoyer
                     </Button>
                   </div>
                 </div>
               ) : (
                  <div className="p-4 sm:p-6 bg-gray-100 text-center text-gray-500 text-sm font-medium border-t border-gray-200 shrink-0">
                     Ce ticket a été marqué comme résolu et est maintenant fermé.
                  </div>
               )}'''

content = re.sub(footer_pattern, new_footer, content, flags=re.DOTALL)

open('components/agency/AgencySupport.tsx', 'w').write(content)
print("Updated AgencySupport.tsx")
