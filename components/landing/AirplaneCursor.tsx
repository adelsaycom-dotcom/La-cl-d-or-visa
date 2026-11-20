import { useEffect, useRef, useState } from "react";

const TRAIL_POOL_SIZE = 10;

interface TrailItem {
  x: number;
  y: number;
  opacity: number;
  scale: number;
}

export function AirplaneCursor() {
  const [enabled, setEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const posRef = useRef({ x: -120, y: -120 });
  const targetRef = useRef({ x: -120, y: -120 });
  const angleRef = useRef(45);
  const trailRef = useRef<TrailItem[]>(
    Array.from({ length: TRAIL_POOL_SIZE }, () => ({ x: -120, y: -120, opacity: 0, scale: 1 }))
  );
  const trailHeadRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    setEnabled(true);
    let lastTrailTime = 0;

    const setContainerVisibility = (visible: boolean) => {
      visibleRef.current = visible;
      if (containerRef.current) {
        containerRef.current.style.opacity = visible ? "1" : "0";
      }
    };

    const tick = (time: number) => {
      const target = targetRef.current;
      const current = posRef.current;

      const dx = target.x - current.x;
      const dy = target.y - current.y;
      const dist = Math.hypot(dx, dy);

      current.x += dx * 0.24;
      current.y += dy * 0.24;

      if (dist > 1.2) {
        const rawAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        const diff = ((rawAngle - angleRef.current + 180) % 360) - 180;
        angleRef.current += diff * 0.25;
      }

      if (planeRef.current) {
        planeRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%) rotate(${angleRef.current + 45}deg)`;
      }

      if (dist > 2.2 && time - lastTrailTime > 32) {
        lastTrailTime = time;
        const idx = trailHeadRef.current % TRAIL_POOL_SIZE;
        trailHeadRef.current += 1;
        trailRef.current[idx] = {
          x: current.x,
          y: current.y,
          opacity: 0.55,
          scale: 1,
        };
      }

      let hasActiveTrail = false;
      for (let i = 0; i < TRAIL_POOL_SIZE; i += 1) {
        const pt = trailRef.current[i];
        const el = trailRefs.current[i];
        if (pt.opacity > 0.02) {
          pt.opacity = Math.max(0, pt.opacity - 0.04);
          pt.scale += 0.08;
          hasActiveTrail = true;
          if (el) {
            el.style.opacity = String(pt.opacity);
            el.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -50%) scale(${pt.scale})`;
          }
        } else if (el && el.style.opacity !== "0") {
          el.style.opacity = "0";
        }
      }

      if (visibleRef.current && (dist > 0.35 || hasActiveTrail)) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    const startLoop = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!visibleRef.current) {
        posRef.current = { x: e.clientX, y: e.clientY };
        setContainerVisibility(true);
      }
      targetRef.current = { x: e.clientX, y: e.clientY };
      startLoop();
    };

    const handleMouseLeave = () => {
      setContainerVisibility(false);
    };

    const handleMouseEnter = () => {
      setContainerVisibility(true);
      startLoop();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      style={{ opacity: 0 }}
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none transition-opacity duration-200"
      aria-hidden="true"
    >
      {/* Pool fixe GPU-accéléré pour la traînée (0 re-render React) */}
      {Array.from({ length: TRAIL_POOL_SIZE }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="absolute top-0 left-0 w-[5px] h-[5px] rounded-full pointer-events-none will-change-transform"
          style={{
            opacity: 0,
            backgroundColor: "#661915",
            boxShadow: "0 0 6px rgba(102, 25, 21, 0.38)",
          }}
        />
      ))}

      {/* Avion GPU-accéléré via translate3d */}
      <div
        ref={planeRef}
        className="absolute top-0 left-0 pointer-events-none will-change-transform"
        style={{ transform: "translate3d(-120px, -120px, 0)" }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_2px_4px_rgba(102,25,21,0.35)]"
        >
          <path
            d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"
            fill="#661915"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <circle cx="11.5" cy="5" r="0.8" fill="#ffffff" />
        </svg>
      </div>
    </div>
  );
}
