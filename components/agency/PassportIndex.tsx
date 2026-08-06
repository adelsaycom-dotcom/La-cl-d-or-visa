import { useState } from "react";
import { Search, Globe2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WorldMap from "./WorldMap";

export type VisaStatus = "free" | "voa" | "required" | "eta";

interface Destination {
  country: string;
  code: string;
  status: VisaStatus;
  duration?: string;
}

import { PASSPORT_DATA } from "./passportData";

export function PassportIndex() {
  const [selectedPassport, setSelectedPassport] = useState("Algérien");
  const [searchQuery, setSearchQuery] = useState("");

  const passports = PASSPORT_DATA;

  const data = passports[selectedPassport] || passports["Algérien"];

  const filteredDestinations = data.destinations.filter(d => 
    d.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: VisaStatus) => {
    switch (status) {
      case "free": return "text-green-700 bg-green-50 border-green-200";
      case "voa": return "text-blue-700 bg-blue-50 border-blue-200";
      case "eta": return "text-purple-700 bg-purple-50 border-purple-200";
      case "required": return "text-red-700 bg-red-50 border-red-200";
    }
  };

  const getStatusIcon = (status: VisaStatus) => {
    switch (status) {
      case "free": return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "voa": return <Clock className="w-4 h-4 text-blue-600" />;
      case "eta": return <Globe2 className="w-4 h-4 text-purple-600" />;
      case "required": return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusText = (status: VisaStatus) => {
    switch (status) {
      case "free": return "Sans Visa";
      case "voa": return "Visa à l'arrivée";
      case "eta": return "eTA / e-Visa";
      case "required": return "Visa Requis";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Index des Passeports</h2>
          <p className="text-sm text-gray-500 mt-1">Explorez la mobilité mondiale et les exigences en matière de visa.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 w-full relative">
            <div className="text-sm font-medium mb-2 text-gray-500">Sélectionnez un passeport</div>
            <Select value={selectedPassport} onValueChange={setSelectedPassport}>
              <SelectTrigger className="h-14 text-lg bg-gray-50/50">
                <SelectValue placeholder="Choisir un passeport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Algérien">🇩🇿 Passeport Algérien</SelectItem>
                <SelectItem value="Français">🇫🇷 Passeport Français</SelectItem>
                <SelectItem value="Émirati">🇦🇪 Passeport Émirati</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-8 w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-start">
            <div className="text-center px-4">
              <div className="text-sm font-medium text-gray-500 mb-1">Rang Mondial</div>
              <div className="text-5xl font-black text-slate-800">#{data.rank}</div>
            </div>
            <div className="text-center px-4 border-l">
              <div className="text-sm font-medium text-gray-500 mb-1">Score de Mobilité</div>
              <div className="text-5xl font-black text-blue-600">{data.score}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
          <div className="bg-green-50/50 rounded-xl p-4 flex flex-col justify-center items-center border border-green-100">
            <div className="text-3xl font-bold text-green-600">{data.stats.free}</div>
            <div className="text-xs uppercase tracking-wider text-green-600 mt-1 font-semibold flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div>Sans Visa</div>
          </div>
          <div className="bg-blue-50/50 rounded-xl p-4 flex flex-col justify-center items-center border border-blue-100">
            <div className="text-3xl font-bold text-blue-600">{data.stats.voa}</div>
            <div className="text-xs uppercase tracking-wider text-blue-600 mt-1 font-semibold flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Visa à l'arrivée</div>
          </div>
          <div className="bg-purple-50/50 rounded-xl p-4 flex flex-col justify-center items-center border border-purple-100">
            <div className="text-3xl font-bold text-purple-600">{data.stats.eta}</div>
            <div className="text-xs uppercase tracking-wider text-purple-600 mt-1 font-semibold flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div>eTA / e-Visa</div>
          </div>
          <div className="bg-red-50/50 rounded-xl p-4 flex flex-col justify-center items-center border border-red-100">
            <div className="text-3xl font-bold text-red-600">{data.stats.required}</div>
            <div className="text-xs uppercase tracking-wider text-red-600 mt-1 font-semibold flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div>Requis</div>
          </div>
        </div>
      </div>

      <WorldMap destinations={data.destinations} />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-lg font-bold">Détails des Destinations ({data.destinations.length})</h3>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un pays..." 
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDestinations.map((dest, i) => (
            <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${getStatusColor(dest.status)} bg-white shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold shrink-0 border border-current shadow-sm">
                  {dest.code}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{dest.country}</div>
                  <div className="text-xs font-semibold flex items-center gap-1.5 mt-1">
                    {getStatusIcon(dest.status)}
                    {getStatusText(dest.status)}
                  </div>
                </div>
              </div>
              {dest.duration && (
                <div className="text-xs font-mono bg-white/50 px-2 py-1 rounded-md border border-current font-bold">
                  {dest.duration}
                </div>
              )}
            </div>
          ))}

          {filteredDestinations.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed">
              Aucune destination trouvée pour votre recherche.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
