'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { Laptop, Home as HomeIcon, Shirt } from 'lucide-react';
import { ECommerceNewsTicker } from '@/components/ECommerceNewsTicker';
import VidyardLazyVideo from '@/components/VidyardLazyVideo';

export default function Home() {
  const { isSignedIn } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState<'single' | 'cashflow'>('single');

  // Einzelkauf Rechner State
  const [einkaufspreis, setEinkaufspreis] = useState(5000);
  const [marge, setMarge] = useState(40);

  // Berechnungen Einzelkauf
  const warenwert = einkaufspreis * 3;
  const verkaufserloes = warenwert * (1 - marge / 100);
  const ertragSelbst = verkaufserloes - einkaufspreis;
  const ertragKommission = (verkaufserloes - einkaufspreis) * 0.8;

  // Cashflow Rechner State
  const [monthlyBudget, setMonthlyBudget] = useState(3000);
  const [salesCycle, setSalesCycle] = useState(3);
  const [cashflowMargin, setCashflowMargin] = useState(40);

  // Berechnungen Cashflow
  const warenWertCashflow = monthlyBudget * 3;
  const verkaufsErloesCashflow = warenWertCashflow * (cashflowMargin / 100);
  const bruttoErtragCashflow = verkaufsErloesCashflow - monthlyBudget;
  const cashflowSelbst = bruttoErtragCashflow;
  const cashflowKommission = bruttoErtragCashflow * 0.8;

  return (
    <div className="flex flex-col">
      <ECommerceNewsTicker />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-28 md:py-40">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-ecommerce.jpg"
            alt=""
            fill
            className="object-cover"
          />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-[#f5f5f0]/85" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-3 px-4 py-2 rounded-full border-2 border-gold bg-gold/20">
              <span className="text-gold text-sm font-bold tracking-wider">
                NUR FÜR GEWERBETREIBENDE (B2B)
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-3 bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
              Bewährte Warenpakete
              <br />
              <span className="text-gray-900">zu Großhandelspreisen</span>
            </h1>

            <p className="text-xl md:text-lg text-gray-700 mb-5 leading-relaxed">
              Produkte die bereits erfolgreich auf <span className="text-gold font-semibold">Amazon, eBay & Online-Shops</span> verkauft werden
              <br />
              – jetzt zu B2B-Konditionen für Ihr Geschäft
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={isSignedIn ? '/products' : '/sign-up'}>
                <Button
                  size="lg"
                  className="text-lg px-5 py-7 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold shadow-2xl shadow-gold/30 border border-gold-light/20"
                >
                  {isSignedIn ? 'Warenpakete ansehen' : 'Jetzt registrieren'}
                </Button>
              </Link>
              <Link href="/erstgespraech">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-5 py-7 border-2 border-gold text-gold bg-white hover:bg-gold/10 font-bold shadow-xl"
                >
                  📞 Erstgespräch vereinbaren
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-light/5 rounded-full blur-3xl" />
      </section>

      {/* Bekannt aus Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Bekannt aus
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
            <a
              href="https://www.forbes.at/artikel/markenaufbau-im-amazon-zeitalter"
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-all duration-300"
            >
              <div className="relative w-32 h-16 md:w-40 md:h-20">
                <Image
                  src="/images/press/forbes.png"
                  alt="Forbes"
                  fill
                  className="object-contain transition-all duration-300 opacity-60 group-hover:opacity-100"
                />
              </div>
            </a>
            <a
              href="https://unternehmen.focus.de/amazon-markenaufbau.html"
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-all duration-300"
            >
              <div className="relative w-32 h-16 md:w-40 md:h-20">
                <Image
                  src="/images/press/focus.png"
                  alt="Focus"
                  fill
                  className="object-contain transition-all duration-300 opacity-60 group-hover:opacity-100"
                />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Erstgespräch CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#fffbeb] via-white to-[#fffbeb] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="p-10 md:p-12 bg-white border-2 border-gold/30 shadow-2xl shadow-gold/10">
              <div className="text-center">
                <div className="inline-block mb-4 px-4 py-2 rounded-full bg-gold/20 border border-gold/30">
                  <span className="text-gold text-sm font-bold tracking-wider">
                    KOSTENLOSE BERATUNG
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Persönliche <span className="text-gold">Beratung</span> gewünscht?
                </h2>

                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Vereinbaren Sie jetzt ein kostenloses Erstgespräch mit unseren E-Commerce Experten.
                  Wir besprechen Ihre individuellen Möglichkeiten und beantworten all Ihre Fragen.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30 Minuten persönlich</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>100% unverbindlich</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Keine Verpflichtungen</span>
                  </div>
                </div>

                <Link href="/erstgespraech">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-7 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold shadow-2xl shadow-gold/30"
                  >
                    📞 Jetzt Termin buchen
                  </Button>
                </Link>

                <p className="text-xs text-gray-500 mt-4">
                  In nur 3 Minuten Ihren Wunschtermin sichern
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* So funktioniert's Section */}
      <section className="py-24 bg-[#f5f5f0] relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-ecommerce.jpg"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#f5f5f0]/85" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              So <span className="text-gold">funktioniert&apos;s</span>
            </h2>
            <p className="text-gray-600 text-lg">
              In drei einfachen Schritten zum Warenhandel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 bg-white border-gray-300 hover:border-gold/40 hover:shadow-lg transition-all relative">
              <div className="absolute -top-4 left-6 w-12 h-12 bg-gradient-to-br from-gold-light to-gold rounded-full flex items-center justify-center shadow-lg">
                <span className="text-dark font-bold text-xl">1</span>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Warenpaket wählen
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Wähle aus Paketen mit Produkten die nachweislich gut auf Marktplätzen laufen. Detaillierte Verkaufshistorie einsehbar.
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white border-gray-300 hover:border-gold/40 hover:shadow-lg transition-all relative">
              <div className="absolute -top-4 left-6 w-12 h-12 bg-gradient-to-br from-gold-light to-gold rounded-full flex items-center justify-center shadow-lg">
                <span className="text-dark font-bold text-xl">2</span>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Verkaufsweg entscheiden
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Selbst über eigene Kanäle verkaufen oder per Kommissionsverkauf durch uns – du entscheidest flexibel.
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white border-gray-300 hover:border-gold/40 hover:shadow-lg transition-all relative">
              <div className="absolute -top-4 left-6 w-12 h-12 bg-gradient-to-br from-gold-light to-gold rounded-full flex items-center justify-center shadow-lg">
                <span className="text-dark font-bold text-xl">3</span>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Verkaufserlös erhalten
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Nach Verkauf der Waren erhältst du den Erlös (abzüglich Kommission falls gewählt). Transparente Abrechnung.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Erklärvideo Section */}
      <section className="py-20 bg-gradient-to-br from-[#2a2a2a] via-[#1f1f1f] to-[#2a2a2a] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              Sehen Sie <span className="text-gold">wie es funktioniert</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              In diesem kurzen Video erklären wir Ihnen den gesamten Ablauf – von der Auswahl bis zum Verkaufserlös
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <VidyardLazyVideo
              videoId="R5YaUYnT8eP2y3YTjZ7gFW"
              thumbnailUrl="https://play.vidyard.com/R5YaUYnT8eP2y3YTjZ7gFW.jpg"
              className="border-2 border-gold/30 rounded-2xl overflow-hidden shadow-2xl shadow-gold/10"
            />
          </div>
        </div>
      </section>

      {/* Ertragsrechner Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#2a2a2a] via-[#1f1f1f] to-[#2a2a2a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="border-2 border-gold/30 rounded-2xl p-8 md:p-12 bg-black/20 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                <span className="text-gold">Ertragsrechner</span>
              </h2>
              <p className="text-gray-400 text-lg">
                {activeTab === 'single'
                  ? 'Berechnen Sie Ihr mögliches Verkaufspotenzial'
                  : 'Berechnen Sie Ihren möglichen monatlichen Rückfluss'
                }
              </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-12">
              <button
                onClick={() => setActiveTab('single')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'single'
                    ? 'bg-gold text-dark'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Einzelkauf
              </button>
              <button
                onClick={() => setActiveTab('cashflow')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'cashflow'
                    ? 'bg-gold text-dark'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Monatlicher Cashflow
              </button>
            </div>

            <div className="max-w-5xl mx-auto">
            {activeTab === 'single' && (
              <>
            {/* Eingabefelder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Einkaufspreis */}
              <Card className="p-6 bg-white/5 border-gold/20 backdrop-blur">
                <label className="block text-gray-200 font-semibold mb-4">
                  Einkaufspreis (€)
                </label>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="500"
                  value={einkaufspreis}
                  onChange={(e) => setEinkaufspreis(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-400 text-sm">1.000 €</span>
                  <input
                    type="number"
                    value={einkaufspreis}
                    onChange={(e) => setEinkaufspreis(Number(e.target.value))}
                    className="w-32 px-3 py-2 bg-gray-800 text-gold text-center text-xl font-bold rounded border border-gold/30 focus:outline-none focus:border-gold"
                  />
                  <span className="text-gray-400 text-sm">50.000 €</span>
                </div>
              </Card>

              {/* Erwartete Marge */}
              <Card className="p-6 bg-white/5 border-gold/20 backdrop-blur">
                <label className="block text-gray-200 font-semibold mb-4">
                  Erwartete Marge (%)
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={marge}
                  onChange={(e) => setMarge(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-400 text-sm">10%</span>
                  <input
                    type="number"
                    value={marge}
                    onChange={(e) => setMarge(Number(e.target.value))}
                    className="w-32 px-3 py-2 bg-gray-800 text-gold text-center text-xl font-bold rounded border border-gold/30 focus:outline-none focus:border-gold"
                  />
                  <span className="text-gray-400 text-sm">100%</span>
                </div>
              </Card>
            </div>

            {/* Berechnete Werte */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="p-6 text-center bg-white/5 border-gold/20 backdrop-blur">
                <p className="text-gray-400 text-sm mb-2">Warenwert (Retail)</p>
                <p className="text-3xl font-bold text-gold">{warenwert.toLocaleString('de-DE')} €</p>
                <p className="text-xs text-gray-500 mt-2">Einkauf × 3</p>
              </Card>

              <Card className="p-6 text-center bg-white/5 border-gold/20 backdrop-blur">
                <p className="text-gray-400 text-sm mb-2">Erwarteter Verkaufserlös</p>
                <p className="text-3xl font-bold text-gold">{verkaufserloes.toLocaleString('de-DE')} €</p>
                <p className="text-xs text-gray-500 mt-2">Nach {marge}% Marge</p>
              </Card>

              <Card className="p-6 text-center bg-white/5 border-gold/20 backdrop-blur">
                <p className="text-gray-400 text-sm mb-2">Brutto-Ertrag</p>
                <p className="text-3xl font-bold text-gold">{ertragSelbst.toLocaleString('de-DE')} €</p>
                <p className="text-xs text-gray-500 mt-2">Erlös - Einkauf</p>
              </Card>
            </div>

            {/* Ergebnis Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Option A */}
              <Card className="p-8 bg-white border-2 border-gold/30 hover:border-gold transition-all shadow-xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-light to-gold rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Option A: Selbst verkaufen
                  </h3>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Ihr Ertrag</p>
                  <p className="text-5xl font-bold text-gold mb-4">{ertragSelbst.toLocaleString('de-DE')} €</p>
                  <p className="text-sm text-gray-500">100% Marge für Sie</p>
                </div>
              </Card>

              {/* Option B */}
              <Card className="p-8 bg-white border-2 border-gold/30 hover:border-gold transition-all shadow-xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-light to-gold rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Option B: Kommissionsverkauf
                  </h3>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Ihr Ertrag</p>
                  <p className="text-5xl font-bold text-gold mb-4">{ertragKommission.toLocaleString('de-DE')} €</p>
                  <p className="text-sm text-gray-500">Nach 20% Kommission</p>
                </div>
              </Card>
            </div>

            {/* Rechtlicher Disclaimer */}
            <div className="bg-orange-900/20 border-2 border-orange-500/40 rounded-lg p-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-orange-400 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="font-bold text-orange-300 mb-2">Hinweis</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Diese Berechnung dient nur zur Orientierung und stellt <strong>keine Gewinn- oder Renditegarantie</strong> dar.
                    Die tatsächlichen Ergebnisse hängen von vielen Faktoren ab (Marktbedingungen, Verkaufsdauer, Nachfrage).
                    Warenhandel ist mit unternehmerischem Risiko verbunden.
                  </p>
                </div>
              </div>
            </div>
              </>
            )}

            {activeTab === 'cashflow' && (
              <>
            {/* Monatlicher Cashflow Rechner */}
            {/* Eingabefelder */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Monatliches Budget */}
              <Card className="p-6 bg-white/5 border-gold/20 backdrop-blur">
                <label className="block text-gray-200 font-semibold mb-4">
                  Monatliches Budget (€)
                </label>
                <input
                  type="range"
                  min="1000"
                  max="20000"
                  step="500"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-400 text-sm">1.000 €</span>
                  <input
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                    className="w-32 px-3 py-2 bg-gray-800 text-gold text-center text-xl font-bold rounded border border-gold/30 focus:outline-none focus:border-gold"
                  />
                  <span className="text-gray-400 text-sm">20.000 €</span>
                </div>
              </Card>

              {/* Verkaufszyklus */}
              <Card className="p-6 bg-white/5 border-gold/20 backdrop-blur">
                <label className="block text-gray-200 font-semibold mb-4">
                  Verkaufszyklus (Monate)
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="1"
                  value={salesCycle}
                  onChange={(e) => setSalesCycle(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-400 text-sm">1 Mon.</span>
                  <input
                    type="number"
                    value={salesCycle}
                    onChange={(e) => setSalesCycle(Number(e.target.value))}
                    className="w-32 px-3 py-2 bg-gray-800 text-gold text-center text-xl font-bold rounded border border-gold/30 focus:outline-none focus:border-gold"
                  />
                  <span className="text-gray-400 text-sm">6 Mon.</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">Durchschnittliche Zeit bis Waren verkauft sind</p>
              </Card>

              {/* Erwartete Marge */}
              <Card className="p-6 bg-white/5 border-gold/20 backdrop-blur">
                <label className="block text-gray-200 font-semibold mb-4">
                  Erwartete Marge (%)
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={cashflowMargin}
                  onChange={(e) => setCashflowMargin(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-400 text-sm">10%</span>
                  <input
                    type="number"
                    value={cashflowMargin}
                    onChange={(e) => setCashflowMargin(Number(e.target.value))}
                    className="w-32 px-3 py-2 bg-gray-800 text-gold text-center text-xl font-bold rounded border border-gold/30 focus:outline-none focus:border-gold"
                  />
                  <span className="text-gray-400 text-sm">100%</span>
                </div>
              </Card>
            </div>

            {/* Berechnete Werte */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="p-6 text-center bg-white/5 border-gold/20 backdrop-blur">
                <p className="text-gray-400 text-sm mb-2">Monatlicher Warenwert</p>
                <p className="text-3xl font-bold text-gold">{warenWertCashflow.toLocaleString('de-DE')} €</p>
                <p className="text-xs text-gray-500 mt-2">Budget × 3</p>
              </Card>

              <Card className="p-6 text-center bg-white/5 border-gold/20 backdrop-blur">
                <p className="text-gray-400 text-sm mb-2">Monatlicher Verkaufserlös</p>
                <p className="text-3xl font-bold text-gold">{verkaufsErloesCashflow.toLocaleString('de-DE')} €</p>
                <p className="text-xs text-gray-500 mt-2">Nach {cashflowMargin}% Marge</p>
              </Card>

              <Card className="p-6 text-center bg-white/5 border-gold/20 backdrop-blur">
                <p className="text-gray-400 text-sm mb-2">Monatlicher Brutto-Ertrag</p>
                <p className="text-3xl font-bold text-gold">{bruttoErtragCashflow.toLocaleString('de-DE')} €</p>
                <p className="text-xs text-gray-500 mt-2">Erlös - Budget</p>
              </Card>
            </div>

            {/* Ergebnis Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Option A */}
              <Card className="p-8 bg-white border-2 border-gold/30 hover:border-gold transition-all shadow-xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-light to-gold rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Option A: Selbst verkaufen
                  </h3>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Möglicher monatlicher Rückfluss</p>
                  <p className="text-5xl font-bold text-gold mb-4">{cashflowSelbst.toLocaleString('de-DE')} €</p>
                  <p className="text-sm text-gray-500">Nach {salesCycle} Monaten Anlaufphase</p>
                </div>
              </Card>

              {/* Option B */}
              <Card className="p-8 bg-white border-2 border-gold/30 hover:border-gold transition-all shadow-xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-light to-gold rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Option B: Kommissionsverkauf
                  </h3>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Möglicher monatlicher Rückfluss</p>
                  <p className="text-5xl font-bold text-gold mb-4">{cashflowKommission.toLocaleString('de-DE')} €</p>
                  <p className="text-sm text-gray-500">Nach 20% Kommission</p>
                </div>
              </Card>
            </div>

            {/* Cashflow Hinweis */}
            <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-amber-400 text-sm text-center">
                <strong>Hinweis:</strong> Der monatliche Rückfluss entsteht erst nach der Anlaufphase von {salesCycle} Monaten.
                Dies ist eine vereinfachte Modellrechnung – tatsächliche Verkaufszeiten und Erträge variieren.
                Kein garantierter Cashflow – unternehmerisches Risiko.
              </p>
            </div>

            {/* Rechtlicher Disclaimer */}
            <div className="bg-orange-900/20 border-2 border-orange-500/40 rounded-lg p-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-orange-400 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="font-bold text-orange-300 mb-2">Hinweis</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Diese Berechnung dient nur zur Orientierung und stellt <strong>keine Gewinn- oder Renditegarantie</strong> dar.
                    Die tatsächlichen Ergebnisse hängen von vielen Faktoren ab (Marktbedingungen, Verkaufsdauer, Nachfrage).
                    Warenhandel ist mit unternehmerischem Risiko verbunden.
                  </p>
                </div>
              </div>
            </div>
              </>
            )}
          </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-24 bg-[#f5f5f0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Erfolgs<span className="text-gold">beispiele</span>
            </h2>
            <p className="text-gray-600 text-lg">
              So nutzen Händler unsere Warenpakete
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Case Study 1: Elektronik */}
            <Card className="p-6 bg-white border-2 border-gray-300 hover:border-gold hover:shadow-xl transition-all">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-light to-gold rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Laptop className="w-6 h-6 text-dark" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Elektronik-Paket
                  </h3>
                  <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full">
                    Amazon FBA
                  </span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Ein Händler aus Bayern kaufte ein Elektronik-Paket für <strong>8.500 €</strong>.
                Über Amazon FBA innerhalb von <strong>6 Wochen vollständig abverkauft</strong>.
              </p>
            </Card>

            {/* Case Study 2: Haushaltswaren */}
            <Card className="p-6 bg-white border-2 border-gray-300 hover:border-gold hover:shadow-xl transition-all">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-light to-gold rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <HomeIcon className="w-6 h-6 text-dark" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Haushaltswaren-Paket
                  </h3>
                  <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full">
                    Kommissionsverkauf
                  </span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Ein Online-Shop-Betreiber aus NRW nutzte den Kommissionsverkauf.
                Paket für <strong>5.200 €</strong> – Abwicklung komplett durch uns,
                Auszahlung nach <strong>10 Wochen</strong>.
              </p>
            </Card>

            {/* Case Study 3: Fashion */}
            <Card className="p-6 bg-white border-2 border-gray-300 hover:border-gold hover:shadow-xl transition-all">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-light to-gold rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Shirt className="w-6 h-6 text-dark" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Fashion-Paket
                  </h3>
                  <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full">
                    Multi-Channel
                  </span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Eine Händlerin aus Österreich verkaufte ein Fashion-Paket über eBay und den eigenen Shop.
                Einkauf <strong>4.800 €</strong>, verkauft in <strong>8 Wochen</strong>.
              </p>
            </Card>
          </div>

          {/* Disclaimer */}
          <p className="text-gray-500 text-sm text-center mt-8">
            * Anonymisierte Beispiele aus der Praxis. Ergebnisse variieren je nach Produkt, Markt und Verkaufsstrategie.
          </p>
        </div>
      </section>

      {/* Vertrauen/Partner Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#2a2a2a] via-[#1f1f1f] to-[#2a2a2a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="border-2 border-gold/30 rounded-2xl p-8 md:p-12 bg-black/20 backdrop-blur-sm">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Starke <span className="text-gold">Partner & Infrastruktur</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Professionelle Abwicklung durch etablierte Dienstleister
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Box 1: Fulfillment */}
              <Card className="p-6 bg-white/5 border-gold/20 backdrop-blur text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-gold-light to-gold rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-200 mb-2">
                  Fulfillment durch Fly Fulfilment
                </h3>
                <p className="text-sm text-gray-400">
                  Deutschlandweites Lager & Versand
                </p>
              </Card>

              {/* Box 2: Marktplätze */}
              <Card className="p-6 bg-white/5 border-gold/20 backdrop-blur text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-gold-light to-gold rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-200 mb-2">
                  Verkauf auf allen Marktplätzen
                </h3>
                <p className="text-sm text-gray-400">
                  Amazon, eBay, Otto & mehr
                </p>
              </Card>

              {/* Box 3: Zahlungsabwicklung */}
              <Card className="p-6 bg-white/5 border-gold/20 backdrop-blur text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-gold-light to-gold rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-200 mb-2">
                  Sichere Zahlungsabwicklung
                </h3>
                <p className="text-sm text-gray-400">
                  Stripe Payment Processing
                </p>
              </Card>

              {/* Box 4: Rechtssicher */}
              <Card className="p-6 bg-white/5 border-gold/20 backdrop-blur text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-gold-light to-gold rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-200 mb-2">
                  Rechtssicher
                </h3>
                <p className="text-sm text-gray-400">
                  Schweizer & österreichische Unternehmensstruktur
                </p>
              </Card>
            </div>

            {/* Partner Logos */}
            <div className="mt-12 bg-white p-6 rounded-xl border-2 border-gold/50 hover:border-gold hover:shadow-lg hover:shadow-gold/20 transition-all max-w-3xl mx-auto">
              <Image
                src="/images/partners/marketplaces.jpeg"
                alt="Unsere Marktplatz-Partner: Amazon, eBay, Walmart, Shopify, Etsy und mehr"
                width={800}
                height={200}
                className="object-contain w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Zwei Optionen Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Zwei <span className="text-gold">Verkaufswege</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Wähle den Weg der zu deinem Geschäftsmodell passt
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Option A: Selbstverkauf */}
            <Card className="p-8 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-300 hover:border-gold hover:shadow-xl transition-all">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gold-light to-gold rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Option A: Selbstverkauf
                </h3>
                <p className="text-gray-600">
                  Du verkaufst eigenständig über deine Kanäle
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Volle Kontrolle über Verkauf & Preise</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">100% Marge nach Warenkosten</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Aufbau eigener Kundenbasis</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-orange-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Eigenverantwortlicher Verkauf</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-orange-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Eigene Logistik & Kundensupport</span>
                </div>
              </div>
            </Card>

            {/* Option B: Kommission */}
            <Card className="p-8 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-300 hover:border-gold hover:shadow-xl transition-all">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gold-light to-gold rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Option B: Kommissionsverkauf
                </h3>
                <p className="text-gray-600">
                  Wir verkaufen für dich über etablierte Kanäle
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Kein eigener Verkaufsaufwand nötig</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Professionelle Abwicklung</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Zugang zu etablierten Verkaufskanälen</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-orange-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Kommissionsgebühr wird fällig</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-orange-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Geringerer Erlös pro Verkauf</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#f5f5f0] relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ihre <span className="text-gold">Vorteile</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Professioneller B2B-Warenhandel mit bewährten Produkten
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center bg-white border-gray-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-light to-gold rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold/20">
                <svg className="w-8 h-8 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Bewährte Produkte
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Waren die bereits erfolgreich auf Amazon, eBay und anderen Marktplätzen verkauft werden. Nachvollziehbare Verkaufshistorie.
              </p>
            </Card>

            <Card className="p-6 text-center bg-white border-gray-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-light to-gold rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold/20">
                <svg className="w-8 h-8 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Großhandelspreise
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Deutlich unter Marktpreis einkaufen. B2B-Konditionen für professionelle Händler mit transparenter Kalkulation.
              </p>
            </Card>

            <Card className="p-6 text-center bg-white border-gray-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-light to-gold rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold/20">
                <svg className="w-8 h-8 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Flexible Verkaufswege
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Selbst verkaufen oder Kommission nutzen – du entscheidest je nach Geschäftssituation und Kapazität flexibel.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Produkt-<span className="text-gold">Kategorien</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Warenpakete in verschiedenen Top-Kategorien
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { name: 'Elektronik', image: '/images/categories/elektronik.webp' },
              { name: 'Haushalt', image: '/images/categories/haushalt.webp' },
              { name: 'Fashion', image: '/images/categories/fashion.webp' },
              { name: 'Spielwaren', image: '/images/categories/spielwaren.webp' },
              { name: 'Werkzeug', image: '/images/categories/werkzeug.webp' },
            ].map((category) => (
              <div key={category.name}>
                <Card className="p-4 text-center bg-white border-gray-300">
                  <div className="w-full h-32 mb-4 overflow-hidden rounded-lg relative">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-bold text-gray-900">
                    {category.name}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#1a1a1a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-100 mb-3">
              Jetzt <span className="text-gold">Warenpakete entdecken</span>
            </h2>
            <p className="text-xl text-gray-400 mb-5 leading-relaxed">
              Registriere dich als Gewerbetreibender und erhalte Zugang
              <br />
              zu bewährten Produkten zu Großhandelspreisen
            </p>

            {isSignedIn ? (
              <Link href="/products">
                <Button
                  size="lg"
                  className="text-lg px-8 py-7 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold shadow-2xl shadow-gold/30"
                >
                  Warenpakete ansehen
                </Button>
              </Link>
            ) : (
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="text-lg px-8 py-7 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold shadow-2xl shadow-gold/30"
                >
                  Kostenlos registrieren
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Legal Disclaimer Section */}
      <section className="py-12 bg-gray-100 border-t border-gray-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-gray-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Rechtlicher Hinweis</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong>Dieses Angebot richtet sich ausschließlich an Gewerbetreibende.</strong> Es handelt sich um Warenhandel, nicht um ein Anlage- oder Finanzprodukt.
                    Vergangene Verkaufserfolge einzelner Produkte sind kein Indikator für zukünftige Ergebnisse. Jeder Kauf erfolgt auf eigenes unternehmerisches Risiko.
                    Es werden keine Gewinn- oder Renditegarantien gegeben. Der Verkaufserfolg hängt von Marktbedingungen, Ihrer Verkaufsstrategie und weiteren Faktoren ab.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
