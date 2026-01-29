/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz | Warenpakete Portal',
  description: 'Datenschutzerklärung',
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark-light rounded-lg shadow-xl p-8 border border-gold/20">
          <h1 className="text-4xl font-bold text-gold mb-8">
            Datenschutzerklärung
          </h1>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <p className="text-white text-lg leading-relaxed mb-4">
                Die Datenschutzerklärung für das Warenpakete Portal finden Sie unter:
              </p>
              <div className="bg-dark p-6 rounded border border-gold/20">
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

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                Geltungsbereich
              </h2>
              <p className="text-white">
                Diese Datenschutzerklärung gilt für alle Dienste der Trademark24-7 AG.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                Kontakt zum Datenschutz
              </h2>
              <div className="bg-dark p-4 rounded border border-gold/20">
                <p className="text-white mb-2">
                  Bei Fragen zum Datenschutz wenden Sie sich bitte an:
                </p>
                <p className="text-white">
                  <a
                    href="mailto:datenschutz@ecommercerente.com"
                    className="text-gold hover:text-gold/80 underline"
                  >
                    datenschutz@ecommercerente.com
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                Verantwortliche Stelle
              </h2>
              <div className="bg-dark p-4 rounded border border-gold/20">
                <p className="text-white"><strong>Trademark24-7 AG</strong></p>
                <p className="text-white">Kantonsstrasse 1</p>
                <p className="text-white">8807 Freienbach SZ</p>
                <p className="text-white">Schweiz</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
