import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/20 bg-dark-light">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-light to-gold rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-dark">W</span>
              </div>
              <div>
                <h3 className="font-bold text-gold text-lg">
                  Warenpakete Portal
                </h3>
                <p className="text-xs text-gold-dark font-medium">PREMIUM B2B</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Ihr exklusiver B2B Partner für Premium-Warenpakete im Großhandel.
              Seit 2024 vertrauen über 500 Unternehmen auf unsere erstklassigen Konditionen.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-gray-400 hover:text-gold transition-colors"
                >
                  Produkte
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-gold transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-gray-400 hover:text-gold transition-colors"
                >
                  Bestellungen
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Rechtliches</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                  Impressum
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                  Datenschutz
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                  AGB
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                  Widerrufsrecht
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gold/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Warenpakete Portal. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Powered by</span>
              <span className="text-gold font-semibold">Premium Technology</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
