import re

content = open('components/admin/AdminDashboard.tsx').read()
if 'const { applications, agencies, transactions' not in content:
    if 'import { useAppStore }' not in content:
        content = content.replace('import { Button } from "@/components/ui/button";', 'import { Button } from "@/components/ui/button";\nimport { useAppStore } from "../../src/store/useAppStore";')
    
    content = content.replace('export function AdminDashboard() {', '''export function AdminDashboard() {
  const { applications, agencies, transactions, rechargeRequests } = useAppStore();
  const today = new Date().toISOString().split("T")[0];
  const appsToday = applications.filter(a => a.submissionDate?.startsWith(today)).length;
  const pendingApps = applications.filter(a => a.status === "Pending").length;
  const activeAgencies = agencies.filter(a => a.status === "ACTIVE").length;
  const pendingRecharges = (rechargeRequests || []).filter(r => r.status === "Pending").length;
''')

    # Now replace the hardcoded values. Wait, let's see what the HTML is.
    # Total Demandes du jour: "14"
    # En attente d'examen: "32"
    # Let me check the exact HTML first.
    open('components/admin/AdminDashboard.tsx', 'w').write(content)
