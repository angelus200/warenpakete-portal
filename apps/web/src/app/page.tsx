'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Willkommen im Warenpakete Portal
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Ihr B2B Partner für hochwertige Großhandels-Warenpakete mit
              attraktiven Konditionen. Sparen Sie bis zu 70% gegenüber UVP!
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="text-lg px-8 py-6">
                  Produkte entdecken
                </Button>
              </Link>
              {!isSignedIn && (
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6"
                  >
                    Jetzt registrieren
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Ihre Vorteile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Attraktive Großhandelspreise
              </h3>
              <p className="text-gray-600">
                Sparen Sie bis zu 70% gegenüber UVP durch unsere direkten
                Herstellerkontakte
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Geprüfte Qualität</h3>
              <p className="text-gray-600">
                Alle Waren werden von uns geprüft und sind funktionstüchtig
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Provisionsystem für Reseller
              </h3>
              <p className="text-gray-600">
                Verdienen Sie 5% Provision auf alle Verkäufe über Ihren
                Empfehlungscode
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Unsere Kategorien
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              'Elektronik',
              'Haushalt',
              'Fashion',
              'Spielwaren',
              'Werkzeug',
            ].map((category) => (
              <Link key={category} href="/products">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <p className="font-semibold text-gray-900">{category}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Bereit für großartige Deals?
            </h2>
            <p className="text-lg mb-8 text-blue-100">
              Registrieren Sie sich jetzt und entdecken Sie unser vielfältiges
              Sortiment an Großhandels-Warenpaketen
            </p>
            {isSignedIn ? (
              <Link href="/products">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-6"
                >
                  Zu den Produkten
                </Button>
              </Link>
            ) : (
              <Link href="/sign-up">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-6"
                >
                  Kostenlos registrieren
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
