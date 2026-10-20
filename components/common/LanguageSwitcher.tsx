import React from "react";
import { useLanguage } from "../../src/i18n/LanguageContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";

interface LanguageSwitcherProps {
  variant?: "outline" | "ghost" | "glass" | "pill";
  className?: string;
  showLabel?: boolean;
}

export function LanguageSwitcher({ 
  variant = "outline", 
  className = "", 
  showLabel = true 
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "fr" as const, label: "Français", short: "FR", flag: "🇫🇷" },
    { code: "en" as const, label: "English", short: "EN", flag: "🇬🇧" }
  ];

  const current = languages.find(l => l.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === "glass" ? "ghost" : variant === "pill" ? "outline" : "outline"}
          size="sm"
          className={`h-9 px-3 rounded-xl gap-2 font-bold text-xs transition-all border-slate-200 hover:border-slate-300 ${
            variant === "glass"
              ? "bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
              : variant === "pill"
              ? "rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800"
              : "bg-white hover:bg-slate-50 text-slate-800 shadow-sm"
          } ${className}`}
          title="Changer de langue / Change language"
        >
          <span className="text-base leading-none select-none">{current.flag}</span>
          <span className="font-bold tracking-wide uppercase">{current.short}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-2xl shadow-xl border-slate-200">
        <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Langue / Language
        </div>
        {languages.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                isSelected 
                  ? "bg-[#7B1B38]/10 text-[#7B1B38]" 
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base leading-none">{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 text-[#7B1B38]" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
