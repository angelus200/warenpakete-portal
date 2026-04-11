import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Erstgespräch buchen — Kostenlose Beratung',
  description:
    'Vereinbaren Sie ein kostenloses Erstgespräch mit unseren B2B-Beratern. Besprechen Sie Ihre Möglichkeiten im E-Commerce-Handel im DACH-Raum.',
  keywords: [
    'Erstgespräch B2B Marktplatz',
    'Beratung E-Commerce DACH',
    'Kommissionshandel Beratung',
    'Markenware Erstgespräch',
    'B2B E-Commerce Beratung kostenlos',
  ],
  alternates: {
    canonical: 'https://www.ecommercerente.com/erstgespraech',
  },
  openGraph: {
    title: 'Erstgespräch buchen — E-Commerce Service',
    description:
      'Kostenloses Erstgespräch mit unseren B2B-Beratern vereinbaren.',
    url: 'https://www.ecommercerente.com/erstgespraech',
  },
};

export default function ErstgespraechLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
