import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Phone, MapPin, Clock, Menu, X, Mail } from "lucide-react";
import { cn } from "../../lib/cn";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { useI18n } from "../../i18n/useI18n";

const nav = [
  { to: "/", key: "nav.home" },
  { to: "/services", key: "nav.services" },
  { to: "/about", key: "nav.about" },
  { to: "/contacts", key: "nav.contacts" }
];

export function Layout() {
  const location = useLocation();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const email = useMemo(() => "info@turboservis.cz", []);

  useEffect(() => {
    // hash navigation support: /contacts#form
    const hash = location.hash?.replace("#", "");
    if (!hash) return;
    const el = document.getElementById(hash);
    if (!el) return;
    // allow route render first
    window.setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    // close mobile menu on route change
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // lock scroll when menu open
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-dark to-dark-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-dark/95 backdrop-blur-lg border-b border-primary-500/20">
        <header className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="TURBOSERVIS" className="h-12 md:h-14 transition-transform group-hover:scale-105" />
            </NavLink>

            {/* Navigation */}
            <nav className="hidden items-center gap-1 lg:flex">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200",
                      "text-white/80 hover:text-white hover:bg-primary-500/10",
                      isActive && "text-primary-500 bg-primary-500/10"
                    )
                  }
                >
                  {t(item.key)}
                </NavLink>
              ))}
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-3">
              {/* language is always accessible (mobile too) */}
              <LanguageSwitcher />
              <a 
                href="tel:+77775887871" 
                className="hidden lg:flex items-center gap-2 px-4 py-2 text-white font-semibold hover:text-primary-500 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-lg">777-588-787</span>
              </a>

              {/* Mobile menu button */}
              <button
                type="button"
                className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary-500/20 bg-dark-50 text-white/80 hover:text-white hover:border-primary-500/40"
                aria-label="Menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <NavLink 
                to="/contacts#form"
                className="px-4 py-2 md:px-6 md:py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg shadow-lg hover:shadow-primary-500/50 transition-all duration-200 text-sm md:text-base"
              >
                {t("cta.book")}
              </NavLink>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 right-0 top-20 mx-4 rounded-2xl border border-primary-500/20 bg-dark-50 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.8)]">
            <div className="grid gap-2">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-xl px-4 py-3 text-base font-semibold transition",
                      isActive ? "bg-primary-500/15 text-primary-400" : "text-white/80 hover:bg-white/5 hover:text-white"
                    )
                  }
                >
                  {t(item.key)}
                </NavLink>
              ))}
            </div>

            <div className="mt-4 grid gap-2 rounded-xl border border-white/10 bg-dark p-4">
              <a className="flex items-center gap-2 text-white/80 hover:text-white" href="tel:+77775887871">
                <Phone className="h-4 w-4 text-primary-500" />
                777-588-787
              </a>
              <a className="flex items-center gap-2 text-white/80 hover:text-white" href={`mailto:${email}`}>
                <Mail className="h-4 w-4 text-primary-500" />
                {email}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-primary-500/20 bg-dark-50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* About */}
            <div>
              <img src="/logo.png" alt="TURBOSERVIS" className="h-12 mb-4" />
              <p className="text-sm text-white/60 leading-relaxed">
                {t("footer.about")}
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-white font-bold mb-4">{t("common.navigation")}</h3>
              <div className="grid gap-2">
                {nav.map((item) => (
                  <NavLink 
                    key={item.to} 
                    to={item.to}
                    className="text-sm text-white/70 hover:text-primary-500 transition-colors"
                  >
                    {t(item.key)}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Contacts */}
            <div>
              <h3 className="text-white font-bold mb-4">{t("common.contacts")}</h3>
              <div className="grid gap-3 text-sm">
                <a 
                  href="tel:+77775887871" 
                  className="flex items-center gap-2 text-white/70 hover:text-primary-500 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  777-588-787
                </a>
                <a 
                  href={`mailto:${email}`} 
                  className="text-white/70 hover:text-primary-500 transition-colors"
                >
                  {email}
                </a>
                <div className="flex items-start gap-2 text-white/60">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{t("contacts.addressText")}</span>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div>
              <h3 className="text-white font-bold mb-4">{t("common.openingHours")}</h3>
              <div className="grid gap-2 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{t("common.monFri")}</span>
                </div>
                <div className="ml-6">{t("common.sat")}</div>
                <div className="ml-6 text-white/50">{t("common.sunOff")}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/40">
            © {new Date().getFullYear()} TURBOSERVIS. {t("common.allRightsReserved")}
          </div>
        </div>
      </footer>
    </div>
  );
}
