/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum | Warenpakete Portal',
  description: 'Impressum und rechtliche Angaben',
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark-light rounded-lg shadow-xl p-8 border border-gold/20">
          <h1 className="text-4xl font-bold text-gold mb-8">Impressum</h1>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                Angaben gemäß schweizerischem Recht:
              </h2>
              <div className="bg-dark p-4 rounded border border-gold/20">
                <p className="text-white"><strong>Trademark24-7 AG</strong></p>
                <p className="text-white">Kantonsstrasse 1</p>
                <p className="text-white">8807 Freienbach SZ</p>
                <p className="text-white">Schweiz</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                Handelsregister
              </h2>
              <div className="bg-dark p-4 rounded border border-gold/20">
                <p className="text-white"><strong>Handelsregister:</strong> CHE-246.473.858</p>
                <p className="text-white"><strong>Registergericht:</strong> Handelsregisteramt Kanton Schwyz</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">Kontakt</h2>
              <div className="bg-dark p-4 rounded border border-gold/20">
                <p className="text-white">
                  <strong>E-Mail:</strong>{' '}
                  <a
                    href="mailto:info@ecommercerente.com"
                    className="text-gold hover:text-gold/80 underline"
                  >
                    info@ecommercerente.com
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                Vertretungsberechtigte Geschäftsführung
              </h2>
              <div className="bg-dark p-4 rounded border border-gold/20">
                <p className="text-white">[Name des Geschäftsführers einfügen]</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                Umsatzsteuer-Identifikationsnummer
              </h2>
              <div className="bg-dark p-4 rounded border border-gold/20">
                <p className="text-white">CHE-246.473.858 MWST</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
