import { useState } from "react";
import { hasFlag } from "country-flag-icons";
import { Globe2 } from "lucide-react";
import { getCountryIsoCode } from "../../src/utils/flags";

interface CountryFlagProps {
  country?: string | null;
  fallbackCode?: string | null;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  rounded?: boolean;
  title?: string;
}

const SIZE_CLASSES: Record<NonNullable<CountryFlagProps["size"]>, string> = {
  xs: "w-4 h-3",
  sm: "w-5 h-3.5",
  md: "w-6 h-4",
  lg: "w-8 h-6",
  xl: "w-10 h-7"
};

/**
 * Drapeau vectoriel SVG universel servi à la demande depuis /flags/*.svg.
 * Évite d'embarquer 240 Ko de composants SVG synchrones en RAM et reste 100% compatible Windows/macOS/Linux/mobile.
 */
export function CountryFlag({
  country,
  fallbackCode,
  className = "",
  size = "md",
  rounded = false,
  title
}: CountryFlagProps) {
  const [failedIso, setFailedIso] = useState<string | null>(null);
  const iso =
    getCountryIsoCode(country) ||
    getCountryIsoCode(fallbackCode);

  const dimClass = SIZE_CLASSES[size];

  if (iso && iso !== "WORLD" && hasFlag(iso) && failedIso !== iso) {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 overflow-hidden shadow-2xs ring-1 ring-black/10 ${
          rounded ? "rounded-full aspect-square" : "rounded-[3px]"
        } ${dimClass} ${className}`}
        title={title || country || iso}
      >
        <img
          src={`/flags/${iso}.svg`}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailedIso(iso)}
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 text-slate-500 ${dimClass} ${className}`}
      title={title || country || "International"}
    >
      <Globe2 className="w-full h-full" aria-hidden="true" />
    </span>
  );
}
