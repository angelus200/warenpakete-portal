import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Warenpakete Portal
            </h3>
            <p className="text-sm text-gray-600">
              Ihr B2B Partner für Großhandels-Warenpakete mit attraktiven Konditionen.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Produkte
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Bestellungen
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Rechtliches</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Impressum
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Datenschutz
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  AGB
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>
            &copy; {currentYear} Warenpakete Portal. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
