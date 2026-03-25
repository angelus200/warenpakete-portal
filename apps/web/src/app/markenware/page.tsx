'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const VORTEILE = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5H6m0 0v4.5m0-4.5h12m-12 4.5h12" />
      </svg>
    ),
    titel: 'Sofortige Reichweite',
    text: 'Ihr Sortiment wird über unser bestehendes B2B-Netzwerk im DACH-Raum sichtbar — ohne eigene Marketing-Kosten.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    titel: 'Logistik & Fulfillment',
    text: 'Komplette Abwicklung auf Wunsch: Lagerung, Versand, Retouren — Sie liefern, wir kümmern uns um den Rest.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    titel: 'Rechtssicher & transparent',
    text: 'Klare Vertragsstrukturen nach §383 HGB (Kommissionsgeschäft), transparente Provisionen, ordentliche Buchführung.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
      </svg>
    ),
    titel: 'Multi-Channel Vertrieb',
    text: 'Amazon, eBay, Webshop, stationär — Platzierung dort, wo Nachfrage für Ihre Produkte ist.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    titel: 'Kein Risiko',
    text: 'Keine Vorabkosten, keine Mindestabnahmen. Faire Provision nur auf tatsächlich verkaufte Ware.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    titel: 'Persönliche Betreuung',
    text: 'Fester Ansprechpartner, individuelle Beratung zu Pricing und Positionierung für Ihren Markt.',
  },
];

const SCHRITTE = [
  { nr: '01', titel: 'Bewerbung einreichen', text: 'Formular ausfüllen, Sortiment beschreiben. Rückmeldung innerhalb von 48 Stunden.' },
  { nr: '02', titel: 'Erstgespräch & Prüfung', text: 'Details besprechen: Produktqualität, Preisstruktur, Lieferfähigkeit und Kanalstrategie.' },
  { nr: '03', titel: 'Vertrag & Onboarding', text: 'Kommissionsvertrag §383 HGB, Verkäufer-Konto einrichten, Produktdaten übermitteln.' },
  { nr: '04', titel: 'Verkaufsstart', text: 'Produkte ins Netzwerk, aktive Vermarktung beginnt, regelmäßige Abrechnungen folgen.' },
];

const ANFORDERUNGEN = [
  'Eingetragenes Gewerbe mit gültigem Gewerbeschein',
  'Qualitätsprodukte mit CE-Kennzeichnung (falls zutreffend)',
  'Zuverlässige Lieferfähigkeit und stabile Warenverfügbarkeit',
  'Bereitschaft zu wettbewerbsfähigen B2B-Konditionen',
  'Professionelle Produktdaten (Bilder, Beschreibungen, EAN)',
  'Transparente Kommunikation und partnerschaftliche Zusammenarbeit',
];

const KATEGORIEN = [
  'Elektronik & Technik',
  'Mode & Accessoires',
  'Beauty & Pflege',
  'Haus & Garten',
  'Sport & Outdoor',
  'Lebensmittel & Getränke',
  'Spielzeug & Kinder',
  'Sonstiges',
];

const SKU_OPTIONEN = ['1–10', '11–50', '51–200', '200+'];

type FormState = {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  productCategory: string;
  productCount: string;
  message: string;
  gewerbeschein: boolean;
};

const INITIAL: FormState = {
  company: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  productCategory: '',
  productCount: '',
  message: '',
  gewerbeschein: false,
};

export default function MarkenwarePage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/seller-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: form.company,
          contactName: form.contactName,
          email: form.email,
          phone: form.phone || undefined,
          website: form.website || undefined,
          productCategory: form.productCategory,
          productCount: form.productCount || undefined,
          message: form.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Fehler beim Senden. Bitte versuchen Sie es erneut.');
      }

      setSuccess(true);
      setForm(INITIAL);
    } catch (err: any) {
      setError(err.message || 'Unbekannter Fehler. Bitte versuchen Sie es später erneut.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors text-sm';
  const labelClass = 'block text-sm font-medium text-neutral-300 mb-1.5';

  return (
    <div className="flex flex-col bg-neutral-950">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-28 md:py-40">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(234,179,8,0.08)_0%,_transparent_60%)]" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10">
              <span className="text-yellow-500 text-sm font-bold tracking-wider">
                🏭 FÜR HERSTELLER, MARKEN &amp; GROSSHÄNDLER
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              Eigene Produkte über{' '}
              <span className="text-yellow-500">E-Commerce Service</span>{' '}
              anbieten
            </h1>

            <p className="text-lg md:text-xl text-neutral-400 mb-10 leading-relaxed max-w-3xl mx-auto">
              Nutzen Sie unser bestehendes Netzwerk, unsere Infrastruktur und Reichweite, um Ihre Produkte im
              DACH-Raum zu vertreiben — ohne eigenen Shop-Aufbau, ohne Logistik-Kopfschmerzen.
            </p>

            <a
              href="#bewerbung"
              className="inline-block px-8 py-4 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg transition-colors shadow-lg shadow-yellow-500/20"
            >
              Jetzt als Verkäufer bewerben
            </a>
          </div>
        </div>
      </section>

      {/* ── VORTEILE ── */}
      <section className="py-24 bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ihre Vorteile als <span className="text-yellow-500">Verkäufer</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {VORTEILE.map(({ icon, titel, text }) => (
              <div
                key={titel}
                className="p-6 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-yellow-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center mb-4">
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{titel}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREISPAKETE ── */}
      <section className="py-24 bg-neutral-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-4">
              Plattformgebühren
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Transparente Preise für <span className="text-yellow-500">Produktanbieter</span>
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto text-sm leading-relaxed">
              Registrierung, Produktlisting und laufende Plattformnutzung — alles inklusive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

            {/* Starter */}
            <div className="relative rounded-2xl border border-yellow-500/30 bg-neutral-900/50 p-8 flex flex-col hover:border-yellow-500/50 transition-colors">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Starter</h3>
                <p className="text-yellow-500 text-sm font-medium">1–5 Produkte</p>
                <p className="text-neutral-500 text-xs">mit jeweils bis zu 4 Varianten</p>
              </div>
              <div className="mb-6 pb-6 border-b border-neutral-800">
                <div className="text-4xl font-bold text-white">499 €</div>
                <div className="text-xs text-neutral-400 mt-1">Einmalige Einrichtungsgebühr</div>
                <div className="mt-3 text-sm text-neutral-300 font-medium">49 € <span className="text-neutral-500 font-normal">/ Monat</span></div>
                <div className="text-xs text-neutral-500">Plattformgebühr</div>
                <div className="mt-2 text-sm text-neutral-300 font-medium">2% <span className="text-neutral-500 font-normal">vom Warenumsatz</span></div>
                <div className="text-xs text-neutral-500">laufende Provision</div>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  'Registrierung & Onboarding',
                  'Bis zu 5 Produktlistings',
                  'Bis zu 4 Varianten pro Produkt',
                  'Zugang zum Verkäufer-Dashboard',
                  'Support via Dashboard-Chat',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-300">
                    <svg className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#bewerbung"
                className="block text-center py-3 rounded-lg border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 text-sm font-semibold transition-colors"
              >
                Jetzt als Verkäufer bewerben
              </a>
            </div>

            {/* Professional — hervorgehoben */}
            <div className="relative rounded-2xl border border-yellow-500 bg-neutral-900/80 p-8 flex flex-col shadow-lg shadow-yellow-500/10">
              <div className="absolute top-4 right-4 bg-yellow-500 text-neutral-900 text-xs font-bold px-3 py-1 rounded-full">
                Empfohlen
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Professional</h3>
                <p className="text-yellow-500 text-sm font-medium">6–25 Produkte</p>
                <p className="text-neutral-500 text-xs">mit jeweils bis zu 4 Varianten</p>
              </div>
              <div className="mb-6 pb-6 border-b border-neutral-700">
                <div className="text-4xl font-bold text-white">899 €</div>
                <div className="text-xs text-neutral-400 mt-1">Einmalige Einrichtungsgebühr</div>
                <div className="mt-3 text-sm text-neutral-300 font-medium">89 € <span className="text-neutral-500 font-normal">/ Monat</span></div>
                <div className="text-xs text-neutral-500">Plattformgebühr</div>
                <div className="mt-2 text-sm text-neutral-300 font-medium">2% <span className="text-neutral-500 font-normal">vom Warenumsatz</span></div>
                <div className="text-xs text-neutral-500">laufende Provision</div>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  'Alles aus Starter',
                  'Bis zu 25 Produktlistings',
                  'Erweiterte Produktanalysen',
                  'Priorisierter Support',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-300">
                    <svg className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#bewerbung"
                className="block text-center py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-neutral-900 text-sm font-bold transition-colors shadow-md shadow-yellow-500/20"
              >
                Jetzt als Verkäufer bewerben
              </a>
            </div>

            {/* Enterprise */}
            <div className="relative rounded-2xl border border-neutral-700 bg-neutral-900/50 p-8 flex flex-col hover:border-neutral-600 transition-colors">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Enterprise</h3>
                <p className="text-yellow-500 text-sm font-medium">Mehr als 25 Produkte</p>
                <p className="text-neutral-500 text-xs">Individuelle Konditionen</p>
              </div>
              <div className="mb-6 pb-6 border-b border-neutral-800">
                <div className="text-4xl font-bold text-white">Auf Anfrage</div>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed mb-8 flex-grow">
                Für größere Sortimente erstellen wir ein individuelles Angebot — abgestimmt auf Ihr Volumen und Ihre Anforderungen.
              </p>
              <a
                href="#bewerbung"
                className="block text-center py-3 rounded-lg border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white text-sm font-semibold transition-colors"
              >
                Individuelles Angebot anfragen
              </a>
            </div>

          </div>

          {/* Hinweistexte */}
          <div className="mt-10 text-center space-y-1.5">
            <p className="text-xs text-neutral-500">Alle Preise zzgl. gesetzlicher MwSt.</p>
            <p className="text-xs text-neutral-500">Die laufende Provision von 2% wird auf den tatsächlichen Warenumsatz über die Plattform erhoben.</p>
            <p className="text-xs text-neutral-500">Nur für Gewerbetreibende mit gültigem Gewerbeschein.</p>
          </div>
        </div>
      </section>

      {/* ── SO FUNKTIONIERT'S ── */}
      <section className="py-24 bg-neutral-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              So werden Sie <span className="text-yellow-500">Verkäufer</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {SCHRITTE.map(({ nr, titel, text }) => (
              <div key={nr} className="flex gap-5 p-6 rounded-xl border border-neutral-800 bg-neutral-900">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <span className="text-yellow-500 font-bold text-lg">{nr}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1.5">{titel}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANFORDERUNGEN ── */}
      <section className="py-24 bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Was wir von <span className="text-yellow-500">Verkäufern erwarten</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ANFORDERUNGEN.map((req) => (
                <div key={req} className="flex items-start gap-3 p-4 rounded-lg bg-neutral-950 border border-neutral-800">
                  <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-neutral-300 text-sm">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BEWERBUNGSFORMULAR ── */}
      <section id="bewerbung" className="scroll-mt-24 py-24 bg-neutral-950">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Werden Sie Teil <span className="text-yellow-500">unseres Netzwerks</span>
              </h2>
              <p className="text-neutral-400">
                Bewerbung dauert 5 Minuten — Rückmeldung innerhalb 48 Stunden.
              </p>
            </div>

            {success ? (
              <div className="p-8 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Bewerbung eingegangen!</h3>
                <p className="text-neutral-400 text-sm mb-6">
                  Wir prüfen Ihre Angaben und melden uns innerhalb von 48 Stunden bei Ihnen.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-yellow-500 hover:text-yellow-400 text-sm underline underline-offset-2"
                >
                  Weitere Bewerbung einreichen
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-8 rounded-2xl border border-neutral-800 bg-neutral-900"
              >
                {/* Firma + Ansprechpartner */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>
                      Firma <span className="text-yellow-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.company}
                      onChange={set('company')}
                      placeholder="Ihre Firma"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Ansprechpartner <span className="text-yellow-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.contactName}
                      onChange={set('contactName')}
                      placeholder="Vor- und Nachname"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* E-Mail + Telefon */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>
                      E-Mail <span className="text-yellow-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={set('email')}
                      placeholder="email@firma.de"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Telefon</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="+49 ..."
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className={labelClass}>Website / Online-Shop</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={set('website')}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>

                {/* Kategorie + SKUs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>
                      Produktkategorie <span className="text-yellow-500">*</span>
                    </label>
                    <select
                      required
                      value={form.productCategory}
                      onChange={set('productCategory')}
                      className={inputClass}
                    >
                      <option value="">Bitte wählen...</option>
                      {KATEGORIEN.map((k) => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Anzahl Produkte / SKUs</label>
                    <select
                      value={form.productCount}
                      onChange={set('productCount')}
                      className={inputClass}
                    >
                      <option value="">Bitte wählen...</option>
                      {SKU_OPTIONEN.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sortiment beschreiben */}
                <div>
                  <label className={labelClass}>
                    Sortiment beschreiben <span className="text-yellow-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Welche Produkte / Marken möchten Sie anbieten?"
                    className={inputClass}
                  />
                </div>

                {/* Gewerbeschein-Checkbox */}
                <div className="flex items-start gap-3 p-4 rounded-lg border border-neutral-700 bg-neutral-800/50">
                  <input
                    id="gewerbeschein"
                    type="checkbox"
                    required
                    checked={form.gewerbeschein}
                    onChange={set('gewerbeschein')}
                    className="mt-0.5 w-4 h-4 accent-yellow-500 flex-shrink-0"
                  />
                  <label htmlFor="gewerbeschein" className="text-neutral-300 text-sm cursor-pointer leading-relaxed">
                    Ich bestätige, dass ich ein eingetragenes Gewerbe betreibe und einen gültigen Gewerbeschein besitze.
                    <span className="text-yellow-500"> *</span>
                  </label>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-lg bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-500/40 disabled:cursor-not-allowed text-black font-bold text-base transition-colors shadow-lg shadow-yellow-500/10"
                >
                  {submitting ? 'Wird gesendet...' : 'Bewerbung absenden'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ── */}
      <section className="py-8 bg-neutral-900 border-t border-neutral-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-neutral-600 max-w-3xl mx-auto">
            Nur für Gewerbetreibende mit gültigem Gewerbeschein. Kein Endkundenverkauf.
            Alle Angaben freibleibend. Die Aufnahme als Verkäufer erfolgt nach individueller Prüfung.
          </p>
        </div>
      </section>

    </div>
  );
}
