import { useState } from "react";
import { auth, db } from "../../src/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff } from "lucide-react";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agencyName, setAgencyName] = useState("");

  const navigate = useNavigate();
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      // Create user doc
      let role = "agency";
      if (email === "adel.saycom@gmail.com" || email.includes("admin")) {
        role = "admin";
      }
      await setDoc(doc(db, 'users', userCred.user.uid), {
        email: email,
        role: role,
        agencyName: agencyName,
        balance: 0,
        createdAt: new Date().toISOString()
      });
      alert("Demande envoyée avec succès ! Notre équipe examinera le profil de votre agence.");
      navigate("/login");
    } catch(err: any) {
      alert("Erreur: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-black/5 border border-gray-100">
        <div className="text-center">
          <Link to="/" className="inline-block mb-6">
             <img src="/logo.png" alt="La Clé D'or Visa" className="h-14 w-auto object-contain mx-auto" />
          </Link>
          <h2 className="mt-2 text-2xl md:text-3xl font-black text-text-dark tracking-tight">Devenez Partenaire</h2>
          <p className="mt-2 text-sm md:text-base text-gray-500 font-medium">Inscrivez votre agence de voyage pour accéder à la plateforme.</p>
        </div>
        
        <form className="mt-5 space-y-5" onSubmit={handleRegister}>
          <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-text-dark">Nom de l'agence *</label>
                 <Input required value={agencyName} onChange={e=>setAgencyName(e.target.value)} placeholder="ex: Wanderlust Tours" className="h-12 bg-gray-50 border-gray-200 focus:border-primary-gold" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-text-dark">N° de registre du commerce *</label>
                 <Input required placeholder="RC / NIF" className="h-12 bg-gray-50 border-gray-200 focus:border-primary-gold" />
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-text-dark">Nom complet du gérant *</label>
                 <Input required placeholder="Jean Dupont" className="h-12 bg-gray-50 border-gray-200 focus:border-primary-gold" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-text-dark">Numéro de téléphone *</label>
                 <Input required placeholder="+213 555 12 34 56" type="tel" className="h-12 bg-gray-50 border-gray-200 focus:border-primary-gold" />
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-sm font-bold text-text-dark">Email professionnel *</label>
               <Input required placeholder="contact@agence.com" type="email" value={email} onChange={e=>setEmail(e.target.value)} className="h-12 bg-gray-50 border-gray-200 focus:border-primary-gold" />
             </div>

             <div className="space-y-2">
               <label className="text-sm font-bold text-text-dark">Adresse physique</label>
               <Textarea placeholder="123 Rue des Voyages, Alger" rows={2} className="bg-gray-50 border-gray-200 focus:border-primary-gold resize-none" />
             </div>
             
             <div className="space-y-2">
               <label className="text-sm font-bold text-text-dark">Définir un mot de passe *</label>
               <div className="relative">
                 <Input required type={showPassword ? "text" : "password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="h-12 bg-gray-50 border-gray-200 focus:border-primary-gold" />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                 </button>
               </div>
             </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full h-14 text-lg font-bold bg-text-dark hover:bg-accent-bronze text-white shadow-lg transition-transform hover:-translate-y-1">
              Soumettre la demande
            </Button>
          </div>
        </form>
        
        <div className="text-center text-sm mt-4 font-medium text-gray-500">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="font-bold text-primary-gold hover:text-accent-bronze transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
