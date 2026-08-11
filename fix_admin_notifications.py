import re

content = open('src/App.tsx').read()
if 'const adminPendingApps' not in content:
    calc = '''
  const { applications, rechargeRequests, supportTickets } = useAppStore();
  const adminPendingApps = applications.filter(a => a.status === 'Pending').slice(0, 2);
  const adminPendingRecharges = (rechargeRequests || []).filter(r => r.status === 'Pending').slice(0, 2);
  const adminOpenTickets = (supportTickets || []).filter(t => t.status === 'OPEN').slice(0, 1);
  const adminNotifsCount = adminPendingApps.length + adminPendingRecharges.length + adminOpenTickets.length;
'''
    content = content.replace('function AdminLayout() {\n  const location = useLocation();', 'function AdminLayout() {\n  const location = useLocation();\n' + calc)

    old_notifs = '''<DropdownMenuGroup>
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                      <span className="text-sm font-medium">New Recharge Request</span>
                      <span className="text-xs text-gray-500 mt-1">Global Travel requested 50,000 DA</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                      <span className="text-sm font-medium">Urgent Ticket Options</span>
                      <span className="text-xs text-gray-500 mt-1">Wanderlust Tours opened a new ticket</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-center font-medium text-blue-600 justify-center">
                      Mark all as read
                    </DropdownMenuItem>
                  </DropdownMenuGroup>'''

    new_notifs = '''<DropdownMenuGroup>
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {adminNotifsCount === 0 && (
                      <div className="p-4 text-sm text-gray-500 text-center">Aucune notification</div>
                    )}

                    {adminPendingApps.map(app => (
                      <DropdownMenuItem key={app.id} className="flex flex-col items-start p-3 cursor-pointer">
                        <span className="text-sm font-medium">Nouvelle Demande Visa</span>
                        <span className="text-xs text-gray-500 mt-1">{app.agencyName} a soumis une demande ({app.id})</span>
                      </DropdownMenuItem>
                    ))}

                    {adminPendingRecharges.map(req => (
                      <DropdownMenuItem key={req.id} className="flex flex-col items-start p-3 cursor-pointer">
                        <span className="text-sm font-medium">Demande de Recharge</span>
                        <span className="text-xs text-gray-500 mt-1">{req.agencyName} demande {req.amount.toLocaleString()} DA</span>
                      </DropdownMenuItem>
                    ))}

                    {adminOpenTickets.map(ticket => (
                      <DropdownMenuItem key={ticket.id} className="flex flex-col items-start p-3 cursor-pointer">
                        <span className="text-sm font-medium">Nouveau Ticket</span>
                        <span className="text-xs text-gray-500 mt-1">{ticket.agencyName} a ouvert un ticket</span>
                      </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-center font-medium text-blue-600 justify-center">
                      Mark all as read
                    </DropdownMenuItem>
                  </DropdownMenuGroup>'''

    content = content.replace(old_notifs, new_notifs)
    content = content.replace('<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white pointer-events-none"></span>',
    '{adminNotifsCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white pointer-events-none"></span>}')
    
    open('src/App.tsx', 'w').write(content)
