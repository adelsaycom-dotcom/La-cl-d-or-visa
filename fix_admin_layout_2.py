import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_dropdown = re.search(r'<DropdownMenu>.*?Mark all as read.*?<\/DropdownMenu>', content, flags=re.DOTALL)
if old_dropdown:
    new_dropdown = """{/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 outline-none">
                  <Bell className="w-5 h-5" />
                  {adminNotifsCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                    </span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 border-gray-200 overflow-hidden shadow-xl rounded-xl">
                  <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                    <span className="font-bold text-gray-900">Notifications Admin</span>
                    {adminNotifsCount > 0 && (
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">{adminNotifsCount} nouvelle(s)</span>
                    )}
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {adminNotifsCount === 0 ? (
                      <div className="p-8 text-center flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                          <Bell className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">Aucune nouvelle notification</p>
                        <p className="text-xs text-gray-500 mt-1">Vous êtes à jour !</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        <AnimatePresence>
                          {unreadNotifications.map(notif => (
                            <motion.div 
                              key={notif.id}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="group p-4 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 items-start"
                              onClick={() => {
                                markNotificationAsRead(notif.id);
                                if(notif.link) navigate(notif.link);
                              }}
                            >
                              <div className={`shrink-0 w-2 h-2 mt-2 rounded-full ${notif.type === 'success' ? 'bg-green-500' : notif.type === 'error' ? 'bg-red-500' : notif.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-bold text-gray-900 leading-tight">{notif.title}</p>
                                <p className="text-xs text-gray-600 line-clamp-2">{notif.message}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{new Date(notif.createdAt).toLocaleString()}</p>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                  {adminNotifsCount > 0 && (
                    <div className="p-2 border-t bg-gray-50">
                      <button 
                        className="w-full py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        onClick={() => markAllNotificationsAsRead("admin")}
                      >
                        Tout marquer comme lu
                      </button>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>"""
    
    content = content.replace(old_dropdown.group(0), new_dropdown)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Replaced dropdown")
else:
    print("Dropdown not found")
