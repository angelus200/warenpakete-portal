import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ClipboardList, Package, ShoppingCart, CreditCard, CheckCircle, Calendar, Banknote, Zap } from 'lucide-react';

export const metadata = {
  title: 'Verkauf auf Kommission | E-Commerce Business',
  description:
    'Als E-Commerce Dienstleister auf Kommissionsbasis verkaufen — Kommissionshandel im DACH-Raum, nur für Gewerbetreibende.',
};

const ablauf = [
  {
    nr: 1,
    icon: ClipboardList,
    titel: 'Bewerbung einreichen',
    text: 'Kurzes Profil: Ihre Kanäle, Reichweite, Erfahrung. Die Bewerbung wird geprüft — Rückmeldung innerhalb von 48 Stunden.',
  },
  {
    nr: 2,
    icon: Package,
    titel: 'Sortiment erhalten',
    text: 'Über die Plattform stehen geprüfte Markenprodukte für Ihre Kanäle bereit — abgestimmt auf Ihre Zielgruppe und Plattform.',
  },
  {
    nr: 3,
    icon: ShoppingCart,
    titel: 'Verkauf abwickeln',
    text: 'Sie listen, verkaufen und betreuen den Kundenkontakt. Produktdaten und Bildmaterial stehen über das Dienstleister-Dashboard bereit.',
  },
  {
    nr: 4,
    icon: CreditCard,
    titel: 'Kommission erhalten',
    text: 'Monatliche Abrechnung nach tatsächlichen Verkäufen. Transparente Abrechnung, pünktliche Zahlung.',
  },
];

const voraussetzungen = [
  { icon: CheckCircle, text: 'Aktiver E-Commerce-Kanal (Amazon, eBay, eigener Shop, etc.)' },
  { icon: CheckCircle, text: 'Gewerbeschein erforderlich' },
  { icon: CheckCircle, text: 'Nachweisbare Verkaufserfahrung' },
  { icon: CheckCircle, text: 'Bereitschaft zur transparenten Reporting-Pflicht' },
];

const kommissionsDetails = [
  { icon: Banknote, label: 'Kommissionssatz', wert: 'Individuell nach Kanal und Volumen' },
  { icon: Calendar, label: 'Abrechnung', wert: 'Monatlich' },
  { icon: CreditCard, label: 'Auszahlung', wert: 'Nach Zahlungseingang beim Käufer' },
  { icon: Zap, label: 'Vorabkosten', wert: 'Keine' },
];

export default function VerkaufskommissionPage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative overflow-hidden py-28 md:py-40 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10">
              <span className="text-[#D4AF37] text-sm font-bold tracking-wider">
                🤝 KOMMISSIONSVERKAUF IM DACH-RAUM
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#B8960C] bg-clip-text text-transparent leading-tight">
              Als E-Commerce Dienstleister auf Kommission verkaufen
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
              Werden Sie Kommissions-Dienstleister —{' '}
              <span className="text-[#D4AF37] font-semibold">Geprüfte Markenprodukte stehen bereit</span>,
              Sie liefern Reichweite.
            </p>

            <Link href="/kontakt">
              <Button
                size="lg"
                className="text-lg px-8 py-7 bg-gradient-to-r from-[#B8960C] via-[#D4AF37] to-[#FFD700] hover:from-[#A07800] hover:via-[#B8960C] hover:to-[#D4AF37] text-black font-bold shadow-2xl shadow-[#D4AF37]/30"
              >
                Jetzt als Dienstleister bewerben
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Das Modell */}
      <section className="py-24 bg-[#f5f5f0]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Das <span className="text-[#D4AF37]">Modell</span>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed bg-white p-8 rounded-2xl border-2 border-[#D4AF37]/20 shadow-sm">
              Über die Plattform stehen geprüfte Markenprodukte bereit. Sie übernehmen den Verkauf über Ihre Kanäle.
              Nach erfolgreichem Verkauf erhalten Sie Ihre Kommission —
              <strong> transparent und pünktlich abgerechnet</strong>.
              Die Abwicklung erfolgt auf Basis eines Kommissionsvertrags nach geltendem Recht im jeweiligen Land (§383 HGB in Deutschland, §383 UGB in Österreich, Art. 425 OR in der Schweiz).
            </p>
          </div>
        </div>
      </section>

      {/* Plattformgebühren */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-4">
              Plattformgebühren
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transparente <span className="text-[#D4AF37]">Konditionen für Dienstleister</span>
            </h2>
          </div>

          <div className="max-w-sm mx-auto">
            <div className="rounded-2xl border-2 border-[#D4AF37] bg-white p-8 shadow-lg shadow-[#D4AF37]/10">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Kommissions-Dienstleister</h3>

              <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-gray-900">499 €</div>
                  <div className="text-sm text-gray-500 mt-0.5">Einmaliges Onboarding</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-gray-800">49,90 € <span className="text-gray-500 font-normal text-sm">/ Monat</span></div>
                  <div className="text-sm text-gray-500 mt-0.5">Monatliche Plattformgebühr</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-gray-800">2% <span className="text-gray-500 font-normal text-sm">vom Umsatz</span></div>
                  <div className="text-sm text-gray-500 mt-0.5">Laufende Provision auf Verkaufserlöse</div>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Onboarding & Einrichtung',
                  'Zugang zum Dienstleister-Dashboard',
                  'Produktdaten & Bildmaterial',
                  'Transparente Verkaufsabrechnung',
                  'Support via Dashboard-Chat',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#cta-bewerben"
                className="block text-center py-3 rounded-xl bg-gradient-to-r from-[#B8960C] via-[#D4AF37] to-[#FFD700] hover:from-[#A07800] hover:via-[#B8960C] hover:to-[#D4AF37] text-black font-bold text-sm transition-all shadow-md"
              >
                Jetzt als Dienstleister bewerben
              </a>
            </div>

            <div className="mt-6 text-center space-y-1.5">
              <p className="text-xs text-gray-400">Alle Preise zzgl. gesetzlicher MwSt.</p>
              <p className="text-xs text-gray-400">2% auf Netto-Verkaufserlös, monatlich abgerechnet.</p>
              <p className="text-xs text-gray-400">Nur für Gewerbetreibende mit gültigem Gewerbeschein.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ablauf */}
      <section className="py-24 bg-[#f5f5f0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Der <span className="text-[#D4AF37]">Ablauf</span>
            </h2>
            <p className="text-lg text-gray-600">Von der Bewerbung zur ersten Abrechnung</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {ablauf.map(({ nr, icon: Icon, titel, text }) => (
              <Card key={nr} className="p-8 bg-white border-2 border-gray-200 hover:border-[#D4AF37] hover:shadow-xl transition-all relative">
                <div className="absolute -top-5 left-6 w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#B8960C] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-black font-bold">{nr}</span>
                </div>
                <div className="mt-4 mb-4">
                  <Icon className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{titel}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Voraussetzungen & Kommissionsstruktur */}
      <section className="py-24 bg-[#f5f5f0]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

            {/* Voraussetzungen */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                <span className="text-[#D4AF37]">Voraussetzungen</span>
              </h2>
              <div className="space-y-4">
                {voraussetzungen.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 bg-white hover:border-[#D4AF37]/40 transition-colors">
                    <Icon className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kommissionsstruktur */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                <span className="text-[#D4AF37]">Kommissionsstruktur</span>
              </h2>
              <div className="space-y-4">
                {kommissionsDetails.map(({ icon: Icon, label, wert }) => (
                  <div key={label} className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 bg-white">
                    <Icon className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">{label}</p>
                      <p className="text-gray-800 font-semibold">{wert}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta-bewerben" className="py-24 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
            Bereit als <span className="text-[#D4AF37]">Dienstleister</span> zu starten?
          </h2>
          <p className="text-gray-400 mb-10 text-lg">Bewerben Sie sich jetzt — Rückmeldung innerhalb von 48 Stunden.</p>
          <Link href="/kontakt">
            <Button
              size="lg"
              className="text-lg px-8 py-7 bg-gradient-to-r from-[#B8960C] via-[#D4AF37] to-[#FFD700] hover:from-[#A07800] hover:via-[#B8960C] hover:to-[#D4AF37] text-black font-bold shadow-2xl shadow-[#D4AF37]/30"
            >
              Jetzt als Dienstleister bewerben
            </Button>
          </Link>
        </div>
      </section>

      {/* Rechtlicher Hinweis */}
      <section className="py-8 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            Kommissionshandel nach anwendbarem Recht im jeweiligen Land (§383 HGB/§383 UGB/Art. 425 OR). Nur für Gewerbetreibende mit gültigem Gewerbeschein.
            Es handelt sich um eine Dienstleistungsbeziehung, kein Arbeitsverhältnis.
          </p>
        </div>
      </section>

    </div>
  );
}
