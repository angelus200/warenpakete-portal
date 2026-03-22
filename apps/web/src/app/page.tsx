'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { ECommerceNewsTicker } from '@/components/ECommerceNewsTicker';
import { MarktplatzModell } from '@/components/MarktplatzModell';

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex flex-col">
      <ECommerceNewsTicker />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-28 md:py-40">
        {/* Background - Dark gradient statt kaputtem Bild */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        {/* Gold accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/5" />
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/8 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">

            {/* B2B Badge */}
            <div className="inline-block mb-6 px-4 py-2 rounded-full border border-gold/50 bg-gold/10">
              <span className="text-gold text-sm font-bold tracking-wider">
                💼 B2B WARENHANDEL FÜR GEWERBETREIBENDE
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
                Ihr E-Commerce Business —
              </span>
              <br />
              <span className="text-white">
                professionell. strukturiert. skalierbar.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed">
              Geprüfte Markenprodukte. Direkt handelbar.
            </p>
            <p className="text-base md:text-lg text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Gewerbetreibende im DACH-Raum starten mit unseren Markenprodukten mit Großhandelsrabatt ein zusätzliches Handelsgeschäft — nebenberuflich, mit überschaubarem Aufwand.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">💼 Strukturierter Handelsablauf</span>
              <span className="flex items-center gap-1.5">📦 Kein Sourcing, kein Risiko</span>
              <span className="flex items-center gap-1.5">🤖 Vollautomatisierter Verkaufsprozess</span>
              <span className="flex items-center gap-1.5">🕐 Nebenberuflich — ab 2h/Woche</span>
              <span className="flex items-center gap-1.5">📈 Skalierbar von €5.000 bis €100.000+</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={isSignedIn ? '/products' : '/sign-up'}>
                <Button
                  size="lg"
                  className="text-lg px-8 py-7 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold shadow-2xl shadow-gold/30 border border-gold-light/20"
                >
                  {isSignedIn ? '→ Markenprodukte ansehen' : '→ Jetzt kostenlos registrieren'}
                </Button>
              </Link>
              <Link href="/erstgespraech">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-7 border-2 border-gold text-gold bg-transparent hover:bg-gold/10 font-bold shadow-xl"
                >
                  📞 Kostenloses Erstgespräch
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Guide CTA Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="p-8 md:p-12 bg-gradient-to-br from-[#fffbeb] via-white to-[#fffbeb] border-2 border-gold/30 shadow-2xl shadow-gold/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left: Book Cover Mockup */}
                <div className="flex justify-center">
                  <div
                    className="relative"
                    style={{
                      width: '240px',
                      height: '320px',
                      perspective: '1000px',
                    }}
                  >
                    <div
                      className="w-full h-full rounded-lg shadow-2xl flex items-center justify-center p-6 text-center"
                      style={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        transform: 'rotateY(-15deg) rotateX(5deg)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        border: '2px solid #D4AF37',
                      }}
                    >
                      <div>
                        <h3 className="text-dark font-bold text-xl leading-tight mb-4">
                          Online Warenhandel
                        </h3>
                        <div className="text-dark font-extrabold text-2xl mb-4">
                          B2B GUIDE
                        </div>
                        <div className="text-dark font-bold text-lg">
                          2026
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Content */}
                <div>
                  <div className="inline-block mb-4 px-4 py-2 rounded-full border-2 border-gold bg-gold/20">
                    <span className="text-gold text-sm font-bold tracking-wider">
                      KOSTENLOSER B2B-GUIDE
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Kostenloser <span className="text-gold">B2B-Guide</span>
                  </h2>

                  <p className="text-lg text-gray-600 mb-6">
                    Der komplette Leitfaden für profitablen Marktplatz-Handel 2026
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">
                        Konkrete Kalkulationsbeispiele mit realistischen Margen (13-17% EBIT)
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">
                        Steuer-Tipps: Reverse Charge & Vorsteuerabzug optimal nutzen
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">
                        Schritt-für-Schritt vom Gewerbeschein zum ersten Verkauf
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">
                        Die 5 größten Fehler vermeiden — aus hunderten Kundengesprächen
                      </span>
                    </div>
                  </div>

                  <Link
                    href={
                      isSignedIn
                        ? `/guide${typeof window !== 'undefined' ? window.location.search : ''}`
                        : `/sign-up?redirect_url=/guide${typeof window !== 'undefined' ? encodeURIComponent(window.location.search) : ''}`
                    }
                  >
                    <Button
                      size="lg"
                      className="text-lg px-8 py-6 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold shadow-2xl shadow-gold/30"
                    >
                      Jetzt kostenlos herunterladen
                    </Button>
                  </Link>

                  <p className="text-sm text-gray-500 mt-4">
                    Kostenlos nach Registrierung • Kein Abo • Sofort verfügbar
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Video Section - Erfahren Sie mehr */}
      <section className="py-20 bg-[#f8f8f8]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Erfahren Sie <span className="text-gold">mehr</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Drei kurze Videos mit wertvollen Einblicken in den E-Commerce Warenhandel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Video 1 */}
            <div>
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src="https://play.vidyard.com/N4rBLTgaJZBs4ygwMwDYZB"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                  className="w-full h-full"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-4 text-center">
                Warenhandel im E-Commerce
              </h3>
            </div>

            {/* Video 2 */}
            <div>
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src="https://play.vidyard.com/9hd9xdCiZC3PBSJKkJLDSm"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                  className="w-full h-full"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-4 text-center">
                Handelsmodell verstehen
              </h3>
            </div>

            {/* Video 3 */}
            <div>
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src="https://play.vidyard.com/f772CcGMmTfqFbwu6cd6Ub"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                  className="w-full h-full"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-4 text-center">
                In 3 Schritten zum ersten Verkauf
              </h3>
            </div>
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
                  Produkte auswählen
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Wähle aus Sortimenten mit Produkten die nachweislich gut auf Marktplätzen laufen. Detaillierte Verkaufshistorie einsehbar.
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
                  Selbst über eigene Kanäle verkaufen oder per Kommissionsverkauf durch qualifizierte Dienstleister – Sie entscheiden flexibel.
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white border-gray-300 hover:border-gold/40 hover:shadow-lg transition-all relative">
              <div className="absolute -top-4 left-6 w-12 h-12 bg-gradient-to-br from-gold-light to-gold rounded-full flex items-center justify-center shadow-lg">
                <span className="text-dark font-bold text-xl">3</span>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Handelsergebnis realisieren
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Nach Verkauf der Waren erhalten Sie den Erlös (abzüglich Kommission falls gewählt). Transparente Abwicklung.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>


      <MarktplatzModell />

      {/* Affiliate Partner Section */}
      <section className="py-24 bg-gradient-to-br from-[#fffbeb] via-white to-[#fffbeb] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 rounded-full border-2 border-gold bg-gold/20">
              <span className="text-gold text-sm font-bold tracking-wider">
                💰 AFFILIATE-PARTNER WERDEN
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Verdiene <span className="text-gold">Provisionen</span> mit jedem Verkauf
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Empfehlen Sie E-Commerce Business an Unternehmer aus Ihrem Netzwerk und profitieren Sie von unserem <strong>3-Ebenen Provisionssystem</strong>. Bis zu <strong className="text-gold">5% Provision</strong> auf direkte Verkäufe plus Provisionseinkommen aus Ihrem Partner-Netzwerk.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
              <div className="bg-white p-6 rounded-xl border-2 border-gold/30 shadow-lg">
                <div className="text-3xl font-bold text-gold mb-2">5%</div>
                <div className="text-sm text-gray-600">Ebene 1: Direkte Empfehlungen</div>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-gold/30 shadow-lg">
                <div className="text-3xl font-bold text-gold mb-2">2%</div>
                <div className="text-sm text-gray-600">Ebene 2: Ihre Partner-Verkäufe</div>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-gold/30 shadow-lg">
                <div className="text-3xl font-bold text-gold mb-2">1%</div>
                <div className="text-sm text-gray-600">Ebene 3: Deren Partner-Verkäufe</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <span className="text-sm text-gray-500 italic">
                Partner-Handbuch wird aktualisiert — bald verfügbar
              </span>
              <Link href="/partner">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-7 border-2 border-gold text-gold bg-white hover:bg-gold/10 font-bold shadow-xl"
                >
                  Mehr zum Affiliate-Programm →
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Kostenlos registrieren • Keine monatlichen Gebühren • Sofort starten
            </p>
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
              Wählen Sie den Weg, der zu Ihrem Geschäftsmodell passt
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
                  Sie verkaufen eigenständig über Ihre Kanäle
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
                  Qualifizierte Dienstleister verkaufen über etablierte Kanäle
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
                Waren die bereits erfolgreich auf führenden Online-Marktplätzen verkauft werden. Nachvollziehbare Verkaufshistorie.
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
                Selbst verkaufen oder Kommission nutzen – Sie entscheiden je nach Geschäftssituation und Kapazität flexibel.
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
              Markenprodukte mit Großhandelsrabatt in verschiedenen Top-Kategorien
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
              Jetzt <span className="text-gold">Markenprodukte entdecken</span>
            </h2>
            <p className="text-xl text-gray-400 mb-5 leading-relaxed">
              Registrieren Sie sich als Gewerbetreibender und erhalten Sie Zugang
              <br />
              zu bewährten Produkten zu Großhandelspreisen
            </p>

            {isSignedIn ? (
              <Link href="/products">
                <Button
                  size="lg"
                  className="text-lg px-8 py-7 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold shadow-2xl shadow-gold/30"
                >
                  Markenprodukte ansehen
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
