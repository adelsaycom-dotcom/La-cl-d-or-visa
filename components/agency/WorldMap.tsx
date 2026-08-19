import React, { memo, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { Plus, Minus, Maximize } from "lucide-react";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

interface Destination {
  country: string;
  code: string;
  status: "free" | "voa" | "required" | "eta";
}

interface WorldMapProps {
  destinations: Destination[];
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case "free": return "#10b981"; // emerald-500
    case "voa": return "#3b82f6"; // blue-500
    case "eta": return "#a855f7"; // purple-500
    case "required": return "#f43f5e"; // rose-500
    default: return "#f1f5f9"; // slate-100
  }
};

const getStatusText = (status?: string) => {
  switch (status) {
    case "free": return "Sans Visa";
    case "voa": return "Visa à l'arrivée";
    case "eta": return "eTA / e-Visa";
    case "required": return "Visa Requis";
    default: return "Donnée non disponible";
  }
};

const MapChart = ({ destinations }: WorldMapProps) => {
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });

  function handleZoomIn() {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  }

  function handleReset() {
    setPosition({ coordinates: [0, 20], zoom: 1 });
  }

  function handleMoveEnd(position: { coordinates: [number, number]; zoom: number }) {
    setPosition(position);
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] bg-[#e0f2fe] border border-slate-200 rounded-3xl overflow-hidden mt-8 shadow-inner">
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-xl shadow-md border border-slate-200/50">
        <button onClick={handleZoomIn} className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
        <button onClick={handleZoomOut} className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors">
          <Minus className="w-5 h-5" />
        </button>
        <button onClick={handleReset} className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors">
          <Maximize className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-slate-200/50 text-xs font-bold flex flex-col gap-2">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Sans Visa</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Visa à l'arrivée</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div> eTA / e-Visa</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Visa Requis</div>
      </div>

      <ComposableMap projectionConfig={{ scale: 140 }} width={800} height={400} style={{ width: "100%", height: "100%" }}>
        <ZoomableGroup 
          zoom={position.zoom} 
          center={position.coordinates as [number, number]} 
          onMoveEnd={handleMoveEnd}
          minZoom={1} 
          maxZoom={4}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoName = geo.properties.name;
                const destinationMatch = destinations.find(
                   d => d.country.toLowerCase() === geoName.toLowerCase() ||
                   (d.country === "United States" && geoName === "United States of America") ||
                   (d.country === "United Kingdom" && geoName === "United Kingdom") ||
                   (d.country === "Russia" && geoName === "Russia")
                );

                const color = getStatusColor(destinationMatch?.status);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={color}
                    stroke="#cbd5e1"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#fbbf24", outline: "none", cursor: "pointer", transition: "all 250ms" },
                      pressed: { outline: "none" },
                    }}
                    data-tooltip-id="map-tooltip"
                    data-tooltip-html={`<div class='text-center'><b class='text-sm'>${geoName}</b>${destinationMatch ? `<br/><span class='text-xs opacity-90'>${getStatusText(destinationMatch.status)}</span>` : '<br/><span class="text-xs opacity-90">Donnée non disponible</span>'}</div>`}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <Tooltip id="map-tooltip" place="top" style={{ backgroundColor: '#0f172a', color: 'white', borderRadius: '12px', padding: '8px 12px', zIndex: 100, fontWeight: 600, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
    </div>
  );
};

export default memo(MapChart);
