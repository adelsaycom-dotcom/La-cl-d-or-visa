import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe2 } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase().includes("admin")) {
      navigate("/admin");
    } else {
      navigate("/agency");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 justify-center">
            <Globe2 className="w-10 h-10" />
            <span className="text-2xl font-bold tracking-tight text-gray-900">VisaHub B2B</span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Connectez-vous à votre compte</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Adresse email</label>
              <Input 
                type="email" 
                placeholder="vous@agence.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mot de passe</label>
              <Input type="password" placeholder="••••••••" required />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Se souvenir de moi</label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Mot de passe oublié ?</a>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Se connecter
            </Button>
          </div>
        </form>
        
        <div className="text-center text-sm mt-4">
          Vous n'avez pas de compte agence ?{" "}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Demander un partenariat
          </Link>
        </div>
      </div>
    </div>
  );
}
