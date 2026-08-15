import re

with open('components/agency/AgencyLayout.tsx', 'r') as f:
    content = f.read()

# Replace the specific lines I see:
bad_block = """  // Dynamic notifications for Agency
  const recentApps = applications.filter(a => a.status === 'Approved' || a.status === 'Rejected').slice(0, 2);
  const recentRecharges = (rechargeRequests || []).filter(r => r.status === 'Approved').slice(0, 1);
  const recentTickets = (supportTickets || []).filter(t => t.status === 'RESOLVED').slice(0, 1);
  const notificationsCount = recentApps.length + recentRecharges.length + recentTickets.length;"""

if bad_block in content:
    content = content.replace(bad_block, "  const unreadNotifications = (notifications || []).filter(n => !n.read).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());\n  const notificationsCount = unreadNotifications.length;")
else:
    print("Could not find the specific block")
    
# Wait, I already added `const unreadNotifications = ` in the last regex. Let's see what's actually there.
