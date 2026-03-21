'use client';

import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

type Frage = {
  frage: string;
  antwort: string;
  kategorie: string;
};

const fragen: Frage[] = [
  // ── ALLGEMEINES ──
  {
    kategorie: 'Allgemeines',
    frage: 'Was ist E-Commerce Service?',
    antwort:
      'E-Commerce Service ist eine B2B-Handelsplattform der Commercehelden GmbH (Österreich). Trademark24-7 AG (Schweiz) bietet als Warenanbieter geprüfte Markenprodukte zu Großhandelskonditionen an. Gewerbetreibende im DACH-Raum können diese Waren kaufen und entweder selbst vermarkten oder über einen Verkaufskommissionär abwickeln lassen.',
  },
  {
    kategorie: 'Allgemeines',
    frage: 'Für wen ist die Plattform?',
    antwort:
      'Ausschließlich für Gewerbetreibende mit gültigem Gewerbeschein in Deutschland, Österreich oder der Schweiz. Kein Endkundenverkauf.',
  },
  {
    kategorie: 'Allgemeines',
    frage: 'Wie registriere ich mich?',
    antwort:
      'Über "Registrieren" — Gewerbedaten eingeben, Gewerbeschein hochladen. Prüfung innerhalb 1–2 Werktagen, danach sofortiger Plattformzugang.',
  },
  {
    kategorie: 'Allgemeines',
    frage: 'In welchen Ländern ist der Service verfügbar?',
    antwort: 'Deutschland, Österreich und Schweiz (DACH-Raum).',
  },

  // ── MARKENWARE KAUFEN ──
  {
    kategorie: 'Markenware',
    frage: 'Wie funktioniert der Warenbezug?',
    antwort:
      'Trademark24-7 AG verkauft geprüfte Markenprodukte aus den Bereichen Elektronik, Haushaltswaren und Fashion zu Großhandelskonditionen an Gewerbetreibende. Der Käufer wird Eigentümer der Ware und entscheidet selbst über den Weiterverkauf.',
  },
  {
    kategorie: 'Markenware',
    frage: 'Was ist der Mindestbestellwert?',
    antwort: '€2.500 netto. Sortimente ab €5.000 werden bevorzugt bearbeitet.',
  },
  {
    kategorie: 'Markenware',
    frage: 'Gibt es Verkaufshistorien zu den Produkten?',
    antwort:
      'Ja — auf Anfrage stellen wir anonymisierte Verkaufshistorien der letzten 90 Tage auf relevanten Marktplätzen zur Verfügung.',
  },
  {
    kategorie: 'Markenware',
    frage: 'Wie läuft die Lieferung ab?',
    antwort:
      'Nach Bestellung und Zahlungseingang Lieferung innerhalb 5–10 Werktagen ab Lager Schweiz. Alle Handelsdokumente (Rechnung, Lieferschein, Zollpapiere bei CH-Lieferung) werden mitgeliefert.',
  },
  {
    kategorie: 'Markenware',
    frage: 'Gibt es ein Rückgaberecht?',
    antwort:
      'B2B-Kaufverträge unterliegen nicht dem Verbraucher-Widerrufsrecht. Rückgabe nur bei nachgewiesenem Lieferschaden oder Falschlieferung, innerhalb von 5 Werktagen nach Wareneingang schriftlich anzeigen.',
  },

  // ── KOMMISSIONSVERKAUF ──
  {
    kategorie: 'Kommissionsverkauf',
    frage: 'Was ist ein Verkaufskommissionär?',
    antwort:
      'Ein Verkaufskommissionär ist ein Dienstleister, der Ihre eingekauften Waren im eigenen Namen, aber auf Ihre Rechnung verkauft (§383 HGB). Sie bleiben Eigentümer der Ware bis zum Verkauf. Der Kommissionär verkauft, zieht seine vereinbarte Provision ab und führt den restlichen Erlös an Sie ab.',
  },
  {
    kategorie: 'Kommissionsverkauf',
    frage: 'Wer übernimmt den Kommissionsverkauf?',
    antwort:
      'Commercehelden GmbH bietet als zugelassener Dienstleister die Abwicklung des Kommissionsverkaufs an. Alternativ können Gewerbetreibende eigene Kommissionäre beauftragen.',
  },
  {
    kategorie: 'Kommissionsverkauf',
    frage: 'Welche Pflichten hat der Kommissionär?',
    antwort:
      'Der Kommissionär verkauft im eigenen Namen und ist gegenüber dem Endkäufer Vertragspartner. Er trägt die Gewährleistungspflicht gegenüber Endkunden, führt ordentliche Bücher und liefert monatliches Verkaufsreporting an den Auftraggeber.',
  },
  {
    kategorie: 'Kommissionsverkauf',
    frage: 'Wie hoch ist die Kommission?',
    antwort:
      'Individuell vereinbart — abhängig von Verkaufskanal, Produktkategorie und erwartetem Volumen. Details werden im persönlichen Erstgespräch festgelegt und vertraglich fixiert.',
  },
  {
    kategorie: 'Kommissionsverkauf',
    frage: 'Wie werden Retouren gehandhabt?',
    antwort:
      'Da der Kommissionär im eigenen Namen verkauft, ist er gegenüber dem Endkäufer Vertragspartner und verantwortlich für die Retourenabwicklung. Bereinigte Retouren werden mit der monatlichen Provisionsabrechnung verrechnet.',
  },
  {
    kategorie: 'Kommissionsverkauf',
    frage: 'Wie erfolgt die Abrechnung zwischen Auftraggeber und Kommissionär?',
    antwort:
      'Monatlich zum Monatsende erstellt der Kommissionär eine Abrechnung. Der erzielte Verkaufserlös abzüglich vereinbarter Provision wird innerhalb von 14 Tagen an den Auftraggeber überwiesen.',
  },

  // ── AFFILIATE ──
  {
    kategorie: 'Affiliate',
    frage: 'Was ist das Affiliate-Programm?',
    antwort:
      'Als Affiliate-Partner vermitteln Sie Gewerbetreibende an unsere Plattform. Bei erfolgreichem Kauf durch Ihre Empfehlung erhalten Sie eine Vermittlungsprovision. Das 3-Ebenen-System vergütet auch Ihr aufgebautes Partnernetzwerk.',
  },
  {
    kategorie: 'Affiliate',
    frage: 'Wie hoch sind die Provisionen?',
    antwort:
      'Ebene 1 (direkte Vermittlung): 5% des Auftragswertes. Ebene 2 (Ihre Partner vermitteln): 2%. Ebene 3 (Sub-Partner): 1%. Auszahlung monatlich zum 15. ab €100 Guthaben per SEPA.',
  },
  {
    kategorie: 'Affiliate',
    frage: 'Wie werde ich Affiliate-Partner?',
    antwort:
      'Registrierung unter /partner, Gewerbeschein-Verifizierung, sofortiger Zugang zum Partner-Dashboard mit persönlichem Tracking-Link und Werbemitteln.',
  },

  // ── ZAHLUNG ──
  {
    kategorie: 'Zahlung',
    frage: 'Welche Zahlungsmethoden gibt es?',
    antwort:
      'Vorkasse per SEPA-Überweisung, Kreditkarte (Visa, Mastercard) via Stripe. Für Stammkunden auf Anfrage: Kauf auf Rechnung mit 14 Tagen Zahlungsziel.',
  },
  {
    kategorie: 'Zahlung',
    frage: 'Welche Steuerregelung gilt?',
    antwort:
      'Alle Preise sind Nettopreise zzgl. gesetzlicher MwSt. Für innergemeinschaftliche Lieferungen DE/AT gilt Reverse-Charge-Verfahren. Schweizer Käufer erhalten MWST-Ausweis nach Schweizer Recht. Rechnungen werden von Trademark24-7 AG (CH) ausgestellt.',
  },
  {
    kategorie: 'Zahlung',
    frage: 'Erhalte ich eine ordentliche Rechnung?',
    antwort:
      'Ja — vollständige B2B-Rechnung von Trademark24-7 AG mit allen steuerrechtlich erforderlichen Angaben inkl. USt-IdNr. und Lieferdetails.',
  },

  // ── RECHTLICHES ──
  {
    kategorie: 'Rechtliches',
    frage: 'Ist die Plattform BaFin-reguliert?',
    antwort:
      'Nein. Es handelt sich ausschließlich um Warenhandel mit physischen Produkten — keine Kapitalanlage, kein Finanzprodukt, keine Renditeversprechen. Die Plattform unterliegt dem allgemeinen Handels- und Vertragsrecht (HGB/UGB).',
  },
  {
    kategorie: 'Rechtliches',
    frage: 'Welches Recht gilt bei Streitigkeiten?',
    antwort:
      'Für Kunden aus DE/AT: österreichisches Recht, Gerichtsstand Wien (Commercehelden GmbH). Für Kaufverträge mit Trademark24-7 AG: Schweizer Recht, Gerichtsstand Zürich.',
  },
  {
    kategorie: 'Rechtliches',
    frage: 'Gilt ein Widerrufsrecht?',
    antwort:
      'Nein. B2B-Kaufverträge unterliegen nicht dem Verbraucher-Widerrufsrecht (§312g BGB gilt ausschließlich für Verbraucher i.S.d. §13 BGB).',
  },
  {
    kategorie: 'Rechtliches',
    frage: 'Wie werden meine Daten verarbeitet?',
    antwort:
      'Nur vertragsnotwendige Daten. Keine Weitergabe an Dritte außer für die Vertragsabwicklung erforderliche Partner. Details in der Datenschutzerklärung unter /datenschutz.',
  },
];

const kategorien = ['Alle', 'Allgemeines', 'Markenware', 'Kommissionsverkauf', 'Affiliate', 'Zahlung', 'Rechtliches'];

export default function FaqPage() {
  const [suche, setSuche] = useState('');
  const [aktiveKategorie, setAktiveKategorie] = useState('Alle');
  const [offen, setOffen] = useState<number | null>(null);

  const gefilterteFragen = useMemo(() => {
    return fragen.filter((f) => {
      const kategorieMatch = aktiveKategorie === 'Alle' || f.kategorie === aktiveKategorie;
      if (!suche.trim()) return kategorieMatch;
      const sucheLower = suche.toLowerCase();
      return kategorieMatch && (
        f.frage.toLowerCase().includes(sucheLower) ||
        f.antwort.toLowerCase().includes(sucheLower)
      );
    });
  }, [suche, aktiveKategorie]);

  const toggle = (idx: number) => setOffen(offen === idx ? null : idx);

  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-36 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-transparent to-transparent" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#FFD700]/10 rounded-full blur-3xl" />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10">
            <span className="text-[#D4AF37] text-sm font-bold tracking-wider">❓ HÄUFIGE FRAGEN</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#B8960C] bg-clip-text text-transparent">
            FAQ
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Alles Wissenswerte zu Warenbezug, Kommissionsverkauf, Affiliate-Programm und rechtlichen Grundlagen.
          </p>

          {/* Suchfeld */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Fragen durchsuchen..."
              value={suche}
              onChange={(e) => { setSuche(e.target.value); setOffen(null); }}
              className="w-full px-5 py-4 rounded-xl bg-white/10 border border-[#D4AF37]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors text-base"
            />
            {suche && (
              <button
                onClick={() => setSuche('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors text-lg"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-[#f5f5f0]">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Kategorie-Tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {kategorien.map((kat) => (
              <button
                key={kat}
                onClick={() => { setAktiveKategorie(kat); setOffen(null); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  aktiveKategorie === kat
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                }`}
              >
                {kat}
              </button>
            ))}
          </div>

          {/* Ergebnis-Zähler */}
          {suche.trim() && (
            <p className="text-sm text-gray-500 mb-6">
              {gefilterteFragen.length} {gefilterteFragen.length === 1 ? 'Frage' : 'Fragen'} gefunden
            </p>
          )}

          {/* Accordion */}
          {gefilterteFragen.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">Keine Fragen gefunden.</p>
              <button onClick={() => { setSuche(''); setAktiveKategorie('Alle'); }} className="mt-3 text-[#D4AF37] hover:underline text-sm">
                Filter zurücksetzen
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {gefilterteFragen.map((f, idx) => {
                const istOffen = offen === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border-2 transition-all overflow-hidden ${
                      istOffen
                        ? 'border-[#D4AF37]/60 shadow-md'
                        : 'border-gray-200 bg-white hover:border-[#D4AF37]/30'
                    }`}
                  >
                    <button
                      onClick={() => toggle(idx)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {aktiveKategorie === 'Alle' && (
                          <span className="flex-shrink-0 mt-0.5 px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#B8960C] text-xs font-semibold">
                            {f.kategorie}
                          </span>
                        )}
                        <span className={`font-semibold text-base leading-snug ${istOffen ? 'text-[#B8960C]' : 'text-gray-900'}`}>
                          {f.frage}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 ml-4 text-[#D4AF37] transition-transform duration-200 ${istOffen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {istOffen && (
                      <div className="px-6 pb-6 bg-[#fffbeb]">
                        <div className="border-t border-[#D4AF37]/20 pt-4">
                          <p className="text-gray-700 leading-relaxed text-sm">{f.antwort}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* Rechtlicher Hinweis */}
      <section className="py-8 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-gray-400 max-w-3xl mx-auto">
            Alle Angaben ohne Gewähr. Maßgeblich sind die aktuellen AGB und Vertragsunterlagen.
            Rechtsberatung durch qualifizierte Fachleute empfohlen.
          </p>
        </div>
      </section>

    </div>
  );
}
