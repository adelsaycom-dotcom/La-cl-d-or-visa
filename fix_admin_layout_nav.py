import re
content = open('src/App.tsx').read()

# Add useNavigate
content = content.replace('import { BrowserRouter as Router, Routes, Route, Outlet, Link, useLocation } from "react-router-dom";', 'import { BrowserRouter as Router, Routes, Route, Outlet, Link, useLocation, useNavigate } from "react-router-dom";')

# Get navigate inside AdminLayout
content = content.replace('const [mobileMenuOpen, setMobileMenuOpen] = useState(false);', 'const [mobileMenuOpen, setMobileMenuOpen] = useState(false);\n  const navigate = useNavigate();')

# Click handlers
content = content.replace('{adminPendingApps.map(app => (\n                      <DropdownMenuItem key={app.id} className="flex flex-col items-start p-3 cursor-pointer">', '{adminPendingApps.map(app => (\n                      <DropdownMenuItem key={app.id} className="flex flex-col items-start p-3 cursor-pointer" onClick={() => navigate("/admin/applications")}>')

content = content.replace('{adminPendingRecharges.map(req => (\n                      <DropdownMenuItem key={req.id} className="flex flex-col items-start p-3 cursor-pointer">', '{adminPendingRecharges.map(req => (\n                      <DropdownMenuItem key={req.id} className="flex flex-col items-start p-3 cursor-pointer" onClick={() => navigate("/admin/finances")}>')

content = content.replace('{adminOpenTickets.map(ticket => (\n                      <DropdownMenuItem key={ticket.id} className="flex flex-col items-start p-3 cursor-pointer">', '{adminOpenTickets.map(ticket => (\n                      <DropdownMenuItem key={ticket.id} className="flex flex-col items-start p-3 cursor-pointer" onClick={() => navigate("/admin/support")}>')

open('src/App.tsx', 'w').write(content)
