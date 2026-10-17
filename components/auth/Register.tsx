import { useState } from "react";
import { auth, db } from "../../src/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Zap, 
  Headphones, 
  Plane, 
  FileText
} from "lucide-react";
import { Logo } from "@/components/Logo";

interface MapHub {
  id: string;
  name: string;
  top: string;
  left: string;
  speed: string;
  approval: string;
  delay: string;
}

const HUBS: MapHub[] = [
  { id: "paris", name: "Paris (France)", top: "37%", left: "48%", speed: "48h", approval: "99.4%", delay: "0s" },
  { id: "dubai", name: "Dubaï (EAU)", top: "45%", left: "59%", speed: "24h", approval: "99.8%", delay: "0.5s" },
  { id: "istanbul", name: "Istanbul (Turquie)", top: "40%", left: "54%", speed: "24h", approval: "99.7%", delay: "1s" },
  { id: "rome", name: "Rome (Italie)", top: "41%", left: "49.5%", speed: "72h", approval: "98.9%", delay: "1.5s" },
  { id: "madrid", name: "Madrid (Espagne)", top: "42%", left: "46%", speed: "72h", approval: "98.5%", delay: "2s" },
  { id: "london", name: "Londres (UK)", top: "34%", left: "47%", speed: "5j", approval: "97.8%", delay: "2.5s" },
  { id: "beijing", name: "Pékin (Chine)", top: "39%", left: "73%", speed: "4j", approval: "99.1%", delay: "3s" },
  { id: "riyadh", name: "Riyad (Arabie S.)", top: "47%", left: "57%", speed: "24h", approval: "99.9%", delay: "3.5s" },
  { id: "algiers", name: "Alger (Siège B2B)", top: "43%", left: "48%", speed: "Hub Central", approval: "100%", delay: "0.2s" }
];

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    agencyName: "",
    rcNumber: "",
    nifNumber: "",
    managerLastName: "",
    managerFirstName: "",
    email: "",
    phone: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [activeHub, setActiveHub] = useState<string | null>(null);

  const update = (field: string, val: string) => setFormData(p => ({ ...p, [field]: val }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const userCred = await createUserWithEmailAndPassword(auth, formData.email.trim(), formData.password);
      
      try {
        await setDoc(doc(db, "users", userCred.user.uid), {
          role: "agency",
          status: "PENDING",
          agencyName: formData.agencyName.trim(),
          rcNumber: formData.rcNumber.trim(),
          nifNumber: formData.nifNumber.trim(),
          managerLastName: formData.managerLastName.trim(),
          managerFirstName: formData.managerFirstName.trim(),
          contactName: `${formData.managerFirstName.trim()} ${formData.managerLastName.trim()}`,
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          balance: 0,
          createdAt: new Date().toISOString()
        });
        setIsSubmittedSuccess(true);
      } catch (firestoreErr: any) {
        // If Firestore write fails, delete the orphaned Auth user so they can retry
        console.error("Erreur Firestore:", firestoreErr);
        try {
          await userCred.user.delete();
        } catch(deleteErr) {
          console.error("Impossible de supprimer l'utilisateur orphelin:", deleteErr);
        }
        setError("Erreur de base de données. Veuillez réessayer. (" + firestoreErr.message + ")");
      }
    } catch(err: any) {
      console.error("Erreur d'inscription complète:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Cette adresse email est déjà associée à un compte partenaire.");
      } else if (err.code === "auth/weak-password") {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
      } else if (err.code === "auth/invalid-email") {
        setError("Veuillez saisir une adresse email valide.");
      } else {
        setError("Erreur lors de l'inscription. Veuillez vérifier vos informations ou réessayer plus tard.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-white font-sans text-slate-900 selection:bg-[#7B1B38]/20 selection:text-[#7B1B38]">
      
      {/* ========================================================
          LEFT COLUMN: Brand Showcase, Stats & Interactive Map (6 cols)
          ======================================================== */}
      <div className="lg:col-span-6 xl:col-span-6 bg-[#f1f4f8] p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden min-h-[480px] lg:min-h-screen border-b lg:border-b-0 lg:border-r border-slate-200">
        
        {/* Subtle dot grid pattern background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-60" 
          style={{
            backgroundImage: "radial-gradient(rgba(15, 23, 42, 0.08) 1.2px, transparent 1.2px)",
            backgroundSize: "24px 24px"
          }}
        />

        {/* Top: Brand Logo */}
        <div className="relative z-20 flex items-center justify-between">
          <Link to="/" className="inline-block transition-transform duration-300 hover:scale-105">
            <Logo />
          </Link>

          <Link 
            to="/" 
            className="lg:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#7B1B38] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Accueil</span>
          </Link>
        </div>

        {/* Middle: Headline & Value Proposition */}
        <div className="relative z-20 my-auto py-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7B1B38]/10 text-[#7B1B38] text-xs font-bold tracking-wide uppercase mb-4 border border-[#7B1B38]/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Réseau d'Agences Partenaires
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-[1.2] tracking-tight mb-4">
            Rejoignez la première plateforme B2B de traitement de visas{" "}
            <span className="text-[#7B1B38] underline decoration-[#7B1B38]/30 underline-offset-4">en Algérie</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
            Automatisez les demandes de visas de vos clients, bénéficiez de tarifs agences négociés et profitez d'un accompagnement consulaire dédié.
          </p>

          {/* Quick Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all group">
              <div className="w-8 h-8 rounded-lg bg-[#7B1B38]/10 flex items-center justify-center text-[#7B1B38] mb-2 group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">Traitement 24-72h</div>
              <div className="text-[11px] text-slate-500 font-medium">Délais records garantis</div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all group">
              <div className="w-8 h-8 rounded-lg bg-[#7B1B38]/10 flex items-center justify-center text-[#7B1B38] mb-2 group-hover:scale-110 transition-transform">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">Assistance Dédiée</div>
              <div className="text-[11px] text-slate-500 font-medium">Conseiller B2B attitré</div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all group">
              <div className="w-8 h-8 rounded-lg bg-[#7B1B38]/10 flex items-center justify-center text-[#7B1B38] mb-2 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">Validation 99.4%</div>
              <div className="text-[11px] text-slate-500 font-medium">Audit anti-rejet</div>
            </div>
          </div>
        </div>

        {/* Ambient: Interactive World Map with Flight Paths & Hotspots */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-35 lg:opacity-40">
          <div className="relative w-full h-full max-w-[1200px] flex items-center justify-center">
            {/* World Map PNG */}
            <img 
              src="/world-map.png" 
              alt="Carte Mondiale La Clé D'or" 
              className="w-full h-auto max-h-[85vh] object-contain select-none"
            />

            {/* Animated SVG Flight Pulse */}
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
              style={{ overflow: "visible" }}
            >
              <defs>
                <filter id="register-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="0.4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path 
                d="M 27,37 Q 38,28 48,35 Q 54,40 59,45 Q 63,46 67,47 Q 71,52 75,57 Q 79,62 83,67 Q 78,50 73,39 Q 60,36 46,32 Q 35,34 27,37"
                fill="none"
                stroke="#7B1B38"
                strokeWidth="0.4"
                strokeDasharray="2 4"
                strokeLinecap="round"
                opacity="0.35"
              />
              <path 
                d="M 27,37 Q 38,28 48,35 Q 54,40 59,45 Q 63,46 67,47 Q 71,52 75,57 Q 79,62 83,67 Q 78,50 73,39 Q 60,36 46,32 Q 35,34 27,37"
                fill="none"
                stroke="#7B1B38"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeDasharray="2 400"
                filter="url(#register-glow)"
                style={{
                  animation: "pulseFlow 45s linear infinite"
                }}
              />
            </svg>

            {/* Interactive Global Hub Dots with Tooltips */}
            {HUBS.map((hub) => (
              <div
                key={hub.id}
                onMouseEnter={() => setActiveHub(hub.id)}
                onMouseLeave={() => setActiveHub(null)}
                className="absolute pointer-events-auto cursor-pointer group"
                style={{
                  top: hub.top,
                  left: hub.left,
                  transform: "translate(-50%, -50%)"
                }}
              >
                <span className="relative flex h-3 w-3">
                  <span 
                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B1B38] opacity-75"
                    style={{ animationDelay: hub.delay }}
                  />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7B1B38] border-2 border-white shadow-sm transition-transform duration-200 group-hover:scale-150" />
                </span>

                <div 
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 p-2.5 rounded-lg bg-slate-900/95 backdrop-blur-md text-white text-xs shadow-xl border border-white/10 transition-all duration-200 z-30 pointer-events-none ${
                    activeHub === hub.id ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-1"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                    <Plane className="w-3.5 h-3.5 text-[#7B1B38]" />
                    <span>{hub.name}</span>
                  </div>
                  <div className="space-y-0.5 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span>Délai moyen :</span>
                      <strong className="text-white">{hub.speed}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Taux d'accord :</span>
                      <strong className="text-emerald-400">{hub.approval}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Trust badge */}
        <div className="relative z-20 pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">Réseau Opérationnel & Agréé</span>
          </div>
          <div className="hidden sm:block text-slate-400">
            Dépôt & retours consulaires sécurisés
          </div>
        </div>
      </div>

      {/* ========================================================
          RIGHT COLUMN: Modern Registration Card & Form (6 cols)
          ======================================================== */}
      <div className="lg:col-span-6 xl:col-span-6 bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-center relative z-10 overflow-y-auto">
        
        {/* Top Status & Back button */}
        <div className="w-full max-w-xl flex justify-between items-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7B1B38]/10 border border-[#7B1B38]/20 text-[#7B1B38] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#7B1B38] animate-pulse" />
            <span>Demande d'Accès Agence B2B</span>
          </div>

          <Link 
            to="/" 
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#7B1B38] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour accueil</span>
          </Link>
        </div>

        <div className="w-full max-w-xl space-y-6">
          
          {/* Header */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Inscription Partenaire
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Remplissez les informations de votre agence pour obtenir vos accès certifiés
            </p>
          </div>

          {/* Success Screen if already submitted */}
          {isSubmittedSuccess ? (
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Demande Transmise avec Succès !</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  Votre dossier d'adhésion a bien été enregistré. Notre équipe partenariats vérifiera vos coordonnées et vous contactera sous 24h pour activer votre espace professionnel.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-sm shadow-lg shadow-[#7B1B38]/25 transition-all"
                >
                  <span>Aller à la page de Connexion</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Error Banner */}
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="font-medium leading-relaxed">{error}</div>
                </div>
              )}

              {/* Form */}
              <form className="space-y-5" onSubmit={handleRegister}>
                
                {/* Section 1: Informations de l'Agence */}
                <div className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-900 font-bold text-xs uppercase tracking-wider">
                    <Building2 className="w-4 h-4 text-[#7B1B38]" />
                    <span>1. Informations de l'Agence</span>
                  </div>

                  {/* Nom Agence */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Nom de l'Agence <span className="text-[#7B1B38]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex : Voyages Etoile d'Or"
                      value={formData.agencyName}
                      onChange={(e) => update("agencyName", e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#7B1B38] focus:ring-2 focus:ring-[#7B1B38]/15 transition-all"
                    />
                  </div>

                  {/* RC & NIF */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>N° Registre de Commerce (RC) *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex : 16/00-1234567B19"
                        value={formData.rcNumber}
                        onChange={(e) => update("rcNumber", e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#7B1B38] focus:ring-2 focus:ring-[#7B1B38]/15 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>NIF *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex : 001916001234567"
                        value={formData.nifNumber}
                        onChange={(e) => update("nifNumber", e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#7B1B38] focus:ring-2 focus:ring-[#7B1B38]/15 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Coordonnées du Responsable */}
                <div className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-900 font-bold text-xs uppercase tracking-wider">
                    <User className="w-4 h-4 text-[#7B1B38]" />
                    <span>2. Coordonnées du Gérant</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex : Benali"
                        value={formData.managerLastName}
                        onChange={(e) => update("managerLastName", e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#7B1B38] focus:ring-2 focus:ring-[#7B1B38]/15 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex : Karim"
                        value={formData.managerFirstName}
                        onChange={(e) => update("managerFirstName", e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#7B1B38] focus:ring-2 focus:ring-[#7B1B38]/15 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Identifiants & Contact */}
                <div className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-900 font-bold text-xs uppercase tracking-wider">
                    <Mail className="w-4 h-4 text-[#7B1B38]" />
                    <span>3. Accès & Coordonnées B2B</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Email Professionnel *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          autoComplete="email"
                          required
                          placeholder="direction@votre-agence.com"
                          value={formData.email}
                          onChange={(e) => update("email", e.target.value)}
                          className="w-full h-11 px-3.5 pl-9 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#7B1B38] focus:ring-2 focus:ring-[#7B1B38]/15 transition-all"
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Téléphone *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          autoComplete="tel"
                          required
                          placeholder="05 XX XX XX XX"
                          value={formData.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          className="w-full h-11 px-3.5 pl-9 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#7B1B38] focus:ring-2 focus:ring-[#7B1B38]/15 transition-all"
                        />
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  {/* Mot de passe */}
                  <div className="space-y-1 pt-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Mot de Passe de Connexion *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        placeholder="Minimum 6 caractères"
                        value={formData.password}
                        onChange={(e) => update("password", e.target.value)}
                        className="w-full h-11 px-3.5 pr-10 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#7B1B38] focus:ring-2 focus:ring-[#7B1B38]/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                        tabIndex={-1}
                        title={showPassword ? "Masquer" : "Afficher"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit button in #7B1B38 */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 px-6 rounded-xl bg-[#7B1B38] hover:bg-[#63142c] active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#7B1B38]/25 hover:shadow-xl hover:shadow-[#7B1B38]/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Transmission du dossier...</span>
                      </>
                    ) : (
                      <>
                        <span>Soumettre la Demande d'Adhésion</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

              </form>

              {/* Login link */}
              <div className="text-center pt-2 pb-4 text-xs text-slate-500 font-medium">
                Votre agence a déjà un compte partenaire ?{" "}
                <Link 
                  to="/login" 
                  className="font-bold text-[#7B1B38] hover:underline transition-colors"
                >
                  Se connecter à l'Espace Pro
                </Link>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
}
