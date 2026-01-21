import { NavLink } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useI18n } from "../i18n/useI18n";

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-9xl font-black text-primary-500 mb-6 animate-fade-in">
            404
          </div>
          <h1 className="text-4xl font-black text-white mb-4 animate-slide-up">
            {t("404.title")}
          </h1>
          <p className="text-xl text-white/70 mb-8 animate-slide-up">
            {t("404.text")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-slide-up">
            <NavLink to="/">
              <Button size="lg">
                <Home className="w-5 h-5" />
                {t("404.home")}
              </Button>
            </NavLink>
            <button onClick={() => window.history.back()}>
              <Button size="lg" variant="outline">
                <ArrowLeft className="w-5 h-5" />
                {t("404.back")}
              </Button>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
