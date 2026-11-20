import React from 'react';

interface LogoProps {
  className?: string;
  imageClassName?: string;
}

export function Logo({ className = "", imageClassName = "" }: LogoProps) {
  const mappedSize = imageClassName
    ? imageClassName.replace(/\bh-8\b/g, "h-14").replace(/\bh-10\b/g, "h-16").trim()
    : "h-20 sm:h-24 -my-4 sm:-my-5";
  const hasWidthClass = /\bw-\S+/.test(mappedSize);
  const sizeClasses = hasWidthClass ? mappedSize : `${mappedSize} w-auto`;

  return (
    <div className={`flex items-center gap-2 shrink-0 ${className}`}>
      {/* Logo officiel complet B2B Platform by La Clé d'Or Travel (sans rognage) */}
      <img
        src="/assets/aistudio/lacledor-01_9b986684.svg"
        alt="B2B Platform by La Clé d'Or Travel"
        width={709}
        height={499}
        decoding="async"
        className={`object-contain shrink-0 ${sizeClasses}`}
        onError={(e) => {
          e.currentTarget.style.display = "none";
          const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
          if (fallback) {
            fallback.style.display = "flex";
          }
        }}
      />

      {/* Fallback texte si l'image ne charge pas */}
      <div className="hidden items-center gap-2">
        <span className="text-lg font-extrabold tracking-tight text-[#111111]">
          B2B Platform <span className="text-[#661915]">by La Clé d&apos;Or</span>
        </span>
      </div>
    </div>
  );
}
