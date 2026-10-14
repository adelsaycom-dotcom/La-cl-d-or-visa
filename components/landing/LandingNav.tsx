import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { LogIn, UserPlus, Menu, X, Phone } from "lucide-react";

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-3"
          : "bg-white/90 backdrop-blur-sm border-b border-slate-100 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <Logo />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-700">
            <a href="#processus" className="hover:text-[#7B1B38] transition-colors">
              Processus B2B
            </a>
            <a href="#avantages" className="hover:text-[#7B1B38] transition-colors">
              Avantages & Outils
            </a>
            <a href="#faq" className="hover:text-[#7B1B38] transition-colors">
              FAQ Agences
            </a>
            <a href="#contact" className="hover:text-[#7B1B38] transition-colors">
              Contact & Support
            </a>
          </nav>

          {/* Action Buttons in #7B1B38 */}
          <div className="hidden sm:flex items-center gap-3">
            <a 
              href="tel:0562101719" 
              className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#7B1B38] flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#7B1B38]" />
              <span>0562 10 17 19</span>
            </a>

            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-800 hover:text-[#7B1B38] bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4 text-[#7B1B38]" />
              <span>Espace Pro</span>
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#7B1B38] hover:bg-[#63142c] transition-all shadow-md shadow-[#7B1B38]/25 flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Demande d'Accès</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200"
            >
              Connexion
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-200 bg-white rounded-2xl p-4 space-y-3 shadow-xl">
            <a
              href="#processus"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-[#7B1B38] py-1"
            >
              Processus B2B
            </a>
            <a
              href="#avantages"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-[#7B1B38] py-1"
            >
              Avantages Plateforme
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-[#7B1B38] py-1"
            >
              FAQ Agences
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-[#7B1B38] py-1"
            >
              Contact & Siège
            </a>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-sm shadow-sm"
              >
                Créer un Compte Agence
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
