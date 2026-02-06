/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz | E-Commerce Service',
  description: 'Datenschutzerklärung',
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-[#ebebeb] py-3">
      <div className="max-w-4xl mx-auto px-4 sm:px-3 lg:px-4">
        <div className="bg-white rounded-lg shadow-xl p-4 border border-gray-300">
          <h1 className="text-lg font-bold text-gold mb-4">
            Datenschutzerklärung
          </h1>

          <div className="prose prose-invert max-w-none space-y-6">
            {/* § 1 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                1. Verantwortlicher für die Datenverarbeitung
              </h2>
              <div className="text-gray-900">
                <p className="mb-2"><strong>Marketplace24-7 GmbH</strong></p>
                <p>Kantonsstrasse 1</p>
                <p>8807 Freienbach SZ</p>
                <p>Schweiz</p>
                <p className="mt-2">E-Mail: info@non-dom.group</p>
              </div>
            </section>

            {/* § 2 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                2. Allgemeine Hinweise
              </h2>
              <div className="space-y-3 text-gray-900">
                <p>
                  Die Betreiber dieser Plattform nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
                  Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen
                  Datenschutzvorschriften (Schweizer DSG, EU-DSGVO soweit anwendbar) sowie dieser Datenschutzerklärung.
                </p>
                <p>
                  Diese Plattform richtet sich ausschließlich an Gewerbetreibende (B2B). Mit der Nutzung
                  bestätigen Sie, dass Sie als Unternehmer im Sinne des Gesetzes handeln.
                </p>
              </div>
            </section>

            {/* § 3 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                3. Datenerfassung auf dieser Website
              </h2>
              <div className="space-y-3 text-gray-900">
                <p>
                  Die Datenverarbeitung erfolgt durch den Plattformbetreiber. Ihre Daten werden erhoben,
                  wenn Sie uns diese mitteilen (z.B. Registrierung, Kontaktformular). Andere Daten werden
                  automatisch beim Besuch der Website durch unsere IT-Systeme erfasst (technische Daten wie
                  Browser, IP-Adresse, Zeitpunkt des Zugriffs).
                </p>
              </div>
            </section>

            {/* § 4 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                4. Nutzung der Daten
              </h2>
              <div className="text-gray-900">
                <p className="mb-2">Wir nutzen Ihre Daten für:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Bereitstellung und Betrieb der Plattform</li>
                  <li>Kommunikation bezüglich Ihrer Anfragen</li>
                  <li>Abwicklung von Transaktionen zwischen Nutzern</li>
                  <li>Verbesserung unserer Dienste</li>
                </ul>
              </div>
            </section>

            {/* § 5 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                5. Weitergabe von Daten
              </h2>
              <div className="text-gray-900">
                <p className="mb-2">Eine Weitergabe Ihrer Daten erfolgt nur:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>An Vertragspartner zur Abwicklung von Geschäften (z.B. Fulfillment-Dienstleister)</li>
                  <li>Bei gesetzlicher Verpflichtung</li>
                  <li>Mit Ihrer ausdrücklichen Einwilligung</li>
                </ul>
              </div>
            </section>

            {/* § 6 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                6. Speicherdauer
              </h2>
              <div className="space-y-3 text-gray-900">
                <p>
                  Ihre Daten werden gelöscht, sobald der Zweck der Speicherung entfällt, es sei denn,
                  gesetzliche Aufbewahrungsfristen stehen dem entgegen.
                </p>
              </div>
            </section>

            {/* § 7 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                7. Ihre Rechte
              </h2>
              <div className="text-gray-900">
                <p className="mb-2">Sie haben das Recht auf:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Auskunft über Ihre gespeicherten Daten</li>
                  <li>Berichtigung unrichtiger Daten</li>
                  <li>Löschung Ihrer Daten</li>
                  <li>Einschränkung der Verarbeitung</li>
                  <li>Datenübertragbarkeit</li>
                  <li>Widerspruch gegen die Verarbeitung</li>
                </ul>
                <p className="mt-3">Kontaktieren Sie uns hierzu unter: info@non-dom.group</p>
              </div>
            </section>

            {/* § 8 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                8. Cookies und Analyse
              </h2>
              <div className="space-y-3 text-gray-900">
                <p>
                  Diese Website verwendet Cookies für die Funktionalität der Plattform. Durch die Nutzung
                  stimmen Sie der Verwendung technisch notwendiger Cookies zu.
                </p>
              </div>
            </section>

            {/* § 9 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                9. SSL-Verschlüsselung
              </h2>
              <div className="space-y-3 text-gray-900">
                <p>
                  Diese Seite nutzt aus Sicherheitsgründen SSL-Verschlüsselung. Eine verschlüsselte
                  Verbindung erkennen Sie an "https://" in der Adresszeile.
                </p>
              </div>
            </section>

            {/* § 10 */}
            <section className="bg-[#ebebeb] p-4 rounded border border-gray-300">
              <h2 className="text-lg font-semibold text-gold mb-3">
                10. Änderungen
              </h2>
              <div className="space-y-3 text-gray-900">
                <p>
                  Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an rechtliche
                  Entwicklungen oder Änderungen unserer Dienste anzupassen.
                </p>
              </div>
            </section>

            <div className="mt-6 pt-4 border-t border-gray-300">
              <p className="text-gray-600 text-sm">Stand: Februar 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
