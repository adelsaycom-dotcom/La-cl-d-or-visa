import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function Register() {
  const navigate = useNavigate();
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Demande envoyée avec succès ! Notre équipe examinera le profil de votre agence.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 justify-center">
            <Globe2 className="w-10 h-10" />
            <span className="text-2xl font-bold tracking-tight text-gray-900">VisaHub B2B</span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Devenez Partenaire</h2>
          <p className="mt-2 text-sm text-gray-600">Inscrivez votre agence de voyage pour accéder à la plateforme.</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium">Nom de l'agence *</label>
                 <Input required placeholder="ex: Wanderlust Tours" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Numéro de registre du commerce *</label>
                 <Input required placeholder="RC / NIF" />
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium">Nom complet du gérant *</label>
                 <Input required placeholder="Jean Dupont" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Numéro de téléphone *</label>
                 <Input required placeholder="+213 555 12 34 56" type="tel" />
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-sm font-medium">Email professionnel *</label>
               <Input required placeholder="contact@agence.com" type="email" />
             </div>

             <div className="space-y-2">
               <label className="text-sm font-medium">Adresse physique</label>
               <Textarea placeholder="123 Rue des Voyages, Alger" rows={2} />
             </div>
             
             <div className="space-y-2">
               <label className="text-sm font-medium">Définir un mot de passe *</label>
               <Input required type="password" placeholder="••••••••" />
             </div>
          </div>

          <div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Soumettre la demande
            </Button>
          </div>
        </form>
        
        <div className="text-center text-sm mt-4">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
