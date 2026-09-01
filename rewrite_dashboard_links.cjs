const fs = require('fs');
let content = fs.readFileSync('components/agency/Dashboard.tsx', 'utf-8');

const oldServices = `const services = [
    { name: "E-Visa", icon: Plane, path: "/agency/apply?service=evisa", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { name: "Résidence", icon: Building2, path: "/agency/apply?service=residence", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { name: "Assurance", icon: ShieldCheck, path: "/agency/apply?service=assurance", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { name: "Index Passeport", icon: Globe, path: "/agency/passport-index", color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
    { name: "Permis Intl.", icon: Car, path: "/agency/apply?service=permis", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { name: "Études", icon: GraduationCap, path: "/agency/apply?service=etude", color: "bg-purple-50 text-purple-600 border-purple-100" },
    { name: "Invitation", icon: Mail, path: "/agency/apply?service=invitation", color: "bg-pink-50 text-pink-600 border-pink-100" },
    { name: "Rendez-vous", icon: CalendarDays, path: "/agency/apply?service=rendezvous", color: "bg-orange-50 text-orange-600 border-orange-100" },
    { name: "Dossier", icon: FolderOpen, path: "/agency/apply?service=dossier", color: "bg-teal-50 text-teal-600 border-teal-100" },
    { name: "Voyage Org.", icon: Map, path: "/agency/trips", color: "bg-rose-50 text-rose-600 border-rose-100" },
  ];`;

const newServices = `const services = [
    { name: "Visa", icon: FileText, path: "/agency/apply?service=Visa", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { name: "E-Visa", icon: Globe, path: "/agency/apply?service=E-Visa", color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
    { name: "Dossier Résidence", icon: Building2, path: "/agency/apply?service=Dossier Résidence", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { name: "Rendez-vous", icon: CalendarDays, path: "/agency/apply?service=Prise de Rendez-vous", color: "bg-orange-50 text-orange-600 border-orange-100" },
    { name: "Traitement de Dossier", icon: FolderOpen, path: "/agency/apply?service=Traitement de Dossier", color: "bg-teal-50 text-teal-600 border-teal-100" },
    { name: "Permis Intl.", icon: Car, path: "/agency/apply?service=Permis internationnal", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { name: "Visa Études", icon: GraduationCap, path: "/agency/study", color: "bg-purple-50 text-purple-600 border-purple-100" },
    { name: "Assurance Voyage", icon: ShieldCheck, path: "/agency/assurance", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  ];`;

content = content.replace(oldServices, newServices);
fs.writeFileSync('components/agency/Dashboard.tsx', content);
