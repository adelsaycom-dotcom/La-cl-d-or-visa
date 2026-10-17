import React from 'react';

interface LogoProps {
  className?: string;
  imageClassName?: string;
}

export function Logo({ className = "", imageClassName = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 
        Logo officiel La Clé d'Or Visa ("IMG_0787.PNG" dans le dossier "public")
      */}
      <img 
        src="/IMG_0787-1.PNG" 
        alt="La Clé d'Or Visa" 
        className={`h-10 sm:h-12 w-auto object-contain ${imageClassName}`}
        onError={(e) => {
          // Fallback to /IMG_0787.PNG if needed
          if (e.currentTarget.src.includes('IMG_0787-1.PNG')) {
            e.currentTarget.src = '/IMG_0787.PNG';
            return;
          }
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
