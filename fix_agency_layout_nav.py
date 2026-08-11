import re
content = open('components/agency/AgencyLayout.tsx').read()

# Add useNavigate
content = content.replace('import { Outlet, Link } from "react-router-dom";', 'import { Outlet, Link, useNavigate } from "react-router-dom";')

# Get navigate
content = content.replace('const [mobileMenuOpen, setMobileMenuOpen] = useState(false);', 'const [mobileMenuOpen, setMobileMenuOpen] = useState(false);\n  const navigate = useNavigate();')

# Click handlers
content = content.replace('<DropdownMenuItem key={app.id} className="flex flex-col items-start p-3 cursor-pointer">', '<DropdownMenuItem key={app.id} className="flex flex-col items-start p-3 cursor-pointer" onClick={() => navigate("/agency/applications")}>')

content = content.replace('<DropdownMenuItem key={req.id} className="flex flex-col items-start p-3 cursor-pointer">', '<DropdownMenuItem key={req.id} className="flex flex-col items-start p-3 cursor-pointer" onClick={() => navigate("/agency/wallet")}>')

content = content.replace('<DropdownMenuItem key={ticket.id} className="flex flex-col items-start p-3 cursor-pointer">', '<DropdownMenuItem key={ticket.id} className="flex flex-col items-start p-3 cursor-pointer" onClick={() => navigate("/agency/support")}>')

open('components/agency/AgencyLayout.tsx', 'w').write(content)
