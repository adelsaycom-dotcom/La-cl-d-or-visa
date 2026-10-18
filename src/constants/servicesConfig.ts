import { 
  FileText, Mail, Plane, Building2, CalendarDays, FolderOpen, Car, 
  GraduationCap, ShieldCheck, Map 
} from "lucide-react";

export interface AgencyServiceConfig {
  id: string;
  name: string;
  badge: string;
  description: string;
  icon: any;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  path: string;
  matchKeys: string[];
  isExternalLink?: boolean;
}

/**
 * Référentiel UNIQUE des 10 services officiels de la plateforme B2B.
 * Utilisé à l'identique sur :
 * - Le Tableau de bord Agence (Dashboard.tsx)
 * - Le Sélecteur multi-services "Nouvelle Demande" (VisaWizard.tsx)
 */
export const AGENCY_SERVICES: AgencyServiceConfig[] = [
  {
    id: "visa",
    name: "Visa B2B",
    badge: "Délivrance rapide",
    description: "Visas consulaires officiels et visas électroniques (tourisme, affaires, transit).",
    icon: FileText,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200 hover:border-blue-400",
    path: "/agency/apply?service=Visa",
    matchKeys: ["visa", "visab2b", "visa b2b", "evisa", "e-visa"]
  },
  {
    id: "invitation",
    name: "Invitation",
    badge: "Garanti 100%",
    description: "Invitations d'affaires officielles, attestations consulaires et visas business.",
    icon: Mail,
    color: "bg-cyan-50 text-cyan-600 border-cyan-100",
    textColor: "text-cyan-700",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200 hover:border-cyan-400",
    path: "/agency/apply?service=Invitation",
    matchKeys: ["invitation", "affaires", "business"]
  },
  {
    id: "trips",
    name: "Voyages Organisés",
    badge: "Départs garantis",
    description: "Séjours de groupe tout compris, pèlerinages Omra, hôtels et excursions avec guide.",
    icon: Plane,
    color: "bg-pink-50 text-pink-600 border-pink-100",
    textColor: "text-pink-700",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200 hover:border-pink-400",
    path: "/agency/trips",
    matchKeys: ["voyages", "voyages organisés", "omra", "séjours"],
    isExternalLink: true
  },
  {
    id: "residence",
    name: "Dossier Résidence",
    badge: "Accompagnement VIP",
    description: "Résidence permanente, permis de séjour temporaire et regroupement familial.",
    icon: Building2,
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    textColor: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200 hover:border-indigo-400",
    path: "/agency/apply?service=Dossier Résidence",
    matchKeys: ["residence", "dossier résidence", "séjour", "titre de séjour"]
  },
  {
    id: "rendezvous",
    name: "Rendez-vous",
    badge: "Créneaux prioritaires",
    description: "Réservation de créneaux rapides TLScontact, VFS Global, BLS et consulats.",
    icon: CalendarDays,
    color: "bg-orange-50 text-orange-600 border-orange-100",
    textColor: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200 hover:border-orange-400",
    path: "/agency/apply?service=Prise de Rendez-vous",
    matchKeys: ["rendez-vous", "prise de rendez-vous", "rdv", "tls", "vfs", "bls"]
  },
  {
    id: "dossier",
    name: "Traitement de Dossier",
    badge: "Conformité consulaire",
    description: "Montage complet de dossiers, vérification d'éligibilité et traductions assermentées.",
    icon: FolderOpen,
    color: "bg-teal-50 text-teal-600 border-teal-100",
    textColor: "text-teal-700",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200 hover:border-teal-400",
    path: "/agency/apply?service=Traitement de Dossier",
    matchKeys: ["dossier", "traitement de dossier", "traduction", "formulaire"]
  },
  {
    id: "permis",
    name: "Permis Intl.",
    badge: "Valide 3 ans",
    description: "Délivrance rapide du livret officiel de permis de conduire international auto & moto.",
    icon: Car,
    color: "bg-amber-50 text-amber-600 border-amber-100",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200 hover:border-amber-400",
    path: "/agency/apply?service=Permis internationnal",
    matchKeys: ["permis", "permis internationnal", "permis international", "conduire"]
  },
  {
    id: "study",
    name: "Visa Études",
    badge: "Universités mondiales",
    description: "Inscriptions universitaires, acceptations Campus France et procédures visa étudiant.",
    icon: GraduationCap,
    color: "bg-purple-50 text-purple-600 border-purple-100",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200 hover:border-purple-400",
    path: "/agency/study",
    matchKeys: ["etude", "visa études", "études", "université"],
    isExternalLink: true
  },
  {
    id: "assurance",
    name: "Assurance Voyage",
    badge: "Agréé consulat",
    description: "Polices d'assurance voyage conformes aux exigences consulaires et espace Schengen.",
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    textColor: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200 hover:border-emerald-400",
    path: "/agency/assurance",
    matchKeys: ["assurance", "assurance voyage", "rapatriement"],
    isExternalLink: true
  },
  {
    id: "passport-index",
    name: "Index Passeport",
    badge: "Outil exclusif",
    description: "Guide interactif d'accès mondial et conditions d'entrée avec passeport algérien.",
    icon: Map,
    color: "bg-rose-50 text-rose-600 border-rose-100",
    textColor: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200 hover:border-rose-400",
    path: "/agency/passport-index",
    matchKeys: ["index passeport", "passeport", "mobilité"],
    isExternalLink: true
  }
];
