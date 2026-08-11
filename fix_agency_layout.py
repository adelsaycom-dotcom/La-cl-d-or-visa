import re

content = open('components/agency/AgencyLayout.tsx').read()
replacement = '''  const { agencyBalance, applications, rechargeRequests, supportTickets } = useAppStore();
  
  // Dynamic notifications for Agency
  const recentApps = applications.filter(a => a.status === 'Approved' || a.status === 'Rejected').slice(0, 2);
  const recentRecharges = (rechargeRequests || []).filter(r => r.status === 'Approved').slice(0, 1);
  const recentTickets = (supportTickets || []).filter(t => t.status === 'RESOLVED').slice(0, 1);
  const notificationsCount = recentApps.length + recentRecharges.length + recentTickets.length;
'''
content = content.replace('const { agencyBalance } = useAppStore();', replacement)
open('components/agency/AgencyLayout.tsx', 'w').write(content)
