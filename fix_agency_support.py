import re

content = open('components/agency/AgencySupport.tsx').read()
content = content.replace('const MOCK_TICKETS: any[] = [];', '')
content = content.replace('const [tickets, setTickets] = useState(MOCK_TICKETS);', 'const { supportTickets: tickets, addSupportTicket } = useAppStore();')
if 'import { useAppStore }' not in content:
    content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { useAppStore } from "../../src/store/useAppStore";\nimport { auth } from "../../src/firebase";')

# Now for the stats
stats_old = '''const stats = [
    { label: "Tickets ouverts", value: "2", icon: Ticket, color: "text-amber-500", bg: "bg-amber-100" },
    { label: "En cours", value: "1", icon: Clock, color: "text-blue-500", bg: "bg-blue-100" },
    { label: "Résolus", value: "45", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-100" },
  ];'''
stats_new = '''const stats = [
    { label: "Tickets ouverts", value: tickets.filter(t => t.status === "OPEN").length.toString(), icon: Ticket, color: "text-amber-500", bg: "bg-amber-100" },
    { label: "En cours", value: tickets.filter(t => t.status === "IN_PROGRESS").length.toString(), icon: Clock, color: "text-blue-500", bg: "bg-blue-100" },
    { label: "Résolus", value: tickets.filter(t => t.status === "RESOLVED").length.toString(), icon: CheckCircle2, color: "text-green-500", bg: "bg-green-100" },
  ];'''
content = content.replace(stats_old, stats_new)

# Let's fix ticket submission logic
# Wait, I need to see if there is a handleCreateTicket function. Let's find it.
open('components/agency/AgencySupport.tsx', 'w').write(content)
