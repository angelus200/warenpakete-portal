/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AGB | Warenpakete Portal',
  description: 'Allgemeine Geschäftsbedingungen',
};

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark-light rounded-lg shadow-xl p-8 border border-gold/20">
          <h1 className="text-4xl font-bold text-gold mb-4">
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>
          <p className="text-gold/80 text-lg mb-8">
            Trademark24-7 AG - Warenpakete Portal
          </p>
          <p className="text-gray-400 mb-8">Stand: Januar 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            {/* § 1 */}
            <section className="bg-red-500/10 border-2 border-red-500/40 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-red-400 mb-4">
                § 1 GELTUNGSBEREICH UND VERTRAGSPARTNER
              </h2>
              <div className="space-y-3 text-white">
                <p>
                  (1) Diese Allgemeinen Geschäftsbedingungen gelten <strong className="text-red-400">ausschließlich für Unternehmer</strong> im Sinne von Art. 2 lit. b der Richtlinie 2011/83/EU bzw. § 14 BGB.
                </p>
                <p>
                  (2) <strong className="text-red-400 uppercase">WARENPAKETE PORTAL VERKAUFT AUSSCHLIESSLICH AN GEWERBETREIBENDE.</strong><br />
                  Verbraucher im Sinne von Art. 2 lit. a der Richtlinie 2011/83/EU bzw. § 13 BGB sind von der Nutzung dieser Plattform ausdrücklich ausgeschlossen.
                </p>
                <p>
                  (3) Mit der Registrierung bestätigt der Kunde, dass er ausschließlich zu gewerblichen Zwecken handelt und kein Verbraucher ist.
                </p>
                <p>
                  (4) Vertragspartner ist:<br />
                  <strong>Trademark24-7 AG</strong><br />
                  Kantonsstrasse 1<br />
                  8807 Freienbach SZ<br />
                  Schweiz<br />
                  Handelsregister: CHE-246.473.858
                </p>
              </div>
            </section>

            {/* § 2 */}
            <section className="bg-dark p-6 rounded border border-gold/20">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 2 GEWERBENACHWEIS
              </h2>
              <div className="space-y-3 text-white">
                <p>
                  (1) Der Kunde ist verpflichtet, bei der Registrierung seinen Gewerbenachweis durch Angabe der Umsatzsteuer-Identifikationsnummer (USt-IdNr.) oder Handelsregisternummer zu erbringen.
                </p>
                <p>
                  (2) Die Trademark24-7 AG behält sich das Recht vor, den Gewerbenachweis jederzeit zu überprüfen und bei Zweifeln an der Unternehmereigenschaft den Vertrag fristlos zu kündigen.
                </p>
                <p>
                  (3) Bei Falschangaben haftet der Kunde für alle entstehenden Schäden und stellt die Trademark24-7 AG von sämtlichen Ansprüchen Dritter frei.
                </p>
              </div>
            </section>

            {/* § 3 */}
            <section className="bg-dark p-6 rounded border border-gold/20">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 3 VERTRAGSSCHLUSS
              </h2>
              <div className="space-y-3 text-white">
                <p>
                  (1) Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot dar, sondern eine Aufforderung zur Abgabe einer Bestellung.
                </p>
                <p>
                  (2) Durch Anklicken des Buttons "Zahlungspflichtig bestellen" gibt der Kunde ein verbindliches Angebot ab.
                </p>
                <p>
                  (3) Der Vertrag kommt erst mit der Auftragsbestätigung per E-Mail oder durch Lieferung der Ware zustande.
                </p>
              </div>
            </section>

            {/* § 4 */}
            <section className="bg-dark p-6 rounded border border-gold/20">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 4 PREISE UND ZAHLUNGSBEDINGUNGEN
              </h2>
              <div className="space-y-3 text-white">
                <p>
                  (1) Alle Preise verstehen sich netto zuzüglich der jeweils geltenden gesetzlichen Mehrwertsteuer.
                </p>
                <p>
                  (2) Die Zahlung erfolgt ausschließlich per Kreditkarte oder anderen von uns angebotenen Zahlungsmethoden über unseren Zahlungsdienstleister Stripe.
                </p>
                <p>
                  (3) Rechnungen sind sofort fällig. Bei Zahlungsverzug werden Verzugszinsen in Höhe von 9 Prozentpunkten über dem jeweiligen Basiszinssatz berechnet.
                </p>
              </div>
            </section>

            {/* § 5 */}
            <section className="bg-dark p-6 rounded border border-gold/20">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 5 LIEFERUNG UND GEFAHRÜBERGANG
              </h2>
              <div className="space-y-3 text-white">
                <p>
                  (1) Die Lieferzeit beträgt in der Regel 5-15 Werktage, sofern nicht anders angegeben.
                </p>
                <p>
                  (2) Die Gefahr des zufälligen Untergangs und der zufälligen Verschlechterung geht mit der Übergabe an den Spediteur oder Frachtführer auf den Kunden über.
                </p>
                <p>
                  (3) Teillieferungen sind zulässig, soweit sie für den Kunden zumutbar sind.
                </p>
              </div>
            </section>

            {/* § 6 */}
            <section className="bg-dark p-6 rounded border border-gold/20">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 6 EIGENTUMSVORBEHALT
              </h2>
              <div className="space-y-3 text-white">
                <p>
                  (1) Die gelieferte Ware bleibt bis zur vollständigen Bezahlung aller Forderungen aus der Geschäftsverbindung Eigentum der Trademark24-7 AG.
                </p>
                <p>
                  (2) Der Kunde ist berechtigt, die Ware im ordnungsgemäßen Geschäftsverkehr weiterzuveräußern. Er tritt bereits jetzt alle Forderungen aus der Weiterveräußerung an uns ab.
                </p>
              </div>
            </section>

            {/* § 7 */}
            <section className="bg-dark p-6 rounded border border-gold/20">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 7 MÄNGELRÜGE UND GEWÄHRLEISTUNG
              </h2>
              <div className="space-y-3 text-white">
                <p>
                  (1) Der Kunde ist verpflichtet, die Ware unverzüglich nach Erhalt zu untersuchen und offensichtliche Mängel innerhalb von 5 Werktagen schriftlich zu rügen.
                </p>
                <p>
                  (2) Verdeckte Mängel sind unverzüglich nach Entdeckung, spätestens jedoch innerhalb von 6 Monaten nach Lieferung zu rügen.
                </p>
                <p>
                  (3) Bei berechtigten Mängelrügen steht uns das Recht zur Nacherfüllung zu. Schlägt die Nacherfüllung zweimal fehl, kann der Kunde nach seiner Wahl Minderung oder Rücktritt verlangen.
                </p>
                <p>
                  (4) Schadensersatzansprüche wegen Mängeln sind ausgeschlossen, soweit nicht Vorsatz oder grobe Fahrlässigkeit vorliegt.
                </p>
              </div>
            </section>

            {/* § 8 */}
            <section className="bg-dark p-6 rounded border border-gold/20">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 8 HAFTUNGSBESCHRÄNKUNG
              </h2>
              <div className="space-y-3 text-white">
                <p>
                  (1) Die Trademark24-7 AG haftet unbeschränkt nur für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie für Schäden, die auf Vorsatz oder grober Fahrlässigkeit beruhen.
                </p>
                <p>
                  (2) Im Übrigen ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden begrenzt.
                </p>
                <p>
                  (3) Die Haftung für mittelbare Schäden, Folgeschäden und entgangenen Gewinn ist ausgeschlossen.
                </p>
                <p>
                  (4) Die Haftung ist der Höhe nach auf den Auftragswert begrenzt.
                </p>
              </div>
            </section>

            {/* § 9 */}
            <section className="bg-red-500/10 border-2 border-red-500/40 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-red-400 mb-4">
                § 9 KEIN WIDERRUFSRECHT
              </h2>
              <div className="space-y-3 text-white">
                <p>
                  (1) Da das Warenpakete Portal ausschließlich an Gewerbetreibende verkauft, besteht <strong className="text-red-400 uppercase">KEIN</strong> gesetzliches Widerrufsrecht.
                </p>
                <p>
                  (2) Das Widerrufsrecht für Verbraucher gemäß Art. 9 ff. der Richtlinie 2011/83/EU bzw. § 312g BGB findet keine Anwendung.
                </p>
                <p>
                  (3) Kulanzrücknahmen sind ausgeschlossen.
                </p>
              </div>
            </section>

            {/* § 10 */}
            <section className="bg-orange-500/10 border-2 border-orange-500/40 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                § 10 AUSSCHLUSS DES ORDENTLICHEN RECHTSWEGS
              </h2>
              <div className="space-y-3 text-white">
                <p>
                  (1) <strong className="text-orange-400 uppercase">FÜR ALLE STREITIGKEITEN AUS ODER IM ZUSAMMENHANG MIT DIESEM VERTRAG IST DER ORDENTLICHE RECHTSWEG AUSGESCHLOSSEN.</strong>
                </p>
                <p>
                  (2) Alle Streitigkeiten werden ausschließlich durch ein Schlichtungsverfahren vor der zuständigen Schlichtungsstelle in der Schweiz beigelegt.
                </p>
                <p>
                  (3) Zuständige Schlichtungsstelle ist:<br />
                  Schweizerische Kammer für Wirtschaftsmediation und Schiedsgerichtsbarkeit<br />
                  oder eine andere von der Trademark24-7 AG benannte anerkannte Schlichtungsstelle in der Schweiz.
                </p>
                <p>
                  (4) Die Kosten des Schlichtungsverfahrens trägt die unterliegende Partei, bei Teilunterliegen werden die Kosten entsprechend geteilt.
                </p>
                <p>
                  (5) Das Schlichtungsverfahren ist Voraussetzung für jegliche weitere rechtliche Schritte.
                </p>
              </div>
            </section>

            {/* § 11 */}
            <section className="bg-dark p-6 rounded border border-gold/20">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 11 ANWENDBARES RECHT
              </h2>
              <div className="space-y-3 text-white">
                <p>
                  (1) Es gilt ausschließlich das Recht der Schweizerischen Eidgenossenschaft unter Ausschluss des UN-Kaufrechts (CISG).
                </p>
                <p>
                  (2) Gerichtsstand für alle Streitigkeiten, soweit ein Gerichtsverfahren nach erfolglosem Schlichtungsverfahren zulässig ist, ist Freienbach, Kanton Schwyz, Schweiz.
                </p>
              </div>
            </section>

            {/* § 12 */}
            <section className="bg-dark p-6 rounded border border-gold/20">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 12 VERTRAULICHKEIT
              </h2>
              <div className="space-y-3 text-white">
                <p>
                  (1) Der Kunde verpflichtet sich, alle im Rahmen der Geschäftsbeziehung erhaltenen Informationen über Preise, Konditionen und Lieferquellen vertraulich zu behandeln.
                </p>
                <p>
                  (2) Diese Vertraulichkeitspflicht gilt auch nach Beendigung der Geschäftsbeziehung fort.
                </p>
              </div>
            </section>

            {/* § 13 */}
            <section className="bg-dark p-6 rounded border border-gold/20">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 13 SALVATORISCHE KLAUSEL
              </h2>
              <div className="space-y-3 text-white">
                <p>
                  (1) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
                </p>
                <p>
                  (2) Anstelle der unwirksamen Bestimmung gilt diejenige wirksame Bestimmung als vereinbart, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.
                </p>
              </div>
            </section>

            {/* § 14 */}
            <section className="bg-dark p-6 rounded border border-gold/20">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                § 14 ÄNDERUNGEN DER AGB
              </h2>
              <div className="space-y-3 text-white">
                <p>
                  (1) Die Trademark24-7 AG behält sich das Recht vor, diese AGB jederzeit zu ändern.
                </p>
                <p>
                  (2) Änderungen werden dem Kunden per E-Mail mitgeteilt und gelten als genehmigt, wenn der Kunde nicht innerhalb von 14 Tagen widerspricht.
                </p>
              </div>
            </section>

            <div className="mt-12 pt-6 border-t border-gold/20">
              <p className="text-white font-semibold">Trademark24-7 AG</p>
              <p className="text-gray-400">Kantonsstrasse 1</p>
              <p className="text-gray-400">8807 Freienbach SZ</p>
              <p className="text-gray-400">Schweiz</p>
              <p className="text-gray-400 mt-4">Stand: Januar 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
