import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AffiliateTracker } from '@/components/AffiliateTracker';
import { PageTracker } from '@/components/PageTracker';
import ElevenLabsWidget from '@/components/ElevenLabsWidget';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Commerce Service — B2B Markenware & Kommissionshandel',
  description:
    'B2B Plattform für Markenware zu Großhandelspreisen und Kommissionshandel im DACH-Raum. Ausschließlich für Gewerbetreibende.',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.ecommercerente.com/#organization',
      name: 'E-Commerce Service by Commercehelden GmbH',
      url: 'https://www.ecommercerente.com',
      description:
        'B2B Plattform für Markenware zu Großhandelspreisen und Kommissionshandel im DACH-Raum',
      areaServed: ['DE', 'AT', 'CH'],
      audience: {
        '@type': 'BusinessAudience',
        audienceType: 'Gewerbetreibende, Händler, E-Commerce Dienstleister',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'support@ecommercerente.com',
        contactType: 'customer service',
        availableLanguage: 'German',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://www.ecommercerente.com/markenware#service',
      name: 'Markenware zu Großhandelspreisen',
      description:
        'Geprüfte Markensortimente für Händler und Gewerbetreibende im DACH-Raum. Bezug zu Großhandelskonditionen ohne eigenes Sourcing.',
      provider: { '@id': 'https://www.ecommercerente.com/#organization' },
      areaServed: ['DE', 'AT', 'CH'],
      audience: { '@type': 'BusinessAudience' },
    },
    {
      '@type': 'Service',
      '@id': 'https://www.ecommercerente.com/verkaufskommission#service',
      name: 'Kommissionsverkauf für E-Commerce Dienstleister',
      description:
        'E-Commerce Dienstleister verkaufen Markenprodukte auf Kommissionsbasis gemäß §383 HGB. Monatliche Abrechnung nach tatsächlichen Verkäufen.',
      provider: { '@id': 'https://www.ecommercerente.com/#organization' },
      areaServed: ['DE', 'AT', 'CH'],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Für wen ist E-Commerce Service geeignet?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Ausschließlich für Gewerbetreibende mit gültigem Gewerbeschein in Deutschland, Österreich und der Schweiz. Kein Endkundenverkauf.',
          },
        },
        {
          '@type': 'Question',
          name: 'Was ist der Unterschied zwischen Markenware-Bezug und Kommissionsverkauf?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Beim Markenware-Bezug kaufen Sie Markensortimente zu Großhandelspreisen und verkaufen selbst. Beim Kommissionsverkauf erhalten Sie die Produkte ohne Vorabkauf und werden nach erfolgreichem Verkauf auf Provisionsbasis vergütet.',
          },
        },
        {
          '@type': 'Question',
          name: 'Welche Produkte sind verfügbar?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Geprüfte Markenprodukte aus den Bereichen Elektronik, Haushaltswaren und Fashion mit nachweislicher Verkaufshistorie auf Marktplätzen wie Amazon und eBay.',
          },
        },
        {
          '@type': 'Question',
          name: 'Wie hoch ist die Mindestbestellung?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Der Mindestbestellwert für Markensortimente beträgt €2.500. Für den Kommissionsverkauf gibt es keinen Mindestbestellwert — Sie erhalten Produkte zur Vermittlung.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="de">
        <body className={`${inter.className} bg-[#f5f5f0] text-gray-900 antialiased`}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          <Providers>
            <AffiliateTracker />
            <PageTracker />
            <div className="flex min-h-screen flex-col bg-[#f5f5f0]">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <ElevenLabsWidget />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
