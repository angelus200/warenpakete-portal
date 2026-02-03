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

          <div className="prose prose-invert max-w-none">
            <section className="mb-4">
              <p className="text-gray-900 text-lg leading-relaxed mb-4">
                Die Datenschutzerklärung für das E-Commerce Service finden Sie unter:
              </p>
              <div className="bg-[#ebebeb] p-3 rounded border border-gray-300">
                <a
                  href="https://brands-wanted.com/policies/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-light underline text-lg font-semibold"
                >
                  https://brands-wanted.com/policies/privacy-policy
                </a>
              </div>
            </section>

            <section className="mb-4">
              <h2 className="text-lg font-semibold text-gold mb-4">
                Geltungsbereich
              </h2>
              <p className="text-gray-900">
                Diese Datenschutzerklärung gilt für alle Dienste der Trademark24-7 AG.
              </p>
            </section>

            <section className="mb-4">
              <h2 className="text-lg font-semibold text-gold mb-4">
                Kontakt zum Datenschutz
              </h2>
              <div className="bg-[#ebebeb] p-4 rounded border border-gray-300">
                <p className="text-gray-900 mb-2">
                  Bei Fragen zum Datenschutz wenden Sie sich bitte an:
                </p>
                <p className="text-gray-900">
                  <a
                    href="mailto:datenschutz@ecommercerente.com"
                    className="text-gold hover:text-gold/80 underline"
                  >
                    datenschutz@ecommercerente.com
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-4">
              <h2 className="text-lg font-semibold text-gold mb-4">
                Verantwortliche Stelle
              </h2>
              <div className="bg-[#ebebeb] p-4 rounded border border-gray-300">
                <p className="text-gray-900"><strong>Trademark24-7 AG</strong></p>
                <p className="text-gray-900">Kantonsstrasse 1</p>
                <p className="text-gray-900">8807 Freienbach SZ</p>
                <p className="text-gray-900">Schweiz</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
