/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum | E-Commerce Rente',
  description: 'Impressum und rechtliche Angaben',
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark-light rounded-lg shadow-xl p-8 border border-gold/20">
          <h1 className="text-4xl font-bold text-gold mb-8">Impressum</h1>

          <div className="prose prose-invert max-w-none">
            <div className="bg-gold/10 border-l-4 border-gold p-4 mb-6">
              <p className="text-gold font-semibold">
                ⚠️ WICHTIG: Diese Angaben müssen vom Betreiber ausgefüllt werden!
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                Angaben gemäß § 5 TMG
              </h2>
              <div className="bg-dark p-4 rounded border border-gold/20">
                <p className="text-white"><strong>Firmenname:</strong> [FIRMA EINTRAGEN]</p>
                <p className="text-white"><strong>Geschäftsführer:</strong> [NAME EINTRAGEN]</p>
                <p className="text-white"><strong>Anschrift:</strong></p>
                <p className="text-white ml-4">
                  [STRASSE UND HAUSNUMMER]<br />
                  [PLZ ORT]<br />
                  [LAND]
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">Kontakt</h2>
              <div className="bg-dark p-4 rounded border border-gold/20">
                <p className="text-white"><strong>Telefon:</strong> [TELEFONNUMMER EINTRAGEN]</p>
                <p className="text-white"><strong>E-Mail:</strong> [EMAIL EINTRAGEN]</p>
                <p className="text-white"><strong>Website:</strong> https://www.ecommercerente.com</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                Registereintrag
              </h2>
              <div className="bg-dark p-4 rounded border border-gold/20">
                <p className="text-white"><strong>Registergericht:</strong> [GERICHT EINTRAGEN]</p>
                <p className="text-white"><strong>Registernummer:</strong> [HRB-NUMMER EINTRAGEN]</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                Umsatzsteuer-ID
              </h2>
              <div className="bg-dark p-4 rounded border border-gold/20">
                <p className="text-white">
                  Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
                </p>
                <p className="text-white font-mono mt-2">[UST-ID EINTRAGEN, z.B. DE123456789]</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <div className="bg-dark p-4 rounded border border-gold/20">
                <p className="text-white">[NAME EINTRAGEN]</p>
                <p className="text-white">[ADRESSE EINTRAGEN]</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                EU-Streitschlichtung
              </h2>
              <p className="text-white">
                Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung (OS) bereit:{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80 underline"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p className="text-white mt-2">
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">
                Verbraucherstreitbeilegung
              </h2>
              <p className="text-white">
                Wir sind nicht bereit oder verpflichtet, an
                Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
                teilzunehmen.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
