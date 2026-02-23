'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Download, CheckCircle2, BookOpen, TrendingUp } from 'lucide-react';

export default function GuidePage() {
  const { getToken } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);

    try {
      // UTM-Parameter aus URL lesen
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source') || undefined;
      const utmMedium = urlParams.get('utm_medium') || undefined;
      const utmCampaign = urlParams.get('utm_campaign') || undefined;

      // API-Call für Tracking
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/guide-download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ utmSource, utmMedium, utmCampaign }),
      });

      // Meta Pixel Event
      if (typeof (window as any).fbq !== 'undefined') {
        (window as any).fbq('track', 'Lead', {
          content_name: 'B2B Guide 2026',
          content_category: 'guide_download',
          value: 0,
          currency: 'EUR',
        });
      }

      // PDF-Download triggern
      const link = document.createElement('a');
      link.href = '/downloads/b2b-guide-2026.pdf';
      link.download = 'B2B-Guide-Online-Warenhandel-2026.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloaded(true);
    } catch (error) {
      console.error('Download tracking failed:', error);
      // PDF trotzdem downloaden
      const link = document.createElement('a');
      link.href = '/downloads/b2b-guide-2026.pdf';
      link.download = 'B2B-Guide-Online-Warenhandel-2026.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ebebeb]">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 rounded-full border-2 border-gold bg-gold/20">
            <span className="text-gold text-sm font-bold tracking-wider">
              KOSTENLOSER B2B-GUIDE
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ihr kostenloser <span className="text-gold">B2B-Guide</span> ist bereit!
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Der komplette Leitfaden für den profitablen Einstieg in den Marktplatz-Handel 2026
          </p>

          <Button
            onClick={handleDownload}
            disabled={downloading}
            size="lg"
            className="text-lg px-10 py-7 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold shadow-2xl shadow-gold/30"
          >
            {downloading ? (
              <>Wird vorbereitet...</>
            ) : downloaded ? (
              <>
                <CheckCircle2 className="mr-2" size={24} />
                Erneut herunterladen
              </>
            ) : (
              <>
                <Download className="mr-2" size={24} />
                Jetzt herunterladen
              </>
            )}
          </Button>

          {downloaded && (
            <p className="text-sm text-green-600 mt-4 font-medium">
              ✓ Download gestartet! Sie erhalten außerdem eine E-Mail mit dem Link.
            </p>
          )}
        </div>

        {/* Guide Content Preview */}
        <Card className="p-8 bg-white border-gray-300 mb-8 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="text-gold" size={32} />
            <h2 className="text-2xl font-bold text-gray-900">
              Was Sie im Guide erwartet
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#fffbeb] border-l-4 border-gold rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Kapitel 1: Warum Online-Warenhandel?</h3>
              <p className="text-sm text-gray-600">Der Markt in Zahlen – Über 100 Mrd. € Umsatz im DACH-Raum</p>
            </div>

            <div className="p-4 bg-[#fffbeb] border-l-4 border-gold rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Kapitel 2: Das Geschäftsmodell erklärt</h3>
              <p className="text-sm text-gray-600">In 3 Schritten zum ersten Verkauf auf Amazon & Co.</p>
            </div>

            <div className="p-4 bg-[#fffbeb] border-l-4 border-gold rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Kapitel 3: Selbstverkauf vs. Kommission</h3>
              <p className="text-sm text-gray-600">Zwei Wege im Vergleich – Welcher passt zu Ihnen?</p>
            </div>

            <div className="p-4 bg-[#fffbeb] border-l-4 border-gold rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Kapitel 4: Warenpakete im Detail</h3>
              <p className="text-sm text-gray-600">Was Sie für Ihr Geld bekommen – Transparente Kalkulation</p>
            </div>

            <div className="p-4 bg-[#fffbeb] border-l-4 border-gold rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Kapitel 5: Kalkulation & ROI ⭐</h3>
              <p className="text-sm text-gray-600">Konkrete Rechenbeispiele mit 13-17% EBIT-Marge</p>
            </div>

            <div className="p-4 bg-[#fffbeb] border-l-4 border-gold rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Kapitel 6: Schritt-für-Schritt Anleitung</h3>
              <p className="text-sm text-gray-600">Vom Gewerbeschein zum ersten Paket – Der komplette Weg</p>
            </div>

            <div className="p-4 bg-[#fffbeb] border-l-4 border-gold rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Kapitel 7: Steuer-Tipps</h3>
              <p className="text-sm text-gray-600">Reverse Charge & Vorsteuerabzug optimal nutzen</p>
            </div>

            <div className="p-4 bg-[#fffbeb] border-l-4 border-gold rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Kapitel 8: Häufige Fehler vermeiden</h3>
              <p className="text-sm text-gray-600">Die 5 größten Fallen – Aus hunderten Kundengesprächen</p>
            </div>

            <div className="p-4 bg-[#fffbeb] border-l-4 border-gold rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Kapitel 9: Erfolgsgeschichten</h3>
              <p className="text-sm text-gray-600">Echte Kunden, echte Zahlen – So klappt der Start</p>
            </div>

            <div className="p-4 bg-[#fffbeb] border-l-4 border-gold rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Kapitel 10: 30+ FAQ Antworten</h3>
              <p className="text-sm text-gray-600">Die häufigsten Fragen kompakt beantwortet</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gold/10 border-2 border-gold/30 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>💡 Unser Tipp:</strong> Lesen Sie besonders Kapitel 5 (Kalkulation & ROI) —
              dort sehen Sie genau, wie sich Ihr Investment rechnet.
            </p>
          </div>
        </Card>

        {/* CTA Section */}
        <Card className="p-8 bg-gradient-to-br from-[#2a2a2a] via-[#1f1f1f] to-[#2a2a2a] border-gold/30 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <TrendingUp className="text-gold mx-auto mb-4" size={48} />
            <h2 className="text-3xl font-bold text-gray-100 mb-3">
              Bereit für den <span className="text-gold">nächsten Schritt?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Entdecken Sie unsere kuratierten Warenpakete oder buchen Sie ein kostenloses Erstgespräch
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/products">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold shadow-lg"
              >
                Warenpakete ansehen
              </Button>
            </Link>
            <Link href="/erstgespraech">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 border-gold text-gold bg-transparent hover:bg-gold/10 font-bold"
              >
                📞 Kostenloses Erstgespräch
              </Button>
            </Link>
          </div>

          <p className="text-center text-gray-500 text-sm">
            Über 400.000 aktive Marketplace Seller in der DACH-Region
          </p>
        </Card>
      </div>
    </div>
  );
}
