import re

content = open('components/agency/AgencySupport.tsx').read()
content = content.replace('const [isUrgent, setIsUrgent] = useState(false);', 'const [isUrgent, setIsUrgent] = useState(false);\n  const [category, setCategory] = useState("General");\n  const [priority, setPriority] = useState("Normal");')

# Update addSupportTicket call
add_ticket = '''    addSupportTicket({
      agencyId: auth.currentUser?.uid || "mock-agency-id",
      agencyName: auth.currentUser?.email || "Mock Agency",
      subject,
      description,
      status: "OPEN",
      isUrgent,
      messages: [],
      category,
      priority
    });'''
content = re.sub(r'addSupportTicket\(\{.*?\}\);', add_ticket, content, flags=re.DOTALL)

# Remove lastReply and fix date
content = content.replace('<span className="text-amber-500">{t.lastReply}</span>', '')
content = content.replace('Créé le {t.date}', 'Créé le {new Date(t.createdAt || t.date || Date.now()).toLocaleDateString()}')
content = content.replace('selectedTicket.date', 'new Date(selectedTicket.createdAt || selectedTicket.date || Date.now()).toLocaleDateString()')

open('components/agency/AgencySupport.tsx', 'w').write(content)
