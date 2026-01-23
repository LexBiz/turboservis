import { NavLink } from "react-router-dom";
import { ArrowRight, ChevronRight, Sparkles, TrendingUp, Award } from "lucide-react";
import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useI18n } from "../i18n/useI18n";
import { heroSources } from "../lib/images";
import { TechLines } from "../components/TechLines";

type LText = { cs: string; uk: string };
type PriceRow = { name: LText; price: string };
type PriceTable = { title: LText; rows: PriceRow[]; note?: LText };
type PriceSection = { id: string; title: LText; lead?: LText; blocks: Array<PriceTable | { note: LText }> };

function lt(v: LText, lang: "cs" | "uk") {
  return lang === "cs" ? v.cs : v.uk;
}

function NoteBlock({ text }: { text: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-500/5 to-transparent px-6 py-5 text-sm text-white/80 leading-relaxed hover:border-primary-500/40 transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-all" />
      <div className="relative flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
        <div>{text}</div>
      </div>
    </div>
  );
}

function PriceTableBlock({ lang, table }: { lang: "cs" | "uk"; table: PriceTable }) {
  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-dark via-dark to-dark/80 border border-primary-500/30 hover:border-primary-500/60 transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-all duration-700" />
      
      <div className="relative flex items-center justify-between gap-4 border-b border-primary-500/20 bg-gradient-to-r from-primary-500/10 to-transparent px-6 py-5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />
          <div className="text-lg font-black text-white tracking-tight">{lt(table.title, lang)}</div>
        </div>
        <TrendingUp className="w-5 h-5 text-primary-400/60" />
      </div>

      <div className="relative divide-y divide-white/5">
        {table.rows.map((r, idx) => (
          <div 
            key={idx} 
            className="grid gap-3 px-6 py-5 md:grid-cols-[1fr_auto] md:items-center hover:bg-primary-500/5 transition-all duration-300 group/row"
          >
            <div>
              <div className="font-semibold text-white/95 group-hover/row:text-white transition-colors">{lt(r.name, lang)}</div>
            </div>
            <div className="relative">
              <div className="text-2xl font-black bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent md:text-right group-hover/row:from-primary-300 group-hover/row:to-primary-200 transition-all">
                {r.price}
              </div>
            </div>
          </div>
        ))}
      </div>

      {table.note ? (
        <div className="relative border-t border-primary-500/10 bg-gradient-to-r from-primary-500/5 to-transparent px-6 py-4 text-sm text-white/70 backdrop-blur-sm">
          <div className="flex items-start gap-2">
            <Award className="w-4 h-4 text-primary-400/70 flex-shrink-0 mt-0.5" />
            <div>{lt(table.note, lang)}</div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

type TireKey = "car" | "suv" | "runflat";
type TireSizeKey = "13-15" | "16-18" | "19-23";
type TiresMatrix = Record<TireKey, Record<TireSizeKey, { full: string; mount: string; storage: string; disposal: string }>>;

const tiresMatrix: TiresMatrix = {
  car: {
    "13-15": { full: "1 089 Kč", mount: "726 Kč", storage: "968 Kč", disposal: "45 Kč / ks" },
    "16-18": { full: "1 210 Kč", mount: "995 Kč", storage: "968 Kč", disposal: "45 Kč / ks" },
    "19-23": { full: "1 694 Kč", mount: "1 210 Kč", storage: "968 Kč", disposal: "45 Kč / ks" }
  },
  suv: {
    "13-15": { full: "1 295 Kč", mount: "1 095 Kč", storage: "968 Kč", disposal: "45 Kč / ks" },
    "16-18": { full: "1 595 Kč", mount: "1 295 Kč", storage: "968 Kč", disposal: "45 Kč / ks" },
    "19-23": { full: "2 178 Kč", mount: "1 495 Kč", storage: "968 Kč", disposal: "45 Kč / ks" }
  },
  runflat: {
    "13-15": { full: "1 295 Kč", mount: "1 095 Kč", storage: "1 210 Kč", disposal: "45 Kč / ks" },
    "16-18": { full: "1 595 Kč", mount: "1 295 Kč", storage: "1 210 Kč", disposal: "45 Kč / ks" },
    "19-23": { full: "2 195 Kč", mount: "1 495 Kč", storage: "1 210 Kč", disposal: "45 Kč / ks" }
  }
};

function TiresPriceBlock({ lang }: { lang: "cs" | "uk" }) {
  const [tab, setTab] = useState<TireKey>("car");

  const tabs: Array<{ key: TireKey; label: LText }> = [
    { key: "car", label: { cs: "Osobní", uk: "Легкові" } },
    { key: "suv", label: { cs: "SUV / 4×4", uk: "SUV / 4×4" } },
    { key: "runflat", label: { cs: "RUNFLAT", uk: "RUNFLAT" } }
  ];

  const sizes: Array<{ key: TireSizeKey; label: string }> = [
    { key: "13-15", label: '13"–15"' },
    { key: "16-18", label: '16"–18"' },
    { key: "19-23", label: '19"–23"' }
  ];

  const rowLabels: Array<{ key: "full" | "mount" | "storage" | "disposal"; label: LText }> = [
    { key: "full", label: { cs: "Kompletní výměna pneu + vyvážení (4 kola)", uk: "Повна заміна шин + балансування (4 колеса)" } },
    { key: "mount", label: { cs: "Demontáž/montáž + vyvážení (4 kola)", uk: "Розбір/збір коліс + балансування (4 колеса)" } },
    { key: "storage", label: { cs: "Sezónní uskladnění", uk: "Сезонне зберігання шин" } },
    { key: "disposal", label: { cs: "Likvidace pneumatik", uk: "Утилізація шин" } }
  ];

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-dark via-dark to-dark/80 border border-primary-500/30 hover:border-primary-500/60 transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-all duration-700" />

      <div className="relative border-b border-primary-500/20 bg-gradient-to-r from-primary-500/10 to-transparent px-6 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />
            <div className="text-lg font-black text-white tracking-tight">
              {lang === "cs" ? "Ceny podle průměru disku" : "Ціни за діаметром диска"}
            </div>
          </div>

          <div className="inline-flex rounded-2xl border border-primary-500/25 bg-dark p-1">
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={[
                    "px-4 py-2 text-sm font-black rounded-xl transition-all",
                    active
                      ? "bg-primary-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.25)]"
                      : "text-white/70 hover:text-white hover:bg-primary-500/10"
                  ].join(" ")}
                >
                  {lt(t.label, lang)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative px-6 py-6">
        {/* Mobile: cards per diameter (no horizontal scroll) */}
        <div className="md:hidden grid gap-4">
          {sizes.map((s) => (
            <div
              key={s.key}
              className="overflow-hidden rounded-2xl border border-primary-500/20 bg-gradient-to-br from-dark via-dark to-primary-500/5"
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
                <div className="text-sm font-black text-white/80">{lang === "cs" ? "Průměr disku" : "Діаметр диска"}</div>
                <div className="text-base font-black bg-gradient-to-r from-primary-300 to-primary-200 bg-clip-text text-transparent">
                  {s.label}
                </div>
              </div>

              <div className="divide-y divide-white/10">
                {rowLabels.map((r) => {
                  const v = tiresMatrix[tab][s.key][r.key];
                  return (
                    <div key={r.key} className="px-5 py-4">
                      <div className="text-sm font-semibold text-white/90">{lt(r.label, lang)}</div>
                      <div className="mt-2 text-xl font-black bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                        {v}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-[720px] w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left">
                <th className="sticky left-0 z-10 bg-dark pr-4 pb-3 text-sm font-black text-white/80">
                  {lang === "cs" ? "Služba" : "Послуга"}
                </th>
                {sizes.map((s) => (
                  <th key={s.key} className="pb-3 px-3 text-center text-sm font-black text-primary-300">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowLabels.map((r) => (
                <tr key={r.key} className="group/row">
                  <td className="sticky left-0 z-10 bg-dark pr-4 py-4 align-top border-t border-white/10">
                    <div className="font-semibold text-white/95 group-hover/row:text-white">{lt(r.label, lang)}</div>
                  </td>
                  {sizes.map((s) => {
                    const v = tiresMatrix[tab][s.key][r.key];
                    return (
                      <td
                        key={s.key}
                        className="py-4 px-3 text-center border-t border-white/10 group-hover/row:bg-primary-500/5 transition-colors"
                      >
                        <div className="text-lg font-black bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                          {v}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-2xl border border-primary-500/20 bg-primary-500/5 px-5 py-4 text-sm text-white/70">
          {lang === "cs"
            ? "Ceny jsou za sadu 4 kol. Včetně DPH (21%). Pro RUNFLAT může být příplatek za složitost."
            : "Ціни за комплект із 4 коліс. З ПДВ (21%). Для RUNFLAT можлива доплата за складність."}
        </div>
      </div>
    </Card>
  );
}

const sections: PriceSection[] = [
  {
    id: "tires",
    title: { cs: "Ceník: Pneuservis", uk: "Прайс-лист: Шиномонтаж" },
    lead: {
      cs: "Ceny jsou uvedeny za sadu 4 kol. Včetně DPH (21%).",
      uk: "Ціни вказані за комплект із 4 коліс. З ПДВ (21%)."
    },
    blocks: [
      {
        title: { cs: "Oprava pneumatik", uk: "Ремонт шин" },
        rows: [
          { name: { cs: "Oprava defektu bezdušové pneu", uk: "Ремонт проколу безкамерної шини" }, price: "345 Kč" },
          { name: { cs: "Závaží po nárazu (1 g)", uk: "Балансувальний грузик після удару (1 г)" }, price: "2 Kč" },
          { name: { cs: "Lepicí závaží (1 g)", uk: "Клейкий грузик (1 г)" }, price: "2,5 Kč" }
        ],
        note: {
          cs: "V ceně jsou závaží do 100 g na sadu. Ceny jsou včetně DPH (21%). Pro RUNFLAT může být příplatek za složitost.",
          uk: "У вартість включені грузики до 100 г на комплект. Ціни з ПДВ (21%). Для RUNFLAT можлива доплата за складність."
        }
      }
    ]
  },
  {
    id: "ac",
    title: { cs: "Klimatizace (servis)", uk: "Кондиціонер (обслуговування)" },
    blocks: [
      {
        title: { cs: "Servis klimatizace", uk: "Послуги кондиціонера" },
        rows: [
          {
            name: { cs: "Pravidelný servis klimatizace", uk: "Планове ТО кондиціонера" },
            price: "968 Kč"
          },
          {
            name: { cs: "Kontrola úniků + diagnostika", uk: "Перевірка на витоки + діагностика" },
            price: "995 Kč"
          },
          {
            name: { cs: "Dezinfekce klimatizace", uk: "Дезінфекція кондиціонера" },
            price: "695 Kč"
          },
          {
            name: { cs: "Komplexní dezinfekce systému", uk: "Комплексна дезінфекція системи" },
            price: "995 Kč"
          }
        ],
        note: {
          cs: "Cena chladiva: R134a — 3 Kč/g, R1234yf — 7 Kč/g. Ceny jsou včetně DPH (21%).",
          uk: "Вартість холодоагенту: R134a — 3 Kč/г, R1234yf — 7 Kč/г. Ціни з ПДВ (21%)."
        }
      }
    ]
  },
  {
    id: "diagnostics",
    title: { cs: "Diagnostika & autoelektrika", uk: "Діагностика та автоелектрика" },
    blocks: [
      {
        title: { cs: "Diagnostika", uk: "Діагностика" },
        rows: [
          {
            name: { cs: "Komplexní diagnostika auta", uk: "Комплексна діагностика авто" },
            price: "995 Kč"
          },
          {
            name: { cs: "Práce autoelektrikáře", uk: "Робота автоелектрика" },
            price: "1 195 Kč"
          }
        ],
        note: {
          cs: "Ceny jsou včetně DPH (21%).",
          uk: "Ціни з ПДВ (21%)."
        }
      }
    ]
  },
  {
    id: "service",
    title: { cs: "Základní servisní práce", uk: "Основні сервісні роботи" },
    blocks: [
      {
        title: { cs: "Servis", uk: "Сервіс" },
        rows: [
          {
            name: { cs: "Výměna oleje (olej + filtr)", uk: "Заміна масла (масло + фільтр)" },
            price: "695 Kč"
          },
          {
            name: { cs: "Výměna oleje (vlastní olej + filtr)", uk: "Заміна масла (своє масло + фільтр)" },
            price: "1 210 Kč"
          },
          {
            name: { cs: "Výměna brzdových destiček (1 náprava)", uk: "Заміна гальмівних колодок (1 вісь)" },
            price: "795 Kč"
          },
          {
            name: { cs: "Výměna brzdového kotouče (1 náprava)", uk: "Заміна гальмівного диска (1 вісь)" },
            price: "995 Kč"
          },
          {
            name: { cs: "Výměna brzdové kapaliny", uk: "Заміна гальмівної рідини" },
            price: "795 Kč"
          },
          {
            name: { cs: "Kotouče + destičky (1 náprava)", uk: "Диски + колодки (1 вісь)" },
            price: "1 815 Kč"
          },
          {
            name: { cs: "Kotouče + destičky (vlastní díly)", uk: "Диски + колодки (свої запчастини)" },
            price: "2 662 Kč"
          }
        ],
        note: {
          cs: "Ceny jsou včetně DPH (21%). Konečná cena se domlouvá před zahájením prací.",
          uk: "Ціни з ПДВ (21%). Остаточна ціна узгоджується до початку робіт."
        }
      }
    ]
  },
  {
    id: "alignment",
    title: { cs: "Geometrie kol", uk: "Геометрія коліс" },
    blocks: [
      {
        title: { cs: "Geometrie", uk: "Геометрія" },
        rows: [
          {
            name: { cs: "Kontrola podvozku", uk: "Перевірка стану підвіски" },
            price: "605 Kč"
          },
          {
            name: { cs: "Geometrie (osobní auto)", uk: "Геометрія (легкові авто)" },
            price: "1 500 Kč"
          },
          {
            name: { cs: "Geometrie (SUV / užitkové)", uk: "Геометрія (комтранс / SUV)" },
            price: "1 995 Kč"
          }
        ],
        note: {
          cs: "Ceny jsou včetně DPH (21%).",
          uk: "Ціни з ПДВ (21%)."
        }
      }
    ]
  },
  {
    id: "mechanical",
    title: { cs: "Mechanické práce", uk: "Ремонт та механічні роботи" },
    blocks: [
      {
        title: { cs: "Práce", uk: "Роботи" },
        rows: [
          { name: { cs: "Hodina práce mechanika (od)", uk: "Година роботи механіка (від)" }, price: "od 895 Kč" },
          {
            name: { cs: "Hodina práce (vlastní díly) (od)", uk: "Година роботи (свої запчастини) (від)" },
            price: "od 1 295 Kč"
          },
          { name: { cs: "Čištění DPF (od)", uk: "Очищення DPF (від)" }, price: "od 3 630 Kč" }
        ],
        note: {
          cs: "Ceny jsou včetně DPH (21%). Cena se může měnit dle složitosti.",
          uk: "Ціни з ПДВ (21%). Вартість може змінюватися залежно від складності."
        }
      }
    ]
  },
  {
    id: "parts",
    title: { cs: "Výběr a výměna dílů", uk: "Підбір та заміна запчастин" },
    blocks: [
      {
        note: {
          cs: "Cena závisí na typu vozu a rozsahu prací. Napište nám nebo zavolejte — připravíme orientační rozpočet.",
          uk: "Ціна залежить від авто та обсягу робіт. Напишіть або зателефонуйте — підготуємо орієнтовний кошторис."
        }
      }
    ]
  },
  {
    id: "bodywork",
    title: { cs: "Karosářské práce a lakování", uk: "Кузовні роботи та фарбування" },
    blocks: [
      {
        note: {
          cs: "Karoserie a lakování se počítá individuálně (podle poškození a materiálů). Pošlete fotky — řekneme cenu.",
          uk: "Кузовний ремонт і фарбування — індивідуально (за пошкодженням та матеріалами). Надішліть фото — скажемо ціну."
        }
      }
    ]
  },
  {
    id: "crash",
    title: { cs: "Opravy po nehodě", uk: "Ремонт після ДТП" },
    blocks: [
      {
        note: {
          cs: "Cena závisí na poškození. Uděláme odhad po prohlídce nebo podle fotografií.",
          uk: "Ціна залежить від пошкоджень. Оцінка — після огляду або за фото."
        }
      }
    ]
  },
  {
    id: "injectors",
    title: { cs: "Vstřikovače", uk: "Форсунки" },
    blocks: [
      {
        note: {
          cs: "Cenu stanovíme po diagnostice a kontrole vstřikovačů.",
          uk: "Ціну визначимо після діагностики та перевірки форсунок."
        }
      }
    ]
  }
];

export default function PricesPage() {
  const { t, lang } = useI18n();

  const quick = sections.map((s) => ({ id: s.id, title: lt(s.title, lang) }));

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[400px] md:min-h-[480px] flex items-center">
        <div className="absolute inset-0">
          {(() => {
            const hero = heroSources("services", lang);
            return (
              <picture className="block h-full w-full">
                <source type="image/webp" srcSet={hero.webpSrcSet} sizes={hero.sizes} />
                <source type="image/jpeg" srcSet={hero.jpgSrcSet} sizes={hero.sizes} />
                <img src={hero.src} alt="Prices" className="h-full w-full object-cover object-center" decoding="async" />
              </picture>
            );
          })()}
          <div className="absolute inset-0 bg-gradient-to-r from-dark/98 via-dark/90 to-dark/85" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(16,185,129,0.15),transparent_60%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 backdrop-blur border border-primary-500/30 rounded-full text-primary-400 font-semibold text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              {lang === "cs" ? "Transparentní ceník" : "Прозорі ціни"}
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                {t("prices.titleA")}{" "}
              </span>
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-300 bg-clip-text text-transparent animate-pulse">
                {t("prices.titleB")}
              </span>
            </h1>
            
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              {t("prices.lead")}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <NavLink to="/contacts#form">
                <Button size="lg" className="text-lg group">
                  {lang === "cs" ? "Získat cenovou nabídku" : "Отримати кошторис"}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Декоративные элементы */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      </section>

      <section className="relative py-20 bg-gradient-to-b from-dark via-dark-50 to-dark overflow-hidden">
        <TechLines />
        
        {/* Декоративные элементы */}
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Quick navigation */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 text-sm font-bold text-primary-400 mb-3">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary-500" />
                {lang === "cs" ? "Rychlá navigace" : "Швидка навігація"}
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-primary-500" />
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {quick.map((q, idx) => (
                <a
                  key={q.id}
                  href={`#${q.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-primary-500/30 bg-gradient-to-br from-dark via-dark to-primary-500/5 px-5 py-3 text-sm font-bold text-white/90 hover:text-white hover:border-primary-500/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/10 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center gap-2">
                    <span>{q.title}</span>
                    <ChevronRight className="w-4 h-4 text-primary-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-16 max-w-5xl mx-auto">
            {sections.map((s, sectionIdx) => (
              <div 
                key={s.id} 
                id={s.id} 
                className="scroll-mt-24 animate-fade-in"
                style={{ animationDelay: `${sectionIdx * 100}ms` }}
              >
                <div className="mb-6 relative">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-12 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />
                      <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                        {lt(s.title, lang)}
                      </div>
                    </div>
                  </div>
                  {s.lead ? (
                    <div className="mt-3 text-white/70 text-lg pl-6 border-l-2 border-primary-500/30">
                      {lt(s.lead, lang)}
                    </div>
                  ) : null}
                  
                  {/* Декоративная линия */}
                  <div className="mt-6 h-px bg-gradient-to-r from-primary-500/50 via-primary-500/20 to-transparent" />
                </div>

                <div className="grid gap-5">
                  {s.id === "tires" ? <TiresPriceBlock lang={lang} /> : null}
                  {s.blocks.map((b, idx) => {
                    if ("rows" in b) return <PriceTableBlock key={idx} lang={lang} table={b} />;
                    return <NoteBlock key={idx} text={lt(b.note, lang)} />;
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <div className="relative mx-auto max-w-4xl rounded-3xl border border-primary-500/30 bg-gradient-to-br from-dark via-primary-500/5 to-dark p-12 overflow-hidden hover:border-primary-500/50 transition-all duration-500 group">
              {/* Декоративные элементы */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all duration-700" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all duration-700" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-400 font-bold text-sm mb-6">
                  <Sparkles className="w-4 h-4" />
                  {lang === "cs" ? "Získejte svoji nabídku" : "Отримайте свою пропозицію"}
                </div>
                
                <div className="text-3xl md:text-4xl font-black mb-4">
                  <span className="bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
                    {t("prices.ctaTitle")}
                  </span>
                </div>
                
                <div className="mt-4 text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                  {t("prices.ctaText")}
                </div>
                
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <NavLink to="/contacts#form">
                    <Button size="lg" className="group text-lg px-8 py-6 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                      {t("prices.ctaBtn")}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                    </Button>
                  </NavLink>
                  <NavLink to="/services">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 hover:bg-primary-500/10">
                      {t("prices.backToServices")}
                    </Button>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


