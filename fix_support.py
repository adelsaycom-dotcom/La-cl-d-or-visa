import re

content = open('components/admin/SupportManagement.tsx').read()
content = content.replace('const [tickets, setTickets] = useState(MOCK_TICKETS);', 'const { supportTickets: tickets, updateSupportTicket } = useAppStore();')
content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { useAppStore } from "../../src/store/useAppStore";')
open('components/admin/SupportManagement.tsx', 'w').write(content)
