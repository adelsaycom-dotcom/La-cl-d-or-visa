import { useState } from "react";
import { auth, db } from "../../src/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Headphones, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  KeyRound, 
  Plane, 
  Lock 
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useLanguage } from "../../src/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

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
  { id: "paris", name: "Hub Paris (CDG)", top: "35%", left: "48%", speed: "24-48h", approval: "99.4%", delay: "0.1s" },
  { id: "london", name: "Hub London", top: "32%", left: "46%", speed: "48h", approval: "99.2%", delay: "0.2s" },
  { id: "dubai", name: "Hub Dubai (DXB)", top: "45%", left: "59%", speed: "24h Express", approval: "99.8%", delay: "0.3s" },
  { id: "delhi", name: "Hub New Delhi", top: "47%", left: "67%", speed: "48-72h", approval: "99.3%", delay: "0.4s" },
  { id: "singapore", name: "Hub Singapore", top: "57%", left: "75%", speed: "24-48h", approval: "99.7%", delay: "0.5s" },
  { id: "beijing", name: "Hub Beijing", top: "39%", left: "73%", speed: "72h", approval: "99.1%", delay: "0.6s" },
  { id: "sydney", name: "Hub Sydney", top: "67%", left: "83%", speed: "4-5 days", approval: "98.9%", delay: "0.7s" },
  { id: "newyork", name: "Hub New York (JFK)", top: "37%", left: "27%", speed: "3-5 days", approval: "98.6%", delay: "0.8s" },
  { id: "dakar", name: "Hub Dakar / Abidjan", top: "50%", left: "43%", speed: "48h", approval: "99.0%", delay: "0.9s" },
];

export function Login() {
  const { language, t } = useLanguage();
  const isEn = language === "en";
  const navigate = useNavigate();
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Password reset modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");

  // Hover state for interactive map hub tooltip
  const [activeHub, setActiveHub] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
      const userEmail = (userCred.user.email || "").toLowerCase();
      const isAdminEmail = 
        userEmail === "adel.saycom@gmail.com" || 
        userEmail === "admin@cle-dor.com" || 
        userEmail === "admin@lacle-dor.com";
      
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        if (role === "admin" || isAdminEmail) {
          navigate("/admin");
        } else {
          const status = userDoc.data().status;
          if (status === "PENDING") {
            setErrorMessage(isEn ? "Your account is awaiting approval by the administrator." : "Votre compte est en attente de validation par l'administrateur.");
            auth.signOut();
          } else if (status === "SUSPENDED") {
            setErrorMessage(isEn ? "Your account has been suspended. Please contact support." : "Votre compte a été suspendu. Veuillez contacter le support.");
            auth.signOut();
          } else {
            navigate("/agency");
          }
        }
      } else if (isAdminEmail) {
        // Auto-heal admin document if wiped
        await setDoc(doc(db, "users", userCred.user.uid), {
          id: userCred.user.uid,
          email: userCred.user.email,
          role: "admin",
          status: "ACTIVE",
          createdAt: new Date().toISOString()
        }, { merge: true });
        navigate("/admin");
      } else {
        // Normal agency fallback
        navigate("/agency");
      }
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setErrorMessage(isEn ? "Incorrect email or password. Please verify and try again." : "Identifiants incorrects. Veuillez vérifier votre e-mail et mot de passe.");
      } else if (err.code === "auth/too-many-requests") {
        setErrorMessage(isEn ? "Too many attempts. Account temporarily locked for security." : "Trop de tentatives infructueuses. Veuillez patienter avant de réessayer.");
      } else {
        setErrorMessage(err.message || (isEn ? "Login failed. Please check your connection." : "Une erreur est survenue lors de la connexion."));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetError(isEn ? "Please enter your professional email address." : "Veuillez saisir votre adresse email professionnelle.");
      return;
    }
    setResetLoading(true);
    setResetError("");
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setResetSuccess(true);
    } catch (err: any) {
      console.error("Erreur réinitialisation mot de passe:", err);
      if (err.code === "auth/user-not-found") {
        setResetError(isEn ? "No account matches this email address." : "Aucun compte n'est associé à cette adresse e-mail.");
      } else {
        setResetError(isEn ? "Unable to send reset email. Please try again." : "Erreur lors de l'envoi de l'e-mail. Veuillez réessayer.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 grid grid-cols-1 lg:grid-cols-12 overflow-x-hidden selection:bg-[#7B1B38]/20 selection:text-[#7B1B38]">
      
      {/* ========================================================
          LEFT COLUMN: Brand, World Map & Global Network (7 cols)
          ======================================================== */}
      <div className="lg:col-span-7 bg-gradient-to-br from-slate-100 via-white to-slate-100 p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 relative overflow-hidden">
        
        {/* Top: Brand Logo & Back Link */}
        <div className="relative z-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#7B1B38] bg-white/80 backdrop-blur-sm border border-slate-200 px-3.5 py-1.5 rounded-full transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? "Home" : "Accueil"}</span>
          </Link>
        </div>

        {/* Middle: Headline & Key Stats */}
        <div className="relative z-20 my-auto py-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7B1B38]/10 text-[#7B1B38] text-xs font-bold tracking-wide uppercase mb-5 border border-[#7B1B38]/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isEn ? "Accredited B2B Partner Portal" : "Portail Partenaire Agréé B2B"}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-8">
            {isEn ? "Your Trusted Partner for Wholesale Visa Operations" : "Votre partenaire de confiance en traitement de visas"}{" "}
            <span className="text-[#7B1B38] underline decoration-[#7B1B38]/30 underline-offset-4">B2B</span>
          </h1>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-9 h-9 rounded-lg bg-[#7B1B38]/10 flex items-center justify-center text-[#7B1B38] mb-2.5 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {isEn ? "Express Intake" : "Traitement Express"}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {isEn ? "24h to 72h turnaround" : "Délais 24h à 72h"}
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-9 h-9 rounded-lg bg-[#7B1B38]/10 flex items-center justify-center text-[#7B1B38] mb-2.5 group-hover:scale-110 transition-transform">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {isEn ? "Dedicated Support" : "Support Dédié"}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {isEn ? "24/7 Experts" : "Experts 24/7"}
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-9 h-9 rounded-lg bg-[#7B1B38]/10 flex items-center justify-center text-[#7B1B38] mb-2.5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {isEn ? "Maximum Security" : "Sécurité Maximale"}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {isEn ? "Anti-rejection review" : "Contrôle anti-rejet"}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom / Ambient: Interactive World Map with Flight Paths & Hotspots */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-35 lg:opacity-45">
          <div className="relative w-full h-full max-w-[1200px] flex items-center justify-center">
            {/* World Map PNG */}
            <img 
              src="/world-map.png" 
              alt="Carte Mondiale La Clé D'or" 
              className="w-full h-auto max-h-[85vh] object-contain select-none"
            />

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
                {/* Center dot */}
                <span className="relative flex h-3 w-3">
                  <span 
                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B1B38] opacity-75"
                    style={{ animationDelay: hub.delay }}
                  />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7B1B38] border-2 border-white shadow-sm transition-transform duration-200 group-hover:scale-150" />
                </span>

                {/* Custom Tooltip */}
                <div 
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 p-2.5 rounded-lg bg-slate-900/95 backdrop-blur-md text-white text-xs shadow-xl border border-white/10 transition-all duration-200 z-30 pointer-events-none ${
                    activeHub === hub.id ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-1"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                    <Plane className="w-3.5 h-3.5 text-[#7B1B38]" />
                    <span>{hub.name}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-300 border-t border-white/10 pt-1 mt-1">
                    <span>{isEn ? "Avg. Turnaround:" : "Délai moyen :"}</span>
                    <strong className="text-white">{hub.speed}</strong>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>{isEn ? "Approval:" : "Approbation :"}</span>
                    <strong className="text-emerald-400 font-semibold">{hub.approval}</strong>
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-20 pt-6 text-xs text-slate-500 font-medium hidden sm:flex items-center justify-between border-t border-slate-200/70">
          <span>{isEn ? "Certified B2B Platform • All rights reserved La Clé D'or" : "Plateforme B2B certifiée • Tous droits réservés La Clé D'or"}</span>
          <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
            <Lock className="w-3.5 h-3.5 text-emerald-600" /> {isEn ? "AES-256 Encryption" : "Chiffrement AES-256"}
          </span>
        </div>
      </div>

      {/* ========================================================
          RIGHT COLUMN: Login Card & Form (5 cols)
          ======================================================== */}
      <div className="lg:col-span-5 bg-white p-6 sm:p-10 lg:p-14 flex flex-col justify-center items-center relative z-10">
        
        {/* Top Status Badge & Language Switcher */}
        <div className="w-full max-w-md flex justify-between items-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isEn ? "Secure B2B Portal" : "Portail Sécurisé B2B"}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <LanguageSwitcher variant="outline" />
            <Link 
              to="/" 
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#7B1B38] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t("nav.backToHome")}</span>
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md space-y-7">
          
          {/* Header */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t("auth.loginTitle")}
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-1.5">
              {t("auth.loginSubtitle")}
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                {t("auth.emailLabel")}
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder={isEn ? "contact@your-agency.com" : "contact@votre-agence.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 pl-10 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#7B1B38] focus:ring-2 focus:ring-[#7B1B38]/15 transition-all shadow-2xs"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  {t("auth.passwordLabel")}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email.trim());
                    setResetSuccess(false);
                    setResetError("");
                    setShowResetModal(true);
                  }}
                  className="text-xs font-semibold text-[#7B1B38] hover:underline transition-colors"
                >
                  {t("auth.forgotPassword")}
                </button>
              </div>

              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 pl-10 pr-11 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#7B1B38] focus:ring-2 focus:ring-[#7B1B38]/15 transition-all shadow-2xs"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-1">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#7B1B38] focus:ring-[#7B1B38] accent-[#7B1B38] cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-slate-600 cursor-pointer">
                {t("auth.rememberMe")}
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-[#7B1B38] hover:bg-[#63142c] active:scale-[0.99] text-white text-sm font-bold shadow-md shadow-[#7B1B38]/25 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t("auth.loggingIn")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("auth.loginButton")}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sign up prompt & Back to Home */}
          <div className="pt-4 border-t border-slate-100 space-y-3 text-center">
            <p className="text-xs text-slate-500 font-medium">
              {t("auth.noAccount")}{" "}
              <Link 
                to="/register" 
                className="font-bold text-[#7B1B38] hover:underline transition-colors"
              >
                {t("auth.registerLink")}
              </Link>
            </p>

            <div className="text-center">
              <Link 
                to="/" 
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isEn ? "Return to Home Page" : "Retourner à la page d'accueil"}</span>
              </Link>
            </div>
          </div>

          {/* Support help footnote */}
          <div className="pt-2 text-center text-[11px] text-slate-400">
            {isEn ? "Need assistance with your portal access?" : "Besoin d'aide pour vos accès ?"}{" "}
            <a 
              href="mailto:support@lacledortravel.com" 
              className="text-[#7B1B38] hover:underline font-medium"
            >
              support@lacledortravel.com
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================
          PASSWORD RESET MODAL
          ======================================================== */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#7B1B38]/10 flex items-center justify-center text-[#7B1B38]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isEn ? "Reset Password" : "Mot de passe oublié"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isEn ? "Recover access to your B2B account" : "Réinitialisez l'accès à votre portail B2B"}
                </p>
              </div>
            </div>

            {resetSuccess ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">
                      {isEn ? "Email Sent Successfully!" : "Email envoyé avec succès !"}
                    </p>
                    <p className="mt-1 text-emerald-700 text-xs leading-relaxed">
                      {isEn 
                        ? <>A secure password reset link has been dispatched to <strong>{resetEmail}</strong>. Please check your inbox and spam folder.</>
                        : <>Un lien officiel et sécurisé de réinitialisation a été envoyé à <strong>{resetEmail}</strong>. Veuillez vérifier votre boîte de réception ainsi que vos courriers indésirables.</>}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {isEn ? "Close Window" : "Fermer cette fenêtre"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendResetEmail} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isEn 
                    ? "Enter your registered professional email. We will send you an official secure link to choose a new password."
                    : "Indiquez votre adresse email professionnelle enregistrée. Nous vous transmettrons un lien sécurisé pour redéfinir votre mot de passe."}
                </p>

                {resetError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{resetError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="reset-email" className="text-xs font-bold text-slate-700">
                    {isEn ? "Email Address" : "Adresse email"}
                  </label>
                  <div className="relative">
                    <input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder={isEn ? "contact@your-agency.com" : "contact@votre-agence.com"}
                      required
                      className="w-full h-11 px-3.5 pl-9 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#7B1B38]"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {isEn ? "Cancel" : "Annuler"}
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-5 py-2.5 rounded-xl bg-[#7B1B38] hover:bg-[#63142c] text-white text-xs font-bold shadow-md shadow-[#7B1B38]/20 transition-all disabled:opacity-60"
                  >
                    {resetLoading ? (isEn ? "Sending..." : "Envoi en cours...") : (isEn ? "Send Reset Link" : "Envoyer le lien")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
