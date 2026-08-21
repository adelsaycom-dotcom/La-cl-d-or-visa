import { useState } from "react";
import { auth, db } from "../../src/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Eye, EyeOff, Building2, Sparkles, ShieldCheck } from "lucide-react";
import { Logo } from '@/components/Logo';

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    agencyName: "",
    contactName: "",
    email: "",
    phone: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, 'users', userCred.user.uid), {
        role: 'agency',
        status: 'PENDING',
        agencyName: formData.agencyName,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        createdAt: new Date().toISOString()
      });
      alert("Demande envoyée avec succès. Vous serez recontacté(e) sous peu.");
      navigate("/login");
    } catch(err: any) {
      setError("Erreur lors de l'inscription. L'email est peut-être déjà utilisé.");
    } finally {
      setIsLoading(false);
    }
  };

  const update = (field: string, val: string) => setFormData(p => ({...p, [field]: val}));

  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      {/* Visual Side */}
      <div className="hidden lg:flex lg:flex-col flex-1 relative bg-slate-900 overflow-hidden p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 -translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-xl mx-auto w-full">
           <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl">
              <div className="w-14 h-14 bg-indigo-600 border border-indigo-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/20 text-white">
                <Building2 className="w-7 h-7" />
              </div>
              
              <h3 className="text-3xl font-black text-white leading-tight mb-4">
                Devenez Partenaire B2B.
              </h3>
              <p className="text-indigo-200 text-lg leading-relaxed mb-8">
                Rejoignez le réseau La Clé d'Or et offrez à vos clients des services consulaires premium, rapides et 100% digitalisés.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white">
                  <ShieldCheck className="w-5 h-5 text-indigo-300" />
                  <span className="font-medium">Traitement de dossiers simplifié</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Sparkles className="w-5 h-5 text-indigo-300" />
                  <span className="font-medium">Suivi de l'état d'avancement</span>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 relative z-10 w-full lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="text-left">
            <Link to="/" className="inline-block mb-8">
              <Logo />
            </Link>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Créer un compte</h2>
            <p className="text-slate-500 font-medium text-lg">Demandez votre accès partenaire exclusif.</p>
          </div>
          
          <form className="mt-8 space-y-5" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-bold">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Nom de l'agence</label>
                <Input value={formData.agencyName} onChange={(e) => update('agencyName', e.target.value)} className="h-14 rounded-xl bg-white border-slate-200 focus:border-indigo-600 text-base shadow-sm" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Contact (Nom)</label>
                <Input value={formData.contactName} onChange={(e) => update('contactName', e.target.value)} className="h-14 rounded-xl bg-white border-slate-200 focus:border-indigo-600 text-base shadow-sm" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Email professionnel</label>
              <Input type="email" value={formData.email} onChange={(e) => update('email', e.target.value)} className="h-14 rounded-xl bg-white border-slate-200 focus:border-indigo-600 text-base shadow-sm" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Téléphone</label>
              <Input type="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)} className="h-14 rounded-xl bg-white border-slate-200 focus:border-indigo-600 text-base shadow-sm" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Mot de passe</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => update('password', e.target.value)} className="h-14 rounded-xl bg-white border-slate-200 focus:border-indigo-600 pr-12 text-base shadow-sm" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-14 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-bold shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-1 group">
              {isLoading ? 'Envoi en cours...' : 'Envoyer la demande'}
              {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>
          
          <div className="text-center text-sm font-medium text-slate-500 mt-8">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
