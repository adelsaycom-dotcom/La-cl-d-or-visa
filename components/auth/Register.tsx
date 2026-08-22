import { useState } from "react";
import { auth, db } from "../../src/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Eye, EyeOff, Building2 } from "lucide-react";
import { Logo } from '@/components/Logo';

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
        rcNumber: formData.rcNumber,
        nifNumber: formData.nifNumber,
        managerLastName: formData.managerLastName,
        managerFirstName: formData.managerFirstName,
        contactName: `${formData.managerFirstName} ${formData.managerLastName}`, // Legacy support
        email: formData.email,
        phone: formData.phone,
        balance: 0,
        createdAt: new Date().toISOString()
      });
      alert("Demande envoyée avec succès. Vous serez recontacté(e) sous peu.");
      navigate("/login");
    } catch(err: any) {
      console.error("Erreur d'inscription complète:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Cette adresse email est déjà utilisée par un autre compte.");
      } else {
        setError("Erreur lors de l'inscription. Veuillez vérifier vos informations ou réessayer plus tard.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const update = (field: string, val: string) => setFormData(p => ({...p, [field]: val}));

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-8 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <Logo />
          </Link>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Inscription Partenaire</h2>
          <p className="text-slate-500 font-medium">Renseignez les informations de votre agence pour demander un accès.</p>
        </div>
        
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-bold">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Building2 className="w-5 h-5 text-primary-gold" />
                <h3 className="font-bold text-slate-800">Informations de l'Agence</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Nom de l'agence</label>
                <Input value={formData.agencyName} onChange={(e) => update('agencyName', e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-primary-gold focus:ring-primary-gold" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">N° Registre de Commerce (RC)</label>
                  <Input value={formData.rcNumber} onChange={(e) => update('rcNumber', e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-primary-gold focus:ring-primary-gold" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">NIF</label>
                  <Input value={formData.nifNumber} onChange={(e) => update('nifNumber', e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-primary-gold focus:ring-primary-gold" required />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="font-bold text-slate-800 pb-2 border-b border-slate-100">Coordonnées du Gérant</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">Nom</label>
                  <Input value={formData.managerLastName} onChange={(e) => update('managerLastName', e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-primary-gold focus:ring-primary-gold" required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">Prénom</label>
                  <Input value={formData.managerFirstName} onChange={(e) => update('managerFirstName', e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-primary-gold focus:ring-primary-gold" required />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="font-bold text-slate-800 pb-2 border-b border-slate-100">Identifiants de Connexion</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">Email professionnel</label>
                  <Input type="email" value={formData.email} onChange={(e) => update('email', e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-primary-gold focus:ring-primary-gold" required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">Téléphone</label>
                  <Input type="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-primary-gold focus:ring-primary-gold" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Mot de passe</label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => update('password', e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-primary-gold focus:ring-primary-gold pr-12" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full h-14 bg-primary-gold hover:bg-primary-gold/90 text-white rounded-xl text-lg font-bold shadow-lg shadow-primary-gold/20 transition-all hover:-translate-y-0.5 group">
                {isLoading ? 'Envoi en cours...' : 'Soumettre la demande'}
                {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </div>
          </form>
        </div>
        
        <div className="text-center text-sm font-medium text-slate-500 mt-8">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="font-bold text-primary-gold hover:text-primary-gold/80 transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
