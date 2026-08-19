import { VisaStatus } from "./PassportIndex";

export interface Destination {
  country: string;
  code: string;
  status: VisaStatus;
  duration?: string;
}

export interface PassportData {
  rank: number;
  score: number;
  stats: {
    free: number;
    voa: number;
    eta: number;
    required: number;
  };
  destinations: Destination[];
}

export const PASSPORT_DATA: Record<string, PassportData> = {
  "Émirati": {
    "rank": 1,
    "score": 184,
    "stats": {
        "free": 127,
        "voa": 36,
        "eta": 21,
        "required": 14
    },
    "destinations": [
        {
            "country": "Albania",
            "code": "AL",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Algeria",
            "code": "AL",
            "status": "required"
        },
        {
            "country": "Andorra",
            "code": "AN",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Angola",
            "code": "AN",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Antigua and Barbuda",
            "code": "AN",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Argentina",
            "code": "AR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Armenia",
            "code": "AR",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Australia",
            "code": "AU",
            "status": "eta"
        },
        {
            "country": "Austria",
            "code": "AU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Azerbaijan",
            "code": "AZ",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Bahamas",
            "code": "BA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Bahrain",
            "code": "BA",
            "status": "free"
        },
        {
            "country": "Bangladesh",
            "code": "BA",
            "status": "voa"
        },
        {
            "country": "Barbados",
            "code": "BA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Belarus",
            "code": "BE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Belgium",
            "code": "BE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Belize",
            "code": "BE",
            "status": "required"
        },
        {
            "country": "Benin",
            "code": "BE",
            "status": "eta"
        },
        {
            "country": "Bhutan",
            "code": "BH",
            "status": "eta"
        },
        {
            "country": "Bolivia",
            "code": "BO",
            "status": "voa"
        },
        {
            "country": "Bosnia and Herzegovina",
            "code": "BO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Botswana",
            "code": "BO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Brazil",
            "code": "BR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Brunei",
            "code": "BR",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Bulgaria",
            "code": "BU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Burkina Faso",
            "code": "BU",
            "status": "free"
        },
        {
            "country": "Burundi",
            "code": "BU",
            "status": "voa"
        },
        {
            "country": "Cambodia",
            "code": "CA",
            "status": "voa"
        },
        {
            "country": "Cameroon",
            "code": "CA",
            "status": "eta"
        },
        {
            "country": "Canada",
            "code": "CA",
            "status": "eta"
        },
        {
            "country": "Cape Verde",
            "code": "CA",
            "status": "voa"
        },
        {
            "country": "Central African Republic",
            "code": "CE",
            "status": "voa"
        },
        {
            "country": "Chad",
            "code": "CH",
            "status": "free"
        },
        {
            "country": "Chile",
            "code": "CH",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "China",
            "code": "CH",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Colombia",
            "code": "CO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Comoros",
            "code": "CO",
            "status": "voa"
        },
        {
            "country": "Congo",
            "code": "CO",
            "status": "voa"
        },
        {
            "country": "DR Congo",
            "code": "DR",
            "status": "eta"
        },
        {
            "country": "Costa Rica",
            "code": "CO",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Ivory Coast",
            "code": "IV",
            "status": "eta"
        },
        {
            "country": "Croatia",
            "code": "CR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Cuba",
            "code": "CU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Cyprus",
            "code": "CY",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Czech Republic",
            "code": "CZ",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Denmark",
            "code": "DE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Djibouti",
            "code": "DJ",
            "status": "voa"
        },
        {
            "country": "Dominica",
            "code": "DO",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Dominican Republic",
            "code": "DO",
            "status": "free"
        },
        {
            "country": "Ecuador",
            "code": "EC",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Egypt",
            "code": "EG",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "El Salvador",
            "code": "EL",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Equatorial Guinea",
            "code": "EQ",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Eritrea",
            "code": "ER",
            "status": "required"
        },
        {
            "country": "Estonia",
            "code": "ES",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Swaziland",
            "code": "SW",
            "status": "required"
        },
        {
            "country": "Ethiopia",
            "code": "ET",
            "status": "voa"
        },
        {
            "country": "Fiji",
            "code": "FI",
            "status": "free",
            "duration": "120 jours"
        },
        {
            "country": "Finland",
            "code": "FI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "France",
            "code": "FR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Gabon",
            "code": "GA",
            "status": "eta"
        },
        {
            "country": "Gambia",
            "code": "GA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Georgia",
            "code": "GE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Germany",
            "code": "GE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Ghana",
            "code": "GH",
            "status": "voa"
        },
        {
            "country": "Greece",
            "code": "GR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Grenada",
            "code": "GR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Guatemala",
            "code": "GU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Guinea",
            "code": "GU",
            "status": "voa"
        },
        {
            "country": "Guinea-Bissau",
            "code": "GU",
            "status": "voa"
        },
        {
            "country": "Guyana",
            "code": "GU",
            "status": "voa"
        },
        {
            "country": "Haiti",
            "code": "HA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Honduras",
            "code": "HO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Hong Kong",
            "code": "HO",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Hungary",
            "code": "HU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Iceland",
            "code": "IC",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "India",
            "code": "IN",
            "status": "voa"
        },
        {
            "country": "Indonesia",
            "code": "IN",
            "status": "voa"
        },
        {
            "country": "Iran",
            "code": "IR",
            "status": "free",
            "duration": "15 jours"
        },
        {
            "country": "Iraq",
            "code": "IR",
            "status": "voa"
        },
        {
            "country": "Ireland",
            "code": "IR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Israel",
            "code": "IS",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Italy",
            "code": "IT",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Jamaica",
            "code": "JA",
            "status": "voa"
        },
        {
            "country": "Japan",
            "code": "JA",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Jordan",
            "code": "JO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Kazakhstan",
            "code": "KA",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Kenya",
            "code": "KE",
            "status": "eta"
        },
        {
            "country": "Kiribati",
            "code": "KI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Kosovo",
            "code": "KO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Kuwait",
            "code": "KU",
            "status": "free"
        },
        {
            "country": "Kyrgyzstan",
            "code": "KY",
            "status": "free",
            "duration": "60 jours"
        },
        {
            "country": "Laos",
            "code": "LA",
            "status": "voa"
        },
        {
            "country": "Latvia",
            "code": "LA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Lebanon",
            "code": "LE",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Lesotho",
            "code": "LE",
            "status": "eta"
        },
        {
            "country": "Liberia",
            "code": "LI",
            "status": "required"
        },
        {
            "country": "Libya",
            "code": "LI",
            "status": "eta"
        },
        {
            "country": "Liechtenstein",
            "code": "LI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Lithuania",
            "code": "LI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Luxembourg",
            "code": "LU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Macao",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Madagascar",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Malawi",
            "code": "MA",
            "status": "eta"
        },
        {
            "country": "Malaysia",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Maldives",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mali",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Malta",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Marshall Islands",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mauritania",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mauritius",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Mexico",
            "code": "ME",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Micronesia",
            "code": "MI",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Moldova",
            "code": "MO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Monaco",
            "code": "MO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Mongolia",
            "code": "MO",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Montenegro",
            "code": "MO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Morocco",
            "code": "MO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Mozambique",
            "code": "MO",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Myanmar",
            "code": "MY",
            "status": "required"
        },
        {
            "country": "Namibia",
            "code": "NA",
            "status": "voa"
        },
        {
            "country": "Nauru",
            "code": "NA",
            "status": "free"
        },
        {
            "country": "Nepal",
            "code": "NE",
            "status": "voa"
        },
        {
            "country": "Netherlands",
            "code": "NE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "New Zealand",
            "code": "NE",
            "status": "eta"
        },
        {
            "country": "Nicaragua",
            "code": "NI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Niger",
            "code": "NI",
            "status": "required"
        },
        {
            "country": "Nigeria",
            "code": "NI",
            "status": "eta"
        },
        {
            "country": "North Korea",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "North Macedonia",
            "code": "NO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Norway",
            "code": "NO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Oman",
            "code": "OM",
            "status": "free"
        },
        {
            "country": "Pakistan",
            "code": "PA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Palau",
            "code": "PA",
            "status": "voa"
        },
        {
            "country": "Palestine",
            "code": "PA",
            "status": "free"
        },
        {
            "country": "Panama",
            "code": "PA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Papua New Guinea",
            "code": "PA",
            "status": "eta"
        },
        {
            "country": "Paraguay",
            "code": "PA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Peru",
            "code": "PE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Philippines",
            "code": "PH",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Poland",
            "code": "PO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Portugal",
            "code": "PO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Qatar",
            "code": "QA",
            "status": "free"
        },
        {
            "country": "Romania",
            "code": "RO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Russia",
            "code": "RU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Rwanda",
            "code": "RW",
            "status": "voa"
        },
        {
            "country": "Saint Kitts and Nevis",
            "code": "SA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Saint Lucia",
            "code": "SA",
            "status": "free",
            "duration": "60 jours"
        },
        {
            "country": "Samoa",
            "code": "SA",
            "status": "voa"
        },
        {
            "country": "San Marino",
            "code": "SA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sao Tome and Principe",
            "code": "SA",
            "status": "free",
            "duration": "15 jours"
        },
        {
            "country": "Saudi Arabia",
            "code": "SA",
            "status": "free"
        },
        {
            "country": "Senegal",
            "code": "SE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Serbia",
            "code": "SE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Seychelles",
            "code": "SE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sierra Leone",
            "code": "SI",
            "status": "voa"
        },
        {
            "country": "Singapore",
            "code": "SI",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Slovakia",
            "code": "SL",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Slovenia",
            "code": "SL",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Solomon Islands",
            "code": "SO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Somalia",
            "code": "SO",
            "status": "voa"
        },
        {
            "country": "South Africa",
            "code": "SO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "South Korea",
            "code": "SO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "South Sudan",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "Spain",
            "code": "SP",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sri Lanka",
            "code": "SR",
            "status": "voa"
        },
        {
            "country": "Saint Vincent and the Grenadines",
            "code": "SA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sudan",
            "code": "SU",
            "status": "free"
        },
        {
            "country": "Suriname",
            "code": "SU",
            "status": "required"
        },
        {
            "country": "Sweden",
            "code": "SW",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Switzerland",
            "code": "SW",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Syria",
            "code": "SY",
            "status": "free"
        },
        {
            "country": "Taiwan",
            "code": "TA",
            "status": "eta"
        },
        {
            "country": "Tajikistan",
            "code": "TA",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Tanzania",
            "code": "TA",
            "status": "voa"
        },
        {
            "country": "Thailand",
            "code": "TH",
            "status": "free",
            "duration": "60 jours"
        },
        {
            "country": "Timor-Leste",
            "code": "TI",
            "status": "voa"
        },
        {
            "country": "Togo",
            "code": "TO",
            "status": "eta"
        },
        {
            "country": "Tonga",
            "code": "TO",
            "status": "free",
            "duration": "60 jours"
        },
        {
            "country": "Trinidad and Tobago",
            "code": "TR",
            "status": "required"
        },
        {
            "country": "Tunisia",
            "code": "TU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Turkmenistan",
            "code": "TU",
            "status": "required"
        },
        {
            "country": "Tuvalu",
            "code": "TU",
            "status": "voa"
        },
        {
            "country": "Turkey",
            "code": "TU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Uganda",
            "code": "UG",
            "status": "eta"
        },
        {
            "country": "Ukraine",
            "code": "UK",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "United Kingdom",
            "code": "UN",
            "status": "eta"
        },
        {
            "country": "United States",
            "code": "UN",
            "status": "required"
        },
        {
            "country": "Uruguay",
            "code": "UR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Uzbekistan",
            "code": "UZ",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Vanuatu",
            "code": "VA",
            "status": "free",
            "duration": "120 jours"
        },
        {
            "country": "Vatican",
            "code": "VA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Venezuela",
            "code": "VE",
            "status": "required"
        },
        {
            "country": "Vietnam",
            "code": "VI",
            "status": "eta"
        },
        {
            "country": "Yemen",
            "code": "YE",
            "status": "voa"
        },
        {
            "country": "Zambia",
            "code": "ZA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Zimbabwe",
            "code": "ZI",
            "status": "voa"
        },
        {
            "country": "Afghanistan",
            "code": "AF",
            "status": "required"
        }
    ]
},
  "Français": {
    "rank": 2,
    "score": 183,
    "stats": {
        "free": 127,
        "voa": 30,
        "eta": 26,
        "required": 15
    },
    "destinations": [
        {
            "country": "Albania",
            "code": "AL",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Algeria",
            "code": "AL",
            "status": "required"
        },
        {
            "country": "Andorra",
            "code": "AN",
            "status": "free"
        },
        {
            "country": "Angola",
            "code": "AN",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Antigua and Barbuda",
            "code": "AN",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Argentina",
            "code": "AR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Armenia",
            "code": "AR",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Australia",
            "code": "AU",
            "status": "eta"
        },
        {
            "country": "Austria",
            "code": "AU",
            "status": "free"
        },
        {
            "country": "Azerbaijan",
            "code": "AZ",
            "status": "eta"
        },
        {
            "country": "Bahamas",
            "code": "BA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Bahrain",
            "code": "BA",
            "status": "voa"
        },
        {
            "country": "Bangladesh",
            "code": "BA",
            "status": "voa"
        },
        {
            "country": "Barbados",
            "code": "BA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Belarus",
            "code": "BE",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Belgium",
            "code": "BE",
            "status": "free"
        },
        {
            "country": "Belize",
            "code": "BE",
            "status": "free"
        },
        {
            "country": "Benin",
            "code": "BE",
            "status": "eta"
        },
        {
            "country": "Bhutan",
            "code": "BH",
            "status": "eta"
        },
        {
            "country": "Bolivia",
            "code": "BO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Bosnia and Herzegovina",
            "code": "BO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Botswana",
            "code": "BO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Brazil",
            "code": "BR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Brunei",
            "code": "BR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Bulgaria",
            "code": "BU",
            "status": "free"
        },
        {
            "country": "Burkina Faso",
            "code": "BU",
            "status": "voa"
        },
        {
            "country": "Burundi",
            "code": "BU",
            "status": "voa"
        },
        {
            "country": "Cambodia",
            "code": "CA",
            "status": "voa"
        },
        {
            "country": "Cameroon",
            "code": "CA",
            "status": "eta"
        },
        {
            "country": "Canada",
            "code": "CA",
            "status": "eta"
        },
        {
            "country": "Cape Verde",
            "code": "CA",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Central African Republic",
            "code": "CE",
            "status": "required"
        },
        {
            "country": "Chad",
            "code": "CH",
            "status": "required"
        },
        {
            "country": "Chile",
            "code": "CH",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "China",
            "code": "CH",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Colombia",
            "code": "CO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Comoros",
            "code": "CO",
            "status": "voa"
        },
        {
            "country": "Congo",
            "code": "CO",
            "status": "required"
        },
        {
            "country": "DR Congo",
            "code": "DR",
            "status": "eta"
        },
        {
            "country": "Costa Rica",
            "code": "CO",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Ivory Coast",
            "code": "IV",
            "status": "eta"
        },
        {
            "country": "Croatia",
            "code": "CR",
            "status": "free"
        },
        {
            "country": "Cuba",
            "code": "CU",
            "status": "eta"
        },
        {
            "country": "Cyprus",
            "code": "CY",
            "status": "free"
        },
        {
            "country": "Czech Republic",
            "code": "CZ",
            "status": "free"
        },
        {
            "country": "Denmark",
            "code": "DE",
            "status": "free"
        },
        {
            "country": "Djibouti",
            "code": "DJ",
            "status": "voa"
        },
        {
            "country": "Dominica",
            "code": "DO",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Dominican Republic",
            "code": "DO",
            "status": "free"
        },
        {
            "country": "Ecuador",
            "code": "EC",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Egypt",
            "code": "EG",
            "status": "voa"
        },
        {
            "country": "El Salvador",
            "code": "EL",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Equatorial Guinea",
            "code": "EQ",
            "status": "eta"
        },
        {
            "country": "Eritrea",
            "code": "ER",
            "status": "required"
        },
        {
            "country": "Estonia",
            "code": "ES",
            "status": "free"
        },
        {
            "country": "Swaziland",
            "code": "SW",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Ethiopia",
            "code": "ET",
            "status": "voa"
        },
        {
            "country": "Fiji",
            "code": "FI",
            "status": "free",
            "duration": "120 jours"
        },
        {
            "country": "Finland",
            "code": "FI",
            "status": "free"
        },
        {
            "country": "Gabon",
            "code": "GA",
            "status": "eta"
        },
        {
            "country": "Gambia",
            "code": "GA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Georgia",
            "code": "GE",
            "status": "free",
            "duration": "360 jours"
        },
        {
            "country": "Germany",
            "code": "GE",
            "status": "free"
        },
        {
            "country": "Ghana",
            "code": "GH",
            "status": "voa"
        },
        {
            "country": "Greece",
            "code": "GR",
            "status": "free"
        },
        {
            "country": "Grenada",
            "code": "GR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Guatemala",
            "code": "GU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Guinea",
            "code": "GU",
            "status": "eta"
        },
        {
            "country": "Guinea-Bissau",
            "code": "GU",
            "status": "voa"
        },
        {
            "country": "Guyana",
            "code": "GU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Haiti",
            "code": "HA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Honduras",
            "code": "HO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Hong Kong",
            "code": "HO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Hungary",
            "code": "HU",
            "status": "free"
        },
        {
            "country": "Iceland",
            "code": "IC",
            "status": "free"
        },
        {
            "country": "India",
            "code": "IN",
            "status": "eta"
        },
        {
            "country": "Indonesia",
            "code": "IN",
            "status": "voa"
        },
        {
            "country": "Iran",
            "code": "IR",
            "status": "voa"
        },
        {
            "country": "Iraq",
            "code": "IR",
            "status": "voa"
        },
        {
            "country": "Ireland",
            "code": "IR",
            "status": "free"
        },
        {
            "country": "Israel",
            "code": "IS",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Italy",
            "code": "IT",
            "status": "free"
        },
        {
            "country": "Jamaica",
            "code": "JA",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Japan",
            "code": "JA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Jordan",
            "code": "JO",
            "status": "voa"
        },
        {
            "country": "Kazakhstan",
            "code": "KA",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Kenya",
            "code": "KE",
            "status": "eta"
        },
        {
            "country": "Kiribati",
            "code": "KI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Kosovo",
            "code": "KO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Kuwait",
            "code": "KU",
            "status": "voa"
        },
        {
            "country": "Kyrgyzstan",
            "code": "KY",
            "status": "free",
            "duration": "60 jours"
        },
        {
            "country": "Laos",
            "code": "LA",
            "status": "voa"
        },
        {
            "country": "Latvia",
            "code": "LA",
            "status": "free"
        },
        {
            "country": "Lebanon",
            "code": "LE",
            "status": "voa"
        },
        {
            "country": "Lesotho",
            "code": "LE",
            "status": "free",
            "duration": "14 jours"
        },
        {
            "country": "Liberia",
            "code": "LI",
            "status": "required"
        },
        {
            "country": "Libya",
            "code": "LI",
            "status": "eta"
        },
        {
            "country": "Liechtenstein",
            "code": "LI",
            "status": "free"
        },
        {
            "country": "Lithuania",
            "code": "LI",
            "status": "free"
        },
        {
            "country": "Luxembourg",
            "code": "LU",
            "status": "free"
        },
        {
            "country": "Macao",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Madagascar",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Malawi",
            "code": "MA",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Malaysia",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Maldives",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mali",
            "code": "MA",
            "status": "required"
        },
        {
            "country": "Malta",
            "code": "MA",
            "status": "free"
        },
        {
            "country": "Marshall Islands",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Mauritania",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mauritius",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Mexico",
            "code": "ME",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Micronesia",
            "code": "MI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Moldova",
            "code": "MO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Monaco",
            "code": "MO",
            "status": "free"
        },
        {
            "country": "Mongolia",
            "code": "MO",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Montenegro",
            "code": "MO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Morocco",
            "code": "MO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Mozambique",
            "code": "MO",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Myanmar",
            "code": "MY",
            "status": "eta"
        },
        {
            "country": "Namibia",
            "code": "NA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Nauru",
            "code": "NA",
            "status": "required"
        },
        {
            "country": "Nepal",
            "code": "NE",
            "status": "voa"
        },
        {
            "country": "Netherlands",
            "code": "NE",
            "status": "free"
        },
        {
            "country": "New Zealand",
            "code": "NE",
            "status": "eta"
        },
        {
            "country": "Nicaragua",
            "code": "NI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Niger",
            "code": "NI",
            "status": "required"
        },
        {
            "country": "Nigeria",
            "code": "NI",
            "status": "eta"
        },
        {
            "country": "North Korea",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "North Macedonia",
            "code": "NO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Norway",
            "code": "NO",
            "status": "free"
        },
        {
            "country": "Oman",
            "code": "OM",
            "status": "voa"
        },
        {
            "country": "Pakistan",
            "code": "PA",
            "status": "eta"
        },
        {
            "country": "Palau",
            "code": "PA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Palestine",
            "code": "PA",
            "status": "free"
        },
        {
            "country": "Panama",
            "code": "PA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Papua New Guinea",
            "code": "PA",
            "status": "eta"
        },
        {
            "country": "Paraguay",
            "code": "PA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Peru",
            "code": "PE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Philippines",
            "code": "PH",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Poland",
            "code": "PO",
            "status": "free"
        },
        {
            "country": "Portugal",
            "code": "PO",
            "status": "free"
        },
        {
            "country": "Qatar",
            "code": "QA",
            "status": "voa"
        },
        {
            "country": "Romania",
            "code": "RO",
            "status": "free"
        },
        {
            "country": "Russia",
            "code": "RU",
            "status": "eta"
        },
        {
            "country": "Rwanda",
            "code": "RW",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Saint Kitts and Nevis",
            "code": "SA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Saint Lucia",
            "code": "SA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Samoa",
            "code": "SA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "San Marino",
            "code": "SA",
            "status": "free"
        },
        {
            "country": "Sao Tome and Principe",
            "code": "SA",
            "status": "free",
            "duration": "15 jours"
        },
        {
            "country": "Saudi Arabia",
            "code": "SA",
            "status": "voa"
        },
        {
            "country": "Senegal",
            "code": "SE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Serbia",
            "code": "SE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Seychelles",
            "code": "SE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sierra Leone",
            "code": "SI",
            "status": "voa"
        },
        {
            "country": "Singapore",
            "code": "SI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Slovakia",
            "code": "SL",
            "status": "free"
        },
        {
            "country": "Slovenia",
            "code": "SL",
            "status": "free"
        },
        {
            "country": "Solomon Islands",
            "code": "SO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Somalia",
            "code": "SO",
            "status": "voa"
        },
        {
            "country": "South Africa",
            "code": "SO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "South Korea",
            "code": "SO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "South Sudan",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "Spain",
            "code": "SP",
            "status": "free"
        },
        {
            "country": "Sri Lanka",
            "code": "SR",
            "status": "voa"
        },
        {
            "country": "Saint Vincent and the Grenadines",
            "code": "SA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sudan",
            "code": "SU",
            "status": "required"
        },
        {
            "country": "Suriname",
            "code": "SU",
            "status": "required"
        },
        {
            "country": "Sweden",
            "code": "SW",
            "status": "free"
        },
        {
            "country": "Switzerland",
            "code": "SW",
            "status": "free"
        },
        {
            "country": "Syria",
            "code": "SY",
            "status": "eta"
        },
        {
            "country": "Taiwan",
            "code": "TA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Tajikistan",
            "code": "TA",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Tanzania",
            "code": "TA",
            "status": "voa"
        },
        {
            "country": "Thailand",
            "code": "TH",
            "status": "free",
            "duration": "60 jours"
        },
        {
            "country": "Timor-Leste",
            "code": "TI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Togo",
            "code": "TO",
            "status": "eta"
        },
        {
            "country": "Tonga",
            "code": "TO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Trinidad and Tobago",
            "code": "TR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Tunisia",
            "code": "TU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Turkmenistan",
            "code": "TU",
            "status": "required"
        },
        {
            "country": "Tuvalu",
            "code": "TU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Turkey",
            "code": "TU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Uganda",
            "code": "UG",
            "status": "eta"
        },
        {
            "country": "Ukraine",
            "code": "UK",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "United Arab Emirates",
            "code": "UN",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "United Kingdom",
            "code": "UN",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "United States",
            "code": "UN",
            "status": "eta"
        },
        {
            "country": "Uruguay",
            "code": "UR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Uzbekistan",
            "code": "UZ",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Vanuatu",
            "code": "VA",
            "status": "free",
            "duration": "120 jours"
        },
        {
            "country": "Vatican",
            "code": "VA",
            "status": "free"
        },
        {
            "country": "Venezuela",
            "code": "VE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Vietnam",
            "code": "VI",
            "status": "free",
            "duration": "45 jours"
        },
        {
            "country": "Yemen",
            "code": "YE",
            "status": "required"
        },
        {
            "country": "Zambia",
            "code": "ZA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Zimbabwe",
            "code": "ZI",
            "status": "voa"
        },
        {
            "country": "Afghanistan",
            "code": "AF",
            "status": "required"
        }
    ]
},
  "Canadien": {
    "rank": 3,
    "score": 179,
    "stats": {
        "free": 117,
        "voa": 37,
        "eta": 25,
        "required": 19
    },
    "destinations": [
        {
            "country": "Albania",
            "code": "AL",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Algeria",
            "code": "AL",
            "status": "required"
        },
        {
            "country": "Andorra",
            "code": "AN",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Angola",
            "code": "AN",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Antigua and Barbuda",
            "code": "AN",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Argentina",
            "code": "AR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Armenia",
            "code": "AR",
            "status": "voa"
        },
        {
            "country": "Australia",
            "code": "AU",
            "status": "eta"
        },
        {
            "country": "Austria",
            "code": "AU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Azerbaijan",
            "code": "AZ",
            "status": "eta"
        },
        {
            "country": "Bahamas",
            "code": "BA",
            "status": "free",
            "duration": "240 jours"
        },
        {
            "country": "Bahrain",
            "code": "BA",
            "status": "voa"
        },
        {
            "country": "Bangladesh",
            "code": "BA",
            "status": "voa"
        },
        {
            "country": "Barbados",
            "code": "BA",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Belarus",
            "code": "BE",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Belgium",
            "code": "BE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Belize",
            "code": "BE",
            "status": "free"
        },
        {
            "country": "Benin",
            "code": "BE",
            "status": "eta"
        },
        {
            "country": "Bhutan",
            "code": "BH",
            "status": "eta"
        },
        {
            "country": "Bolivia",
            "code": "BO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Bosnia and Herzegovina",
            "code": "BO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Botswana",
            "code": "BO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Brazil",
            "code": "BR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Brunei",
            "code": "BR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Bulgaria",
            "code": "BU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Burkina Faso",
            "code": "BU",
            "status": "voa"
        },
        {
            "country": "Burundi",
            "code": "BU",
            "status": "voa"
        },
        {
            "country": "Cambodia",
            "code": "CA",
            "status": "voa"
        },
        {
            "country": "Cameroon",
            "code": "CA",
            "status": "eta"
        },
        {
            "country": "Cape Verde",
            "code": "CA",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Central African Republic",
            "code": "CE",
            "status": "required"
        },
        {
            "country": "Chad",
            "code": "CH",
            "status": "required"
        },
        {
            "country": "Chile",
            "code": "CH",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "China",
            "code": "CH",
            "status": "required"
        },
        {
            "country": "Colombia",
            "code": "CO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Comoros",
            "code": "CO",
            "status": "voa"
        },
        {
            "country": "Congo",
            "code": "CO",
            "status": "required"
        },
        {
            "country": "DR Congo",
            "code": "DR",
            "status": "eta"
        },
        {
            "country": "Costa Rica",
            "code": "CO",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Ivory Coast",
            "code": "IV",
            "status": "eta"
        },
        {
            "country": "Croatia",
            "code": "CR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Cuba",
            "code": "CU",
            "status": "eta"
        },
        {
            "country": "Cyprus",
            "code": "CY",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Czech Republic",
            "code": "CZ",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Denmark",
            "code": "DE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Djibouti",
            "code": "DJ",
            "status": "voa"
        },
        {
            "country": "Dominica",
            "code": "DO",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Dominican Republic",
            "code": "DO",
            "status": "free"
        },
        {
            "country": "Ecuador",
            "code": "EC",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Egypt",
            "code": "EG",
            "status": "voa"
        },
        {
            "country": "El Salvador",
            "code": "EL",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Equatorial Guinea",
            "code": "EQ",
            "status": "eta"
        },
        {
            "country": "Eritrea",
            "code": "ER",
            "status": "required"
        },
        {
            "country": "Estonia",
            "code": "ES",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Swaziland",
            "code": "SW",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Ethiopia",
            "code": "ET",
            "status": "voa"
        },
        {
            "country": "Fiji",
            "code": "FI",
            "status": "free",
            "duration": "120 jours"
        },
        {
            "country": "Finland",
            "code": "FI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "France",
            "code": "FR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Gabon",
            "code": "GA",
            "status": "eta"
        },
        {
            "country": "Gambia",
            "code": "GA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Georgia",
            "code": "GE",
            "status": "free",
            "duration": "360 jours"
        },
        {
            "country": "Germany",
            "code": "GE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Ghana",
            "code": "GH",
            "status": "voa"
        },
        {
            "country": "Greece",
            "code": "GR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Grenada",
            "code": "GR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Guatemala",
            "code": "GU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Guinea",
            "code": "GU",
            "status": "eta"
        },
        {
            "country": "Guinea-Bissau",
            "code": "GU",
            "status": "voa"
        },
        {
            "country": "Guyana",
            "code": "GU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Haiti",
            "code": "HA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Honduras",
            "code": "HO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Hong Kong",
            "code": "HO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Hungary",
            "code": "HU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Iceland",
            "code": "IC",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "India",
            "code": "IN",
            "status": "eta"
        },
        {
            "country": "Indonesia",
            "code": "IN",
            "status": "voa"
        },
        {
            "country": "Iran",
            "code": "IR",
            "status": "required"
        },
        {
            "country": "Iraq",
            "code": "IR",
            "status": "voa"
        },
        {
            "country": "Ireland",
            "code": "IR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Israel",
            "code": "IS",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Italy",
            "code": "IT",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Jamaica",
            "code": "JA",
            "status": "free"
        },
        {
            "country": "Japan",
            "code": "JA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Jordan",
            "code": "JO",
            "status": "voa"
        },
        {
            "country": "Kazakhstan",
            "code": "KA",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Kenya",
            "code": "KE",
            "status": "eta"
        },
        {
            "country": "Kiribati",
            "code": "KI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Kosovo",
            "code": "KO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Kuwait",
            "code": "KU",
            "status": "voa"
        },
        {
            "country": "Kyrgyzstan",
            "code": "KY",
            "status": "free",
            "duration": "60 jours"
        },
        {
            "country": "Laos",
            "code": "LA",
            "status": "voa"
        },
        {
            "country": "Latvia",
            "code": "LA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Lebanon",
            "code": "LE",
            "status": "voa"
        },
        {
            "country": "Lesotho",
            "code": "LE",
            "status": "free"
        },
        {
            "country": "Liberia",
            "code": "LI",
            "status": "required"
        },
        {
            "country": "Libya",
            "code": "LI",
            "status": "eta"
        },
        {
            "country": "Liechtenstein",
            "code": "LI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Lithuania",
            "code": "LI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Luxembourg",
            "code": "LU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Macao",
            "code": "MA",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Madagascar",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Malawi",
            "code": "MA",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Malaysia",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Maldives",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mali",
            "code": "MA",
            "status": "required"
        },
        {
            "country": "Malta",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Marshall Islands",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mauritania",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mauritius",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Mexico",
            "code": "ME",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Micronesia",
            "code": "MI",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Moldova",
            "code": "MO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Monaco",
            "code": "MO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Mongolia",
            "code": "MO",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Montenegro",
            "code": "MO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Morocco",
            "code": "MO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Mozambique",
            "code": "MO",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Myanmar",
            "code": "MY",
            "status": "eta"
        },
        {
            "country": "Namibia",
            "code": "NA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Nauru",
            "code": "NA",
            "status": "required"
        },
        {
            "country": "Nepal",
            "code": "NE",
            "status": "voa"
        },
        {
            "country": "Netherlands",
            "code": "NE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "New Zealand",
            "code": "NE",
            "status": "eta"
        },
        {
            "country": "Nicaragua",
            "code": "NI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Niger",
            "code": "NI",
            "status": "required"
        },
        {
            "country": "Nigeria",
            "code": "NI",
            "status": "eta"
        },
        {
            "country": "North Korea",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "North Macedonia",
            "code": "NO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Norway",
            "code": "NO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Oman",
            "code": "OM",
            "status": "voa"
        },
        {
            "country": "Pakistan",
            "code": "PA",
            "status": "eta"
        },
        {
            "country": "Palau",
            "code": "PA",
            "status": "voa"
        },
        {
            "country": "Palestine",
            "code": "PA",
            "status": "free"
        },
        {
            "country": "Panama",
            "code": "PA",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Papua New Guinea",
            "code": "PA",
            "status": "eta"
        },
        {
            "country": "Paraguay",
            "code": "PA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Peru",
            "code": "PE",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Philippines",
            "code": "PH",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Poland",
            "code": "PO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Portugal",
            "code": "PO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Qatar",
            "code": "QA",
            "status": "voa"
        },
        {
            "country": "Romania",
            "code": "RO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Russia",
            "code": "RU",
            "status": "required"
        },
        {
            "country": "Rwanda",
            "code": "RW",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Saint Kitts and Nevis",
            "code": "SA",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Saint Lucia",
            "code": "SA",
            "status": "free",
            "duration": "42 jours"
        },
        {
            "country": "Samoa",
            "code": "SA",
            "status": "voa"
        },
        {
            "country": "San Marino",
            "code": "SA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sao Tome and Principe",
            "code": "SA",
            "status": "free",
            "duration": "15 jours"
        },
        {
            "country": "Saudi Arabia",
            "code": "SA",
            "status": "voa"
        },
        {
            "country": "Senegal",
            "code": "SE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Serbia",
            "code": "SE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Seychelles",
            "code": "SE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sierra Leone",
            "code": "SI",
            "status": "voa"
        },
        {
            "country": "Singapore",
            "code": "SI",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Slovakia",
            "code": "SL",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Slovenia",
            "code": "SL",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Solomon Islands",
            "code": "SO",
            "status": "voa"
        },
        {
            "country": "Somalia",
            "code": "SO",
            "status": "voa"
        },
        {
            "country": "South Africa",
            "code": "SO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "South Korea",
            "code": "SO",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "South Sudan",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "Spain",
            "code": "SP",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sri Lanka",
            "code": "SR",
            "status": "voa"
        },
        {
            "country": "Saint Vincent and the Grenadines",
            "code": "SA",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Sudan",
            "code": "SU",
            "status": "required"
        },
        {
            "country": "Suriname",
            "code": "SU",
            "status": "required"
        },
        {
            "country": "Sweden",
            "code": "SW",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Switzerland",
            "code": "SW",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Syria",
            "code": "SY",
            "status": "eta"
        },
        {
            "country": "Taiwan",
            "code": "TA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Tajikistan",
            "code": "TA",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Tanzania",
            "code": "TA",
            "status": "voa"
        },
        {
            "country": "Thailand",
            "code": "TH",
            "status": "free",
            "duration": "60 jours"
        },
        {
            "country": "Timor-Leste",
            "code": "TI",
            "status": "voa"
        },
        {
            "country": "Togo",
            "code": "TO",
            "status": "eta"
        },
        {
            "country": "Tonga",
            "code": "TO",
            "status": "voa"
        },
        {
            "country": "Trinidad and Tobago",
            "code": "TR",
            "status": "free"
        },
        {
            "country": "Tunisia",
            "code": "TU",
            "status": "free",
            "duration": "120 jours"
        },
        {
            "country": "Turkmenistan",
            "code": "TU",
            "status": "required"
        },
        {
            "country": "Tuvalu",
            "code": "TU",
            "status": "voa"
        },
        {
            "country": "Turkey",
            "code": "TU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Uganda",
            "code": "UG",
            "status": "eta"
        },
        {
            "country": "Ukraine",
            "code": "UK",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "United Arab Emirates",
            "code": "UN",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "United Kingdom",
            "code": "UN",
            "status": "eta"
        },
        {
            "country": "United States",
            "code": "UN",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Uruguay",
            "code": "UR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Uzbekistan",
            "code": "UZ",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Vanuatu",
            "code": "VA",
            "status": "free",
            "duration": "120 jours"
        },
        {
            "country": "Vatican",
            "code": "VA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Venezuela",
            "code": "VE",
            "status": "required"
        },
        {
            "country": "Vietnam",
            "code": "VI",
            "status": "eta"
        },
        {
            "country": "Yemen",
            "code": "YE",
            "status": "required"
        },
        {
            "country": "Zambia",
            "code": "ZA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Zimbabwe",
            "code": "ZI",
            "status": "voa"
        },
        {
            "country": "Afghanistan",
            "code": "AF",
            "status": "required"
        }
    ]
},
  "Marocain": {
    "rank": 4,
    "score": 109,
    "stats": {
        "free": 38,
        "voa": 31,
        "eta": 40,
        "required": 89
    },
    "destinations": [
        {
            "country": "Albania",
            "code": "AL",
            "status": "eta"
        },
        {
            "country": "Algeria",
            "code": "AL",
            "status": "required"
        },
        {
            "country": "Andorra",
            "code": "AN",
            "status": "required"
        },
        {
            "country": "Angola",
            "code": "AN",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Antigua and Barbuda",
            "code": "AN",
            "status": "eta"
        },
        {
            "country": "Argentina",
            "code": "AR",
            "status": "required"
        },
        {
            "country": "Armenia",
            "code": "AR",
            "status": "eta"
        },
        {
            "country": "Australia",
            "code": "AU",
            "status": "eta"
        },
        {
            "country": "Austria",
            "code": "AU",
            "status": "required"
        },
        {
            "country": "Azerbaijan",
            "code": "AZ",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Bahamas",
            "code": "BA",
            "status": "eta"
        },
        {
            "country": "Bahrain",
            "code": "BA",
            "status": "eta"
        },
        {
            "country": "Bangladesh",
            "code": "BA",
            "status": "required"
        },
        {
            "country": "Barbados",
            "code": "BA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Belarus",
            "code": "BE",
            "status": "required"
        },
        {
            "country": "Belgium",
            "code": "BE",
            "status": "required"
        },
        {
            "country": "Belize",
            "code": "BE",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Benin",
            "code": "BE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Bhutan",
            "code": "BH",
            "status": "eta"
        },
        {
            "country": "Bolivia",
            "code": "BO",
            "status": "voa"
        },
        {
            "country": "Bosnia and Herzegovina",
            "code": "BO",
            "status": "required"
        },
        {
            "country": "Botswana",
            "code": "BO",
            "status": "eta"
        },
        {
            "country": "Brazil",
            "code": "BR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Brunei",
            "code": "BR",
            "status": "required"
        },
        {
            "country": "Bulgaria",
            "code": "BU",
            "status": "required"
        },
        {
            "country": "Burkina Faso",
            "code": "BU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Burundi",
            "code": "BU",
            "status": "voa"
        },
        {
            "country": "Cambodia",
            "code": "CA",
            "status": "voa"
        },
        {
            "country": "Cameroon",
            "code": "CA",
            "status": "eta"
        },
        {
            "country": "Canada",
            "code": "CA",
            "status": "required"
        },
        {
            "country": "Cape Verde",
            "code": "CA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Central African Republic",
            "code": "CE",
            "status": "required"
        },
        {
            "country": "Chad",
            "code": "CH",
            "status": "required"
        },
        {
            "country": "Chile",
            "code": "CH",
            "status": "required"
        },
        {
            "country": "China",
            "code": "CH",
            "status": "required"
        },
        {
            "country": "Colombia",
            "code": "CO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Comoros",
            "code": "CO",
            "status": "voa"
        },
        {
            "country": "Congo",
            "code": "CO",
            "status": "voa"
        },
        {
            "country": "DR Congo",
            "code": "DR",
            "status": "eta"
        },
        {
            "country": "Costa Rica",
            "code": "CO",
            "status": "required"
        },
        {
            "country": "Ivory Coast",
            "code": "IV",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Croatia",
            "code": "CR",
            "status": "required"
        },
        {
            "country": "Cuba",
            "code": "CU",
            "status": "eta"
        },
        {
            "country": "Cyprus",
            "code": "CY",
            "status": "required"
        },
        {
            "country": "Czech Republic",
            "code": "CZ",
            "status": "required"
        },
        {
            "country": "Denmark",
            "code": "DE",
            "status": "required"
        },
        {
            "country": "Djibouti",
            "code": "DJ",
            "status": "voa"
        },
        {
            "country": "Dominica",
            "code": "DO",
            "status": "free",
            "duration": "21 jours"
        },
        {
            "country": "Dominican Republic",
            "code": "DO",
            "status": "free"
        },
        {
            "country": "Ecuador",
            "code": "EC",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Egypt",
            "code": "EG",
            "status": "required"
        },
        {
            "country": "El Salvador",
            "code": "EL",
            "status": "eta"
        },
        {
            "country": "Equatorial Guinea",
            "code": "EQ",
            "status": "eta"
        },
        {
            "country": "Eritrea",
            "code": "ER",
            "status": "required"
        },
        {
            "country": "Estonia",
            "code": "ES",
            "status": "required"
        },
        {
            "country": "Swaziland",
            "code": "SW",
            "status": "required"
        },
        {
            "country": "Ethiopia",
            "code": "ET",
            "status": "voa"
        },
        {
            "country": "Fiji",
            "code": "FI",
            "status": "required"
        },
        {
            "country": "Finland",
            "code": "FI",
            "status": "required"
        },
        {
            "country": "France",
            "code": "FR",
            "status": "required"
        },
        {
            "country": "Gabon",
            "code": "GA",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Gambia",
            "code": "GA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Georgia",
            "code": "GE",
            "status": "eta"
        },
        {
            "country": "Germany",
            "code": "GE",
            "status": "required"
        },
        {
            "country": "Ghana",
            "code": "GH",
            "status": "voa"
        },
        {
            "country": "Greece",
            "code": "GR",
            "status": "required"
        },
        {
            "country": "Grenada",
            "code": "GR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Guatemala",
            "code": "GU",
            "status": "required"
        },
        {
            "country": "Guinea",
            "code": "GU",
            "status": "free"
        },
        {
            "country": "Guinea-Bissau",
            "code": "GU",
            "status": "voa"
        },
        {
            "country": "Guyana",
            "code": "GU",
            "status": "required"
        },
        {
            "country": "Haiti",
            "code": "HA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Honduras",
            "code": "HO",
            "status": "required"
        },
        {
            "country": "Hong Kong",
            "code": "HO",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Hungary",
            "code": "HU",
            "status": "required"
        },
        {
            "country": "Iceland",
            "code": "IC",
            "status": "required"
        },
        {
            "country": "India",
            "code": "IN",
            "status": "eta"
        },
        {
            "country": "Indonesia",
            "code": "IN",
            "status": "voa"
        },
        {
            "country": "Iran",
            "code": "IR",
            "status": "voa"
        },
        {
            "country": "Iraq",
            "code": "IR",
            "status": "eta"
        },
        {
            "country": "Ireland",
            "code": "IR",
            "status": "required"
        },
        {
            "country": "Israel",
            "code": "IS",
            "status": "required"
        },
        {
            "country": "Italy",
            "code": "IT",
            "status": "required"
        },
        {
            "country": "Jamaica",
            "code": "JA",
            "status": "required"
        },
        {
            "country": "Japan",
            "code": "JA",
            "status": "required"
        },
        {
            "country": "Jordan",
            "code": "JO",
            "status": "voa"
        },
        {
            "country": "Kazakhstan",
            "code": "KA",
            "status": "eta"
        },
        {
            "country": "Kenya",
            "code": "KE",
            "status": "eta"
        },
        {
            "country": "Kiribati",
            "code": "KI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Kosovo",
            "code": "KO",
            "status": "required"
        },
        {
            "country": "Kuwait",
            "code": "KU",
            "status": "required"
        },
        {
            "country": "Kyrgyzstan",
            "code": "KY",
            "status": "eta"
        },
        {
            "country": "Laos",
            "code": "LA",
            "status": "voa"
        },
        {
            "country": "Latvia",
            "code": "LA",
            "status": "required"
        },
        {
            "country": "Lebanon",
            "code": "LE",
            "status": "voa"
        },
        {
            "country": "Lesotho",
            "code": "LE",
            "status": "eta"
        },
        {
            "country": "Liberia",
            "code": "LI",
            "status": "required"
        },
        {
            "country": "Libya",
            "code": "LI",
            "status": "eta"
        },
        {
            "country": "Liechtenstein",
            "code": "LI",
            "status": "required"
        },
        {
            "country": "Lithuania",
            "code": "LI",
            "status": "required"
        },
        {
            "country": "Luxembourg",
            "code": "LU",
            "status": "required"
        },
        {
            "country": "Macao",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Madagascar",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Malawi",
            "code": "MA",
            "status": "eta"
        },
        {
            "country": "Malaysia",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Maldives",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mali",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Malta",
            "code": "MA",
            "status": "required"
        },
        {
            "country": "Marshall Islands",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mauritania",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mauritius",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mexico",
            "code": "ME",
            "status": "required"
        },
        {
            "country": "Micronesia",
            "code": "MI",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Moldova",
            "code": "MO",
            "status": "eta"
        },
        {
            "country": "Monaco",
            "code": "MO",
            "status": "required"
        },
        {
            "country": "Mongolia",
            "code": "MO",
            "status": "required"
        },
        {
            "country": "Montenegro",
            "code": "MO",
            "status": "required"
        },
        {
            "country": "Mozambique",
            "code": "MO",
            "status": "voa"
        },
        {
            "country": "Myanmar",
            "code": "MY",
            "status": "eta"
        },
        {
            "country": "Namibia",
            "code": "NA",
            "status": "required"
        },
        {
            "country": "Nauru",
            "code": "NA",
            "status": "required"
        },
        {
            "country": "Nepal",
            "code": "NE",
            "status": "voa"
        },
        {
            "country": "Netherlands",
            "code": "NE",
            "status": "required"
        },
        {
            "country": "New Zealand",
            "code": "NE",
            "status": "required"
        },
        {
            "country": "Nicaragua",
            "code": "NI",
            "status": "voa"
        },
        {
            "country": "Niger",
            "code": "NI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Nigeria",
            "code": "NI",
            "status": "voa"
        },
        {
            "country": "North Korea",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "North Macedonia",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "Norway",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "Oman",
            "code": "OM",
            "status": "eta"
        },
        {
            "country": "Pakistan",
            "code": "PA",
            "status": "eta"
        },
        {
            "country": "Palau",
            "code": "PA",
            "status": "voa"
        },
        {
            "country": "Palestine",
            "code": "PA",
            "status": "free"
        },
        {
            "country": "Panama",
            "code": "PA",
            "status": "required"
        },
        {
            "country": "Papua New Guinea",
            "code": "PA",
            "status": "eta"
        },
        {
            "country": "Paraguay",
            "code": "PA",
            "status": "required"
        },
        {
            "country": "Peru",
            "code": "PE",
            "status": "required"
        },
        {
            "country": "Philippines",
            "code": "PH",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Poland",
            "code": "PO",
            "status": "required"
        },
        {
            "country": "Portugal",
            "code": "PO",
            "status": "required"
        },
        {
            "country": "Qatar",
            "code": "QA",
            "status": "eta"
        },
        {
            "country": "Romania",
            "code": "RO",
            "status": "required"
        },
        {
            "country": "Russia",
            "code": "RU",
            "status": "required"
        },
        {
            "country": "Rwanda",
            "code": "RW",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Saint Kitts and Nevis",
            "code": "SA",
            "status": "eta"
        },
        {
            "country": "Saint Lucia",
            "code": "SA",
            "status": "required"
        },
        {
            "country": "Samoa",
            "code": "SA",
            "status": "voa"
        },
        {
            "country": "San Marino",
            "code": "SA",
            "status": "required"
        },
        {
            "country": "Sao Tome and Principe",
            "code": "SA",
            "status": "free",
            "duration": "15 jours"
        },
        {
            "country": "Saudi Arabia",
            "code": "SA",
            "status": "required"
        },
        {
            "country": "Senegal",
            "code": "SE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Serbia",
            "code": "SE",
            "status": "required"
        },
        {
            "country": "Seychelles",
            "code": "SE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sierra Leone",
            "code": "SI",
            "status": "eta"
        },
        {
            "country": "Singapore",
            "code": "SI",
            "status": "eta"
        },
        {
            "country": "Slovakia",
            "code": "SL",
            "status": "required"
        },
        {
            "country": "Slovenia",
            "code": "SL",
            "status": "required"
        },
        {
            "country": "Solomon Islands",
            "code": "SO",
            "status": "required"
        },
        {
            "country": "Somalia",
            "code": "SO",
            "status": "voa"
        },
        {
            "country": "South Africa",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "South Korea",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "South Sudan",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "Spain",
            "code": "SP",
            "status": "required"
        },
        {
            "country": "Sri Lanka",
            "code": "SR",
            "status": "voa"
        },
        {
            "country": "Saint Vincent and the Grenadines",
            "code": "SA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sudan",
            "code": "SU",
            "status": "required"
        },
        {
            "country": "Suriname",
            "code": "SU",
            "status": "required"
        },
        {
            "country": "Sweden",
            "code": "SW",
            "status": "required"
        },
        {
            "country": "Switzerland",
            "code": "SW",
            "status": "required"
        },
        {
            "country": "Syria",
            "code": "SY",
            "status": "free"
        },
        {
            "country": "Taiwan",
            "code": "TA",
            "status": "required"
        },
        {
            "country": "Tajikistan",
            "code": "TA",
            "status": "voa"
        },
        {
            "country": "Tanzania",
            "code": "TA",
            "status": "voa"
        },
        {
            "country": "Thailand",
            "code": "TH",
            "status": "free",
            "duration": "60 jours"
        },
        {
            "country": "Timor-Leste",
            "code": "TI",
            "status": "voa"
        },
        {
            "country": "Togo",
            "code": "TO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Tonga",
            "code": "TO",
            "status": "required"
        },
        {
            "country": "Trinidad and Tobago",
            "code": "TR",
            "status": "required"
        },
        {
            "country": "Tunisia",
            "code": "TU",
            "status": "free"
        },
        {
            "country": "Turkmenistan",
            "code": "TU",
            "status": "required"
        },
        {
            "country": "Tuvalu",
            "code": "TU",
            "status": "voa"
        },
        {
            "country": "Turkey",
            "code": "TU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Uganda",
            "code": "UG",
            "status": "eta"
        },
        {
            "country": "Ukraine",
            "code": "UK",
            "status": "required"
        },
        {
            "country": "United Arab Emirates",
            "code": "UN",
            "status": "eta"
        },
        {
            "country": "United Kingdom",
            "code": "UN",
            "status": "required"
        },
        {
            "country": "United States",
            "code": "UN",
            "status": "required"
        },
        {
            "country": "Uruguay",
            "code": "UR",
            "status": "required"
        },
        {
            "country": "Uzbekistan",
            "code": "UZ",
            "status": "eta"
        },
        {
            "country": "Vanuatu",
            "code": "VA",
            "status": "free",
            "duration": "120 jours"
        },
        {
            "country": "Vatican",
            "code": "VA",
            "status": "required"
        },
        {
            "country": "Venezuela",
            "code": "VE",
            "status": "required"
        },
        {
            "country": "Vietnam",
            "code": "VI",
            "status": "eta"
        },
        {
            "country": "Yemen",
            "code": "YE",
            "status": "required"
        },
        {
            "country": "Zambia",
            "code": "ZA",
            "status": "eta"
        },
        {
            "country": "Zimbabwe",
            "code": "ZI",
            "status": "eta"
        },
        {
            "country": "Afghanistan",
            "code": "AF",
            "status": "required"
        }
    ]
},
  "Tunisien": {
    "rank": 5,
    "score": 105,
    "stats": {
        "free": 36,
        "voa": 31,
        "eta": 38,
        "required": 93
    },
    "destinations": [
        {
            "country": "Albania",
            "code": "AL",
            "status": "eta"
        },
        {
            "country": "Algeria",
            "code": "AL",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Andorra",
            "code": "AN",
            "status": "required"
        },
        {
            "country": "Angola",
            "code": "AN",
            "status": "required"
        },
        {
            "country": "Antigua and Barbuda",
            "code": "AN",
            "status": "eta"
        },
        {
            "country": "Argentina",
            "code": "AR",
            "status": "required"
        },
        {
            "country": "Armenia",
            "code": "AR",
            "status": "eta"
        },
        {
            "country": "Australia",
            "code": "AU",
            "status": "eta"
        },
        {
            "country": "Austria",
            "code": "AU",
            "status": "required"
        },
        {
            "country": "Azerbaijan",
            "code": "AZ",
            "status": "required"
        },
        {
            "country": "Bahamas",
            "code": "BA",
            "status": "eta"
        },
        {
            "country": "Bahrain",
            "code": "BA",
            "status": "eta"
        },
        {
            "country": "Bangladesh",
            "code": "BA",
            "status": "required"
        },
        {
            "country": "Barbados",
            "code": "BA",
            "status": "free",
            "duration": "180 jours"
        },
        {
            "country": "Belarus",
            "code": "BE",
            "status": "required"
        },
        {
            "country": "Belgium",
            "code": "BE",
            "status": "required"
        },
        {
            "country": "Belize",
            "code": "BE",
            "status": "free"
        },
        {
            "country": "Benin",
            "code": "BE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Bhutan",
            "code": "BH",
            "status": "eta"
        },
        {
            "country": "Bolivia",
            "code": "BO",
            "status": "voa"
        },
        {
            "country": "Bosnia and Herzegovina",
            "code": "BO",
            "status": "required"
        },
        {
            "country": "Botswana",
            "code": "BO",
            "status": "eta"
        },
        {
            "country": "Brazil",
            "code": "BR",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Brunei",
            "code": "BR",
            "status": "required"
        },
        {
            "country": "Bulgaria",
            "code": "BU",
            "status": "required"
        },
        {
            "country": "Burkina Faso",
            "code": "BU",
            "status": "voa"
        },
        {
            "country": "Burundi",
            "code": "BU",
            "status": "voa"
        },
        {
            "country": "Cambodia",
            "code": "CA",
            "status": "voa"
        },
        {
            "country": "Cameroon",
            "code": "CA",
            "status": "eta"
        },
        {
            "country": "Canada",
            "code": "CA",
            "status": "required"
        },
        {
            "country": "Cape Verde",
            "code": "CA",
            "status": "voa"
        },
        {
            "country": "Central African Republic",
            "code": "CE",
            "status": "required"
        },
        {
            "country": "Chad",
            "code": "CH",
            "status": "required"
        },
        {
            "country": "Chile",
            "code": "CH",
            "status": "required"
        },
        {
            "country": "China",
            "code": "CH",
            "status": "required"
        },
        {
            "country": "Colombia",
            "code": "CO",
            "status": "eta"
        },
        {
            "country": "Comoros",
            "code": "CO",
            "status": "voa"
        },
        {
            "country": "Congo",
            "code": "CO",
            "status": "required"
        },
        {
            "country": "DR Congo",
            "code": "DR",
            "status": "eta"
        },
        {
            "country": "Costa Rica",
            "code": "CO",
            "status": "required"
        },
        {
            "country": "Ivory Coast",
            "code": "IV",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Croatia",
            "code": "CR",
            "status": "required"
        },
        {
            "country": "Cuba",
            "code": "CU",
            "status": "eta"
        },
        {
            "country": "Cyprus",
            "code": "CY",
            "status": "required"
        },
        {
            "country": "Czech Republic",
            "code": "CZ",
            "status": "required"
        },
        {
            "country": "Denmark",
            "code": "DE",
            "status": "required"
        },
        {
            "country": "Djibouti",
            "code": "DJ",
            "status": "voa"
        },
        {
            "country": "Dominica",
            "code": "DO",
            "status": "free",
            "duration": "21 jours"
        },
        {
            "country": "Dominican Republic",
            "code": "DO",
            "status": "required"
        },
        {
            "country": "Ecuador",
            "code": "EC",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Egypt",
            "code": "EG",
            "status": "required"
        },
        {
            "country": "El Salvador",
            "code": "EL",
            "status": "eta"
        },
        {
            "country": "Equatorial Guinea",
            "code": "EQ",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Eritrea",
            "code": "ER",
            "status": "required"
        },
        {
            "country": "Estonia",
            "code": "ES",
            "status": "required"
        },
        {
            "country": "Swaziland",
            "code": "SW",
            "status": "required"
        },
        {
            "country": "Ethiopia",
            "code": "ET",
            "status": "voa"
        },
        {
            "country": "Fiji",
            "code": "FI",
            "status": "free",
            "duration": "120 jours"
        },
        {
            "country": "Finland",
            "code": "FI",
            "status": "required"
        },
        {
            "country": "France",
            "code": "FR",
            "status": "required"
        },
        {
            "country": "Gabon",
            "code": "GA",
            "status": "free"
        },
        {
            "country": "Gambia",
            "code": "GA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Georgia",
            "code": "GE",
            "status": "eta"
        },
        {
            "country": "Germany",
            "code": "GE",
            "status": "required"
        },
        {
            "country": "Ghana",
            "code": "GH",
            "status": "voa"
        },
        {
            "country": "Greece",
            "code": "GR",
            "status": "required"
        },
        {
            "country": "Grenada",
            "code": "GR",
            "status": "required"
        },
        {
            "country": "Guatemala",
            "code": "GU",
            "status": "required"
        },
        {
            "country": "Guinea",
            "code": "GU",
            "status": "free"
        },
        {
            "country": "Guinea-Bissau",
            "code": "GU",
            "status": "voa"
        },
        {
            "country": "Guyana",
            "code": "GU",
            "status": "required"
        },
        {
            "country": "Haiti",
            "code": "HA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Honduras",
            "code": "HO",
            "status": "required"
        },
        {
            "country": "Hong Kong",
            "code": "HO",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Hungary",
            "code": "HU",
            "status": "required"
        },
        {
            "country": "Iceland",
            "code": "IC",
            "status": "required"
        },
        {
            "country": "India",
            "code": "IN",
            "status": "required"
        },
        {
            "country": "Indonesia",
            "code": "IN",
            "status": "voa"
        },
        {
            "country": "Iran",
            "code": "IR",
            "status": "free",
            "duration": "15 jours"
        },
        {
            "country": "Iraq",
            "code": "IR",
            "status": "eta"
        },
        {
            "country": "Ireland",
            "code": "IR",
            "status": "required"
        },
        {
            "country": "Israel",
            "code": "IS",
            "status": "required"
        },
        {
            "country": "Italy",
            "code": "IT",
            "status": "required"
        },
        {
            "country": "Jamaica",
            "code": "JA",
            "status": "required"
        },
        {
            "country": "Japan",
            "code": "JA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Jordan",
            "code": "JO",
            "status": "voa"
        },
        {
            "country": "Kazakhstan",
            "code": "KA",
            "status": "eta"
        },
        {
            "country": "Kenya",
            "code": "KE",
            "status": "eta"
        },
        {
            "country": "Kiribati",
            "code": "KI",
            "status": "required"
        },
        {
            "country": "Kosovo",
            "code": "KO",
            "status": "required"
        },
        {
            "country": "Kuwait",
            "code": "KU",
            "status": "required"
        },
        {
            "country": "Kyrgyzstan",
            "code": "KY",
            "status": "eta"
        },
        {
            "country": "Laos",
            "code": "LA",
            "status": "voa"
        },
        {
            "country": "Latvia",
            "code": "LA",
            "status": "required"
        },
        {
            "country": "Lebanon",
            "code": "LE",
            "status": "voa"
        },
        {
            "country": "Lesotho",
            "code": "LE",
            "status": "eta"
        },
        {
            "country": "Liberia",
            "code": "LI",
            "status": "required"
        },
        {
            "country": "Libya",
            "code": "LI",
            "status": "free"
        },
        {
            "country": "Liechtenstein",
            "code": "LI",
            "status": "required"
        },
        {
            "country": "Lithuania",
            "code": "LI",
            "status": "required"
        },
        {
            "country": "Luxembourg",
            "code": "LU",
            "status": "required"
        },
        {
            "country": "Macao",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Madagascar",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Malawi",
            "code": "MA",
            "status": "eta"
        },
        {
            "country": "Malaysia",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Maldives",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mali",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Malta",
            "code": "MA",
            "status": "required"
        },
        {
            "country": "Marshall Islands",
            "code": "MA",
            "status": "required"
        },
        {
            "country": "Mauritania",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Mauritius",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Mexico",
            "code": "ME",
            "status": "required"
        },
        {
            "country": "Micronesia",
            "code": "MI",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Moldova",
            "code": "MO",
            "status": "eta"
        },
        {
            "country": "Monaco",
            "code": "MO",
            "status": "required"
        },
        {
            "country": "Mongolia",
            "code": "MO",
            "status": "required"
        },
        {
            "country": "Montenegro",
            "code": "MO",
            "status": "required"
        },
        {
            "country": "Morocco",
            "code": "MO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Mozambique",
            "code": "MO",
            "status": "voa"
        },
        {
            "country": "Myanmar",
            "code": "MY",
            "status": "required"
        },
        {
            "country": "Namibia",
            "code": "NA",
            "status": "voa"
        },
        {
            "country": "Nauru",
            "code": "NA",
            "status": "required"
        },
        {
            "country": "Nepal",
            "code": "NE",
            "status": "voa"
        },
        {
            "country": "Netherlands",
            "code": "NE",
            "status": "required"
        },
        {
            "country": "New Zealand",
            "code": "NE",
            "status": "required"
        },
        {
            "country": "Nicaragua",
            "code": "NI",
            "status": "voa"
        },
        {
            "country": "Niger",
            "code": "NI",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Nigeria",
            "code": "NI",
            "status": "voa"
        },
        {
            "country": "North Korea",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "North Macedonia",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "Norway",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "Oman",
            "code": "OM",
            "status": "eta"
        },
        {
            "country": "Pakistan",
            "code": "PA",
            "status": "eta"
        },
        {
            "country": "Palau",
            "code": "PA",
            "status": "voa"
        },
        {
            "country": "Palestine",
            "code": "PA",
            "status": "free"
        },
        {
            "country": "Panama",
            "code": "PA",
            "status": "required"
        },
        {
            "country": "Papua New Guinea",
            "code": "PA",
            "status": "eta"
        },
        {
            "country": "Paraguay",
            "code": "PA",
            "status": "required"
        },
        {
            "country": "Peru",
            "code": "PE",
            "status": "required"
        },
        {
            "country": "Philippines",
            "code": "PH",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Poland",
            "code": "PO",
            "status": "required"
        },
        {
            "country": "Portugal",
            "code": "PO",
            "status": "required"
        },
        {
            "country": "Qatar",
            "code": "QA",
            "status": "eta"
        },
        {
            "country": "Romania",
            "code": "RO",
            "status": "required"
        },
        {
            "country": "Russia",
            "code": "RU",
            "status": "required"
        },
        {
            "country": "Rwanda",
            "code": "RW",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Saint Kitts and Nevis",
            "code": "SA",
            "status": "eta"
        },
        {
            "country": "Saint Lucia",
            "code": "SA",
            "status": "required"
        },
        {
            "country": "Samoa",
            "code": "SA",
            "status": "voa"
        },
        {
            "country": "San Marino",
            "code": "SA",
            "status": "required"
        },
        {
            "country": "Sao Tome and Principe",
            "code": "SA",
            "status": "eta"
        },
        {
            "country": "Saudi Arabia",
            "code": "SA",
            "status": "required"
        },
        {
            "country": "Senegal",
            "code": "SE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Serbia",
            "code": "SE",
            "status": "required"
        },
        {
            "country": "Seychelles",
            "code": "SE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sierra Leone",
            "code": "SI",
            "status": "eta"
        },
        {
            "country": "Singapore",
            "code": "SI",
            "status": "eta"
        },
        {
            "country": "Slovakia",
            "code": "SL",
            "status": "required"
        },
        {
            "country": "Slovenia",
            "code": "SL",
            "status": "required"
        },
        {
            "country": "Solomon Islands",
            "code": "SO",
            "status": "required"
        },
        {
            "country": "Somalia",
            "code": "SO",
            "status": "voa"
        },
        {
            "country": "South Africa",
            "code": "SO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "South Korea",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "South Sudan",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "Spain",
            "code": "SP",
            "status": "required"
        },
        {
            "country": "Sri Lanka",
            "code": "SR",
            "status": "voa"
        },
        {
            "country": "Saint Vincent and the Grenadines",
            "code": "SA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sudan",
            "code": "SU",
            "status": "required"
        },
        {
            "country": "Suriname",
            "code": "SU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sweden",
            "code": "SW",
            "status": "required"
        },
        {
            "country": "Switzerland",
            "code": "SW",
            "status": "required"
        },
        {
            "country": "Syria",
            "code": "SY",
            "status": "free"
        },
        {
            "country": "Taiwan",
            "code": "TA",
            "status": "required"
        },
        {
            "country": "Tajikistan",
            "code": "TA",
            "status": "voa"
        },
        {
            "country": "Tanzania",
            "code": "TA",
            "status": "voa"
        },
        {
            "country": "Thailand",
            "code": "TH",
            "status": "voa"
        },
        {
            "country": "Timor-Leste",
            "code": "TI",
            "status": "voa"
        },
        {
            "country": "Togo",
            "code": "TO",
            "status": "eta"
        },
        {
            "country": "Tonga",
            "code": "TO",
            "status": "required"
        },
        {
            "country": "Trinidad and Tobago",
            "code": "TR",
            "status": "required"
        },
        {
            "country": "Turkmenistan",
            "code": "TU",
            "status": "required"
        },
        {
            "country": "Tuvalu",
            "code": "TU",
            "status": "voa"
        },
        {
            "country": "Turkey",
            "code": "TU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Uganda",
            "code": "UG",
            "status": "eta"
        },
        {
            "country": "Ukraine",
            "code": "UK",
            "status": "required"
        },
        {
            "country": "United Arab Emirates",
            "code": "UN",
            "status": "eta"
        },
        {
            "country": "United Kingdom",
            "code": "UN",
            "status": "required"
        },
        {
            "country": "United States",
            "code": "UN",
            "status": "required"
        },
        {
            "country": "Uruguay",
            "code": "UR",
            "status": "required"
        },
        {
            "country": "Uzbekistan",
            "code": "UZ",
            "status": "eta"
        },
        {
            "country": "Vanuatu",
            "code": "VA",
            "status": "free",
            "duration": "120 jours"
        },
        {
            "country": "Vatican",
            "code": "VA",
            "status": "required"
        },
        {
            "country": "Venezuela",
            "code": "VE",
            "status": "required"
        },
        {
            "country": "Vietnam",
            "code": "VI",
            "status": "eta"
        },
        {
            "country": "Yemen",
            "code": "YE",
            "status": "required"
        },
        {
            "country": "Zambia",
            "code": "ZA",
            "status": "eta"
        },
        {
            "country": "Zimbabwe",
            "code": "ZI",
            "status": "eta"
        },
        {
            "country": "Afghanistan",
            "code": "AF",
            "status": "required"
        }
    ]
},
  "Sénégalais": {
    "rank": 6,
    "score": 100,
    "stats": {
        "free": 32,
        "voa": 22,
        "eta": 46,
        "required": 98
    },
    "destinations": [
        {
            "country": "Albania",
            "code": "AL",
            "status": "eta"
        },
        {
            "country": "Algeria",
            "code": "AL",
            "status": "required"
        },
        {
            "country": "Andorra",
            "code": "AN",
            "status": "required"
        },
        {
            "country": "Angola",
            "code": "AN",
            "status": "required"
        },
        {
            "country": "Antigua and Barbuda",
            "code": "AN",
            "status": "eta"
        },
        {
            "country": "Argentina",
            "code": "AR",
            "status": "required"
        },
        {
            "country": "Armenia",
            "code": "AR",
            "status": "required"
        },
        {
            "country": "Australia",
            "code": "AU",
            "status": "eta"
        },
        {
            "country": "Austria",
            "code": "AU",
            "status": "required"
        },
        {
            "country": "Azerbaijan",
            "code": "AZ",
            "status": "required"
        },
        {
            "country": "Bahamas",
            "code": "BA",
            "status": "eta"
        },
        {
            "country": "Bahrain",
            "code": "BA",
            "status": "eta"
        },
        {
            "country": "Bangladesh",
            "code": "BA",
            "status": "voa"
        },
        {
            "country": "Barbados",
            "code": "BA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Belarus",
            "code": "BE",
            "status": "required"
        },
        {
            "country": "Belgium",
            "code": "BE",
            "status": "required"
        },
        {
            "country": "Belize",
            "code": "BE",
            "status": "required"
        },
        {
            "country": "Benin",
            "code": "BE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Bhutan",
            "code": "BH",
            "status": "eta"
        },
        {
            "country": "Bolivia",
            "code": "BO",
            "status": "voa"
        },
        {
            "country": "Bosnia and Herzegovina",
            "code": "BO",
            "status": "required"
        },
        {
            "country": "Botswana",
            "code": "BO",
            "status": "eta"
        },
        {
            "country": "Brazil",
            "code": "BR",
            "status": "required"
        },
        {
            "country": "Brunei",
            "code": "BR",
            "status": "required"
        },
        {
            "country": "Bulgaria",
            "code": "BU",
            "status": "required"
        },
        {
            "country": "Burkina Faso",
            "code": "BU",
            "status": "free"
        },
        {
            "country": "Burundi",
            "code": "BU",
            "status": "voa"
        },
        {
            "country": "Cambodia",
            "code": "CA",
            "status": "voa"
        },
        {
            "country": "Cameroon",
            "code": "CA",
            "status": "eta"
        },
        {
            "country": "Canada",
            "code": "CA",
            "status": "required"
        },
        {
            "country": "Cape Verde",
            "code": "CA",
            "status": "free"
        },
        {
            "country": "Central African Republic",
            "code": "CE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Chad",
            "code": "CH",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Chile",
            "code": "CH",
            "status": "required"
        },
        {
            "country": "China",
            "code": "CH",
            "status": "required"
        },
        {
            "country": "Colombia",
            "code": "CO",
            "status": "eta"
        },
        {
            "country": "Comoros",
            "code": "CO",
            "status": "voa"
        },
        {
            "country": "Congo",
            "code": "CO",
            "status": "voa"
        },
        {
            "country": "DR Congo",
            "code": "DR",
            "status": "eta"
        },
        {
            "country": "Costa Rica",
            "code": "CO",
            "status": "required"
        },
        {
            "country": "Ivory Coast",
            "code": "IV",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Croatia",
            "code": "CR",
            "status": "required"
        },
        {
            "country": "Cuba",
            "code": "CU",
            "status": "eta"
        },
        {
            "country": "Cyprus",
            "code": "CY",
            "status": "required"
        },
        {
            "country": "Czech Republic",
            "code": "CZ",
            "status": "required"
        },
        {
            "country": "Denmark",
            "code": "DE",
            "status": "required"
        },
        {
            "country": "Djibouti",
            "code": "DJ",
            "status": "voa"
        },
        {
            "country": "Dominica",
            "code": "DO",
            "status": "free",
            "duration": "21 jours"
        },
        {
            "country": "Dominican Republic",
            "code": "DO",
            "status": "required"
        },
        {
            "country": "Ecuador",
            "code": "EC",
            "status": "eta"
        },
        {
            "country": "Egypt",
            "code": "EG",
            "status": "required"
        },
        {
            "country": "El Salvador",
            "code": "EL",
            "status": "eta"
        },
        {
            "country": "Equatorial Guinea",
            "code": "EQ",
            "status": "eta"
        },
        {
            "country": "Eritrea",
            "code": "ER",
            "status": "required"
        },
        {
            "country": "Estonia",
            "code": "ES",
            "status": "required"
        },
        {
            "country": "Swaziland",
            "code": "SW",
            "status": "required"
        },
        {
            "country": "Ethiopia",
            "code": "ET",
            "status": "voa"
        },
        {
            "country": "Fiji",
            "code": "FI",
            "status": "free",
            "duration": "120 jours"
        },
        {
            "country": "Finland",
            "code": "FI",
            "status": "required"
        },
        {
            "country": "France",
            "code": "FR",
            "status": "required"
        },
        {
            "country": "Gabon",
            "code": "GA",
            "status": "eta"
        },
        {
            "country": "Gambia",
            "code": "GA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Georgia",
            "code": "GE",
            "status": "eta"
        },
        {
            "country": "Germany",
            "code": "GE",
            "status": "required"
        },
        {
            "country": "Ghana",
            "code": "GH",
            "status": "free"
        },
        {
            "country": "Greece",
            "code": "GR",
            "status": "required"
        },
        {
            "country": "Grenada",
            "code": "GR",
            "status": "required"
        },
        {
            "country": "Guatemala",
            "code": "GU",
            "status": "required"
        },
        {
            "country": "Guinea",
            "code": "GU",
            "status": "free"
        },
        {
            "country": "Guinea-Bissau",
            "code": "GU",
            "status": "free"
        },
        {
            "country": "Guyana",
            "code": "GU",
            "status": "required"
        },
        {
            "country": "Haiti",
            "code": "HA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Honduras",
            "code": "HO",
            "status": "required"
        },
        {
            "country": "Hong Kong",
            "code": "HO",
            "status": "eta"
        },
        {
            "country": "Hungary",
            "code": "HU",
            "status": "required"
        },
        {
            "country": "Iceland",
            "code": "IC",
            "status": "required"
        },
        {
            "country": "India",
            "code": "IN",
            "status": "eta"
        },
        {
            "country": "Indonesia",
            "code": "IN",
            "status": "eta"
        },
        {
            "country": "Iran",
            "code": "IR",
            "status": "voa"
        },
        {
            "country": "Iraq",
            "code": "IR",
            "status": "eta"
        },
        {
            "country": "Ireland",
            "code": "IR",
            "status": "required"
        },
        {
            "country": "Israel",
            "code": "IS",
            "status": "required"
        },
        {
            "country": "Italy",
            "code": "IT",
            "status": "required"
        },
        {
            "country": "Jamaica",
            "code": "JA",
            "status": "required"
        },
        {
            "country": "Japan",
            "code": "JA",
            "status": "required"
        },
        {
            "country": "Jordan",
            "code": "JO",
            "status": "required"
        },
        {
            "country": "Kazakhstan",
            "code": "KA",
            "status": "eta"
        },
        {
            "country": "Kenya",
            "code": "KE",
            "status": "eta"
        },
        {
            "country": "Kiribati",
            "code": "KI",
            "status": "required"
        },
        {
            "country": "Kosovo",
            "code": "KO",
            "status": "required"
        },
        {
            "country": "Kuwait",
            "code": "KU",
            "status": "required"
        },
        {
            "country": "Kyrgyzstan",
            "code": "KY",
            "status": "eta"
        },
        {
            "country": "Laos",
            "code": "LA",
            "status": "required"
        },
        {
            "country": "Latvia",
            "code": "LA",
            "status": "required"
        },
        {
            "country": "Lebanon",
            "code": "LE",
            "status": "required"
        },
        {
            "country": "Lesotho",
            "code": "LE",
            "status": "eta"
        },
        {
            "country": "Liberia",
            "code": "LI",
            "status": "free"
        },
        {
            "country": "Libya",
            "code": "LI",
            "status": "eta"
        },
        {
            "country": "Liechtenstein",
            "code": "LI",
            "status": "required"
        },
        {
            "country": "Lithuania",
            "code": "LI",
            "status": "required"
        },
        {
            "country": "Luxembourg",
            "code": "LU",
            "status": "required"
        },
        {
            "country": "Macao",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Madagascar",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Malawi",
            "code": "MA",
            "status": "eta"
        },
        {
            "country": "Malaysia",
            "code": "MA",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Maldives",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mali",
            "code": "MA",
            "status": "free"
        },
        {
            "country": "Malta",
            "code": "MA",
            "status": "required"
        },
        {
            "country": "Marshall Islands",
            "code": "MA",
            "status": "required"
        },
        {
            "country": "Mauritania",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Mauritius",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mexico",
            "code": "ME",
            "status": "required"
        },
        {
            "country": "Micronesia",
            "code": "MI",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Moldova",
            "code": "MO",
            "status": "eta"
        },
        {
            "country": "Monaco",
            "code": "MO",
            "status": "required"
        },
        {
            "country": "Mongolia",
            "code": "MO",
            "status": "eta"
        },
        {
            "country": "Montenegro",
            "code": "MO",
            "status": "required"
        },
        {
            "country": "Morocco",
            "code": "MO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Mozambique",
            "code": "MO",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Myanmar",
            "code": "MY",
            "status": "required"
        },
        {
            "country": "Namibia",
            "code": "NA",
            "status": "required"
        },
        {
            "country": "Nauru",
            "code": "NA",
            "status": "required"
        },
        {
            "country": "Nepal",
            "code": "NE",
            "status": "voa"
        },
        {
            "country": "Netherlands",
            "code": "NE",
            "status": "required"
        },
        {
            "country": "New Zealand",
            "code": "NE",
            "status": "required"
        },
        {
            "country": "Nicaragua",
            "code": "NI",
            "status": "voa"
        },
        {
            "country": "Niger",
            "code": "NI",
            "status": "free"
        },
        {
            "country": "Nigeria",
            "code": "NI",
            "status": "free"
        },
        {
            "country": "North Korea",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "North Macedonia",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "Norway",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "Oman",
            "code": "OM",
            "status": "eta"
        },
        {
            "country": "Pakistan",
            "code": "PA",
            "status": "eta"
        },
        {
            "country": "Palau",
            "code": "PA",
            "status": "voa"
        },
        {
            "country": "Palestine",
            "code": "PA",
            "status": "free"
        },
        {
            "country": "Panama",
            "code": "PA",
            "status": "required"
        },
        {
            "country": "Papua New Guinea",
            "code": "PA",
            "status": "eta"
        },
        {
            "country": "Paraguay",
            "code": "PA",
            "status": "required"
        },
        {
            "country": "Peru",
            "code": "PE",
            "status": "required"
        },
        {
            "country": "Philippines",
            "code": "PH",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Poland",
            "code": "PO",
            "status": "required"
        },
        {
            "country": "Portugal",
            "code": "PO",
            "status": "required"
        },
        {
            "country": "Qatar",
            "code": "QA",
            "status": "eta"
        },
        {
            "country": "Romania",
            "code": "RO",
            "status": "required"
        },
        {
            "country": "Russia",
            "code": "RU",
            "status": "required"
        },
        {
            "country": "Rwanda",
            "code": "RW",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Saint Kitts and Nevis",
            "code": "SA",
            "status": "eta"
        },
        {
            "country": "Saint Lucia",
            "code": "SA",
            "status": "voa"
        },
        {
            "country": "Samoa",
            "code": "SA",
            "status": "voa"
        },
        {
            "country": "San Marino",
            "code": "SA",
            "status": "required"
        },
        {
            "country": "Sao Tome and Principe",
            "code": "SA",
            "status": "eta"
        },
        {
            "country": "Saudi Arabia",
            "code": "SA",
            "status": "required"
        },
        {
            "country": "Serbia",
            "code": "SE",
            "status": "required"
        },
        {
            "country": "Seychelles",
            "code": "SE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sierra Leone",
            "code": "SI",
            "status": "free"
        },
        {
            "country": "Singapore",
            "code": "SI",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Slovakia",
            "code": "SL",
            "status": "required"
        },
        {
            "country": "Slovenia",
            "code": "SL",
            "status": "required"
        },
        {
            "country": "Solomon Islands",
            "code": "SO",
            "status": "required"
        },
        {
            "country": "Somalia",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "South Africa",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "South Korea",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "South Sudan",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "Spain",
            "code": "SP",
            "status": "required"
        },
        {
            "country": "Sri Lanka",
            "code": "SR",
            "status": "voa"
        },
        {
            "country": "Saint Vincent and the Grenadines",
            "code": "SA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sudan",
            "code": "SU",
            "status": "required"
        },
        {
            "country": "Suriname",
            "code": "SU",
            "status": "required"
        },
        {
            "country": "Sweden",
            "code": "SW",
            "status": "required"
        },
        {
            "country": "Switzerland",
            "code": "SW",
            "status": "required"
        },
        {
            "country": "Syria",
            "code": "SY",
            "status": "eta"
        },
        {
            "country": "Taiwan",
            "code": "TA",
            "status": "required"
        },
        {
            "country": "Tajikistan",
            "code": "TA",
            "status": "eta"
        },
        {
            "country": "Tanzania",
            "code": "TA",
            "status": "eta"
        },
        {
            "country": "Thailand",
            "code": "TH",
            "status": "required"
        },
        {
            "country": "Timor-Leste",
            "code": "TI",
            "status": "voa"
        },
        {
            "country": "Togo",
            "code": "TO",
            "status": "free"
        },
        {
            "country": "Tonga",
            "code": "TO",
            "status": "required"
        },
        {
            "country": "Trinidad and Tobago",
            "code": "TR",
            "status": "required"
        },
        {
            "country": "Tunisia",
            "code": "TU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Turkmenistan",
            "code": "TU",
            "status": "required"
        },
        {
            "country": "Tuvalu",
            "code": "TU",
            "status": "voa"
        },
        {
            "country": "Turkey",
            "code": "TU",
            "status": "required"
        },
        {
            "country": "Uganda",
            "code": "UG",
            "status": "eta"
        },
        {
            "country": "Ukraine",
            "code": "UK",
            "status": "required"
        },
        {
            "country": "United Arab Emirates",
            "code": "UN",
            "status": "eta"
        },
        {
            "country": "United Kingdom",
            "code": "UN",
            "status": "required"
        },
        {
            "country": "United States",
            "code": "UN",
            "status": "required"
        },
        {
            "country": "Uruguay",
            "code": "UR",
            "status": "required"
        },
        {
            "country": "Uzbekistan",
            "code": "UZ",
            "status": "eta"
        },
        {
            "country": "Vanuatu",
            "code": "VA",
            "status": "required"
        },
        {
            "country": "Vatican",
            "code": "VA",
            "status": "required"
        },
        {
            "country": "Venezuela",
            "code": "VE",
            "status": "required"
        },
        {
            "country": "Vietnam",
            "code": "VI",
            "status": "eta"
        },
        {
            "country": "Yemen",
            "code": "YE",
            "status": "required"
        },
        {
            "country": "Zambia",
            "code": "ZA",
            "status": "eta"
        },
        {
            "country": "Zimbabwe",
            "code": "ZI",
            "status": "voa"
        },
        {
            "country": "Afghanistan",
            "code": "AF",
            "status": "required"
        }
    ]
},
  "Algérien": {
    "rank": 7,
    "score": 99,
    "stats": {
        "free": 21,
        "voa": 31,
        "eta": 47,
        "required": 99
    },
    "destinations": [
        {
            "country": "Albania",
            "code": "AL",
            "status": "eta"
        },
        {
            "country": "Andorra",
            "code": "AN",
            "status": "required"
        },
        {
            "country": "Angola",
            "code": "AN",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Antigua and Barbuda",
            "code": "AN",
            "status": "eta"
        },
        {
            "country": "Argentina",
            "code": "AR",
            "status": "required"
        },
        {
            "country": "Armenia",
            "code": "AR",
            "status": "eta"
        },
        {
            "country": "Australia",
            "code": "AU",
            "status": "eta"
        },
        {
            "country": "Austria",
            "code": "AU",
            "status": "required"
        },
        {
            "country": "Azerbaijan",
            "code": "AZ",
            "status": "eta"
        },
        {
            "country": "Bahamas",
            "code": "BA",
            "status": "eta"
        },
        {
            "country": "Bahrain",
            "code": "BA",
            "status": "eta"
        },
        {
            "country": "Bangladesh",
            "code": "BA",
            "status": "required"
        },
        {
            "country": "Barbados",
            "code": "BA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Belarus",
            "code": "BE",
            "status": "required"
        },
        {
            "country": "Belgium",
            "code": "BE",
            "status": "required"
        },
        {
            "country": "Belize",
            "code": "BE",
            "status": "required"
        },
        {
            "country": "Benin",
            "code": "BE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Bhutan",
            "code": "BH",
            "status": "eta"
        },
        {
            "country": "Bolivia",
            "code": "BO",
            "status": "voa"
        },
        {
            "country": "Bosnia and Herzegovina",
            "code": "BO",
            "status": "required"
        },
        {
            "country": "Botswana",
            "code": "BO",
            "status": "eta"
        },
        {
            "country": "Brazil",
            "code": "BR",
            "status": "required"
        },
        {
            "country": "Brunei",
            "code": "BR",
            "status": "required"
        },
        {
            "country": "Bulgaria",
            "code": "BU",
            "status": "required"
        },
        {
            "country": "Burkina Faso",
            "code": "BU",
            "status": "eta"
        },
        {
            "country": "Burundi",
            "code": "BU",
            "status": "voa"
        },
        {
            "country": "Cambodia",
            "code": "CA",
            "status": "voa"
        },
        {
            "country": "Cameroon",
            "code": "CA",
            "status": "eta"
        },
        {
            "country": "Canada",
            "code": "CA",
            "status": "required"
        },
        {
            "country": "Cape Verde",
            "code": "CA",
            "status": "voa"
        },
        {
            "country": "Central African Republic",
            "code": "CE",
            "status": "required"
        },
        {
            "country": "Chad",
            "code": "CH",
            "status": "required"
        },
        {
            "country": "Chile",
            "code": "CH",
            "status": "required"
        },
        {
            "country": "China",
            "code": "CH",
            "status": "required"
        },
        {
            "country": "Colombia",
            "code": "CO",
            "status": "eta"
        },
        {
            "country": "Comoros",
            "code": "CO",
            "status": "voa"
        },
        {
            "country": "Congo",
            "code": "CO",
            "status": "required"
        },
        {
            "country": "DR Congo",
            "code": "DR",
            "status": "eta"
        },
        {
            "country": "Costa Rica",
            "code": "CO",
            "status": "required"
        },
        {
            "country": "Ivory Coast",
            "code": "IV",
            "status": "eta"
        },
        {
            "country": "Croatia",
            "code": "CR",
            "status": "required"
        },
        {
            "country": "Cuba",
            "code": "CU",
            "status": "eta"
        },
        {
            "country": "Cyprus",
            "code": "CY",
            "status": "required"
        },
        {
            "country": "Czech Republic",
            "code": "CZ",
            "status": "required"
        },
        {
            "country": "Denmark",
            "code": "DE",
            "status": "required"
        },
        {
            "country": "Djibouti",
            "code": "DJ",
            "status": "voa"
        },
        {
            "country": "Dominica",
            "code": "DO",
            "status": "free",
            "duration": "21 jours"
        },
        {
            "country": "Dominican Republic",
            "code": "DO",
            "status": "required"
        },
        {
            "country": "Ecuador",
            "code": "EC",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Egypt",
            "code": "EG",
            "status": "required"
        },
        {
            "country": "El Salvador",
            "code": "EL",
            "status": "eta"
        },
        {
            "country": "Equatorial Guinea",
            "code": "EQ",
            "status": "eta"
        },
        {
            "country": "Eritrea",
            "code": "ER",
            "status": "required"
        },
        {
            "country": "Estonia",
            "code": "ES",
            "status": "required"
        },
        {
            "country": "Swaziland",
            "code": "SW",
            "status": "required"
        },
        {
            "country": "Ethiopia",
            "code": "ET",
            "status": "voa"
        },
        {
            "country": "Fiji",
            "code": "FI",
            "status": "required"
        },
        {
            "country": "Finland",
            "code": "FI",
            "status": "required"
        },
        {
            "country": "France",
            "code": "FR",
            "status": "required"
        },
        {
            "country": "Gabon",
            "code": "GA",
            "status": "eta"
        },
        {
            "country": "Gambia",
            "code": "GA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Georgia",
            "code": "GE",
            "status": "eta"
        },
        {
            "country": "Germany",
            "code": "GE",
            "status": "required"
        },
        {
            "country": "Ghana",
            "code": "GH",
            "status": "voa"
        },
        {
            "country": "Greece",
            "code": "GR",
            "status": "required"
        },
        {
            "country": "Grenada",
            "code": "GR",
            "status": "required"
        },
        {
            "country": "Guatemala",
            "code": "GU",
            "status": "required"
        },
        {
            "country": "Guinea",
            "code": "GU",
            "status": "free"
        },
        {
            "country": "Guinea-Bissau",
            "code": "GU",
            "status": "voa"
        },
        {
            "country": "Guyana",
            "code": "GU",
            "status": "required"
        },
        {
            "country": "Haiti",
            "code": "HA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Honduras",
            "code": "HO",
            "status": "required"
        },
        {
            "country": "Hong Kong",
            "code": "HO",
            "status": "free",
            "duration": "14 jours"
        },
        {
            "country": "Hungary",
            "code": "HU",
            "status": "required"
        },
        {
            "country": "Iceland",
            "code": "IC",
            "status": "required"
        },
        {
            "country": "India",
            "code": "IN",
            "status": "required"
        },
        {
            "country": "Indonesia",
            "code": "IN",
            "status": "eta"
        },
        {
            "country": "Iran",
            "code": "IR",
            "status": "voa"
        },
        {
            "country": "Iraq",
            "code": "IR",
            "status": "eta"
        },
        {
            "country": "Ireland",
            "code": "IR",
            "status": "required"
        },
        {
            "country": "Israel",
            "code": "IS",
            "status": "required"
        },
        {
            "country": "Italy",
            "code": "IT",
            "status": "required"
        },
        {
            "country": "Jamaica",
            "code": "JA",
            "status": "required"
        },
        {
            "country": "Japan",
            "code": "JA",
            "status": "required"
        },
        {
            "country": "Jordan",
            "code": "JO",
            "status": "voa"
        },
        {
            "country": "Kazakhstan",
            "code": "KA",
            "status": "eta"
        },
        {
            "country": "Kenya",
            "code": "KE",
            "status": "eta"
        },
        {
            "country": "Kiribati",
            "code": "KI",
            "status": "required"
        },
        {
            "country": "Kosovo",
            "code": "KO",
            "status": "required"
        },
        {
            "country": "Kuwait",
            "code": "KU",
            "status": "required"
        },
        {
            "country": "Kyrgyzstan",
            "code": "KY",
            "status": "eta"
        },
        {
            "country": "Laos",
            "code": "LA",
            "status": "required"
        },
        {
            "country": "Latvia",
            "code": "LA",
            "status": "required"
        },
        {
            "country": "Lebanon",
            "code": "LE",
            "status": "voa"
        },
        {
            "country": "Lesotho",
            "code": "LE",
            "status": "eta"
        },
        {
            "country": "Liberia",
            "code": "LI",
            "status": "required"
        },
        {
            "country": "Libya",
            "code": "LI",
            "status": "free"
        },
        {
            "country": "Liechtenstein",
            "code": "LI",
            "status": "required"
        },
        {
            "country": "Lithuania",
            "code": "LI",
            "status": "required"
        },
        {
            "country": "Luxembourg",
            "code": "LU",
            "status": "required"
        },
        {
            "country": "Macao",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Madagascar",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Malawi",
            "code": "MA",
            "status": "eta"
        },
        {
            "country": "Malaysia",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Maldives",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mali",
            "code": "MA",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Malta",
            "code": "MA",
            "status": "required"
        },
        {
            "country": "Marshall Islands",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mauritania",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Mauritius",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mexico",
            "code": "ME",
            "status": "required"
        },
        {
            "country": "Micronesia",
            "code": "MI",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Moldova",
            "code": "MO",
            "status": "eta"
        },
        {
            "country": "Monaco",
            "code": "MO",
            "status": "required"
        },
        {
            "country": "Mongolia",
            "code": "MO",
            "status": "required"
        },
        {
            "country": "Montenegro",
            "code": "MO",
            "status": "required"
        },
        {
            "country": "Morocco",
            "code": "MO",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Mozambique",
            "code": "MO",
            "status": "voa"
        },
        {
            "country": "Myanmar",
            "code": "MY",
            "status": "eta"
        },
        {
            "country": "Namibia",
            "code": "NA",
            "status": "required"
        },
        {
            "country": "Nauru",
            "code": "NA",
            "status": "required"
        },
        {
            "country": "Nepal",
            "code": "NE",
            "status": "voa"
        },
        {
            "country": "Netherlands",
            "code": "NE",
            "status": "required"
        },
        {
            "country": "New Zealand",
            "code": "NE",
            "status": "required"
        },
        {
            "country": "Nicaragua",
            "code": "NI",
            "status": "voa"
        },
        {
            "country": "Niger",
            "code": "NI",
            "status": "required"
        },
        {
            "country": "Nigeria",
            "code": "NI",
            "status": "voa"
        },
        {
            "country": "North Korea",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "North Macedonia",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "Norway",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "Oman",
            "code": "OM",
            "status": "eta"
        },
        {
            "country": "Pakistan",
            "code": "PA",
            "status": "eta"
        },
        {
            "country": "Palau",
            "code": "PA",
            "status": "voa"
        },
        {
            "country": "Palestine",
            "code": "PA",
            "status": "free"
        },
        {
            "country": "Panama",
            "code": "PA",
            "status": "required"
        },
        {
            "country": "Papua New Guinea",
            "code": "PA",
            "status": "eta"
        },
        {
            "country": "Paraguay",
            "code": "PA",
            "status": "required"
        },
        {
            "country": "Peru",
            "code": "PE",
            "status": "required"
        },
        {
            "country": "Philippines",
            "code": "PH",
            "status": "required"
        },
        {
            "country": "Poland",
            "code": "PO",
            "status": "required"
        },
        {
            "country": "Portugal",
            "code": "PO",
            "status": "required"
        },
        {
            "country": "Qatar",
            "code": "QA",
            "status": "eta"
        },
        {
            "country": "Romania",
            "code": "RO",
            "status": "required"
        },
        {
            "country": "Russia",
            "code": "RU",
            "status": "required"
        },
        {
            "country": "Rwanda",
            "code": "RW",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Saint Kitts and Nevis",
            "code": "SA",
            "status": "eta"
        },
        {
            "country": "Saint Lucia",
            "code": "SA",
            "status": "required"
        },
        {
            "country": "Samoa",
            "code": "SA",
            "status": "voa"
        },
        {
            "country": "San Marino",
            "code": "SA",
            "status": "required"
        },
        {
            "country": "Sao Tome and Principe",
            "code": "SA",
            "status": "eta"
        },
        {
            "country": "Saudi Arabia",
            "code": "SA",
            "status": "required"
        },
        {
            "country": "Senegal",
            "code": "SE",
            "status": "voa"
        },
        {
            "country": "Serbia",
            "code": "SE",
            "status": "required"
        },
        {
            "country": "Seychelles",
            "code": "SE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sierra Leone",
            "code": "SI",
            "status": "eta"
        },
        {
            "country": "Singapore",
            "code": "SI",
            "status": "eta"
        },
        {
            "country": "Slovakia",
            "code": "SL",
            "status": "required"
        },
        {
            "country": "Slovenia",
            "code": "SL",
            "status": "required"
        },
        {
            "country": "Solomon Islands",
            "code": "SO",
            "status": "required"
        },
        {
            "country": "Somalia",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "South Africa",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "South Korea",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "South Sudan",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "Spain",
            "code": "SP",
            "status": "required"
        },
        {
            "country": "Sri Lanka",
            "code": "SR",
            "status": "voa"
        },
        {
            "country": "Saint Vincent and the Grenadines",
            "code": "SA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sudan",
            "code": "SU",
            "status": "required"
        },
        {
            "country": "Suriname",
            "code": "SU",
            "status": "required"
        },
        {
            "country": "Sweden",
            "code": "SW",
            "status": "required"
        },
        {
            "country": "Switzerland",
            "code": "SW",
            "status": "required"
        },
        {
            "country": "Syria",
            "code": "SY",
            "status": "free"
        },
        {
            "country": "Taiwan",
            "code": "TA",
            "status": "required"
        },
        {
            "country": "Tajikistan",
            "code": "TA",
            "status": "voa"
        },
        {
            "country": "Tanzania",
            "code": "TA",
            "status": "voa"
        },
        {
            "country": "Thailand",
            "code": "TH",
            "status": "eta"
        },
        {
            "country": "Timor-Leste",
            "code": "TI",
            "status": "voa"
        },
        {
            "country": "Togo",
            "code": "TO",
            "status": "eta"
        },
        {
            "country": "Tonga",
            "code": "TO",
            "status": "required"
        },
        {
            "country": "Trinidad and Tobago",
            "code": "TR",
            "status": "required"
        },
        {
            "country": "Tunisia",
            "code": "TU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Turkmenistan",
            "code": "TU",
            "status": "required"
        },
        {
            "country": "Tuvalu",
            "code": "TU",
            "status": "voa"
        },
        {
            "country": "Turkey",
            "code": "TU",
            "status": "required"
        },
        {
            "country": "Uganda",
            "code": "UG",
            "status": "eta"
        },
        {
            "country": "Ukraine",
            "code": "UK",
            "status": "required"
        },
        {
            "country": "United Arab Emirates",
            "code": "UN",
            "status": "eta"
        },
        {
            "country": "United Kingdom",
            "code": "UN",
            "status": "required"
        },
        {
            "country": "United States",
            "code": "UN",
            "status": "required"
        },
        {
            "country": "Uruguay",
            "code": "UR",
            "status": "required"
        },
        {
            "country": "Uzbekistan",
            "code": "UZ",
            "status": "eta"
        },
        {
            "country": "Vanuatu",
            "code": "VA",
            "status": "required"
        },
        {
            "country": "Vatican",
            "code": "VA",
            "status": "required"
        },
        {
            "country": "Venezuela",
            "code": "VE",
            "status": "required"
        },
        {
            "country": "Vietnam",
            "code": "VI",
            "status": "eta"
        },
        {
            "country": "Yemen",
            "code": "YE",
            "status": "voa"
        },
        {
            "country": "Zambia",
            "code": "ZA",
            "status": "eta"
        },
        {
            "country": "Zimbabwe",
            "code": "ZI",
            "status": "voa"
        },
        {
            "country": "Afghanistan",
            "code": "AF",
            "status": "required"
        }
    ]
},
  "Ivoirien": {
    "rank": 8,
    "score": 99,
    "stats": {
        "free": 28,
        "voa": 24,
        "eta": 47,
        "required": 99
    },
    "destinations": [
        {
            "country": "Albania",
            "code": "AL",
            "status": "eta"
        },
        {
            "country": "Algeria",
            "code": "AL",
            "status": "required"
        },
        {
            "country": "Andorra",
            "code": "AN",
            "status": "required"
        },
        {
            "country": "Angola",
            "code": "AN",
            "status": "required"
        },
        {
            "country": "Antigua and Barbuda",
            "code": "AN",
            "status": "eta"
        },
        {
            "country": "Argentina",
            "code": "AR",
            "status": "required"
        },
        {
            "country": "Armenia",
            "code": "AR",
            "status": "required"
        },
        {
            "country": "Australia",
            "code": "AU",
            "status": "eta"
        },
        {
            "country": "Austria",
            "code": "AU",
            "status": "required"
        },
        {
            "country": "Azerbaijan",
            "code": "AZ",
            "status": "required"
        },
        {
            "country": "Bahamas",
            "code": "BA",
            "status": "eta"
        },
        {
            "country": "Bahrain",
            "code": "BA",
            "status": "eta"
        },
        {
            "country": "Bangladesh",
            "code": "BA",
            "status": "voa"
        },
        {
            "country": "Barbados",
            "code": "BA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Belarus",
            "code": "BE",
            "status": "required"
        },
        {
            "country": "Belgium",
            "code": "BE",
            "status": "required"
        },
        {
            "country": "Belize",
            "code": "BE",
            "status": "required"
        },
        {
            "country": "Benin",
            "code": "BE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Bhutan",
            "code": "BH",
            "status": "eta"
        },
        {
            "country": "Bolivia",
            "code": "BO",
            "status": "voa"
        },
        {
            "country": "Bosnia and Herzegovina",
            "code": "BO",
            "status": "required"
        },
        {
            "country": "Botswana",
            "code": "BO",
            "status": "eta"
        },
        {
            "country": "Brazil",
            "code": "BR",
            "status": "required"
        },
        {
            "country": "Brunei",
            "code": "BR",
            "status": "required"
        },
        {
            "country": "Bulgaria",
            "code": "BU",
            "status": "required"
        },
        {
            "country": "Burkina Faso",
            "code": "BU",
            "status": "free"
        },
        {
            "country": "Burundi",
            "code": "BU",
            "status": "voa"
        },
        {
            "country": "Cambodia",
            "code": "CA",
            "status": "voa"
        },
        {
            "country": "Cameroon",
            "code": "CA",
            "status": "eta"
        },
        {
            "country": "Canada",
            "code": "CA",
            "status": "required"
        },
        {
            "country": "Cape Verde",
            "code": "CA",
            "status": "free"
        },
        {
            "country": "Central African Republic",
            "code": "CE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Chad",
            "code": "CH",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Chile",
            "code": "CH",
            "status": "required"
        },
        {
            "country": "China",
            "code": "CH",
            "status": "required"
        },
        {
            "country": "Colombia",
            "code": "CO",
            "status": "eta"
        },
        {
            "country": "Comoros",
            "code": "CO",
            "status": "voa"
        },
        {
            "country": "Congo",
            "code": "CO",
            "status": "voa"
        },
        {
            "country": "DR Congo",
            "code": "DR",
            "status": "eta"
        },
        {
            "country": "Costa Rica",
            "code": "CO",
            "status": "required"
        },
        {
            "country": "Croatia",
            "code": "CR",
            "status": "required"
        },
        {
            "country": "Cuba",
            "code": "CU",
            "status": "eta"
        },
        {
            "country": "Cyprus",
            "code": "CY",
            "status": "required"
        },
        {
            "country": "Czech Republic",
            "code": "CZ",
            "status": "required"
        },
        {
            "country": "Denmark",
            "code": "DE",
            "status": "required"
        },
        {
            "country": "Djibouti",
            "code": "DJ",
            "status": "voa"
        },
        {
            "country": "Dominica",
            "code": "DO",
            "status": "free",
            "duration": "21 jours"
        },
        {
            "country": "Dominican Republic",
            "code": "DO",
            "status": "required"
        },
        {
            "country": "Ecuador",
            "code": "EC",
            "status": "eta"
        },
        {
            "country": "Egypt",
            "code": "EG",
            "status": "required"
        },
        {
            "country": "El Salvador",
            "code": "EL",
            "status": "eta"
        },
        {
            "country": "Equatorial Guinea",
            "code": "EQ",
            "status": "eta"
        },
        {
            "country": "Eritrea",
            "code": "ER",
            "status": "required"
        },
        {
            "country": "Estonia",
            "code": "ES",
            "status": "required"
        },
        {
            "country": "Swaziland",
            "code": "SW",
            "status": "required"
        },
        {
            "country": "Ethiopia",
            "code": "ET",
            "status": "voa"
        },
        {
            "country": "Fiji",
            "code": "FI",
            "status": "required"
        },
        {
            "country": "Finland",
            "code": "FI",
            "status": "required"
        },
        {
            "country": "France",
            "code": "FR",
            "status": "required"
        },
        {
            "country": "Gabon",
            "code": "GA",
            "status": "eta"
        },
        {
            "country": "Gambia",
            "code": "GA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Georgia",
            "code": "GE",
            "status": "eta"
        },
        {
            "country": "Germany",
            "code": "GE",
            "status": "required"
        },
        {
            "country": "Ghana",
            "code": "GH",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Greece",
            "code": "GR",
            "status": "required"
        },
        {
            "country": "Grenada",
            "code": "GR",
            "status": "required"
        },
        {
            "country": "Guatemala",
            "code": "GU",
            "status": "required"
        },
        {
            "country": "Guinea",
            "code": "GU",
            "status": "free"
        },
        {
            "country": "Guinea-Bissau",
            "code": "GU",
            "status": "free"
        },
        {
            "country": "Guyana",
            "code": "GU",
            "status": "required"
        },
        {
            "country": "Haiti",
            "code": "HA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Honduras",
            "code": "HO",
            "status": "required"
        },
        {
            "country": "Hong Kong",
            "code": "HO",
            "status": "eta"
        },
        {
            "country": "Hungary",
            "code": "HU",
            "status": "required"
        },
        {
            "country": "Iceland",
            "code": "IC",
            "status": "required"
        },
        {
            "country": "India",
            "code": "IN",
            "status": "eta"
        },
        {
            "country": "Indonesia",
            "code": "IN",
            "status": "eta"
        },
        {
            "country": "Iran",
            "code": "IR",
            "status": "voa"
        },
        {
            "country": "Iraq",
            "code": "IR",
            "status": "eta"
        },
        {
            "country": "Ireland",
            "code": "IR",
            "status": "required"
        },
        {
            "country": "Israel",
            "code": "IS",
            "status": "required"
        },
        {
            "country": "Italy",
            "code": "IT",
            "status": "required"
        },
        {
            "country": "Jamaica",
            "code": "JA",
            "status": "required"
        },
        {
            "country": "Japan",
            "code": "JA",
            "status": "required"
        },
        {
            "country": "Jordan",
            "code": "JO",
            "status": "required"
        },
        {
            "country": "Kazakhstan",
            "code": "KA",
            "status": "eta"
        },
        {
            "country": "Kenya",
            "code": "KE",
            "status": "eta"
        },
        {
            "country": "Kiribati",
            "code": "KI",
            "status": "required"
        },
        {
            "country": "Kosovo",
            "code": "KO",
            "status": "required"
        },
        {
            "country": "Kuwait",
            "code": "KU",
            "status": "required"
        },
        {
            "country": "Kyrgyzstan",
            "code": "KY",
            "status": "eta"
        },
        {
            "country": "Laos",
            "code": "LA",
            "status": "required"
        },
        {
            "country": "Latvia",
            "code": "LA",
            "status": "required"
        },
        {
            "country": "Lebanon",
            "code": "LE",
            "status": "voa"
        },
        {
            "country": "Lesotho",
            "code": "LE",
            "status": "eta"
        },
        {
            "country": "Liberia",
            "code": "LI",
            "status": "free"
        },
        {
            "country": "Libya",
            "code": "LI",
            "status": "eta"
        },
        {
            "country": "Liechtenstein",
            "code": "LI",
            "status": "required"
        },
        {
            "country": "Lithuania",
            "code": "LI",
            "status": "required"
        },
        {
            "country": "Luxembourg",
            "code": "LU",
            "status": "required"
        },
        {
            "country": "Macao",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Madagascar",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Malawi",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Malaysia",
            "code": "MA",
            "status": "eta"
        },
        {
            "country": "Maldives",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mali",
            "code": "MA",
            "status": "free"
        },
        {
            "country": "Malta",
            "code": "MA",
            "status": "required"
        },
        {
            "country": "Marshall Islands",
            "code": "MA",
            "status": "required"
        },
        {
            "country": "Mauritania",
            "code": "MA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Mauritius",
            "code": "MA",
            "status": "voa"
        },
        {
            "country": "Mexico",
            "code": "ME",
            "status": "required"
        },
        {
            "country": "Micronesia",
            "code": "MI",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Moldova",
            "code": "MO",
            "status": "eta"
        },
        {
            "country": "Monaco",
            "code": "MO",
            "status": "required"
        },
        {
            "country": "Mongolia",
            "code": "MO",
            "status": "eta"
        },
        {
            "country": "Montenegro",
            "code": "MO",
            "status": "required"
        },
        {
            "country": "Morocco",
            "code": "MO",
            "status": "required"
        },
        {
            "country": "Mozambique",
            "code": "MO",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Myanmar",
            "code": "MY",
            "status": "eta"
        },
        {
            "country": "Namibia",
            "code": "NA",
            "status": "voa"
        },
        {
            "country": "Nauru",
            "code": "NA",
            "status": "required"
        },
        {
            "country": "Nepal",
            "code": "NE",
            "status": "voa"
        },
        {
            "country": "Netherlands",
            "code": "NE",
            "status": "required"
        },
        {
            "country": "New Zealand",
            "code": "NE",
            "status": "required"
        },
        {
            "country": "Nicaragua",
            "code": "NI",
            "status": "voa"
        },
        {
            "country": "Niger",
            "code": "NI",
            "status": "free"
        },
        {
            "country": "Nigeria",
            "code": "NI",
            "status": "free"
        },
        {
            "country": "North Korea",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "North Macedonia",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "Norway",
            "code": "NO",
            "status": "required"
        },
        {
            "country": "Oman",
            "code": "OM",
            "status": "eta"
        },
        {
            "country": "Pakistan",
            "code": "PA",
            "status": "eta"
        },
        {
            "country": "Palau",
            "code": "PA",
            "status": "voa"
        },
        {
            "country": "Palestine",
            "code": "PA",
            "status": "required"
        },
        {
            "country": "Panama",
            "code": "PA",
            "status": "required"
        },
        {
            "country": "Papua New Guinea",
            "code": "PA",
            "status": "eta"
        },
        {
            "country": "Paraguay",
            "code": "PA",
            "status": "required"
        },
        {
            "country": "Peru",
            "code": "PE",
            "status": "required"
        },
        {
            "country": "Philippines",
            "code": "PH",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Poland",
            "code": "PO",
            "status": "required"
        },
        {
            "country": "Portugal",
            "code": "PO",
            "status": "required"
        },
        {
            "country": "Qatar",
            "code": "QA",
            "status": "eta"
        },
        {
            "country": "Romania",
            "code": "RO",
            "status": "required"
        },
        {
            "country": "Russia",
            "code": "RU",
            "status": "required"
        },
        {
            "country": "Rwanda",
            "code": "RW",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Saint Kitts and Nevis",
            "code": "SA",
            "status": "eta"
        },
        {
            "country": "Saint Lucia",
            "code": "SA",
            "status": "voa"
        },
        {
            "country": "Samoa",
            "code": "SA",
            "status": "voa"
        },
        {
            "country": "San Marino",
            "code": "SA",
            "status": "required"
        },
        {
            "country": "Sao Tome and Principe",
            "code": "SA",
            "status": "eta"
        },
        {
            "country": "Saudi Arabia",
            "code": "SA",
            "status": "required"
        },
        {
            "country": "Senegal",
            "code": "SE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Serbia",
            "code": "SE",
            "status": "required"
        },
        {
            "country": "Seychelles",
            "code": "SE",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sierra Leone",
            "code": "SI",
            "status": "free"
        },
        {
            "country": "Singapore",
            "code": "SI",
            "status": "free",
            "duration": "30 jours"
        },
        {
            "country": "Slovakia",
            "code": "SL",
            "status": "required"
        },
        {
            "country": "Slovenia",
            "code": "SL",
            "status": "required"
        },
        {
            "country": "Solomon Islands",
            "code": "SO",
            "status": "required"
        },
        {
            "country": "Somalia",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "South Africa",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "South Korea",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "South Sudan",
            "code": "SO",
            "status": "eta"
        },
        {
            "country": "Spain",
            "code": "SP",
            "status": "required"
        },
        {
            "country": "Sri Lanka",
            "code": "SR",
            "status": "required"
        },
        {
            "country": "Saint Vincent and the Grenadines",
            "code": "SA",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Sudan",
            "code": "SU",
            "status": "required"
        },
        {
            "country": "Suriname",
            "code": "SU",
            "status": "required"
        },
        {
            "country": "Sweden",
            "code": "SW",
            "status": "required"
        },
        {
            "country": "Switzerland",
            "code": "SW",
            "status": "required"
        },
        {
            "country": "Syria",
            "code": "SY",
            "status": "eta"
        },
        {
            "country": "Taiwan",
            "code": "TA",
            "status": "required"
        },
        {
            "country": "Tajikistan",
            "code": "TA",
            "status": "eta"
        },
        {
            "country": "Tanzania",
            "code": "TA",
            "status": "voa"
        },
        {
            "country": "Thailand",
            "code": "TH",
            "status": "required"
        },
        {
            "country": "Timor-Leste",
            "code": "TI",
            "status": "voa"
        },
        {
            "country": "Togo",
            "code": "TO",
            "status": "free"
        },
        {
            "country": "Tonga",
            "code": "TO",
            "status": "required"
        },
        {
            "country": "Trinidad and Tobago",
            "code": "TR",
            "status": "required"
        },
        {
            "country": "Tunisia",
            "code": "TU",
            "status": "free",
            "duration": "90 jours"
        },
        {
            "country": "Turkmenistan",
            "code": "TU",
            "status": "required"
        },
        {
            "country": "Tuvalu",
            "code": "TU",
            "status": "voa"
        },
        {
            "country": "Turkey",
            "code": "TU",
            "status": "required"
        },
        {
            "country": "Uganda",
            "code": "UG",
            "status": "eta"
        },
        {
            "country": "Ukraine",
            "code": "UK",
            "status": "required"
        },
        {
            "country": "United Arab Emirates",
            "code": "UN",
            "status": "eta"
        },
        {
            "country": "United Kingdom",
            "code": "UN",
            "status": "required"
        },
        {
            "country": "United States",
            "code": "UN",
            "status": "required"
        },
        {
            "country": "Uruguay",
            "code": "UR",
            "status": "required"
        },
        {
            "country": "Uzbekistan",
            "code": "UZ",
            "status": "eta"
        },
        {
            "country": "Vanuatu",
            "code": "VA",
            "status": "required"
        },
        {
            "country": "Vatican",
            "code": "VA",
            "status": "required"
        },
        {
            "country": "Venezuela",
            "code": "VE",
            "status": "required"
        },
        {
            "country": "Vietnam",
            "code": "VI",
            "status": "eta"
        },
        {
            "country": "Yemen",
            "code": "YE",
            "status": "required"
        },
        {
            "country": "Zambia",
            "code": "ZA",
            "status": "eta"
        },
        {
            "country": "Zimbabwe",
            "code": "ZI",
            "status": "eta"
        },
        {
            "country": "Afghanistan",
            "code": "AF",
            "status": "required"
        }
    ]
},
};
