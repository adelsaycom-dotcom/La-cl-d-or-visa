import React from 'react';

interface LogoProps {
  className?: string;
  imageClassName?: string;
}

export function Logo({ className = "", imageClassName = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 
        Pour changer le logo, vous pouvez remplacer l'image "IMG_2481.PNG"
        dans le dossier "public", ou modifier le chemin "src" ci-dessous.
      */}
      <img 
        src="/IMG_2481.PNG" 
        alt="La Clé d'Or Visa" 
        className={`h-10 sm:h-12 w-auto object-contain ${imageClassName}`}
        onError={(e) => {
          // Fallback if image is not uploaded yet or name is wrong
          e.currentTarget.style.display = 'none';
          if (e.currentTarget.nextElementSibling) {
            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
          }
        }}
      />
      {/* Fallback Text Logo (hidden by default unless image fails to load) */}
      <div className="hidden items-center gap-2">
        <span className="text-2xl font-bold tracking-tight text-text-dark">La Clé d'Or <span className="text-amber-500">Visa</span></span>
      </div>
    </div>
  );
}
