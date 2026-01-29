/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Widerrufsrecht | Warenpakete Portal',
  description: 'Kein Widerrufsrecht für B2B-Kunden',
};

export default function WiderrufsrechtPage() {
  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">
          KEIN WIDERRUFSRECHT FÜR B2B-KUNDEN
        </h1>

        <div className="bg-red-500/10 border-2 border-red-500/40 rounded-lg p-8 mb-8">
          <div className="flex items-start gap-4">
            <svg className="w-12 h-12 text-red-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h2 className="text-3xl font-bold text-red-400 mb-4">
                Das Warenpakete Portal der Trademark24-7 AG verkauft ausschließlich an Gewerbetreibende (B2B).
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Als Unternehmer im Sinne von Art. 2 lit. b der Richtlinie 2011/83/EU bzw. § 14 BGB steht Ihnen <strong className="text-red-400 uppercase">KEIN</strong> gesetzliches Widerrufsrecht zu.
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-6">
          <div className="bg-dark-light p-6 rounded-lg border border-gold/20">
            <h3 className="text-xl font-bold text-gold mb-3">WICHTIGER HINWEIS</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Das Widerrufsrecht für Verbraucher gemäß:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Art. 9 ff. der Richtlinie 2011/83/EU (EU-Verbraucherrechte-Richtlinie)</li>
              <li>§ 312g BGB (deutsches Recht)</li>
              <li>Art. 40a ff. OR (schweizerisches Recht)</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              findet auf Geschäfte mit unserem Portal <strong className="text-red-400">KEINE ANWENDUNG</strong>.
            </p>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-orange-400 mb-3">KULANZRÜCKNAHMEN SIND AUSGESCHLOSSEN</h3>
            <p className="text-gray-300 leading-relaxed">
              Es besteht keine Kulanzregelung für Rücknahmen. Alle Käufe sind endgültig und verbindlich.
            </p>
          </div>

          <div className="bg-dark-light p-6 rounded-lg border border-gold/20">
            <h3 className="text-xl font-bold text-gold mb-3">Bestätigung bei Bestellung</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              Durch Ihre Bestellung bestätigen Sie, dass Sie:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Als Gewerbetreibender handeln (§ 14 BGB / Art. 2 lit. b Richtlinie 2011/83/EU)</li>
              <li>Über das Fehlen eines Widerrufsrechts informiert wurden</li>
              <li>Die Bindungswirkung des Kaufs akzeptieren</li>
            </ul>
          </div>

          <div className="bg-dark-light p-6 rounded-lg border border-gold/20">
            <h3 className="text-xl font-bold text-gold mb-3">Kontakt</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              Bei Fragen wenden Sie sich bitte an:
            </p>
            <p className="text-gold">
              <a href="mailto:info@ecommercerente.com" className="hover:text-gold-light underline">
                info@ecommercerente.com
              </a>
            </p>
          </div>

          <div className="bg-dark p-6 rounded border border-gold/20 mt-8">
            <p className="text-white font-semibold">Trademark24-7 AG</p>
            <p className="text-gray-400">Kantonsstrasse 1</p>
            <p className="text-gray-400">8807 Freienbach SZ</p>
            <p className="text-gray-400">Schweiz</p>
          </div>
        </div>
      </div>
    </div>
  );
}
