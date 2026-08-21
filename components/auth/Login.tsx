import { useState } from "react";
import { auth, db } from "../../src/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, PlaneTakeoff, ShieldCheck, Sparkles, Building2, Eye, EyeOff } from "lucide-react";
import { Logo } from '@/components/Logo';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
      
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        if (role === 'admin') {
          navigate("/admin");
        } else {
          const status = userDoc.data().status;
          if (status === 'PENDING') {
            alert("Votre compte est en attente de validation par l'administrateur.");
            auth.signOut();
          } else if (status === 'SUSPENDED') {
            alert("Votre compte a été suspendu. Veuillez contacter le support.");
            auth.signOut();
          } else {
            navigate("/agency");
          }
        }
      } else {
        alert("Utilisateur introuvable dans la base de données.");
      }
    } catch(err: any) {
      alert("Erreur de connexion: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      {/* Left side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 relative z-10 w-full lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="text-left">
            <Link to="/" className="inline-block mb-12">
              <Logo />
            </Link>
            
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Bienvenue.</h2>
            <p className="text-slate-500 font-medium text-lg">Connectez-vous à votre portail B2B La Clé D'or.</p>
          </div>
          
          <form className="mt-10 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Adresse email</label>
                <Input 
                  type="email" 
                  placeholder="contact@votre-agence.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 rounded-xl bg-white border-slate-200 focus:border-indigo-600 focus:ring-indigo-600 text-base shadow-sm"
                  required 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900">Mot de passe</label>
                  <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Mot de passe oublié ?</a>
                </div>
                <div className="relative">
                  <Input 
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="h-14 rounded-xl bg-white border-slate-200 focus:border-indigo-600 focus:ring-indigo-600 text-base shadow-sm pr-12"
                  required 
                />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
              <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-600">Rester connecté</label>
            </div>

            <div>
              <Button type="submit" disabled={isLoading} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-bold shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-1 group">
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </div>
          </form>
          
          <div className="text-center text-sm font-medium text-slate-500 mt-10">
            Vous n'avez pas encore de compte agence ?{" "}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              Demander un partenariat
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Visual/Feature showcase */}
      <div className="hidden lg:flex lg:flex-col flex-1 relative bg-slate-900 overflow-hidden p-12">
        {/* Background gradient & patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541450805268-4822a3a774ca?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-screen filter blur-[150px] opacity-10 translate-y-1/3 -translate-x-1/3"></div>

        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
           <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-600/30 text-white">
                <Sparkles className="w-7 h-7" />
              </div>
              
              <h3 className="text-3xl font-black text-white leading-tight mb-4">
                La plateforme B2B pensée pour accélérer votre croissance.
              </h3>
              
              <p className="text-indigo-200 text-lg mb-10 leading-relaxed max-w-xl">
                Accédez à des services exclusifs de traitement de visas, résidence, étude de dossiers et gagnez en productivité avec notre outil de suivi en temps réel.
              </p>

              <div className="space-y-6">
                 <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                       <PlaneTakeoff className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                      <div className="font-bold">Traitement Prioritaire</div>
                      <div className="text-sm text-indigo-200">Vos dossiers traités avec la plus grande urgence.</div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                       <ShieldCheck className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                      <div className="font-bold">Démarches Sécurisées</div>
                      <div className="text-sm text-indigo-200">Protection totale des données de vos clients.</div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                       <Building2 className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                      <div className="font-bold">Espace Agence B2B</div>
                      <div className="text-sm text-indigo-200">Facturation, suivi et gestion d'équipe dédiés.</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
