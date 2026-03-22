export function MarktplatzModell() {
  return (
    <section className="py-24 bg-neutral-950">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">

          {/* Überschrift */}
          <div className="text-center mb-16">
            <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-3">
              DAS MODELL
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              So funktioniert der Marktplatz
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              E-Commerce Service verbindet Lieferanten mit Gewerbetreibenden im DACH-Raum
            </p>
          </div>

          {/* Hauptbereich: 3 Spalten */}
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-6 lg:gap-0 mb-12">

            {/* Linke Spalte: Lieferanten */}
            <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-3">
              <div className="flex justify-center lg:justify-start mb-1">
                <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold">
                  Wechselnde Lieferanten
                </span>
              </div>
              {[
                { name: 'Hersteller A', sub: 'Elektronik & Technik' },
                { name: 'Großhändler B', sub: 'Beauty & Pflege' },
                { name: 'Marke C', sub: 'Sport & Outdoor' },
              ].map((s) => (
                <div key={s.name} className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
                  <p className="text-white text-sm font-semibold">{s.name}</p>
                  <p className="text-neutral-500 text-xs mt-0.5">{s.sub}</p>
                </div>
              ))}
              <div className="rounded-lg border border-dashed border-neutral-700 bg-neutral-900/20 p-4 text-center">
                <p className="text-neutral-600 text-xs">Weitere Lieferanten</p>
              </div>
            </div>

            {/* Pfeile + Hub */}
            <div className="flex lg:flex-col items-center justify-center flex-1 gap-4 lg:gap-0 lg:py-4">

              {/* Pfeil Links → Hub */}
              <div className="hidden lg:flex flex-col items-center gap-1 mb-6">
                <p className="text-neutral-500 text-xs">Markenware</p>
                <svg className="w-8 h-8 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

              {/* Mobile Pfeil ↓ */}
              <div className="lg:hidden flex items-center gap-2">
                <svg className="w-5 h-5 text-neutral-700 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span className="text-neutral-500 text-xs">Markenware</span>
              </div>

              {/* Hub */}
              <div className="flex-shrink-0 w-44 h-44 rounded-full border-2 border-yellow-500/50 bg-neutral-900 flex flex-col items-center justify-center text-center shadow-xl shadow-yellow-500/5">
                <p className="text-yellow-500 font-bold text-base leading-tight">E-Commerce</p>
                <p className="text-yellow-500 font-bold text-base leading-tight">Service</p>
                <p className="text-neutral-400 text-xs mt-2">B2B-Marktplatz</p>
              </div>

              {/* Hub → Pfeil Rechts */}
              <div className="hidden lg:flex flex-col items-center gap-1 mt-6">
                <svg className="w-8 h-8 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <p className="text-neutral-500 text-xs">Produkte</p>
              </div>

              {/* Mobile Pfeil ↓ */}
              <div className="lg:hidden flex items-center gap-2">
                <svg className="w-5 h-5 text-neutral-700 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span className="text-neutral-500 text-xs">Produkte</span>
              </div>
            </div>

            {/* Rechte Spalte: Gewerbetreibende */}
            <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-3">
              <div className="flex justify-center lg:justify-end mb-1">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
                  Gewerbetreibende
                </span>
              </div>
              {[
                { name: 'Händler Deutschland', sub: 'Mit Gewerbeschein' },
                { name: 'Händler Österreich', sub: 'Mit Gewerbeschein' },
                { name: 'Händler Schweiz', sub: 'Mit Gewerbeschein' },
              ].map((h) => (
                <div key={h.name} className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
                  <p className="text-white text-sm font-semibold">{h.name}</p>
                  <p className="text-neutral-500 text-xs mt-0.5">{h.sub}</p>
                </div>
              ))}
              <div className="rounded-lg border border-dashed border-neutral-700 bg-neutral-900/20 p-4 text-center">
                <p className="text-neutral-600 text-xs">Weitere Händler</p>
              </div>
            </div>
          </div>

          {/* Trennlinie */}
          <div className="relative mb-10">
            <div className="border-t border-neutral-800" />
            <div className="absolute inset-x-0 -top-3 flex justify-center">
              <span className="bg-neutral-950 px-4 text-neutral-500 text-xs">
                Nach dem Kauf — der Käufer entscheidet
              </span>
            </div>
          </div>

          {/* Unterer Bereich: 2 Optionen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

            {/* Option A */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 border-l-2 border-l-teal-500">
              <h3 className="text-teal-400 font-bold text-base mb-2">Option A: Selbstverkauf</h3>
              <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
                Der Käufer verkauft eigenständig über seine eigenen Kanäle.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Eigener Shop', 'Stationär', 'Marktplätze'].map((p) => (
                  <span key={p} className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Option B */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 border-l-2 border-l-purple-500">
              <h3 className="text-purple-400 font-bold text-base mb-2">Option B: Kommissionsverkauf</h3>
              <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
                Ein qualifizierter Dienstleister verkauft im Auftrag des Käufers.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Dienstleister 1', 'Dienstleister 2', 'Weitere'].map((p) => (
                  <span key={p} className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Legende */}
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
              <span className="text-neutral-500 text-xs">Lieferanten variieren</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
              <span className="text-neutral-500 text-xs">Kommissionäre variieren</span>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-neutral-500 text-center">
            Nur für Gewerbetreibende mit Gewerbeschein — keine Renditegarantie.
            Kommissionshandel nach anwendbarem Recht (DE/AT/CH)
          </p>

        </div>
      </div>
    </section>
  );
}
