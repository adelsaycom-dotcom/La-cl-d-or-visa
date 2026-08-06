const fs = require('fs');
let c = fs.readFileSync('components/LandingPage.tsx', 'utf8');

c = c.replace(/<nav className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-gray-100 sticky top-0 bg-white\/90 backdrop-blur-md z-50 transition-all">[\s\S]*?<\/nav>/, 
  `<nav className="flex items-center justify-between px-4 sm:px-6 py-4 md:px-12 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-50 transition-all">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="La Clé d'Or Visa" className="w-auto h-12 sm:h-16 object-contain" />
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-600">
          <a href="#about" className="hover:text-primary-gold transition-colors">Notre Agence</a>
          <a href="#services" className="hover:text-primary-gold transition-colors">Services</a>
          <a href="#contact" className="hover:text-primary-gold transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/login" className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-primary-gold transition-colors">
            <LogIn className="w-4 h-4" /> Espace pro
          </Link>
          <Link to="/login" className="sm:hidden p-2 text-gray-700">
            <LogIn className="w-5 h-5" />
          </Link>
        </div>
      </nav>`);

fs.writeFileSync('components/LandingPage.tsx', c);
