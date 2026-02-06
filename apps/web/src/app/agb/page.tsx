/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AGB | E-Commerce Service',
  description: 'Allgemeine Geschäftsbedingungen',
};

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-[#ebebeb] py-3">
      <div className="max-w-4xl mx-auto px-4 sm:px-3 lg:px-4">
        <div className="bg-white rounded-lg shadow-xl p-4 border border-gray-300">
          <h1 className="text-lg font-bold text-gold mb-4">
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>
          <p className="text-gold/80 text-lg mb-2">
            der Marketplace24-7 GmbH für die Plattform ecommercerente.com
          </p>
          <p className="text-gray-600 mb-6">Stand: Februar 2026</p>

          <div className="prose prose-invert max-w-none space-y-6">
            {/* § 1 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                § 1 Geltungsbereich und Begriffsbestimmungen
              </h2>
              <div className="space-y-3 text-gray-900 text-sm">
                <p>
                  (1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Plattform
                  ecommercerente.com, betrieben von der Marketplace24-7 GmbH, Kantonsstrasse 1, 8807 Freienbach SZ,
                  Schweiz (nachfolgend "Plattformbetreiber").
                </p>
                <p>
                  (2) Die Plattform richtet sich ausschließlich an Unternehmer im Sinne von § 14 BGB bzw.
                  Gewerbetreibende. Verbraucher im Sinne von § 13 BGB sind von der Nutzung ausgeschlossen.
                </p>
                <p>
                  (3) Der Plattformbetreiber stellt lediglich die technische Infrastruktur zur Verfügung und vermittelt
                  Kontakte zwischen Gewerbetreibenden. Der Plattformbetreiber ist nicht Vertragspartner der zwischen
                  den Nutzern geschlossenen Geschäfte.
                </p>
              </div>
            </section>

            {/* § 2 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                § 2 Leistungen der Plattform
              </h2>
              <div className="space-y-3 text-gray-900 text-sm">
                <p>
                  (1) Der Plattformbetreiber bietet eine Online-Plattform, auf der Gewerbetreibende Warenpakete
                  erwerben und optional Kommissionsverkauf-Dienstleistungen in Anspruch nehmen können.
                </p>
                <p>
                  (2) Die Darstellung der Waren auf der Plattform stellt kein rechtlich bindendes Angebot dar, sondern
                  eine Aufforderung zur Angebotsabgabe.
                </p>
                <p>
                  (3) Der Plattformbetreiber übernimmt keine Garantie für den Verkaufserfolg von Waren. Berechnungen
                  und Prognosen auf der Plattform dienen ausschließlich der Orientierung und stellen keine Zusicherung
                  von Ergebnissen dar.
                </p>
              </div>
            </section>

            {/* § 3 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                § 3 Registrierung und Nutzerkonto
              </h2>
              <div className="space-y-3 text-gray-900 text-sm">
                <p>
                  (1) Die Nutzung der Plattform erfordert eine Registrierung. Der Nutzer versichert bei der
                  Registrierung, dass er Gewerbetreibender ist und alle Angaben wahrheitsgemäß erfolgen.
                </p>
                <p>
                  (2) Der Nutzer ist verpflichtet, seine Zugangsdaten geheim zu halten und vor dem Zugriff Dritter zu
                  schützen.
                </p>
                <p>
                  (3) Der Plattformbetreiber ist berechtigt, Nutzerkonten bei Verstoß gegen diese AGB oder bei Verdacht
                  auf missbräuchliche Nutzung zu sperren oder zu löschen.
                </p>
              </div>
            </section>

            {/* § 4 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                § 4 Vertragsschluss und Vertragspartner
              </h2>
              <div className="space-y-3 text-gray-900 text-sm">
                <p>
                  (1) Verträge über den Kauf von Warenpaketen kommen zwischen dem jeweiligen Verkäufer und dem Käufer
                  zustande, nicht mit dem Plattformbetreiber.
                </p>
                <p>
                  (2) Der Plattformbetreiber ist lediglich Vermittler und wird nicht Vertragspartei der Kaufverträge.
                </p>
                <p>
                  (3) Bei Inanspruchnahme von Kommissionsverkauf-Dienstleistungen gelten gesonderte
                  Kommissionsvereinbarungen.
                </p>
              </div>
            </section>

            {/* § 5 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                § 5 Haftungsausschluss und -begrenzung
              </h2>
              <div className="space-y-3 text-gray-900 text-sm">
                <p>(1) Der Plattformbetreiber haftet nicht für:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Die Qualität, Rechtmäßigkeit oder Verfügbarkeit der angebotenen Waren</li>
                  <li>Die Erfüllung von Verträgen zwischen Nutzern</li>
                  <li>Entgangenen Gewinn oder wirtschaftliche Verluste der Nutzer</li>
                  <li>Den Erfolg von Verkaufsaktivitäten</li>
                  <li>Schäden aus der Nutzung oder Unmöglichkeit der Nutzung der Plattform</li>
                </ul>
                <p>
                  (2) Die Haftung des Plattformbetreibers ist in jedem Fall auf Vorsatz und grobe Fahrlässigkeit
                  beschränkt.
                </p>
                <p>
                  (3) Die Haftung für mittelbare Schäden, Folgeschäden und entgangenen Gewinn ist ausgeschlossen.
                </p>
                <p>
                  (4) Schadensersatzansprüche gegen den Plattformbetreiber sind der Höhe nach auf die vom Nutzer
                  gezahlten Plattformgebühren der letzten 12 Monate begrenzt.
                </p>
              </div>
            </section>

            {/* § 6 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                § 6 Freistellung
              </h2>
              <div className="space-y-3 text-gray-900 text-sm">
                <p>
                  Der Nutzer stellt den Plattformbetreiber von sämtlichen Ansprüchen Dritter frei, die aufgrund einer
                  Verletzung von Rechten durch den Nutzer oder aufgrund der vom Nutzer eingestellten Inhalte oder
                  angebotenen Waren geltend gemacht werden, einschließlich der angemessenen Rechtsverfolgungs- und
                  Verteidigungskosten.
                </p>
              </div>
            </section>

            {/* § 7 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                § 7 Kein Anlageprodukt
              </h2>
              <div className="space-y-3 text-gray-900 text-sm">
                <p>
                  (1) Die auf der Plattform angebotenen Warenpakete sind Handelswaren und keine Finanz- oder
                  Anlageprodukte.
                </p>
                <p>
                  (2) Der Erwerb von Warenpaketen erfolgt auf eigenes unternehmerisches Risiko. Es bestehen keine
                  Gewinn- oder Renditegarantien.
                </p>
                <p>(3) Vergangene Verkaufserfolge sind keine Garantie für zukünftige Ergebnisse.</p>
              </div>
            </section>

            {/* § 8 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                § 8 Datenschutz
              </h2>
              <div className="space-y-3 text-gray-900 text-sm">
                <p>
                  Die Verarbeitung personenbezogener Daten erfolgt gemäß der separat aufgeführten
                  Datenschutzerklärung.
                </p>
              </div>
            </section>

            {/* § 9 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                § 9 Änderungen der AGB
              </h2>
              <div className="space-y-3 text-gray-900 text-sm">
                <p>(1) Der Plattformbetreiber behält sich vor, diese AGB jederzeit zu ändern.</p>
                <p>
                  (2) Änderungen werden den Nutzern per E-Mail oder bei der nächsten Anmeldung mitgeteilt. Widerspricht
                  der Nutzer nicht innerhalb von 14 Tagen nach Zugang der Mitteilung, gelten die geänderten AGB als
                  angenommen.
                </p>
              </div>
            </section>

            {/* § 10 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                § 10 Anwendbares Recht
              </h2>
              <div className="space-y-3 text-gray-900 text-sm">
                <p>
                  Auf sämtliche Rechtsbeziehungen zwischen dem Plattformbetreiber und dem Nutzer findet ausschließlich
                  Schweizer Recht Anwendung unter Ausschluss des UN-Kaufrechts (CISG) und kollisionsrechtlicher
                  Verweisungsnormen.
                </p>
              </div>
            </section>

            {/* § 11 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                § 11 Schiedsgerichtsvereinbarung
              </h2>
              <div className="space-y-3 text-gray-900 text-sm">
                <p>
                  (1) Alle Streitigkeiten, die sich aus oder im Zusammenhang mit diesen AGB oder der Nutzung der
                  Plattform ergeben, werden unter Ausschluss der ordentlichen Gerichte endgültig entschieden durch ein
                  Schiedsgericht nach der Schweizerischen Schiedsordnung der Swiss Chambers' Arbitration Institution.
                </p>
                <p>(2) Sitz des Schiedsgerichts ist Zürich, Schweiz.</p>
                <p>(3) Die Sprache des Schiedsverfahrens ist Deutsch.</p>
                <p>(4) Das Schiedsgericht besteht aus einem Einzelschiedsrichter.</p>
                <p>(5) Diese Schiedsklausel gilt auch nach Beendigung des Vertragsverhältnisses fort.</p>
              </div>
            </section>

            {/* § 12 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                § 12 Salvatorische Klausel
              </h2>
              <div className="space-y-3 text-gray-900 text-sm">
                <p>
                  Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, so wird hierdurch die Gültigkeit
                  der übrigen Bestimmungen nicht berührt. Anstelle der unwirksamen Bestimmung gilt eine solche als
                  vereinbart, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.
                </p>
              </div>
            </section>

            <div className="mt-6 pt-4 border-t border-gray-300">
              <p className="text-gray-900 font-semibold">Marketplace24-7 GmbH</p>
              <p className="text-gray-600">Freienbach, Februar 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
