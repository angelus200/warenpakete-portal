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
                Plattformbetreiber (kein Vertragspartner):
              </h2>
              <div className="bg-[#ebebeb] p-4 rounded border border-gray-300">
                <p className="text-gray-900 mb-2"><strong>Marketplace24-7 GmbH</strong></p>
                <p className="text-gray-900">Kantonsstrasse 1</p>
                <p className="text-gray-900">8807 Freienbach SZ</p>
                <p className="text-gray-900">Schweiz</p>
                <p className="text-gray-900 mt-4">
                  <strong>E-Mail:</strong>{' '}
                  <a
                    href="mailto:info@non-dom.group"
                    className="text-gold hover:text-gold/80 underline"
                  >
                    info@non-dom.group
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-4">
              <h2 className="text-lg font-semibold text-gold mb-4">
                Handelsregister
              </h2>
              <div className="bg-[#ebebeb] p-4 rounded border border-gray-300">
                <p className="text-gray-900"><strong>Handelsregister:</strong> CH-130.4.033.363-2</p>
                <p className="text-gray-900"><strong>Registergericht:</strong> Kanton Schwyz</p>
              </div>
            </section>

            <section className="mb-4">
              <h2 className="text-lg font-semibold text-gold mb-4">Hinweis</h2>
              <div className="bg-[#ebebeb] p-4 rounded border border-gray-300">
                <p className="text-gray-900 leading-relaxed">
                  Die Marketplace24-7 GmbH ist ausschließlich Betreiber dieser Plattform und vermittelt
                  Kontakte zwischen Gewerbetreibenden. Sie ist nicht Vertragspartner der über die Plattform
                  geschlossenen Geschäfte.
                </p>
              </div>
            </section>

            <section className="mb-4">
              <h2 className="text-lg font-semibold text-gold mb-4">Haftungsausschluss</h2>
              <div className="bg-[#ebebeb] p-4 rounded border border-gray-300">
                <p className="text-gray-900 leading-relaxed">
                  Die Marketplace24-7 GmbH übernimmt keine Haftung für die Richtigkeit, Vollständigkeit
                  und Aktualität der bereitgestellten Inhalte. Die Plattform enthält Links zu Informationen
                  Dritter, auf deren Inhalte die Marketplace24-7 GmbH keinen Einfluss hat und für die sie
                  keine Gewähr übernimmt.
                </p>
              </div>
            </section>

            <section className="mb-4">
              <h2 className="text-lg font-semibold text-gold mb-4">Urheberrecht</h2>
              <div className="bg-[#ebebeb] p-4 rounded border border-gray-300">
                <p className="text-gray-900 leading-relaxed">
                  Die Inhalte dieser Webseite sind urheberrechtlich geschützt. Jegliche Vervielfältigung,
                  Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes
                  bedürfen der schriftlichen Zustimmung.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
