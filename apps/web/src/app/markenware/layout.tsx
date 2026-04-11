import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Produkte anbieten — Hersteller & Marken gesucht',
  description:
    'Bieten Sie Ihre Markenprodukte über unser B2B-Netzwerk im DACH-Raum an. Starter ab 499 EUR, Professional ab 899 EUR. Sofortige Reichweite ohne eigenen Shop.',
  keywords: [
    'Produkte online verkaufen Plattform',
    'Markenprodukte über Marktplatz verkaufen',
    'B2B Vertriebskanal für Hersteller',
    'Produkte listen B2B Marktplatz',
    'Markenware Großhandel anbieten',
    'Hersteller DACH Vertrieb',
  ],
  alternates: {
    canonical: 'https://www.ecommercerente.com/markenware',
  },
  openGraph: {
    title: 'Produkte anbieten — E-Commerce Service',
    description:
      'Markenprodukte über unser B2B-Netzwerk im DACH-Raum vertreiben. Starter, Professional und Enterprise Pakete für Hersteller und Großhändler.',
    url: 'https://www.ecommercerente.com/markenware',
  },
};

export default function MarkenwareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
