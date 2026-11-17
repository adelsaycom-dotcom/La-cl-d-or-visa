/**
 * Dictionnaire complet et multi-plateforme des pays vers codes ISO 3166-1 alpha-2
 * Supporte le français, l'anglais, les accents, les codes ISO-2/ISO-3 et la conversion d'emojis drapeaux.
 */

const COUNTRY_TO_ISO: Record<string, string> = {
  // Global / Spécial
  "monde": "WORLD",
  "world": "WORLD",
  "international": "WORLD",
  "tous les pays": "WORLD",
  "all": "WORLD",
  "autre": "WORLD",

  // Maghreb & Moyen-Orient
  "algerie": "DZ", "algeria": "DZ", "algerien": "DZ", "dz": "DZ", "dza": "DZ",
  "maroc": "MA", "morocco": "MA", "marocain": "MA", "ma": "MA", "mar": "MA",
  "tunisie": "TN", "tunisia": "TN", "tunisien": "TN", "tn": "TN", "tun": "TN",
  "libye": "LY", "libya": "LY", "ly": "LY",
  "mauritanie": "MR", "mauritania": "MR", "mr": "MR",
  "egypte": "EG", "egypt": "EG", "eg": "EG", "egy": "EG",
  "arabie saoudite": "SA", "saudi arabia": "SA", "saoudite": "SA", "omra": "SA", "sa": "SA", "sau": "SA",
  "emirats arabes unis": "AE", "emirats": "AE", "emirati": "AE", "uae": "AE", "united arab emirates": "AE", "dubai": "AE", "abu dhabi": "AE", "ae": "AE", "are": "AE",
  "qatar": "QA", "qa": "QA", "qat": "QA",
  "koweit": "KW", "kuwait": "KW", "kw": "KW",
  "bahrein": "BH", "bahrain": "BH", "bh": "BH",
  "oman": "OM", "om": "OM",
  "jordanie": "JO", "jordan": "JO", "jo": "JO",
  "liban": "LB", "lebanon": "LB", "lb": "LB",
  "irak": "IQ", "iraq": "IQ", "iq": "IQ",
  "iran": "IR", "ir": "IR",
  "syrie": "SY", "syria": "SY", "sy": "SY",
  "yemen": "YE", "ye": "YE",
  "palestine": "PS", "ps": "PS", "palestinian territories": "PS",
  "israel": "IL", "il": "IL",
  "turquie": "TR", "turkey": "TR", "turkiye": "TR", "tr": "TR", "tur": "TR",

  // Europe
  "france": "FR", "francais": "FR", "fr": "FR", "fra": "FR", "schengen": "EU", "europe": "EU", "union europeenne": "EU",
  "espagne": "ES", "spain": "ES", "es": "ES", "esp": "ES",
  "italie": "IT", "italy": "IT", "it": "IT", "ita": "IT",
  "allemagne": "DE", "germany": "DE", "de": "DE", "deu": "DE",
  "royaume-uni": "GB", "royaume uni": "GB", "angleterre": "GB", "united kingdom": "GB", "uk": "GB", "gb": "GB", "gbr": "GB",
  "portugal": "PT", "pt": "PT", "prt": "PT",
  "belgique": "BE", "belgium": "BE", "be": "BE", "bel": "BE",
  "suisse": "CH", "switzerland": "CH", "ch": "CH", "che": "CH",
  "pays-bas": "NL", "pays bas": "NL", "hollande": "NL", "netherlands": "NL", "nl": "NL", "nld": "NL",
  "luxembourg": "LU", "lu": "LU",
  "monaco": "MC", "mc": "MC",
  "andorre": "AD", "andorra": "AD", "ad": "AD",
  "grece": "GR", "greece": "GR", "gr": "GR", "grc": "GR",
  "russie": "RU", "russia": "RU", "russian federation": "RU", "ru": "RU", "rus": "RU",
  "ukraine": "UA", "ua": "UA",
  "bielorussie": "BY", "belarus": "BY", "by": "BY",
  "roumanie": "RO", "romania": "RO", "ro": "RO", "rou": "RO",
  "pologne": "PL", "poland": "PL", "pl": "PL", "pol": "PL",
  "hongrie": "HU", "hungary": "HU", "hu": "HU",
  "tchequie": "CZ", "republique tcheque": "CZ", "czech republic": "CZ", "czechia": "CZ", "cz": "CZ",
  "slovaquie": "SK", "slovakia": "SK", "sk": "SK",
  "slovenie": "SI", "slovenia": "SI", "si": "SI",
  "autriche": "AT", "austria": "AT", "at": "AT",
  "suede": "SE", "sweden": "SE", "se": "SE",
  "norvege": "NO", "norway": "NO", "no": "NO",
  "danemark": "DK", "denmark": "DK", "dk": "DK",
  "finlande": "FI", "finland": "FI", "fi": "FI",
  "islande": "IS", "iceland": "IS", "is": "IS",
  "irlande": "IE", "ireland": "IE", "ie": "IE",
  "chypre": "CY", "cyprus": "CY", "cy": "CY",
  "malte": "MT", "malta": "MT", "mt": "MT",
  "croatie": "HR", "croatia": "HR", "hr": "HR",
  "bulgarie": "BG", "bulgaria": "BG", "bg": "BG",
  "serbie": "RS", "serbia": "RS", "rs": "RS",
  "bosnie-herzegovine": "BA", "bosnia and herzegovina": "BA", "ba": "BA",
  "montenegro": "ME", "me": "ME",
  "macedoine du nord": "MK", "north macedonia": "MK", "mk": "MK",
  "albanie": "AL", "albania": "AL", "al": "AL",
  "moldavie": "MD", "moldova": "MD", "md": "MD",
  "estonie": "EE", "estonia": "EE", "ee": "EE",
  "lettonie": "LV", "latvia": "LV", "lv": "LV",
  "lituanie": "LT", "lithuania": "LT", "lt": "LT",
  "georgie": "GE", "georgia": "GE", "ge": "GE",
  "armenie": "AM", "armenia": "AM", "am": "AM",
  "azerbaidjan": "AZ", "azerbaijan": "AZ", "az": "AZ",
  "liechtenstein": "LI", "li": "LI",
  "saint-marin": "SM", "san marino": "SM", "sm": "SM",
  "vatican": "VA", "vatican city": "VA", "va": "VA",
  "kosovo": "XK", "xk": "XK",

  // Asie
  "chine": "CN", "china": "CN", "cn": "CN", "chn": "CN",
  "hong kong": "HK", "hk": "HK",
  "macao": "MO", "macau": "MO", "mo": "MO",
  "taiwan": "TW", "tw": "TW",
  "japon": "JP", "japan": "JP", "jp": "JP", "jpn": "JP",
  "coree du sud": "KR", "south korea": "KR", "korea": "KR", "kr": "KR", "kor": "KR",
  "coree du nord": "KP", "north korea": "KP", "kp": "KP",
  "inde": "IN", "india": "IN", "in": "IN", "ind": "IN",
  "pakistan": "PK", "pk": "PK",
  "bangladesh": "BD", "bd": "BD",
  "sri lanka": "LK", "lk": "LK",
  "nepal": "NP", "np": "NP",
  "bhoutan": "BT", "bhutan": "BT", "bt": "BT",
  "maldives": "MV", "mv": "MV",
  "afghanistan": "AF", "af": "AF",
  "indonesie": "ID", "indonesia": "ID", "bali": "ID", "id": "ID",
  "malaisie": "MY", "malaysia": "MY", "my": "MY", "mys": "MY",
  "thailande": "TH", "thailand": "TH", "th": "TH", "tha": "TH",
  "vietnam": "VN", "viet nam": "VN", "vn": "VN",
  "cambodge": "KH", "cambodia": "KH", "kh": "KH",
  "laos": "LA", "la": "LA",
  "myanmar": "MM", "birmanie": "MM", "mm": "MM",
  "singapour": "SG", "singapore": "SG", "sg": "SG",
  "brunei": "BN", "bn": "BN",
  "philippines": "PH", "ph": "PH",
  "timor oriental": "TL", "timor-leste": "TL", "tl": "TL",
  "mongolie": "MN", "mongolia": "MN", "mn": "MN",
  "kazakhstan": "KZ", "kz": "KZ",
  "ouzbekistan": "UZ", "uzbekistan": "UZ", "uz": "UZ",
  "kirghizistan": "KG", "kyrgyzstan": "KG", "kg": "KG",
  "tadjikistan": "TJ", "tajikistan": "TJ", "tj": "TJ",
  "turkmenistan": "TM", "tm": "TM",

  // Amériques
  "etats-unis": "US", "etats unis": "US", "usa": "US", "us": "US", "united states": "US", "united states of america": "US", "amerique": "US",
  "canada": "CA", "canadien": "CA", "ca": "CA", "can": "CA",
  "mexique": "MX", "mexico": "MX", "mx": "MX",
  "bresil": "BR", "brazil": "BR", "br": "BR", "bra": "BR",
  "argentine": "AR", "argentina": "AR", "ar": "AR",
  "colombie": "CO", "colombia": "CO", "co": "CO",
  "chili": "CL", "chile": "CL", "cl": "CL",
  "perou": "PE", "peru": "PE", "pe": "PE",
  "equateur": "EC", "ecuador": "EC", "ec": "EC",
  "bolivie": "BO", "bolivia": "BO", "bo": "BO",
  "paraguay": "PY", "py": "PY",
  "uruguay": "UY", "uy": "UY",
  "venezuela": "VE", "ve": "VE",
  "guyana": "GY", "gy": "GY",
  "suriname": "SR", "sr": "SR",
  "cuba": "CU", "cu": "CU",
  "republique dominicaine": "DO", "dominican republic": "DO", "do": "DO",
  "haiti": "HT", "ht": "HT",
  "jamaique": "JM", "jamaica": "JM", "jm": "JM",
  "bahamas": "BS", "bs": "BS",
  "barbade": "BB", "barbados": "BB", "bb": "BB",
  "panama": "PA", "pa": "PA",
  "costa rica": "CR", "cr": "CR",
  "guatemala": "GT", "gt": "GT",
  "honduras": "HN", "hn": "HN",
  "nicaragua": "NI", "ni": "NI",
  "salvador": "SV", "el salvador": "SV", "sv": "SV",
  "belize": "BZ", "bz": "BZ",
  "antigua-et-barbuda": "AG", "antigua and barbuda": "AG", "ag": "AG",
  "dominique": "DM", "dominica": "DM", "dm": "DM",
  "grenade": "GD", "grenada": "GD", "gd": "GD",
  "saint-christophe-et-nieves": "KN", "saint kitts and nevis": "KN", "kn": "KN",
  "sainte-lucie": "LC", "saint lucia": "LC", "lc": "LC",
  "saint-vincent-et-les-grenadines": "VC", "saint vincent and the grenadines": "VC", "vc": "VC",
  "trinite-et-tobago": "TT", "trinidad and tobago": "TT", "tt": "TT",

  // Afrique
  "afrique du sud": "ZA", "south africa": "ZA", "za": "ZA",
  "senegal": "SN", "senegalais": "SN", "sn": "SN",
  "cote d'ivoire": "CI", "ivory coast": "CI", "ci": "CI",
  "mali": "ML", "ml": "ML",
  "niger": "NE", "ne": "NE",
  "burkina faso": "BF", "bf": "BF",
  "guinee": "GN", "guinea": "GN", "gn": "GN",
  "guinee-bissau": "GW", "guinea-bissau": "GW", "gw": "GW",
  "guinee equatoriale": "GQ", "equatorial guinea": "GQ", "gq": "GQ",
  "benin": "BJ", "bj": "BJ",
  "togo": "TG", "tg": "TG",
  "ghana": "GH", "gh": "GH",
  "nigeria": "NG", "ng": "NG",
  "cameroun": "CM", "cameroon": "CM", "cm": "CM",
  "gabon": "GA", "ga": "GA",
  "congo": "CG", "republique du congo": "CG", "republic of the congo": "CG", "cg": "CG",
  "rd congo": "CD", "republique democratique du congo": "CD", "dr congo": "CD", "democratic republic of the congo": "CD", "cd": "CD",
  "tchad": "TD", "chad": "TD", "td": "TD",
  "republique centrafricaine": "CF", "central african republic": "CF", "cf": "CF",
  "soudan": "SD", "sudan": "SD", "sd": "SD",
  "soudan du sud": "SS", "south sudan": "SS", "ss": "SS",
  "ethiopie": "ET", "ethiopia": "ET", "et": "ET",
  "erythree": "ER", "eritrea": "ER", "er": "ER",
  "djibouti": "DJ", "dj": "DJ",
  "somalie": "SO", "somalia": "SO", "so": "SO",
  "kenya": "KE", "ke": "KE",
  "ouganda": "UG", "uganda": "UG", "ug": "UG",
  "tanzanie": "TZ", "tanzania": "TZ", "zanzibar": "TZ", "tz": "TZ",
  "rwanda": "RW", "rw": "RW",
  "burundi": "BI", "bi": "BI",
  "angola": "AO", "ao": "AO",
  "zambie": "ZM", "zambia": "ZM", "zm": "ZM",
  "zimbabwe": "ZW", "zw": "ZW",
  "malawi": "MW", "mw": "MW",
  "mozambique": "MZ", "mz": "MZ",
  "madagascar": "MG", "mg": "MG",
  "maurice": "MU", "ile maurice": "MU", "mauritius": "MU", "mu": "MU",
  "seychelles": "SC", "sc": "SC",
  "comores": "KM", "comoros": "KM", "km": "KM",
  "cap-vert": "CV", "cape verde": "CV", "cabo verde": "CV", "cv": "CV",
  "gambie": "GM", "gambia": "GM", "gm": "GM",
  "liberia": "LR", "lr": "LR",
  "sierra leone": "SL", "sl": "SL",
  "namibie": "NA", "namibia": "NA", "na": "NA",
  "botswana": "BW", "bw": "BW",
  "lesotho": "LS", "ls": "LS",
  "eswatini": "SZ", "swaziland": "SZ", "sz": "SZ",
  "sao tome-et-principe": "ST", "sao tome and principe": "ST", "st": "ST",

  // Océanie
  "australie": "AU", "australia": "AU", "au": "AU", "aus": "AU",
  "nouvelle-zelande": "NZ", "nouvelle zelande": "NZ", "new zealand": "NZ", "nz": "NZ",
  "fidji": "FJ", "fiji": "FJ", "fj": "FJ",
  "papouasie-nouvelle-guinee": "PG", "papua new guinea": "PG", "pg": "PG",
  "samoa": "WS", "ws": "WS",
  "tonga": "TO", "to": "TO",
  "vanuatu": "VU", "vu": "VU",
  "micronesie": "FM", "micronesia": "FM", "fm": "FM",
  "palaos": "PW", "palau": "PW", "pw": "PW",
  "iles marshall": "MH", "marshall islands": "MH", "mh": "MH",
  "iles salomon": "SB", "solomon islands": "SB", "sb": "SB",
  "kiribati": "KI", "ki": "KI",
  "nauru": "NR", "nr": "NR",
  "tuvalu": "TV", "tv": "TV"
};

function normalizeCountryInput(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Convertit un emoji drapeau Unicode (ex: "🇫🇷") en code ISO-2 ("FR")
 */
function emojiFlagToIso(str: string): string | null {
  const codePoints = Array.from(str).map(cp => cp.codePointAt(0) || 0);
  const regional = codePoints.filter(cp => cp >= 0x1f1e6 && cp <= 0x1f1ff);
  if (regional.length >= 2) {
    return (
      String.fromCharCode(regional[0] - 0x1f1e6 + 65) +
      String.fromCharCode(regional[1] - 0x1f1e6 + 65)
    );
  }
  return null;
}

/**
 * Résout un nom de pays, code ISO ou emoji drapeau en code ISO 3166-1 alpha-2 majuscule (ex: "FR", "DZ") ou "WORLD".
 */
export function getCountryIsoCode(countryName?: string | null): string | null {
  if (!countryName) return null;

  const trimmed = countryName.trim();
  if (!trimmed) return null;

  const fromEmoji = emojiFlagToIso(trimmed);
  if (fromEmoji) return fromEmoji;

  const clean = normalizeCountryInput(trimmed);
  if (COUNTRY_TO_ISO[clean]) {
    return COUNTRY_TO_ISO[clean];
  }

  // Si c'est directement un code ISO à 2 lettres majuscules connu (ex: "FR", "DZ")
  if (/^[a-z]{2}$/.test(clean) && COUNTRY_TO_ISO[clean]) {
    return COUNTRY_TO_ISO[clean];
  }

  // Correspondance partielle pour chaînes composées (ex: "France (Schengen)", "Émirats Arabes Unis (Dubaï)", "Visa Russie Business")
  for (const [key, iso] of Object.entries(COUNTRY_TO_ISO)) {
    if (key.length >= 4 && clean.includes(key)) {
      return iso;
    }
  }

  return null;
}

/**
 * Convertit un code ISO-2 en emoji drapeau Unicode (usage fallback texte uniquement).
 */
function isoToEmoji(iso: string): string {
  if (iso === "WORLD") return "🌍";
  if (!/^[A-Z]{2}$/.test(iso)) return "🌍";
  return String.fromCodePoint(
    0x1f1e6 + iso.charCodeAt(0) - 65,
    0x1f1e6 + iso.charCodeAt(1) - 65
  );
}

/**
 * Obtient automatiquement l'emoji drapeau à partir du nom du pays (compatibilité ascendante texte/PDF)
 */
export function getCountryFlag(countryName?: string | null): string {
  if (!countryName) return "🌍";
  const iso = getCountryIsoCode(countryName);
  if (iso) return isoToEmoji(iso);
  return "🌍";
}
