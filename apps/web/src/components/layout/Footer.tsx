import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-300 bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-light to-gold rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-dark">W</span>
              </div>
              <div>
                <h3 className="font-bold text-gold text-lg">
                  E-Commerce Service
                </h3>
                <p className="text-xs text-gold-dark font-medium">PREMIUM B2B</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              Ihr exklusiver B2B Partner für Premium-Warenpakete im Großhandel.
              Seit 2024 vertrauen über 500 Unternehmen auf unsere erstklassigen Konditionen.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-gold transition-colors"
                >
                  Produkte
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gold transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-gray-600 hover:text-gold transition-colors"
                >
                  Bestellungen
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Rechtliches</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/impressum"
                  className="text-gray-600 hover:text-gold transition-colors"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="text-gray-600 hover:text-gold transition-colors"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link
                  href="/agb"
                  className="text-gray-600 hover:text-gold transition-colors"
                >
                  AGB
                </Link>
              </li>
              <li>
                <Link
                  href="/widerrufsrecht"
                  className="text-gray-600 hover:text-gold transition-colors"
                >
                  Widerrufsrecht
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gold/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              &copy; {currentYear} E-Commerce Service. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Powered by</span>
              <span className="text-gold font-semibold">Premium Technology</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
