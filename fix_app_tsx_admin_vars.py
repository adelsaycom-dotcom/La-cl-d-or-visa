import re

content = open('src/App.tsx').read()

calc = '''
  const { applications, rechargeRequests, supportTickets } = useAppStore();
  const adminPendingApps = applications.filter((a: any) => a.status === 'Pending').slice(0, 2);
  const adminPendingRecharges = (rechargeRequests || []).filter((r: any) => r.status === 'Pending').slice(0, 2);
  const adminOpenTickets = (supportTickets || []).filter((t: any) => t.status === 'OPEN').slice(0, 1);
  const adminNotifsCount = adminPendingApps.length + adminPendingRecharges.length + adminOpenTickets.length;
'''

content = content.replace('function AdminLayout() {', 'function AdminLayout() {' + calc)
open('src/App.tsx', 'w').write(content)
