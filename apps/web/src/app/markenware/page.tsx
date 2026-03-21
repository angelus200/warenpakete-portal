import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, ShoppingBag, Truck, Store, Package, FileText, BarChart3, Users } from 'lucide-react';

export const metadata = {
  title: 'Markenware zu Großhandelspreisen | E-Commerce Business',
  description:
    'Geprüfte Markensortimente direkt für Ihren Handel — kein Sourcing-Aufwand, direkte B2B-Abwicklung.',
};

const schritte = [
  {
    nr: 1,
    icon: ShoppingBag,
    titel: 'Sortiment auswählen',
    text: 'Aus kuratierten Markensortimenten das passende für Ihren Kanal wählen — mit transparenter Verkaufshistorie.',
  },
  {
    nr: 2,
    icon: Truck,
    titel: 'Zu Großhandelskonditionen beziehen',
    text: 'Direkte Abwicklung über Trademark24-7 AG, keine Zwischenhändler, vollständige Rechnungslegung.',
  },
  {
    nr: 3,
    icon: Store,
    titel: 'Über eigene Kanäle verkaufen',
    text: 'Amazon, eBay, eigener Shop oder stationär — Sie entscheiden. Wir liefern, Sie verkaufen.',
  },
];

const vorteile = [
  { icon: CheckCircle, text: 'Geprüfte Markenprodukte mit Verkaufshistorie' },
  { icon: BarChart3, text: 'Großhandelsrabatt gegenüber UVP' },
  { icon: Package, text: 'Kein Sourcing-Aufwand' },
  { icon: FileText, text: 'Flexible Sortimentsgröße ab €2.500' },
  { icon: CheckCircle, text: 'B2B-Abwicklung mit Rechnung' },
];

const zielgruppen = [
  { icon: Store, label: 'Online-Händler', detail: 'Amazon, eBay, Shopify' },
  { icon: ShoppingBag, label: 'Stationäre Einzelhändler', detail: 'Ladengeschäfte & Märkte' },
  { icon: Package, label: 'Gewerbetreibende mit Lagerkapazität', detail: 'B2B-Einkauf & Weiterverkauf' },
  { icon: Users, label: 'Importeure & Distributoren', detail: 'Großvolumen & Mengenrabatt' },
];

export default function MarkenwarePage() {
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
                🏷️ B2B GROSSHANDEL FÜR GEWERBETREIBENDE
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#B8960C] bg-clip-text text-transparent leading-tight">
              Markenware zu Großhandelspreisen
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
              Geprüfte Markensortimente direkt für Ihren Handel —{' '}
              <span className="text-[#D4AF37] font-semibold">kein Sourcing-Aufwand</span>,
              direkte B2B-Abwicklung.
            </p>

            <Link href="/kontakt">
              <Button
                size="lg"
                className="text-lg px-8 py-7 bg-gradient-to-r from-[#B8960C] via-[#D4AF37] to-[#FFD700] hover:from-[#A07800] hover:via-[#B8960C] hover:to-[#D4AF37] text-black font-bold shadow-2xl shadow-[#D4AF37]/30"
              >
                Jetzt Sortiment anfragen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Wie es funktioniert */}
      <section className="py-24 bg-[#f5f5f0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Wie es <span className="text-[#D4AF37]">funktioniert</span>
            </h2>
            <p className="text-lg text-gray-600">Drei Schritte zum eigenen Markenhandel</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {schritte.map(({ nr, icon: Icon, titel, text }) => (
              <Card key={nr} className="p-8 bg-white border-2 border-gray-200 hover:border-[#D4AF37] hover:shadow-xl transition-all relative">
                <div className="absolute -top-5 left-6 w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#B8960C] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-black font-bold">{nr}</span>
                </div>
                <div className="mt-4 mb-4">
                  <Icon className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{titel}</h3>
                <p className="text-gray-600 leading-relaxed">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ihre Vorteile */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ihre <span className="text-[#D4AF37]">Vorteile</span>
              </h2>
            </div>

            <div className="space-y-4">
              {vorteile.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4 p-5 rounded-xl border border-gray-100 bg-[#f9f9f6] hover:border-[#D4AF37]/40 transition-colors">
                  <Icon className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Für wen geeignet */}
      <section className="py-24 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              Für wen ist das <span className="text-[#D4AF37]">geeignet?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {zielgruppen.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="p-6 rounded-xl border border-[#D4AF37]/30 bg-black/20 backdrop-blur-sm text-center hover:border-[#D4AF37]/60 transition-colors">
                <Icon className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
                <p className="font-bold text-gray-100 mb-1">{label}</p>
                <p className="text-sm text-gray-400">{detail}</p>
              </div>
            ))}
          </div>

          {/* Dual CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-14">
            {/* Karte 1: Einkaufen */}
            <div className="p-8 rounded-2xl border-2 border-[#D4AF37]/40 bg-black/30 backdrop-blur-sm flex flex-col">
              <p className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase mb-3">Händler</p>
              <h3 className="text-xl font-bold text-gray-100 mb-3">Sie möchten einkaufen</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                Markenprodukte zu Großhandelspreisen beziehen und über eigene Kanäle verkaufen.
              </p>
              <Link href="/erstgespraech">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#B8960C] via-[#D4AF37] to-[#FFD700] hover:from-[#A07800] hover:via-[#B8960C] hover:to-[#D4AF37] text-black font-bold shadow-lg shadow-[#D4AF37]/20"
                >
                  Jetzt Sortiment anfragen
                </Button>
              </Link>
            </div>

            {/* Karte 2: Verkaufen */}
            <div className="p-8 rounded-2xl border-2 border-[#D4AF37]/40 bg-black/30 backdrop-blur-sm flex flex-col relative">
              <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-black text-xs font-bold">Neu</span>
              <p className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase mb-3">Dienstleister</p>
              <h3 className="text-xl font-bold text-gray-100 mb-3">Sie möchten verkaufen</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                Eigene Waren oder Markenprodukte über unsere Plattform und unser Netzwerk verkaufen lassen.
              </p>
              <Link href="/verkaufskommission">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-[#D4AF37] text-[#D4AF37] bg-transparent hover:bg-[#D4AF37]/10 font-bold"
                >
                  Als Verkäufer bewerben
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rechtlicher Hinweis */}
      <section className="py-8 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            Nur für Gewerbetreibende mit gültigem Gewerbeschein. Kein Endkundenverkauf.
            Alle Preise zzgl. gesetzlicher MwSt. Angebote freibleibend.
          </p>
        </div>
      </section>

    </div>
  );
}
