import { NavLink } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useI18n } from "../i18n/useI18n";
import { heroSources } from "../lib/images";
import { TechLines } from "../components/TechLines";

type LText = { cs: string; uk: string };
type PriceRow = { name: LText; price: string; duration?: LText };
type PriceTable = { title: LText; rows: PriceRow[]; note?: LText };
type PriceSection = { id: string; title: LText; lead?: LText; blocks: Array<PriceTable | { note: LText }> };

function lt(v: LText, lang: "cs" | "uk") {
  return lang === "cs" ? v.cs : v.uk;
}

function NoteBlock({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70 leading-relaxed">
      {text}
    </div>
  );
}

function PriceTableBlock({ lang, table }: { lang: "cs" | "uk"; table: PriceTable }) {
  return (
    <Card className="overflow-hidden bg-dark border border-primary-500/20">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
        <div className="text-base font-black text-white">{lt(table.title, lang)}</div>
      </div>
      <div className="divide-y divide-white/10">
        {table.rows.map((r, idx) => (
          <div key={idx} className="grid gap-2 px-6 py-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="font-semibold text-white/90">{lt(r.name, lang)}</div>
              {r.duration ? <div className="mt-1 text-xs text-white/50">{lt(r.duration, lang)}</div> : null}
            </div>
            <div className="text-lg font-black text-primary-400 md:text-right">{r.price}</div>
          </div>
        ))}
      </div>
      {table.note ? (
        <div className="border-t border-white/10 px-6 py-4 text-sm text-white/60">{lt(table.note, lang)}</div>
      ) : null}
    </Card>
  );
}

const sections: PriceSection[] = [
  {
    id: "tires",
    title: { cs: "Ceník: Pneuservis", uk: "Прайс-лист: Шиномонтаж" },
    lead: {
      cs: "Ceny jsou uvedeny za sadu 4 kol. Bez DPH / +21% DPH.",
      uk: "Ціни вказані за комплект із 4 коліс. Без ПДВ / +21% DPH."
    },
    blocks: [
      {
        title: { cs: "Osobní auta (13–15\")", uk: "Легкові авто (13\"–15\")" },
        rows: [
          { name: { cs: "Kompletní výměna pneu + vyvážení", uk: "Повна заміна шин + балансування" }, price: "1 089 Kč" },
          { name: { cs: "Demontáž/montáž + vyvážení", uk: "Розбір/збір коліс + балансування" }, price: "726 Kč" },
          { name: { cs: "Sezónní uskladnění pneumatik", uk: "Сезонне зберігання шин" }, price: "968 Kč" },
          { name: { cs: "Likvidace pneumatik (1 ks)", uk: "Утилізація шин (1 шт.)" }, price: "45 Kč" }
        ]
      },
      {
        title: { cs: "Osobní auta (16–18\")", uk: "Легкові авто (16\"–18\")" },
        rows: [
          { name: { cs: "Kompletní výměna pneu + vyvážení", uk: "Повна заміна шин + балансування" }, price: "1 210 Kč" },
          { name: { cs: "Demontáž/montáž + vyvážení", uk: "Розбір/збір коліс + балансування" }, price: "995 Kč" },
          { name: { cs: "Sezónní uskladnění pneumatik", uk: "Сезонне зберігання шин" }, price: "968 Kč" },
          { name: { cs: "Likvidace pneumatik (1 ks)", uk: "Утилізація шин (1 шт.)" }, price: "45 Kč" }
        ]
      },
      {
        title: { cs: "Osobní auta (19–23\")", uk: "Легкові авто (19\"–23\")" },
        rows: [
          { name: { cs: "Kompletní výměna pneu + vyvážení", uk: "Повна заміна шин + балансування" }, price: "1 694 Kč" },
          { name: { cs: "Demontáž/montáž + vyvážení", uk: "Розбір/збір коліс + балансування" }, price: "1 210 Kč" },
          { name: { cs: "Sezónní uskladnění pneumatik", uk: "Сезонне зберігання шин" }, price: "968 Kč" },
          { name: { cs: "Likvidace pneumatik (1 ks)", uk: "Утилізація шин (1 шт.)" }, price: "45 Kč" }
        ]
      },
      {
        title: { cs: "SUV / 4×4 (13–15\")", uk: "SUV / 4×4 (13\"–15\")" },
        rows: [
          { name: { cs: "Kompletní výměna pneu + vyvážení", uk: "Повна заміна шин + балансування" }, price: "1 295 Kč" },
          { name: { cs: "Demontáž/montáž + vyvážení", uk: "Розбір/збір коліс + балансування" }, price: "1 095 Kč" },
          { name: { cs: "Sezónní uskladnění pneumatik", uk: "Сезонне зберігання шин" }, price: "968 Kč" },
          { name: { cs: "Likvidace pneumatik (1 ks)", uk: "Утилізація шин (1 шт.)" }, price: "45 Kč" }
        ]
      },
      {
        title: { cs: "SUV / 4×4 (16–18\")", uk: "SUV / 4×4 (16\"–18\")" },
        rows: [
          { name: { cs: "Kompletní výměna pneu + vyvážení", uk: "Повна заміна шин + балансування" }, price: "1 595 Kč" },
          { name: { cs: "Demontáž/montáž + vyvážení", uk: "Розбір/збір коліс + балансування" }, price: "1 295 Kč" },
          { name: { cs: "Sezónní uskladnění pneumatik", uk: "Сезонне зберігання шин" }, price: "968 Kč" },
          { name: { cs: "Likvidace pneumatik (1 ks)", uk: "Утилізація шин (1 шт.)" }, price: "45 Kč" }
        ]
      },
      {
        title: { cs: "SUV / 4×4 (19–23\")", uk: "SUV / 4×4 (19\"–23\")" },
        rows: [
          { name: { cs: "Kompletní výměna pneu + vyvážení", uk: "Повна заміна шин + балансування" }, price: "2 178 Kč" },
          { name: { cs: "Demontáž/montáž + vyvážení", uk: "Розбір/збір коліс + балансування" }, price: "1 495 Kč" },
          { name: { cs: "Sezónní uskladnění pneumatik", uk: "Сезонне зберігання шин" }, price: "968 Kč" },
          { name: { cs: "Likvidace pneumatik (1 ks)", uk: "Утилізація шин (1 шт.)" }, price: "45 Kč" }
        ]
      },
      {
        title: { cs: "RUNFLAT (13–15\")", uk: "RUNFLAT (13\"–15\")" },
        rows: [
          { name: { cs: "Kompletní výměna pneu + vyvážení", uk: "Повна заміна шин + балансування" }, price: "1 295 Kč" },
          { name: { cs: "Demontáž/montáž + vyvážení", uk: "Розбір/збір коліс + балансування" }, price: "1 095 Kč" },
          { name: { cs: "Sezónní uskladnění pneumatik", uk: "Сезонне зберігання шин" }, price: "1 210 Kč" },
          { name: { cs: "Likvidace pneumatik (1 ks)", uk: "Утилізація шин (1 шт.)" }, price: "45 Kč" }
        ]
      },
      {
        title: { cs: "RUNFLAT (16–18\")", uk: "RUNFLAT (16\"–18\")" },
        rows: [
          { name: { cs: "Kompletní výměna pneu + vyvážení", uk: "Повна заміна шин + балансування" }, price: "1 595 Kč" },
          { name: { cs: "Demontáž/montáž + vyvážení", uk: "Розбір/збір коліс + балансування" }, price: "1 295 Kč" },
          { name: { cs: "Sezónní uskladnění pneumatik", uk: "Сезонне зберігання шин" }, price: "1 210 Kč" },
          { name: { cs: "Likvidace pneumatik (1 ks)", uk: "Утилізація шин (1 шт.)" }, price: "45 Kč" }
        ]
      },
      {
        title: { cs: "RUNFLAT (19–23\")", uk: "RUNFLAT (19\"–23\")" },
        rows: [
          { name: { cs: "Kompletní výměna pneu + vyvážení", uk: "Повна заміна шин + балансування" }, price: "2 195 Kč" },
          { name: { cs: "Demontáž/montáž + vyvážení", uk: "Розбір/збір коліс + балансування" }, price: "1 495 Kč" },
          { name: { cs: "Sezónní uskladnění pneumatik", uk: "Сезонне зберігання шин" }, price: "1 210 Kč" },
          { name: { cs: "Likvidace pneumatik (1 ks)", uk: "Утилізація шин (1 шт.)" }, price: "45 Kč" }
        ]
      },
      {
        title: { cs: "Oprava pneumatik", uk: "Ремонт шин" },
        rows: [
          { name: { cs: "Oprava defektu bezdušové pneu", uk: "Ремонт проколу безкамерної шини" }, price: "345 Kč" },
          { name: { cs: "Závaží po nárazu (1 g)", uk: "Балансувальний грузик після удару (1 г)" }, price: "2 Kč" },
          { name: { cs: "Lepicí závaží (1 g)", uk: "Клейкий грузик (1 г)" }, price: "2,5 Kč" }
        ],
        note: {
          cs: "V ceně jsou závaží do 100 g na sadu. Ceny jsou bez DPH (+21%). Pro RUNFLAT může být příplatek za složitost.",
          uk: "У вартість включені грузики до 100 г на комплект. Ціни без ПДВ (+21%). Для RUNFLAT можлива доплата за складність."
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
            duration: { cs: "60 min", uk: "60 хв" },
            price: "968 Kč"
          },
          {
            name: { cs: "Kontrola úniků + diagnostika", uk: "Перевірка на витоки + діагностика" },
            duration: { cs: "60 min", uk: "60 хв" },
            price: "995 Kč"
          },
          {
            name: { cs: "Dezinfekce klimatizace", uk: "Дезінфекція кондиціонера" },
            duration: { cs: "30 min", uk: "30 хв" },
            price: "695 Kč"
          },
          {
            name: { cs: "Komplexní dezinfekce systému", uk: "Комплексна дезінфекція системи" },
            duration: { cs: "45 min", uk: "45 хв" },
            price: "995 Kč"
          }
        ],
        note: {
          cs: "Cena chladiva: R134a — 3 Kč/g, R1234yf — 7 Kč/g. Ceny bez DPH (+21%).",
          uk: "Вартість холодоагенту: R134a — 3 Kč/г, R1234yf — 7 Kč/г. Ціни без ПДВ (+21%)."
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
            duration: { cs: "30 min", uk: "30 хв" },
            price: "995 Kč"
          },
          {
            name: { cs: "Práce autoelektrikáře", uk: "Робота автоелектрика" },
            duration: { cs: "60 min", uk: "60 хв" },
            price: "1 195 Kč"
          }
        ],
        note: {
          cs: "Ceny jsou bez DPH (+21%).",
          uk: "Ціни без ПДВ (+21%)."
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
            duration: { cs: "45 min", uk: "45 хв" },
            price: "695 Kč"
          },
          {
            name: { cs: "Výměna oleje (vlastní olej + filtr)", uk: "Заміна масла (своє масло + фільтр)" },
            duration: { cs: "45 min", uk: "45 хв" },
            price: "1 210 Kč"
          },
          {
            name: { cs: "Výměna brzdových destiček (1 náprava)", uk: "Заміна гальмівних колодок (1 вісь)" },
            duration: { cs: "45 min", uk: "45 хв" },
            price: "795 Kč"
          },
          {
            name: { cs: "Výměna brzdového kotouče (1 náprava)", uk: "Заміна гальмівного диска (1 вісь)" },
            duration: { cs: "60 min", uk: "60 хв" },
            price: "995 Kč"
          },
          {
            name: { cs: "Výměna brzdové kapaliny", uk: "Заміна гальмівної рідини" },
            duration: { cs: "45 min", uk: "45 хв" },
            price: "795 Kč"
          },
          {
            name: { cs: "Kotouče + destičky (1 náprava)", uk: "Диски + колодки (1 вісь)" },
            duration: { cs: "45 min", uk: "45 хв" },
            price: "1 815 Kč"
          },
          {
            name: { cs: "Kotouče + destičky (vlastní díly)", uk: "Диски + колодки (свої запчастини)" },
            duration: { cs: "45 min", uk: "45 хв" },
            price: "2 662 Kč"
          }
        ],
        note: {
          cs: "Ceny jsou bez DPH (+21%). Konečná cena se domlouvá před zahájením prací.",
          uk: "Ціни без ПДВ (+21%). Остаточна ціна узгоджується до початку робіт."
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
            duration: { cs: "45 min", uk: "45 хв" },
            price: "605 Kč"
          },
          {
            name: { cs: "Geometrie (osobní auto)", uk: "Геометрія (легкові авто)" },
            duration: { cs: "1 h", uk: "1 год" },
            price: "1 500 Kč"
          },
          {
            name: { cs: "Geometrie (SUV / užitkové)", uk: "Геометрія (комтранс / SUV)" },
            duration: { cs: "1,5 h", uk: "1,5 год" },
            price: "1 995 Kč"
          }
        ],
        note: {
          cs: "Ceny jsou bez DPH (+21%).",
          uk: "Ціни без ПДВ (+21%)."
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
          cs: "Ceny jsou bez DPH (+21%). Cena se může měnit dle složitosti.",
          uk: "Ціни без ПДВ (+21%). Вартість може змінюватися залежно від складності."
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
      <section className="relative overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/80 to-dark/85" />
        </div>
        <div className="relative z-10 min-h-[220px] md:min-h-[260px] lg:min-h-[300px]" />
      </section>

      <section className="relative py-20 bg-dark-50 overflow-hidden">
        <TechLines />
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white">
              {t("prices.titleA")} <span className="text-primary-500">{t("prices.titleB")}</span>
            </h1>
            <p className="mt-3 text-white/70">{t("prices.lead")}</p>
          </div>

          {/* Quick navigation */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {quick.map((q) => (
              <a
                key={q.id}
                href={`#${q.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-primary-500/25 bg-dark px-4 py-2 text-sm font-semibold text-white/80 hover:text-white hover:border-primary-500/50 hover:bg-primary-500/10"
              >
                {q.title}
                <ChevronRight className="h-4 w-4 text-primary-500/70" />
              </a>
            ))}
          </div>

          <div className="grid gap-10 max-w-5xl mx-auto">
            {sections.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-24">
                <div className="mb-4">
                  <div className="text-2xl md:text-3xl font-black text-white">
                    {lt(s.title, lang)}
                  </div>
                  {s.lead ? <div className="mt-2 text-white/60">{lt(s.lead, lang)}</div> : null}
                </div>

                <div className="grid gap-4">
                  {s.blocks.map((b, idx) => {
                    if ("rows" in b) return <PriceTableBlock key={idx} lang={lang} table={b} />;
                    return <NoteBlock key={idx} text={lt(b.note, lang)} />;
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 text-center">
            <div className="mx-auto max-w-3xl rounded-2xl border border-primary-500/20 bg-dark p-8">
              <div className="text-2xl md:text-3xl font-black text-white">{t("prices.ctaTitle")}</div>
              <div className="mt-2 text-white/70">{t("prices.ctaText")}</div>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <NavLink to="/contacts#form">
                  <Button size="lg" className="group">
                    {t("prices.ctaBtn")}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </NavLink>
                <NavLink to="/services">
                  <Button size="lg" variant="outline">
                    {t("prices.backToServices")}
                  </Button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


