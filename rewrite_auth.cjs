const fs = require('fs');

// 1. Rewrite Register.tsx to a simple, centered form using unified colors
const registerContent = `import { useState } from "react";
import { auth, db } from "../../src/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <Logo />
          </Link>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Créer un compte</h2>
          <p className="text-slate-500 font-medium">Demandez votre accès partenaire exclusif.</p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <form className="space-y-5" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-bold">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Nom de l'agence</label>
              <Input value={formData.agencyName} onChange={(e) => update('agencyName', e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-primary-gold focus:ring-primary-gold" required />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Contact (Nom)</label>
              <Input value={formData.contactName} onChange={(e) => update('contactName', e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-primary-gold focus:ring-primary-gold" required />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Email professionnel</label>
              <Input type="email" value={formData.email} onChange={(e) => update('email', e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-primary-gold focus:ring-primary-gold" required />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Téléphone</label>
              <Input type="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-primary-gold focus:ring-primary-gold" required />
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
            
            <Button type="submit" disabled={isLoading} className="w-full h-12 mt-2 bg-primary-gold hover:bg-primary-gold/90 text-white rounded-xl text-base font-bold shadow-lg shadow-primary-gold/20 transition-all hover:-translate-y-0.5 group">
              {isLoading ? 'Envoi en cours...' : 'Envoyer la demande'}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
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
`;
fs.writeFileSync('components/auth/Register.tsx', registerContent);

// 2. Unify colors in Login.tsx
let loginContent = fs.readFileSync('components/auth/Login.tsx', 'utf8');

// Replace indigo colors with primary-gold
loginContent = loginContent.replace(/indigo-600/g, 'primary-gold');
loginContent = loginContent.replace(/indigo-700/g, 'primary-gold/90');
loginContent = loginContent.replace(/indigo-800/g, 'primary-gold');
loginContent = loginContent.replace(/indigo-900/g, 'slate-950');
loginContent = loginContent.replace(/indigo-950/g, 'slate-900');
loginContent = loginContent.replace(/indigo-500/g, 'primary-gold');
loginContent = loginContent.replace(/indigo-300/g, 'primary-gold/70');
loginContent = loginContent.replace(/blue-500/g, 'slate-700');

fs.writeFileSync('components/auth/Login.tsx', loginContent);

