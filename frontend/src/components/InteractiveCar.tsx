import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "../i18n/useI18n";
import type { Service } from "../data/services";

interface InteractiveCarProps {
  services: Service[];
  onServiceSelect?: (serviceId: string) => void;
}

type CarZone = "engine" | "wheels" | "suspension" | "body" | "electronics";

const serviceToZone: Record<string, CarZone> = {
  diagnostics: "electronics",
  turbo: "engine",
  egrdpf: "engine",
  injectors: "engine",
  engine: "engine",
  suspension: "suspension",
  maintenance: "body",
  warranty: "body",
  dyno: "electronics",
  repair: "wheels"
};

// Zone definitions with precise areas (x, y, width, height in %)
const sideViewZones: Record<CarZone, { 
  x: string; y: string; width: string; height: string;
  scale: number; offsetX: number; offsetY: number;
  shape?: string; // clip-path for custom shapes
}> = {
  engine: { 
    x: "18%", y: "25%", width: "22%", height: "30%",
    scale: 1.3, offsetX: -15, offsetY: -10,
    shape: "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)"
  },
  wheels: { 
    x: "62%", y: "52%", width: "18%", height: "28%",
    scale: 1.4, offsetX: 15, offsetY: 5,
    shape: "ellipse(50% 50% at 50% 50%)"
  },
  suspension: { 
    x: "35%", y: "60%", width: "30%", height: "22%",
    scale: 1.35, offsetX: 0, offsetY: 10,
    shape: "polygon(5% 20%, 95% 20%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)"
  },
  body: { 
    x: "32%", y: "30%", width: "36%", height: "35%",
    scale: 1.2, offsetX: 0, offsetY: 0,
    shape: "polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)"
  },
  electronics: { 
    x: "22%", y: "20%", width: "20%", height: "25%",
    scale: 1.3, offsetX: -10, offsetY: -8,
    shape: "polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)"
  }
};

const frontViewZones: Record<CarZone, { 
  x: string; y: string; width: string; height: string;
  scale: number; offsetX: number; offsetY: number;
  shape?: string;
}> = {
  engine: { 
    x: "35%", y: "22%", width: "30%", height: "32%",
    scale: 1.4, offsetX: 0, offsetY: -12,
    shape: "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)"
  },
  wheels: { 
    x: "15%", y: "55%", width: "20%", height: "28%",
    scale: 1.35, offsetX: -12, offsetY: 8,
    shape: "ellipse(50% 50% at 50% 50%)"
  },
  suspension: { 
    x: "30%", y: "62%", width: "40%", height: "22%",
    scale: 1.3, offsetX: 0, offsetY: 10,
    shape: "polygon(5% 20%, 95% 20%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)"
  },
  body: { 
    x: "28%", y: "32%", width: "44%", height: "38%",
    scale: 1.2, offsetX: 0, offsetY: 0,
    shape: "polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)"
  },
  electronics: { 
    x: "38%", y: "18%", width: "24%", height: "28%",
    scale: 1.35, offsetX: 0, offsetY: -10,
    shape: "polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)"
  }
};

// Which view to use for each zone
const zoneView: Record<CarZone, "side" | "front"> = {
  engine: "front",
  wheels: "side",
  suspension: "side",
  body: "side",
  electronics: "front"
};

// Optional per-zone overlay images (silhouettes/masks) to make the highlight look like a real part.
// Put files under: frontend/public/images/overlays/
const zoneOverlay: Record<"side" | "front", Partial<Record<CarZone, string>>> = {
  side: {
    wheels: "/images/overlays/side-wheels.png",
    suspension: "/images/overlays/side-suspension.png",
    body: "/images/overlays/side-body.png"
  },
  front: {
    engine: "/images/overlays/front-engine.png",
    electronics: "/images/overlays/front-electronics.png"
  }
};

export function InteractiveCar({ services, onServiceSelect }: InteractiveCarProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    // Skip parallax on touch devices
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleServiceClick = (serviceId: string) => {
    setSelectedService(serviceId);
    onServiceSelect?.(serviceId);
  };

  const activeZone = selectedService ? serviceToZone[selectedService] : null;
  const currentView = activeZone ? zoneView[activeZone] : "side";
  const carImage = currentView === "front" ? "/images/car-front.png" : "/images/car-side.png";
  const zonePositions = currentView === "front" ? frontViewZones : sideViewZones;
  const zoneConfig = activeZone ? zonePositions[activeZone] : null;
  const overlaySrc = activeZone ? zoneOverlay[currentView][activeZone] : undefined;

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-gradient-to-b from-dark via-dark-50 to-dark overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Tech grid overlay */}
      <AnimatePresence>
        {activeZone && (
          <>
            {/* Vertical scan lines */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none hidden md:block"
              style={{
                backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(16, 185, 129, 0.1) 49px, rgba(16, 185, 129, 0.1) 50px)"
              }}
            />
            {/* Horizontal scan lines */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none hidden md:block"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(16, 185, 129, 0.1) 49px, rgba(16, 185, 129, 0.1) 50px)"
              }}
            />
            {/* Animated scan beam */}
            <motion.div
              className="absolute left-0 right-0 h-1 pointer-events-none hidden md:block"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.8) 50%, transparent)",
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.6)"
              }}
              animate={{
                top: ["0%", "100%"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            {/* Corner brackets */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-8 md:inset-16 pointer-events-none"
            >
              {/* Top-left */}
              <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-primary-500" />
              {/* Top-right */}
              <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-primary-500" />
              {/* Bottom-left */}
              <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-primary-500" />
              {/* Bottom-right */}
              <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-primary-500" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Car container */}
      <div className="relative flex items-center justify-center py-8 md:py-12 min-h-[420px] sm:min-h-[520px] lg:min-h-[620px]">
        <motion.div
          className="relative w-full max-w-5xl mx-auto px-4"
          animate={{
            x: isHovering && !activeZone ? mousePos.x * 0.5 : zoneConfig ? zoneConfig.offsetX : 0,
            y: isHovering && !activeZone ? mousePos.y * 0.5 : zoneConfig ? zoneConfig.offsetY : 0,
            scale: zoneConfig ? zoneConfig.scale : 1
          }}
          transition={{ 
            type: "spring", 
            stiffness: 80, 
            damping: 15,
            duration: 0.8
          }}
        >
          {/* Car image with glow */}
          <div className="relative">
            <motion.div
              className="absolute inset-0 blur-2xl opacity-50"
              animate={{
                scale: activeZone ? [1, 1.05, 1] : 1,
                opacity: activeZone ? [0.3, 0.6, 0.3] : 0.3
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <img 
                src={carImage}
                alt="" 
                className="w-full h-auto opacity-0"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/40 via-primary-400/40 to-primary-500/40" />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.img
                key={carImage}
                src={carImage}
                alt="Car"
                className="relative w-full h-auto drop-shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  // X-ray effect: dim the car when a zone is active so the part highlight is obvious
                  opacity: activeZone ? 0.35 : 1,
                  scale: 1,
                  filter: activeZone
                    ? "brightness(1.25) contrast(1.25) saturate(0.7) grayscale(0.15)"
                    : "brightness(1) contrast(1) saturate(1)"
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>

            {/* Precise part overlay (if provided) */}
            <AnimatePresence>
              {activeZone && overlaySrc && (
                <motion.img
                  key={`${currentView}-${activeZone}`}
                  src={overlaySrc}
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.15, 1, 0.15],
                    filter: [
                      "drop-shadow(0 0 8px rgba(16,185,129,0.6))",
                      "drop-shadow(0 0 18px rgba(16,185,129,1))",
                      "drop-shadow(0 0 8px rgba(16,185,129,0.6))"
                    ]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  onError={(e) => {
                    e.currentTarget.classList.add("hidden");
                  }}
                />
              )}
            </AnimatePresence>

            {/* Zone highlight overlay - precise area */}
            <AnimatePresence>
              {activeZone && zoneConfig && (
                <>
                  {/* Colored fill overlay for the exact zone */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute pointer-events-none"
                    style={{
                      left: zoneConfig.x,
                      top: zoneConfig.y,
                      width: zoneConfig.width,
                      height: zoneConfig.height,
                      clipPath: zoneConfig.shape
                    }}
                  >
                    {/* Pulsing colored fill */}
                    <motion.div
                      className="absolute inset-0 bg-primary-500/35 mix-blend-screen"
                      animate={{
                        // If we have an overlay silhouette, keep the box highlight subtle.
                        opacity: overlaySrc ? [0.08, 0.18, 0.08] : [0.25, 0.75, 0.25]
                      }}
                      transition={{
                        duration: overlaySrc ? 1.6 : 1.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        boxShadow:
                          overlaySrc
                            ? "inset 0 0 30px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.4)"
                            : "inset 0 0 60px rgba(16, 185, 129, 0.9), 0 0 80px rgba(16, 185, 129, 0.8)"
                      }}
                    />
                    
                    {/* Animated border */}
                    <motion.div
                      className="absolute inset-0 border-4 border-primary-500"
                      animate={{
                        borderColor: ["rgba(16, 185, 129, 1)", "rgba(16, 185, 129, 0.4)", "rgba(16, 185, 129, 1)"]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity
                      }}
                      style={{ clipPath: zoneConfig.shape }}
                    />

                    {/* Scan lines within zone */}
                    <div className="absolute inset-0 overflow-hidden" style={{ clipPath: zoneConfig.shape }}>
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent"
                          animate={{
                            top: ["-10%", "110%"]
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.5,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* Corner brackets around zone */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute pointer-events-none"
                    style={{
                      left: zoneConfig.x,
                      top: zoneConfig.y,
                      width: zoneConfig.width,
                      height: zoneConfig.height
                    }}
                  >
                    {/* Top-left bracket */}
                    <motion.div
                      className="absolute top-0 left-0 w-6 h-6 border-l-3 border-t-3 border-primary-400"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    {/* Top-right bracket */}
                    <motion.div
                      className="absolute top-0 right-0 w-6 h-6 border-r-3 border-t-3 border-primary-400"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                    {/* Bottom-left bracket */}
                    <motion.div
                      className="absolute bottom-0 left-0 w-6 h-6 border-l-3 border-b-3 border-primary-400"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                    {/* Bottom-right bracket */}
                    <motion.div
                      className="absolute bottom-0 right-0 w-6 h-6 border-r-3 border-b-3 border-primary-400"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* HUD overlay - top left status */}
      <AnimatePresence>
        {activeZone && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="absolute top-4 left-4 md:top-8 md:left-8 z-20 hidden md:block"
          >
            <div className="bg-dark/90 backdrop-blur-md border-2 border-primary-500/40 rounded-lg p-4 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                <span className="text-xs font-mono text-primary-400 uppercase tracking-wider">Scanning Active</span>
              </div>
              <div className="text-white font-bold text-lg mb-1">{activeZone.toUpperCase()}</div>
              <div className="text-xs text-white/60 font-mono">
                VIEW: {currentView.toUpperCase()}
              </div>
              <div className="mt-2 h-1 bg-dark-50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-600 to-primary-400"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service selector */}
      <div className="relative z-20 border-t border-primary-500/20 bg-dark/60 backdrop-blur-md">
        <div className="container mx-auto px-4 py-5 md:py-8">
          <div className="text-center mb-4 md:mb-6">
            <motion.h2 
              className="text-xl md:text-3xl font-black text-white mb-1 md:mb-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {t("home.interactiveTitle")}
            </motion.h2>
            <motion.p 
              className="text-white/60 text-sm md:text-base"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {t("home.interactiveLead")}
            </motion.p>
          </div>

          {/* Mobile details as bottom-sheet (inside selector, so it never overlaps badly) */}
          <AnimatePresence>
            {selectedService && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                className="md:hidden mb-4 rounded-2xl border border-primary-500/30 bg-dark/85 p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const ServiceIcon = services.find((s) => s.id === selectedService)?.icon;
                      return ServiceIcon ? <ServiceIcon className="w-6 h-6 text-primary-500" /> : null;
                    })()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-bold leading-tight break-words hyphens-auto">{t(`svc.${selectedService}.t`)}</div>
                    <div className="text-xs text-white/60 mt-1">{t(`svc.${selectedService}.d`)}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-white/80">{t(`svc.${selectedService}.b${num}`)}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="mt-4 w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg transition-colors"
                  onClick={() => (window.location.href = "/contacts#form")}
                >
                  {t("cta.book")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile: horizontal scroll selector */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {services.map((service) => {
              const isActive = selectedService === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceClick(service.id)}
                  className={[
                    "min-w-[150px] flex items-center gap-3 rounded-xl border px-3 py-3 transition",
                    isActive
                      ? "bg-primary-500/20 border-primary-500 shadow-[0_0_0_1px_rgba(16,185,129,0.4)]"
                      : "bg-dark-50/40 border-white/10 hover:border-primary-500/40"
                  ].join(" ")}
                >
                  <div className={["h-10 w-10 rounded-lg grid place-items-center", isActive ? "bg-primary-500/25" : "bg-white/5"].join(" ")}>
                    <service.icon className={["h-5 w-5", isActive ? "text-primary-400" : "text-white/70"].join(" ")} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className={["text-xs font-bold leading-tight line-clamp-2 break-words hyphens-auto", isActive ? "text-white" : "text-white/70"].join(" ")}>
                      {t(`svc.${service.id}.t`)}
                    </div>
                    {service.status === "soon" && (
                      <div className="mt-1 inline-flex rounded-full bg-primary-500/15 px-2 py-0.5 text-[10px] font-bold text-primary-400">
                        {t("services.soon")}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Desktop: grid selector */}
          <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-5xl mx-auto">
            {services.map((service, idx) => {
              const isActive = selectedService === service.id;
              return (
                <motion.button
                  key={service.id}
                  onClick={() => handleServiceClick(service.id)}
                  className={[
                    "relative p-4 rounded-xl border-2 transition-all duration-300",
                    isActive
                      ? "bg-primary-500/20 border-primary-500 shadow-lg shadow-primary-500/50"
                      : "bg-dark-50/50 border-white/10 hover:border-primary-500/50 hover:bg-dark-50"
                  ].join(" ")}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={[
                    "w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center transition-colors",
                    isActive ? "bg-primary-500/30" : "bg-white/5"
                  ].join(" ")}>
                    <service.icon className={[
                      "w-5 h-5 transition-colors",
                      isActive ? "text-primary-400" : "text-white/70"
                    ].join(" ")} />
                  </div>
                  <div className={[
                    "text-xs font-semibold transition-colors line-clamp-2 break-words hyphens-auto",
                    isActive ? "text-white" : "text-white/70"
                  ].join(" ")}>
                    {t(`svc.${service.id}.t`)}
                  </div>
                  {service.status === "soon" && (
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-primary-500 text-white text-[10px] font-bold rounded-full">
                      {t("services.soon")}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Service details panel */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="hidden md:block absolute top-4 right-4 md:top-1/2 md:right-12 md:-translate-y-1/2 w-72 md:w-80 bg-dark/95 backdrop-blur-lg border border-primary-500/30 rounded-2xl p-4 md:p-6 shadow-2xl z-20"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                {(() => {
                  const ServiceIcon = services.find(s => s.id === selectedService)?.icon;
                  return ServiceIcon ? <ServiceIcon className="w-6 h-6 text-primary-500" /> : null;
                })()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {t(`svc.${selectedService}.t`)}
                </h3>
                <p className="text-sm text-white/60">
                  {t(`svc.${selectedService}.d`)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {[1, 2, 3, 4].map((num) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: num * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-white/80">
                    {t(`svc.${selectedService}.b${num}`)}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.button
              className="mt-6 w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = "/contacts#form"}
            >
              {t("cta.book")}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

