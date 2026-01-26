import { NavLink } from "react-router-dom";
import { Shield, Wrench, Star, Phone, CheckCircle2 } from "lucide-react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { services } from "../data/services";
import { useI18n } from "../i18n/useI18n";
import { heroMainSources, imageUrl } from "../lib/images";
import { TechGears } from "../components/TechGears";
import { TechLines } from "../components/TechLines";
const LazyInteractiveCar = lazy(() =>
  import("../components/InteractiveCar").then((m) => ({ default: m.InteractiveCar }))
);

export default function HomePage() {
  const { t } = useI18n();
  const interactiveRef = useRef<HTMLDivElement | null>(null);
  const [showInteractive, setShowInteractive] = useState(false);
  const phone = "777 588 787";
  const tel = "+777588787";

  useEffect(() => {
    const el = interactiveRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShowInteractive(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div>
      {/* HERO SECTION - огромный баннер под картинки */}
      <section className="relative overflow-hidden">
        {/* Hero background image */}
        <div className="absolute inset-0">
          {(() => {
            const hero = heroMainSources();
            return (
              <picture className="block h-full w-full">
                <source type="image/webp" srcSet={hero.webpSrcSet} sizes={hero.sizes} />
                <source type="image/jpeg" srcSet={hero.jpgSrcSet} sizes={hero.sizes} />
                <img
                  src={hero.src}
                  alt="TURBOSERVIS"
                  className="h-full w-full object-cover"
                  decoding="async"
                  fetchPriority="high"
                />
              </picture>
            );
          })()}
          <div className="absolute inset-0 bg-gradient-to-r from-dark/98 via-dark/90 to-dark/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.15),transparent_60%)]" />
        </div>

        {/* Контент */}
        <div className="container mx-auto px-4 relative z-10 min-h-[520px] md:min-h-[560px] lg:min-h-[640px] flex items-center py-12">
          <div className="w-full max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark/70 backdrop-blur border border-primary-500/30 rounded-full text-primary-400 font-semibold text-sm mb-6 w-fit animate-slide-in">
              <Star className="w-4 h-4" />
              {t("home.badge")}
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight animate-fade-in">
              TURBO<span className="text-primary-500">SERVIS</span>
            </h1>

            <p className="text-xl lg:text-2xl text-white/80 mb-8 leading-relaxed animate-slide-up">
              {t("home.heroText")}
              <span className="text-primary-500 font-semibold"> {t("home.heroTextStrong")}</span>.
            </p>

            <div className="flex flex-wrap gap-4 animate-slide-up">
              <NavLink to="/contacts#form">
                <Button size="lg" className="text-lg">
                  {t("home.bookDiagnostics")}
                </Button>
              </NavLink>
              <a href={`tel:${tel}`}>
                <Button size="lg" variant="outline" className="text-lg">
                  <Phone className="w-5 h-5 mr-2" />
                  {phone}
                </Button>
              </a>
            </div>

            {/* Преимущества */}
            <div className="grid grid-cols-3 gap-4 mt-10 animate-fade-in">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-500">10+</div>
                <div className="mt-1 text-[11px] sm:text-sm leading-tight text-white/70">
                  {t("home.stats.years")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-500">500+</div>
                <div className="mt-1 text-[11px] sm:text-sm leading-tight text-white/70">
                  {t("home.stats.clients")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-500">24/7</div>
                <div className="mt-1 text-[11px] sm:text-sm leading-tight text-white/70">
                  {t("home.stats.online")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Декоративные элементы */}
        <TechGears />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
      </section>

      {/* ВАЖЛИВО (сильні факти) */}
      <section className="relative py-16 sm:py-20 bg-dark-50 overflow-hidden">
        <TechLines />
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-6xl rounded-3xl border border-primary-500/25 bg-gradient-to-br from-dark via-dark-50 to-dark p-7 sm:p-10 shadow-[0_0_0_1px_rgba(16,185,129,0.08),0_30px_80px_-30px_rgba(0,0,0,0.85)]">
            <div className="flex items-center justify-between gap-4">
              <div className="text-lg sm:text-xl font-black tracking-wide text-primary-300 uppercase">
                {t("home.noteTitle")}
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-primary-500/70 via-white/10 to-transparent" />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                // Custom images for the IMPORTANT block (put them into /frontend/public/images).
                { key: "home.note.egrDpf", img: "home-important-egrdpf-800x800.jpg", fallback: Wrench },
                { key: "home.note.injectorsSoon", img: "home-important-injectors-800x800.jpg", fallback: CheckCircle2 },
                { key: "home.note.noOverhaul", img: "home-important-diagnostics-800x800.jpg", fallback: Star },
                { key: "home.note.vehicles", img: "home-important-vehicles-800x800.jpg", fallback: Shield }
              ].map((item) => (
                <div
                  key={item.key}
                  className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-dark/40 p-5 sm:p-6 hover:border-primary-500/45 hover:bg-dark/60 transition-colors"
                >
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-500/10 ring-1 ring-primary-500/25 overflow-hidden flex-shrink-0">
                    <img
                      src={imageUrl(item.img)}
                      alt=""
                      className="h-16 w-16 object-cover"
                      onError={(e) => {
                        e.currentTarget.classList.add("hidden");
                        (e.currentTarget.nextElementSibling as HTMLElement | null)?.classList.remove("hidden");
                      }}
                    />
                    <item.fallback className="hidden h-7 w-7 text-primary-400" />
                  </div>
                  <div className="text-[13px] sm:text-sm text-white/85 leading-relaxed">
                    {t(item.key)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CAR DIAGNOSTICS */}
      <section ref={interactiveRef} className="relative">
        {showInteractive ? (
          <Suspense
            fallback={
              <div className="min-h-[520px] bg-dark-50 border-y border-primary-500/20 animate-pulse" />
            }
          >
            <LazyInteractiveCar services={services} />
          </Suspense>
        ) : (
          <div className="min-h-[520px] bg-dark-50 border-y border-primary-500/20" />
        )}
      </section>

      {/* CTA БАННЕР */}
      <section className="py-20 bg-gradient-to-r from-primary-900/30 via-primary-500/20 to-primary-900/30 border-y border-primary-500/20">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={imageUrl("cta-banner-1920x500.jpg")}
              alt="CTA"
              className="h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/60 to-dark/80" />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10 py-20">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            {t("home.ctaTitle")}
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {t("home.ctaText")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <NavLink to="/contacts#form">
              <Button size="lg" className="text-lg">
                {t("home.leaveRequest")}
              </Button>
            </NavLink>
            <a href={`tel:${tel}`}>
              <Button size="lg" variant="secondary" className="text-lg">
                <Phone className="w-5 h-5 mr-2" />
                {t("cta.callNow")}
              </Button>
            </a>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}
