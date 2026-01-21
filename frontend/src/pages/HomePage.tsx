import { NavLink } from "react-router-dom";
import { Clock, Shield, Wrench, Star, Phone, CheckCircle2 } from "lucide-react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Card } from "../components/ui/Card";
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
              <picture>
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
              <a href="tel:+77775887871">
                <Button size="lg" variant="outline" className="text-lg">
                  <Phone className="w-5 h-5 mr-2" />
                  777-588-787
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

      {/* ПОЧЕМУ МЫ */}
      <section className="relative py-20 bg-dark-50 overflow-hidden">
        <TechLines />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              {t("home.whyTitleA")} <span className="text-primary-500">TURBOSERVIS</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {t("home.whyText")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: t("home.feature.warranty.title"),
                description: t("home.feature.warranty.desc")
              },
              {
                icon: Clock,
                title: t("home.feature.fast.title"),
                description: t("home.feature.fast.desc")
              },
              {
                icon: Wrench,
                title: t("home.feature.pros.title"),
                description: t("home.feature.pros.desc")
              },
              {
                icon: Star,
                title: t("home.feature.prices.title"),
                description: t("home.feature.prices.desc")
              }
            ].map((item, idx) => (
              <Card key={idx} className="p-6 bg-dark border border-primary-500/20 hover:border-primary-500/50">
                <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-primary-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/70 leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-primary-500/20 bg-dark p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-black tracking-wide text-primary-400">{t("home.noteTitle")}</div>
              <div className="h-px flex-1 bg-gradient-to-r from-primary-500/40 via-white/10 to-transparent" />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                { key: "home.note.egrDpf", img: "note/egr-dpf.png", fallback: Wrench },
                { key: "home.note.injectorsSoon", img: "note/injectors.png", fallback: Clock },
                { key: "home.note.vehicles", img: "note/vans.png", fallback: Shield },
                { key: "home.note.noOverhaul", img: "note/engine.png", fallback: Star },
                { key: "home.note.b2b", img: "note/b2b.png", fallback: CheckCircle2 }
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-start gap-4 rounded-xl border border-white/10 bg-dark-50/40 p-4 hover:border-primary-500/30 transition-colors"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-xl bg-primary-500/10 ring-1 ring-primary-500/20 overflow-hidden flex-shrink-0">
                    <img
                      src={imageUrl(item.img)}
                      alt=""
                      className="h-14 w-14 object-contain"
                      onError={(e) => {
                        e.currentTarget.classList.add("hidden");
                        (e.currentTarget.nextElementSibling as HTMLElement | null)?.classList.remove("hidden");
                      }}
                    />
                    <item.fallback className="hidden h-7 w-7 text-primary-400" />
                  </div>
                  <div className="text-sm text-white/80 leading-relaxed">{t(item.key)}</div>
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
            <a href="tel:+77775887871">
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
