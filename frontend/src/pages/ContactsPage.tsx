import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Card } from "../components/ui/Card";
import { LeadForm } from "../components/LeadForm";
import { useI18n } from "../i18n/useI18n";
import { heroImage } from "../lib/images";

export default function ContactsPage() {
  const { t, lang } = useI18n();
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage("contacts", lang)} alt="Contacts" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/80 to-dark/85" />
        </div>

        {/* No hero text overlay (requested): keep only the banner */}
        <div className="relative z-10 min-h-[220px] md:min-h-[260px] lg:min-h-[300px]" />
      </section>

      {/* Контактная информация */}
      <section className="py-20 bg-dark-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 bg-dark border border-primary-500/20 hover:border-primary-500/50 text-center">
              <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t("contacts.phone")}</h3>
              <a 
                href="tel:+77775887871" 
                className="text-primary-500 font-semibold text-xl hover:text-primary-400 transition-colors"
              >
                777-588-787
              </a>
              <p className="text-sm text-white/60 mt-2">{t("contacts.phoneHint")}</p>
            </Card>

            <Card className="p-6 bg-dark border border-primary-500/20 hover:border-primary-500/50 text-center">
              <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Email</h3>
              <a 
                href="mailto:info@turboservis.cz" 
                className="text-primary-500 hover:text-primary-400 transition-colors"
              >
                info@turboservis.cz
              </a>
              <p className="text-sm text-white/60 mt-2">{t("contacts.emailHint")}</p>
            </Card>

            <Card className="p-6 bg-dark border border-primary-500/20 hover:border-primary-500/50 text-center">
              <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t("contacts.address")}</h3>
              <p className="text-white/70">
                {t("contacts.addressText")}
              </p>
              <p className="text-sm text-white/60 mt-2">{t("contacts.parking")}</p>
            </Card>

            <Card className="p-6 bg-dark border border-primary-500/20 hover:border-primary-500/50 text-center">
              <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t("contacts.hours")}</h3>
              <p className="text-white/70">
                {t("common.monFri")}
                <br />
                {t("common.sat")}
              </p>
              <p className="text-sm text-white/60 mt-2">{t("common.sunOff")}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Форма заявки */}
      <section id="form" className="py-20 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-white mb-4">
                {t("contacts.formTitleA")} <span className="text-primary-500">{t("contacts.formTitleB")}</span>
              </h2>
              <p className="text-white/70 text-lg">
                {t("contacts.formLead")}
              </p>
            </div>

            <Card className="p-8 bg-dark border border-primary-500/20">
              <LeadForm />
            </Card>

            <div className="mt-8 text-center text-sm text-white/60">
              {t("contacts.privacyPrefix")}{" "}
              <a href="#" className="text-primary-500 hover:text-primary-400">
                {t("contacts.privacyLink")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Карта (placeholder) */}
      <section className="py-20 bg-dark-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">
              {t("contacts.findUsTitleA")} <span className="text-primary-500">{t("contacts.findUsTitleB")}</span>
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden bg-dark border border-primary-500/20">
              {/* Placeholder для карты */}
              <div className="h-96 bg-gradient-to-br from-primary-900/20 to-dark-50 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                  <p className="text-white/70 text-lg">
                    {t("contacts.addressText")}
                  </p>
                  <p className="text-white/50 text-sm mt-2">
                    {t("contacts.mapHint")}
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <Card className="p-6 bg-dark border border-primary-500/20 text-center">
                <div className="text-3xl font-bold text-primary-500 mb-2">{t("contacts.parking247")}</div>
                <p className="text-white/70">{t("contacts.parking247Hint")}</p>
              </Card>
              <Card className="p-6 bg-dark border border-primary-500/20 text-center">
                <div className="text-3xl font-bold text-primary-500 mb-2">{t("contacts.wifi")}</div>
                <p className="text-white/70">{t("contacts.wifiHint")}</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Соцсети */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-black text-white mb-6">
              {t("contacts.socialTitleA")} <span className="text-primary-500">{t("contacts.socialTitleB")}</span>
            </h2>
            <p className="text-white/70 mb-8">
              {t("contacts.socialLead")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: "Telegram", href: "#" },
                { name: "WhatsApp", href: "https://wa.me/77775887871" },
                { name: "Instagram*", href: "#" },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="px-6 py-3 bg-dark-50 border border-primary-500/20 hover:border-primary-500/50 rounded-lg text-white font-semibold transition-all hover:bg-primary-500/10"
                >
                  {social.name}
                </a>
              ))}
            </div>
            <p className="text-xs text-white/40 mt-4">
              {t("contacts.igNote")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
