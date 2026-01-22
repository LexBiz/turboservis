import { NavLink } from "react-router-dom";
import { 
  Award, 
  Users, 
  Wrench, 
  TrendingUp, 
  Shield, 
  Clock,
  CheckCircle2,
  Star
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useI18n } from "../i18n/useI18n";
import { heroSources } from "../lib/images";

export default function AboutPage() {
  const { t, lang } = useI18n();
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {(() => {
            const hero = heroSources("about", lang);
            return (
              <picture className="block h-full w-full">
                <source type="image/webp" srcSet={hero.webpSrcSet} sizes={hero.sizes} />
                <source type="image/jpeg" srcSet={hero.jpgSrcSet} sizes={hero.sizes} />
                <img src={hero.src} alt="About" className="h-full w-full object-cover object-center" decoding="async" />
              </picture>
            );
          })()}
          <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/80 to-dark/85" />
        </div>

        {/* No hero text overlay (requested): keep only the banner */}
        <div className="relative z-10 min-h-[220px] md:min-h-[260px] lg:min-h-[300px]" />
      </section>

      {/* Цифры и достижения */}
      <section className="py-20 bg-dark-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, value: "10+", label: t("about.stats.1") },
              { icon: Users, value: "500+", label: t("about.stats.2") },
              { icon: Wrench, value: "3000+", label: t("about.stats.3") },
              { icon: Award, value: "100%", label: t("about.stats.4") }
            ].map((stat, idx) => (
              <Card key={idx} className="p-6 bg-dark border border-primary-500/20 text-center hover:border-primary-500/50">
                <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-primary-500" />
                </div>
                <div className="text-4xl font-black text-primary-500 mb-2">{stat.value}</div>
                <div className="text-white/70">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Наши преимущества */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">
              {t("about.whyTitleA")} <span className="text-primary-500">{t("about.whyTitleB")}</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {t("about.whyLead")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: t("about.benefit.1.t"),
                description: t("about.benefit.1.d")
              },
              {
                icon: Award,
                title: t("about.benefit.2.t"),
                description: t("about.benefit.2.d")
              },
              {
                icon: TrendingUp,
                title: t("about.benefit.3.t"),
                description: t("about.benefit.3.d")
              },
              {
                icon: Clock,
                title: t("about.benefit.4.t"),
                description: t("about.benefit.4.d")
              },
              {
                icon: CheckCircle2,
                title: t("about.benefit.5.t"),
                description: t("about.benefit.5.d")
              },
              {
                icon: Star,
                title: t("about.benefit.6.t"),
                description: t("about.benefit.6.d")
              }
            ].map((item, idx) => (
              <Card key={idx} className="p-6 bg-dark border border-primary-500/20 hover:border-primary-500/50">
                <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-primary-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/70 leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Наша команда */}
      <section className="py-20 bg-dark-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">
              {t("about.teamTitleA")} <span className="text-primary-500">{t("about.teamTitleB")}</span>
            </h2>
            <p className="text-white/60 text-lg">
              {t("about.teamLead")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: t("team.1.name"),
                role: t("team.1.role"),
                experience: t("team.1.exp"),
                specialization: t("team.1.spec")
              },
              {
                name: t("team.2.name"),
                role: t("team.2.role"),
                experience: t("team.2.exp"),
                specialization: t("team.2.spec")
              },
              {
                name: t("team.3.name"),
                role: t("team.3.role"),
                experience: t("team.3.exp"),
                specialization: t("team.3.spec")
              }
            ].map((member, idx) => (
              <Card key={idx} className="p-6 bg-dark border border-primary-500/20 hover:border-primary-500/50 text-center">
                <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-primary-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <div className="text-primary-500 font-semibold mb-2">{member.role}</div>
                <div className="text-sm text-white/60 mb-2">{member.experience}</div>
                <p className="text-sm text-white/70">{member.specialization}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Кейсы / Успешные работы */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">
              {t("about.casesTitleA")} <span className="text-primary-500">{t("about.casesTitleB")}</span>
            </h2>
            <p className="text-white/60 text-lg">
              {t("about.casesLead")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: t("case.1.t"),
                description: t("case.1.d"),
                result: t("case.1.r")
              },
              {
                title: t("case.2.t"),
                description: t("case.2.d"),
                result: t("case.2.r")
              },
              {
                title: t("case.3.t"),
                description: t("case.3.d"),
                result: t("case.3.r")
              },
              {
                title: t("case.4.t"),
                description: t("case.4.d"),
                result: t("case.4.r")
              }
            ].map((caseItem, idx) => (
              <Card key={idx} className="p-6 bg-dark border border-primary-500/20 hover:border-primary-500/50">
                <h3 className="text-xl font-bold text-white mb-3">{caseItem.title}</h3>
                <p className="text-white/70 mb-4">{caseItem.description}</p>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span className="text-primary-500 font-semibold">{caseItem.result}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-900/30 via-primary-500/20 to-primary-900/30 border-y border-primary-500/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-6">
            {t("about.ctaTitle")}
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {t("about.ctaText")}
          </p>
          <NavLink to="/contacts#form">
            <Button size="lg">
              {t("home.bookDiagnostics")}
            </Button>
          </NavLink>
        </div>
      </section>
    </div>
  );
}
