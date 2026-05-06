import React, { memo } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Tooltip } from "react-tooltip";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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
    case "free": return "#22c55e"; // green-500
    case "voa": return "#3b82f6"; // blue-500
    case "eta": return "#a855f7"; // purple-500
    case "required": return "#ef4444"; // red-500
    default: return "#e2e8f0"; // slate-200
  }
};

const getStatusText = (status?: string) => {
  switch (status) {
    case "free": return "Sans Visa";
    case "voa": return "Visa à l'arrivée";
    case "eta": return "eTA / e-Visa";
    case "required": return "Visa Requis";
    default: return "Inconnu";
  }
};

const MapChart = ({ destinations }: WorldMapProps) => {
  return (
    <div className="relative w-full h-[500px] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden mt-8 hidden md:block">
      <ComposableMap projectionConfig={{ scale: 140 }} width={800} height={400} style={{ width: "100%", height: "100%" }}>
        <ZoomableGroup center={[0, 20]} zoom={1} minZoom={1} maxZoom={4}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoName = geo.properties.name;
                const destinationMatch = destinations.find(
                   d => d.country.toLowerCase() === geoName.toLowerCase() ||
                   // handle some common name variations
                   (d.country === "United States" && geoName === "United States of America")
                );

                const color = getStatusColor(destinationMatch?.status);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#fcd34d", outline: "none", cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                    data-tooltip-id="my-tooltip"
                    data-tooltip-html={`<b>${geoName}</b>${destinationMatch ? `<br/>${getStatusText(destinationMatch.status)}` : ''}`}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <Tooltip id="my-tooltip" place="top" style={{ backgroundColor: '#1e293b', color: 'white', borderRadius: '8px', zIndex: 100 }} />
    </div>
  );
};

export default memo(MapChart);
