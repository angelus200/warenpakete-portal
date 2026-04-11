import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Häufig gestellte Fragen — B2B-Marktplatz',
  description:
    'Antworten auf die wichtigsten Fragen zu unserem B2B-Marktplatz: Warenbezug, Kommissionshandel, Affiliate-Programm und rechtliche Grundlagen.',
  keywords: [
    'B2B Marktplatz FAQ',
    'Kommissionshandel Fragen',
    'Wie funktioniert Kommissionsverkauf',
    'Markenware Großhandel FAQ',
    'E-Commerce DACH Fragen',
  ],
  alternates: {
    canonical: 'https://www.ecommercerente.com/faq',
  },
  openGraph: {
    title: 'FAQ — E-Commerce Service',
    description:
      'Antworten auf die wichtigsten Fragen zu Warenbezug, Kommissionshandel und Affiliate-Programm.',
    url: 'https://www.ecommercerente.com/faq',
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
