import { useEffect, useState, useRef } from "react";

interface TrailPoint {
  x: number;
  y: number;
  id: string;
  opacity: number;
  scale: number;
}

export function AirplaneCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [planePos, setPlanePos] = useState({ x: -100, y: -100, angle: 45 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);

  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const angleRef = useRef(45);
  const trailCounterRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setTrail([]);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    let lastTrailTime = 0;

    // Smooth animation loop
    const updatePlane = (time: number) => {
      const target = targetRef.current;
      const current = posRef.current;

      // Smooth interpolation (lerp)
      const ease = 0.22;
      const dx = target.x - current.x;
      const dy = target.y - current.y;

      current.x += dx * ease;
      current.y += dy * ease;

      // Calculate direction angle when moving
      const dist = Math.hypot(dx, dy);
      if (dist > 1.5) {
        // SVG plane is oriented pointing towards top-right (45 deg) by default
        const rawAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        // Smoothly rotate
        const diff = ((rawAngle - angleRef.current + 180) % 360) - 180;
        angleRef.current += diff * 0.25;
      }

      setPlanePos({ x: current.x, y: current.y, angle: angleRef.current + 45 });

      // Determine if a new trail point should be spawned
      const shouldSpawnTrail = dist > 2 && time - lastTrailTime > 35;
      if (shouldSpawnTrail) {
        lastTrailTime = time;
      }

      // Single atomic trail update to avoid multiple re-renders and duplicate key collisions
      setTrail((prev) => {
        const aged = prev
          .map((pt) => ({
            ...pt,
            opacity: pt.opacity - 0.04,
            scale: pt.scale + 0.1,
          }))
          .filter((pt) => pt.opacity > 0.05);

        if (shouldSpawnTrail) {
          trailCounterRef.current += 1;
          aged.push({
            x: current.x,
            y: current.y,
            id: `trail_${trailCounterRef.current}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            opacity: 0.6,
            scale: 1,
          });
        }

        return aged.slice(-12);
      });

      animFrameRef.current = requestAnimationFrame(updatePlane);
    };

    animFrameRef.current = requestAnimationFrame(updatePlane);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* Contrail / Vapor trail behind plane */}
      {trail.map((pt) => (
        <div
          key={pt.id}
          className="absolute rounded-full pointer-events-none blur-[0.5px]"
          style={{
            left: `${pt.x}px`,
            top: `${pt.y}px`,
            width: "5px",
            height: "5px",
            transform: `translate(-50%, -50%) scale(${pt.scale})`,
            backgroundColor: "#7B1B38",
            opacity: pt.opacity,
            boxShadow: "0 0 6px rgba(123, 27, 56, 0.4)",
            transition: "opacity 0.1s ease-out",
          }}
        />
      ))}

      {/* Modern Jet Airplane Follower */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${planePos.x}px`,
          top: `${planePos.y}px`,
          transform: `translate(-50%, -50%) rotate(${planePos.angle}deg)`,
          transition: "transform 0.05s ease-out",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md filter drop-shadow-[0_2px_4px_rgba(123,27,56,0.35)]"
        >
          {/* Jet Fuselage & Wings */}
          <path
            d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"
            fill="#7B1B38"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Cockpit detail */}
          <circle cx="11.5" cy="5" r="0.8" fill="#ffffff" />
        </svg>
      </div>
    </div>
  );
}
