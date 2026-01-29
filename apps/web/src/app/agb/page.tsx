import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AGB | E-Commerce Rente',
  description: 'Allgemeine Geschäftsbedingungen',
};

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark-light rounded-lg shadow-xl p-8 border border-gold/20">
          <h1 className="text-4xl font-bold text-gold mb-8">
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>

          <div className="prose prose-invert max-w-none">
            <div className="bg-orange/20 border-l-4 border-orange p-4 mb-6">
              <p className="text-orange font-semibold">
                ⚠️ WICHTIGER HINWEIS
              </p>
              <p className="text-white mt-2">
                Diese AGB sind Platzhalter und müssen von einem Fachanwalt für
                Handels- und Gesellschaftsrecht geprüft und angepasst werden.
                Die nachfolgenden Regelungen dienen nur als Struktur.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 1 Geltungsbereich
              </h2>
              <p className="text-white">
                (1) Diese Allgemeinen Geschäftsbedingungen gelten für alle
                Verträge zwischen [FIRMENNAME] (nachfolgend "Anbieter") und
                Unternehmern im Sinne des § 14 BGB (nachfolgend "Kunde") über die
                Lieferung von Warenpaketen.
              </p>
              <p className="text-white mt-2">
                (2) Diese AGB gelten ausschließlich. Abweichende Bedingungen des
                Kunden werden nicht akzeptiert, es sei denn, der Anbieter stimmt
                ihrer Geltung ausdrücklich schriftlich zu.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 2 Vertragsschluss
              </h2>
              <p className="text-white">
                (1) Die Darstellung der Waren auf der Website stellt kein
                rechtlich bindendes Angebot dar, sondern eine Aufforderung zur
                Bestellung.
              </p>
              <p className="text-white mt-2">
                (2) Durch Anklicken des Buttons "Jetzt kaufen" gibt der Kunde ein
                verbindliches Angebot zum Kauf der im Warenkorb befindlichen Waren
                ab.
              </p>
              <p className="text-white mt-2">
                (3) Der Vertrag kommt zustande, wenn der Anbieter die Bestellung
                durch Versand einer Auftragsbestätigung per E-Mail annimmt.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 3 Preise und Zahlung
              </h2>
              <p className="text-white">
                (1) Alle Preise verstehen sich in Euro (€) zzgl. der gesetzlichen
                Umsatzsteuer.
              </p>
              <p className="text-white mt-2">
                (2) Die Zahlung erfolgt über den Zahlungsdienstleister Stripe.
                Akzeptiert werden Kreditkarten und andere von Stripe unterstützte
                Zahlungsmethoden.
              </p>
              <p className="text-white mt-2">
                (3) Die Ware bleibt bis zur vollständigen Bezahlung Eigentum des
                Anbieters.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 4 Lieferung und Abholung
              </h2>
              <p className="text-white">
                (1) Die Lieferung erfolgt nach Zahlungseingang.
              </p>
              <p className="text-white mt-2">
                (2) Der Kunde hat nach Bezahlung 14 Tage Zeit zur kostenlosen
                Abholung der Ware.
              </p>
              <p className="text-white mt-2">
                (3) Ab dem 15. Tag nach Bezahlung fallen Lagergebühren in Höhe von
                €0,50 pro Palette und Tag an.
              </p>
              <p className="text-white mt-2">
                (4) Lagergebühren werden täglich berechnet und dem Kundenkonto
                belastet.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 5 Gewährleistung
              </h2>
              <p className="text-white">
                (1) Es gelten die gesetzlichen Gewährleistungsrechte.
              </p>
              <p className="text-white mt-2">
                (2) [WEITERE GEWÄHRLEISTUNGSREGELUNGEN DURCH ANWALT ERGÄNZEN]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 6 Haftung
              </h2>
              <p className="text-white">
                [HAFTUNGSREGELUNGEN DURCH ANWALT ERGÄNZEN]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 7 Reseller-Programm
              </h2>
              <p className="text-white">
                (1) Reseller erhalten eine Provision von 20% auf vermittelte
                Verkäufe.
              </p>
              <p className="text-white mt-2">
                (2) Die Provision wird dem Wallet-Konto gutgeschrieben.
              </p>
              <p className="text-white mt-2">
                (3) Auszahlungen sind ab einem Mindestbetrag von €10,00 möglich.
              </p>
              <p className="text-white mt-2">
                (4) Provisionen können innerhalb von 30 Tagen nach Gutschrift
                ausgezahlt werden.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 8 Schlussbestimmungen
              </h2>
              <p className="text-white">
                (1) Es gilt das Recht der Bundesrepublik Deutschland.
              </p>
              <p className="text-white mt-2">
                (2) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt
                die Wirksamkeit der übrigen Bestimmungen davon unberührt.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-gold/20">
              <p className="text-white text-sm">
                Stand: Januar 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
