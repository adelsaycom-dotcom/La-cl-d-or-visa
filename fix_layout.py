import re

with open('components/agency/AgencyLayout.tsx', 'r') as f:
    content = f.read()

# Replace variables
lines_to_replace = """  // Dynamic notifications for Agency
  const recentApps = applications.filter(a => a.status === 'Approved' || a.status === 'Rejected').slice(0, 2);
  const recentRecharges = (rechargeRequests || []).filter(r => r.status === 'Approved').slice(0, 1);
  const recentTickets = (supportTickets || []).filter(t => t.status === 'RESOLVED').slice(0, 1);
  const notificationsCount = recentApps.length + recentRecharges.length + recentTickets.length;"""

new_vars = """  const unreadNotifications = (notifications || []).filter(n => !n.read).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const notificationsCount = unreadNotifications.length;"""

content = content.replace(lines_to_replace, new_vars)

# Write back
with open('components/agency/AgencyLayout.tsx', 'w') as f:
    f.write(content)
