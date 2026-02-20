'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DollarSign,
  Rocket,
  BarChart3,
  CreditCard,
  Users,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function PartnerPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'Wie werde ich Partner?',
      answer:
        'Registrieren Sie sich kostenlos auf unserer Plattform. Nach der Registrierung erhalten Sie automatisch Ihren persönlichen Affiliate-Link.',
    },
    {
      question: 'Was kostet die Teilnahme?',
      answer:
        'Nichts. Die Teilnahme am Partnerprogramm ist komplett kostenlos.',
    },
    {
      question: 'Wie funktioniert das 3-Ebenen-System?',
      answer:
        'Sie erhalten 3% Provision auf direkte Empfehlungen (Ebene 1), 1% auf Empfehlungen Ihrer Empfehlungen (Ebene 2) und 1% auf die dritte Ebene.',
    },
    {
      question: 'Wann und wie werde ich ausgezahlt?',
      answer:
        'Auszahlungen können jederzeit über Ihr Dashboard angefordert werden. Wir überweisen per Banküberweisung oder PayPal.',
    },
    {
      question: 'Gibt es ein Mindest-Auszahlungsbetrag?',
      answer: 'Ja, der Mindestbetrag für eine Auszahlung beträgt €50.',
    },
    {
      question: 'Muss ich selbst Kunde sein?',
      answer:
        'Nein, Sie müssen kein eigenes Warenpaket kaufen um Partner zu werden.',
    },
    {
      question: 'Wie lange werden Empfehlungen getrackt?',
      answer:
        'Unser Cookie-Tracking speichert Empfehlungen für 30 Tage. Sobald sich ein Kunde registriert, ist die Zuordnung dauerhaft.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden py-28 md:py-40 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-transparent to-transparent" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#B8960C] bg-clip-text text-transparent">
              Verdienen Sie mit jeder Empfehlung
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Werden Sie Partner und profitieren Sie von unserem{' '}
              <span className="text-[#D4AF37] font-semibold">
                3-Ebenen-Provisionssystem
              </span>{' '}
              — bis zu 5% auf jeden vermittelten Umsatz.
            </p>

            <Link href="/sign-up">
              <Button
                size="lg"
                className="text-lg px-8 py-7 bg-gradient-to-r from-[#B8960C] via-[#D4AF37] to-[#FFD700] hover:from-[#A07800] hover:via-[#B8960C] hover:to-[#D4AF37] text-black font-bold shadow-2xl shadow-[#D4AF37]/30"
              >
                Jetzt Partner werden
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl" />
      </section>

      {/* SECTION 2: 3-EBENEN-SYSTEM */}
      <section className="py-24 bg-[#f5f5f0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              So funktioniert unser <span className="text-[#D4AF37]">Partnerprogramm</span>
            </h2>
            <p className="text-lg text-gray-600">
              Verdienen Sie nicht nur an Ihren direkten Empfehlungen
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* 3-Ebenen Pyramide */}
            <div className="relative">
              {/* Ebene 1 */}
              <div className="flex justify-center mb-8">
                <Card className="p-8 bg-gradient-to-br from-[#FFD700] to-[#D4AF37] border-2 border-[#B8960C] shadow-2xl max-w-md w-full">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-black mb-2">Ebene 1</div>
                    <div className="text-2xl font-bold text-black mb-3">3% Provision</div>
                    <p className="text-black font-semibold">
                      Ihre direkten Empfehlungen
                    </p>
                  </div>
                </Card>
              </div>

              {/* Verbindungslinien */}
              <div className="flex justify-center mb-8">
                <svg className="w-64 h-16" viewBox="0 0 200 60">
                  <line
                    x1="100"
                    y1="0"
                    x2="50"
                    y2="60"
                    stroke="#D4AF37"
                    strokeWidth="3"
                  />
                  <line
                    x1="100"
                    y1="0"
                    x2="150"
                    y2="60"
                    stroke="#D4AF37"
                    strokeWidth="3"
                  />
                </svg>
              </div>

              {/* Ebene 2 */}
              <div className="flex justify-center gap-4 mb-8">
                <Card className="p-6 bg-[#D4AF37]/20 border-2 border-[#D4AF37] shadow-xl max-w-xs w-full">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      Ebene 2
                    </div>
                    <div className="text-xl font-bold text-[#D4AF37] mb-2">
                      1% Provision
                    </div>
                    <p className="text-sm text-gray-700 font-semibold">
                      Empfehlungen Ihrer Empfehlungen
                    </p>
                  </div>
                </Card>
                <Card className="p-6 bg-[#D4AF37]/20 border-2 border-[#D4AF37] shadow-xl max-w-xs w-full">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      Ebene 2
                    </div>
                    <div className="text-xl font-bold text-[#D4AF37] mb-2">
                      1% Provision
                    </div>
                    <p className="text-sm text-gray-700 font-semibold">
                      Empfehlungen Ihrer Empfehlungen
                    </p>
                  </div>
                </Card>
              </div>

              {/* Verbindungslinien zu Ebene 3 */}
              <div className="flex justify-center mb-8">
                <svg className="w-96 h-16" viewBox="0 0 300 60">
                  <line
                    x1="75"
                    y1="0"
                    x2="50"
                    y2="60"
                    stroke="#B8960C"
                    strokeWidth="2"
                  />
                  <line
                    x1="75"
                    y1="0"
                    x2="100"
                    y2="60"
                    stroke="#B8960C"
                    strokeWidth="2"
                  />
                  <line
                    x1="225"
                    y1="0"
                    x2="200"
                    y2="60"
                    stroke="#B8960C"
                    strokeWidth="2"
                  />
                  <line
                    x1="225"
                    y1="0"
                    x2="250"
                    y2="60"
                    stroke="#B8960C"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Ebene 3 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Card
                    key={i}
                    className="p-4 bg-[#B8960C]/10 border border-[#B8960C] shadow-lg"
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        Ebene 3
                      </div>
                      <div className="text-base font-bold text-[#B8960C]">
                        1% Provision
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Gesamt Highlight */}
            <div className="mt-12 text-center">
              <Card className="p-8 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border-2 border-[#D4AF37] inline-block">
                <p className="text-gray-300 text-lg mb-2">
                  Ihr Gesamtpotenzial
                </p>
                <p className="text-5xl font-bold text-[#D4AF37]">
                  Bis zu 5% pro Verkauf
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: RECHENBEISPIEL */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Was können Sie <span className="text-[#D4AF37]">verdienen?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Realistische Szenarien basierend auf unserer Partnererfahrung
            </p>
          </div>

          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="p-4 font-bold">Szenario</th>
                  <th className="p-4 font-bold">Empfehlungen</th>
                  <th className="p-4 font-bold">Ø Warenwert</th>
                  <th className="p-4 font-bold text-[#D4AF37]">
                    Ihre Provision (Ebene 1 + 2)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 font-semibold">🚀 Starter</td>
                  <td className="p-4">5 Kunden</td>
                  <td className="p-4">€10.000</td>
                  <td className="p-4 font-bold text-[#D4AF37]">
                    €1.500 + €250
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 font-semibold">📈 Aufbau</td>
                  <td className="p-4">15 Kunden</td>
                  <td className="p-4">€15.000</td>
                  <td className="p-4 font-bold text-[#D4AF37]">
                    €6.750 + €1.125
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 font-semibold">💎 Profi</td>
                  <td className="p-4">50 Kunden</td>
                  <td className="p-4">€25.000</td>
                  <td className="p-4 font-bold text-[#D4AF37]">
                    €37.500 + €6.250
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 max-w-3xl mx-auto">
            <Card className="p-6 bg-[#fffbeb] border-2 border-[#D4AF37]/30">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>Erklärung:</strong> Bei 5 direkten Empfehlungen à
                €10.000 verdienen Sie <strong>€1.500 (3%)</strong>. Wenn diese
                5 Kunden jeweils 1 weiteren Kunden empfehlen, kommen{' '}
                <strong>€250 (1%)</strong> pro Ebene-2-Verkauf dazu. Das
                3-Ebenen-System sorgt für passives Einkommen!
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 4: VORTEILE */}
      <section className="py-24 bg-[#f5f5f0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ihre <span className="text-[#D4AF37]">Vorteile</span> als Partner
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <DollarSign size={32} />,
                title: 'Passives Einkommen',
                description:
                  'Verdienen Sie an bis zu 3 Ebenen automatisch',
              },
              {
                icon: <Rocket size={32} />,
                title: 'Keine Startkosten',
                description:
                  'Kostenlose Registrierung, kein Investment nötig',
              },
              {
                icon: <BarChart3 size={32} />,
                title: 'Echtzeit-Dashboard',
                description: 'Verfolgen Sie Ihre Provisionen live',
              },
              {
                icon: <CreditCard size={32} />,
                title: 'Flexible Auszahlung',
                description:
                  'Auszahlung per Banküberweisung oder PayPal',
              },
              {
                icon: <Users size={32} />,
                title: 'Persönlicher Support',
                description:
                  'Ihr eigener Ansprechpartner bei Fragen',
              },
              {
                icon: <TrendingUp size={32} />,
                title: 'Wachstumspotenzial',
                description: 'Unbegrenzte Verdienstmöglichkeiten',
              },
            ].map((benefit, index) => (
              <Card
                key={index}
                className="p-6 bg-white border-2 border-gray-300 hover:border-[#D4AF37] hover:shadow-xl transition-all"
              >
                <div className="text-[#D4AF37] mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Das sagen unsere <span className="text-[#D4AF37]">Partner</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'M. Schmidt',
                role: 'Affiliate Partner seit 2025',
                quote:
                  'Innerhalb von 3 Monaten konnte ich mir ein stabiles Nebeneinkommen aufbauen.',
              },
              {
                name: 'S. Weber',
                role: 'Premium Partner',
                quote:
                  'Das 3-Ebenen-System macht den Unterschied. Mein Netzwerk arbeitet für mich.',
              },
              {
                name: 'J. Müller',
                role: 'Affiliate Partner seit 2025',
                quote:
                  'Einfacher Einstieg, professionelles Dashboard und pünktliche Auszahlungen.',
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="p-8 bg-gradient-to-br from-[#fffbeb] to-white border-2 border-[#D4AF37]/30 shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-[#D4AF37]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-bold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>

          <p className="text-center text-xs text-gray-500 mt-8">
            Erfahrungsberichte können variieren
          </p>
        </div>
      </section>

      {/* SECTION 6: FAQ */}
      <section className="py-24 bg-[#f5f5f0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Häufig gestellte <span className="text-[#D4AF37]">Fragen</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="border-2 border-gray-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp className="text-[#D4AF37] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="text-[#D4AF37] flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: FINALER CTA */}
      <section className="py-28 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-transparent to-transparent" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Bereit durchzustarten?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Registrieren Sie sich jetzt und starten Sie noch heute
            </p>

            <Link href="/sign-up">
              <Button
                size="lg"
                className="text-lg px-10 py-7 bg-gradient-to-r from-[#B8960C] via-[#D4AF37] to-[#FFD700] hover:from-[#A07800] hover:via-[#B8960C] hover:to-[#D4AF37] text-black font-bold shadow-2xl shadow-[#D4AF37]/30"
              >
                Jetzt Partner werden
              </Button>
            </Link>

            <p className="text-sm text-gray-400 mt-6">
              Kostenlos • Unverbindlich • In 2 Minuten startklar
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
