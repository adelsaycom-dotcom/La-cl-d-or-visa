import re

content = open('components/agency/AgencyLayout.tsx').read()
if 'const { applications, rechargeRequests' not in content:
    content = content.replace('const location = useLocation();', 'const location = useLocation();\n  const { applications, rechargeRequests, supportTickets } = useAppStore();')
    
    # Calculate notifications
    calc = '''  
  // Dynamic notifications for Agency
  const recentApps = applications.filter(a => a.status === 'Approved' || a.status === 'Rejected').slice(0, 2);
  const recentRecharges = (rechargeRequests || []).filter(r => r.status === 'Approved').slice(0, 1);
  const recentTickets = (supportTickets || []).filter(t => t.status === 'RESOLVED').slice(0, 1);
  
  const notificationsCount = recentApps.length + recentRecharges.length + recentTickets.length;
'''
    content = content.replace('const isMobileMenuOpen = false; // Just for visual structure in this mock', calc + '\n  const isMobileMenuOpen = false;')

    # Replace the dropdown menu group for notifications
    old_notifs = '''<DropdownMenuGroup>
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                      <span className="text-sm font-medium text-green-600">Visa Approuvé</span>
                      <span className="text-xs text-gray-500 mt-1">La demande APP-003 pour Ali Benmoussa est approuvée !</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                      <span className="text-sm font-medium">Recharge Validée</span>
                      <span className="text-xs text-gray-500 mt-1">L'admin a ajouté 5,000 DA à votre portefeuille.</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-center font-medium text-blue-600 justify-center">
                      Tout marquer comme lu
                    </DropdownMenuItem>
                  </DropdownMenuGroup>'''

    new_notifs = '''<DropdownMenuGroup>
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {notificationsCount === 0 && (
                      <div className="p-4 text-sm text-gray-500 text-center">Aucune nouvelle notification</div>
                    )}

                    {recentApps.map(app => (
                      <DropdownMenuItem key={app.id} className="flex flex-col items-start p-3 cursor-pointer">
                        <span className={`text-sm font-medium ${app.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>Visa {app.status === 'Approved' ? 'Approuvé' : 'Rejeté'}</span>
                        <span className="text-xs text-gray-500 mt-1">La demande {app.id} pour {app.travelerName} a été {app.status === 'Approved' ? 'approuvée' : 'rejetée'}.</span>
                      </DropdownMenuItem>
                    ))}

                    {recentRecharges.map(req => (
                      <DropdownMenuItem key={req.id} className="flex flex-col items-start p-3 cursor-pointer">
                        <span className="text-sm font-medium text-green-600">Recharge Validée</span>
                        <span className="text-xs text-gray-500 mt-1">Votre recharge de {req.amount.toLocaleString()} DA a été approuvée.</span>
                      </DropdownMenuItem>
                    ))}

                    {recentTickets.map(ticket => (
                      <DropdownMenuItem key={ticket.id} className="flex flex-col items-start p-3 cursor-pointer">
                        <span className="text-sm font-medium text-blue-600">Ticket Résolu</span>
                        <span className="text-xs text-gray-500 mt-1">Le ticket "{ticket.subject}" a été marqué comme résolu.</span>
                      </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-center font-medium text-blue-600 justify-center">
                      Tout marquer comme lu
                    </DropdownMenuItem>
                  </DropdownMenuGroup>'''

    content = content.replace(old_notifs, new_notifs)
    content = content.replace('<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--color-text-dark)] pointer-events-none"></span>',
    '{notificationsCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--color-text-dark)] pointer-events-none"></span>}')
    
    open('components/agency/AgencyLayout.tsx', 'w').write(content)
