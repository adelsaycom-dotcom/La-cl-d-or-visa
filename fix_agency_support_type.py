import re

with open('components/agency/AgencySupport.tsx', 'r') as f:
    content = f.read()

old_ticket_create = r"""    addSupportTicket\(\{
      agencyId: auth\.currentUser\?\.uid \|\| "mock-id",
      agencyName: auth\.currentUser\?\.email \|\| "mock-agency",
      subject,
      description,
      status: "OPEN",
      isUrgent,
      messages: \[\]
    \}\);"""

new_ticket_create = """    addSupportTicket({
      agencyId: auth.currentUser?.uid || "mock-id",
      agencyName: auth.currentUser?.email || "mock-agency",
      subject,
      description,
      status: "OPEN",
      isUrgent,
      category: "Général",
      priority: isUrgent ? "Haute" : "Moyenne",
      messages: []
    });"""

content = re.sub(old_ticket_create, new_ticket_create, content)

with open('components/agency/AgencySupport.tsx', 'w') as f:
    f.write(content)
