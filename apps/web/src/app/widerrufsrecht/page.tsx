/* eslint-disable react/no-unescaped-entities */

export default function WiderrufsrechtPage() {
  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">
          Widerrufsrecht
        </h1>

        <div className="bg-red-500/10 border-2 border-red-500/40 rounded-lg p-8 mb-8">
          <div className="flex items-start gap-4">
            <svg className="w-12 h-12 text-red-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h2 className="text-3xl font-bold text-red-400 mb-4">
                Kein Widerrufsrecht für B2B-Kunden
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                <strong className="text-gold">Warenpakete Portal verkauft ausschließlich an Gewerbetreibende.</strong>
              </p>
              <p className="text-gray-300 leading-relaxed">
                Das gesetzliche Widerrufsrecht für Verbraucher (§ 312g BGB) findet <strong className="text-red-400">keine Anwendung</strong> auf Verträge zwischen Unternehmern.
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-6">
          <div className="bg-dark-light p-6 rounded-lg border border-gold/20">
            <h3 className="text-xl font-bold text-gold mb-3">Rechtliche Grundlage</h3>
            <p className="text-gray-300 leading-relaxed">
              Gemäß § 312g Abs. 2 Nr. 1 BGB steht das Widerrufsrecht nur Verbrauchern zu.
              Bei Verträgen zwischen Unternehmern (B2B) besteht grundsätzlich kein Widerrufsrecht.
            </p>
          </div>

          <div className="bg-dark-light p-6 rounded-lg border border-gold/20">
            <h3 className="text-xl font-bold text-gold mb-3">Bestätigung bei Registrierung</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              Alle Kunden bestätigen bei der Registrierung ihren Unternehmerstatus und akzeptieren ausdrücklich:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Handlung als Unternehmer im Sinne von § 14 BGB</li>
              <li>Ausschluss des Verbraucherrechts</li>
              <li>Kenntnis über das fehlende Widerrufsrecht</li>
            </ul>
          </div>

          <div className="bg-gold/10 border border-gold/30 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gold mb-3">Kulanzregelungen</h3>
            <p className="text-gray-300 leading-relaxed">
              In Einzelfällen können wir auf freiwilliger Basis Kulanzlösungen anbieten.
              Dies begründet jedoch keinen Rechtsanspruch.
            </p>
            <p className="text-gray-400 text-sm mt-3">
              Kontaktieren Sie uns bei Fragen: support@warenpakete-portal.de
            </p>
          </div>

          <div className="bg-dark-light p-6 rounded-lg border border-gold/20">
            <h3 className="text-xl font-bold text-gold mb-3">Wichtig für Ihre Buchhaltung</h3>
            <p className="text-gray-300 leading-relaxed">
              Als Unternehmer sind alle Käufe betriebliche Transaktionen und müssen entsprechend
              in Ihrer Buchhaltung erfasst werden. Wir empfehlen die Aufbewahrung aller Rechnungen
              für mindestens 10 Jahre gemäß § 147 AO.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Stand: Januar 2026 • Warenpakete Portal • Ausschließlich B2B
          </p>
        </div>
      </div>
    </div>
  );
}
