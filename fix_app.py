import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix Globe2
if "import { Globe2" not in content:
    content = content.replace("import { LayoutDashboard, Earth, Users, FileText, CheckCircle2, Clock, Map, TrendingUp, DollarSign, LifeBuoy, Settings, LogOut, Search, Bell, MapPin, X, ChevronRight, Check } from 'lucide-react';", "import { Globe2, LayoutDashboard, Earth, Users, FileText, CheckCircle2, Clock, Map, TrendingUp, DollarSign, LifeBuoy, Settings, LogOut, Search, Bell, MapPin, X, ChevronRight, Check } from 'lucide-react';")

content = content.replace('import { ServiceCatalog } from "../components/admin/ServiceCatalog";', 'import { ServiceCatalog } from "./components/admin/ServiceCatalog";')
content = content.replace('import { AdminSettings } from "../components/admin/AdminSettings";', 'import { AdminSettings } from "./components/admin/AdminSettings";')

with open('src/App.tsx', 'w') as f:
    f.write(content)
