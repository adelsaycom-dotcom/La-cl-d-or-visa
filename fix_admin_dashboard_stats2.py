import re

content = open('components/admin/AdminDashboard.tsx').read()
content = content.replace('<div className="text-3xl font-bold mt-2">14</div>', '<div className="text-3xl font-bold mt-2">{appsToday}</div>')
content = content.replace('<div className="text-3xl font-bold text-amber-700 mt-2">32</div>', '<div className="text-3xl font-bold text-amber-700 mt-2">{pendingApps}</div>')
content = content.replace('<div className="text-3xl font-bold mt-2">128</div>', '<div className="text-3xl font-bold mt-2">{activeAgencies}</div>')
content = content.replace('3 en attente d\'approbation', '{pendingRecharges} recharges en attente')

# For the total volume:
# <div className="text-3xl font-bold font-mono tracking-tight mt-2">1.2M <span className="text-lg">DA</span></div>
# Let's sum up transactions
total_volume = '''  const totalVolume = transactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);
  const formattedVolume = totalVolume > 1000000 ? (totalVolume/1000000).toFixed(1) + "M" : totalVolume.toLocaleString();
'''
content = content.replace('const pendingRecharges = (rechargeRequests || []).filter(r => r.status === "Pending").length;', 'const pendingRecharges = (rechargeRequests || []).filter(r => r.status === "Pending").length;\n' + total_volume)
content = content.replace('1.2M', '{formattedVolume}')

open('components/admin/AdminDashboard.tsx', 'w').write(content)
