/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum | E-Commerce Service',
  description: 'Impressum und rechtliche Angaben',
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-[#ebebeb] py-3">
      <div className="max-w-4xl mx-auto px-4 sm:px-3 lg:px-4">
        <div className="bg-white rounded-lg shadow-xl p-4 border border-gray-300">
          <h1 className="text-lg font-bold text-gold mb-4">Impressum</h1>

          <div className="prose prose-invert max-w-none">
            <section className="mb-4">
              <h2 className="text-lg font-semibold text-gold mb-4">
                Angaben gemäß schweizerischem Recht:
              </h2>
              <div className="bg-[#ebebeb] p-4 rounded border border-gray-300">
                <p className="text-gray-900"><strong>Trademark24-7 AG</strong></p>
                <p className="text-gray-900">Kantonsstrasse 1</p>
                <p className="text-gray-900">8807 Freienbach SZ</p>
                <p className="text-gray-900">Schweiz</p>
              </div>
            </section>

            <section className="mb-4">
              <h2 className="text-lg font-semibold text-gold mb-4">
                Handelsregister
              </h2>
              <div className="bg-[#ebebeb] p-4 rounded border border-gray-300">
                <p className="text-gray-900"><strong>Handelsregister:</strong> CHE-246.473.858</p>
                <p className="text-gray-900"><strong>Registergericht:</strong> Handelsregisteramt Kanton Schwyz</p>
              </div>
            </section>

            <section className="mb-4">
              <h2 className="text-lg font-semibold text-gold mb-4">Kontakt</h2>
              <div className="bg-[#ebebeb] p-4 rounded border border-gray-300">
                <p className="text-gray-900">
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

            <section className="mb-4">
              <h2 className="text-lg font-semibold text-gold mb-4">
                Vertretungsberechtigte Geschäftsführung
              </h2>
              <div className="bg-[#ebebeb] p-4 rounded border border-gray-300">
                <p className="text-gray-900">[Name des Geschäftsführers einfügen]</p>
              </div>
            </section>

            <section className="mb-4">
              <h2 className="text-lg font-semibold text-gold mb-4">
                Umsatzsteuer-Identifikationsnummer
              </h2>
              <div className="bg-[#ebebeb] p-4 rounded border border-gray-300">
                <p className="text-gray-900">CHE-246.473.858 MWST</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
