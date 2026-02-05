'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-28 md:py-40">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#222222] to-[#1a1a1a]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-3 px-4 py-2 rounded-full border border-gold/40 bg-gold/10">
              <span className="text-gold text-sm font-semibold tracking-wider">
                PREMIUM B2B WARENPAKETE
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-3 bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
              Luxus-Großhandel
              <br />
              <span className="text-gray-200">für Ihr Business</span>
            </h1>

            <p className="text-xl md:text-lg text-gray-400 mb-5 leading-relaxed">
              Exklusive Warenpakete mit bis zu <span className="text-gold font-bold">70% Ersparnis</span> gegenüber UVP.
              <br />
              Premium-Qualität für anspruchsvolle B2B-Partner.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={isSignedIn ? '/products' : '/sign-up'}>
                <Button
                  size="lg"
                  className="text-lg px-5 py-7 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold shadow-2xl shadow-gold/30 border border-gold-light/20"
                >
                  {isSignedIn ? 'Produkte entdecken' : 'Premium-Zugang sichern'}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-light/5 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#f5f5f0] relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ihre <span className="text-gold">Premium</span> Vorteile
            </h2>
            <p className="text-gray-600 text-lg">
              Exklusiver Service für anspruchsvolle B2B-Partner
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 text-center bg-white border-gray-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-light to-gold rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-gold/20">
                <svg
                  className="w-8 h-8 text-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Premium-Konditionen
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Bis zu 70% unter UVP durch exklusive Herstellerpartnerschaften und direkten Zugang zu Premium-Beständen
              </p>
            </Card>

            <Card className="p-4 text-center bg-white border-gray-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-light to-gold rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-gold/20">
                <svg
                  className="w-8 h-8 text-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Geprüfte Luxus-Qualität</h3>
              <p className="text-gray-600 leading-relaxed">
                Jedes Warenpaket wird von Experten geprüft und zertifiziert. Premium-Marken, einwandfreie Funktion garantiert
              </p>
            </Card>

            <Card className="p-4 text-center bg-white border-gray-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-light to-gold rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-gold/20">
                <svg
                  className="w-8 h-8 text-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                20% Reseller-Provision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Als Premium-Reseller verdienen Sie 20% Provision auf jeden vermittelten Verkauf. Exklusives Partnerprogramm
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#1a1a1a] border-y border-gold/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '€45M+', label: 'Handelsvolumen' },
              { value: '500+', label: 'Premium-Partner' },
              { value: '99.8%', label: 'Zufriedenheit' },
              { value: '24/7', label: 'VIP-Support' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-[#f5f5f0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Premium <span className="text-gold">Kategorien</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Exklusive Warenpakete in Top-Kategorien
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { name: 'Elektronik', image: '/images/categories/elektronik.webp' },
              { name: 'Haushalt', image: '/images/categories/haushalt.webp' },
              { name: 'Fashion', image: '/images/categories/fashion.webp' },
              { name: 'Spielwaren', image: '/images/categories/spielwaren.webp' },
              { name: 'Werkzeug', image: '/images/categories/werkzeug.webp' },
            ].map((category) => (
              <Link key={category.name} href={isSignedIn ? '/products' : '/sign-up'}>
                <Card className="p-4 text-center bg-white border-gray-300 hover:border-gold hover:shadow-xl hover:shadow-gold/20 transition-all cursor-pointer group">
                  <div className="w-full h-32 mb-4 overflow-hidden rounded-lg relative">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="font-bold text-gray-900 group-hover:text-gold transition-colors">
                    {category.name}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#1a1a1a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-100 mb-3">
              Bereit für <span className="text-gold">Premium-Deals?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-5 leading-relaxed">
              Werden Sie Teil unserer exklusiven B2B-Community und profitieren Sie
              <br />
              von erstklassigen Warenpaketen zu unschlagbaren Konditionen
            </p>

            {isSignedIn ? (
              <Link href="/products">
                <Button
                  size="lg"
                  className="text-lg px-3 py-7 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold shadow-2xl shadow-gold/30"
                >
                  Exklusive Produkte entdecken
                </Button>
              </Link>
            ) : (
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="text-lg px-3 py-7 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold shadow-2xl shadow-gold/30"
                >
                  Premium-Zugang sichern
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
