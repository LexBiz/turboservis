import { NavLink } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { services } from "../data/services";
import { useI18n } from "../i18n/useI18n";
import { heroSources, serviceSources } from "../lib/images";
import { TechLines } from "../components/TechLines";

export default function ServicesPage() {
  const { t, lang } = useI18n();
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {(() => {
            const hero = heroSources("services", lang);
            return (
              <picture>
                <source type="image/webp" srcSet={hero.webpSrcSet} sizes={hero.sizes} />
                <source type="image/jpeg" srcSet={hero.jpgSrcSet} sizes={hero.sizes} />
                <img src={hero.src} alt="Services" className="h-full w-full object-cover object-center" decoding="async" />
              </picture>
            );
          })()}
          <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/80 to-dark/85" />
        </div>

        {/* No hero text overlay (requested): keep only the banner */}
        <div className="relative z-10 min-h-[220px] md:min-h-[260px] lg:min-h-[300px]" />
      </section>

      {/* Services Grid */}
      <section className="relative py-20 bg-dark-50 overflow-hidden">
        <TechLines />
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white">
              {t("services.titleA")} <span className="text-primary-500">{t("services.titleB")}</span>
            </h1>
            <p className="mt-3 text-white/70">{t("services.lead")}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, idx) => (
              <Card 
                key={service.id} 
                className="overflow-hidden bg-dark border border-primary-500/20 hover:border-primary-500/50 transition-all duration-300"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="p-8">
                  {/* service image (if exists in /public/images) */}
                  <div className="relative mb-6 overflow-hidden rounded-xl border border-white/10 aspect-square bg-dark">
                    {(() => {
                      const s = serviceSources(service.id, lang);
                      return (
                        <picture>
                          <source type="image/webp" srcSet={s.webpSrcSet} sizes={s.sizes} />
                          <source type="image/jpeg" srcSet={s.jpgSrcSet} sizes={s.sizes} />
                          <img
                            src={s.src}
                            alt={t(`svc.${service.id}.t`)}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              (e.currentTarget.parentElement as HTMLElement | null)?.classList.add("hidden");
                            }}
                          />
                        </picture>
                      );
                    })()}
                    <div className="absolute inset-0 ring-1 ring-white/5" />
                  </div>

                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-16 h-16 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-8 h-8 text-primary-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{t(`svc.${service.id}.t`)}</h3>
                      {service.status === "soon" && (
                        <div className="mb-2 inline-flex rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-bold text-primary-400">
                          {t("services.soon")}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-white/70 mb-6 leading-relaxed">
                    {t(`svc.${service.id}.d`)}
                  </p>

                  <div className="space-y-3 mb-8">
                    {[t(`svc.${service.id}.b1`), t(`svc.${service.id}.b2`), t(`svc.${service.id}.b3`), t(`svc.${service.id}.b4`)].map((bullet, bulletIdx) => (
                      <div key={bulletIdx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span className="text-white/80">{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <NavLink to="/contacts#form">
                    <Button variant="primary" className="w-full group">
                      {t("services.bookService")}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </NavLink>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900/30 via-primary-500/20 to-primary-900/30 border-y border-primary-500/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-black text-white mb-6">
              {t("services.notFoundTitle")}
            </h2>
            <p className="text-xl text-white/80 mb-8">
              {t("services.notFoundText")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <NavLink to="/contacts#form">
                <Button size="lg">
                  {t("home.leaveRequest")}
                </Button>
              </NavLink>
              <NavLink to="/contacts">
                <Button size="lg" variant="outline">
                  {t("services.contactsBtn")}
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Почему выбирают нас */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">
              {t("services.qualityTitleA")} <span className="text-primary-500">{t("services.qualityTitleB")}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: t("services.quality.1.t"),
                description: t("services.quality.1.d")
              },
              {
                title: t("services.quality.2.t"),
                description: t("services.quality.2.d")
              },
              {
                title: t("services.quality.3.t"),
                description: t("services.quality.3.d")
              }
            ].map((item, idx) => (
              <Card key={idx} className="p-6 bg-dark border border-primary-500/20 text-center">
                <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/60">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
