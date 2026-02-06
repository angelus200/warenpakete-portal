'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, TrendingUp, MousePointerClick, DollarSign, BarChart3 } from 'lucide-react';

interface AffiliateStats {
  totalClicks: number;
  totalConversions: number;
  conversionRate: string;
  totalEarnings: number;
  pendingEarnings: number;
  approvedEarnings: number;
  paidEarnings: number;
}

interface Conversion {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  order: {
    id: string;
    totalAmount: number;
    user: {
      email: string;
      company: string | null;
    };
  };
}

export default function AffiliatePage() {
  const [affiliateLink, setAffiliateLink] = useState('');
  const [code, setCode] = useState('');
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  const fetchAffiliateData = async () => {
    try {
      const token = localStorage.getItem('__clerk_db_jwt');

      // Fetch affiliate link
      const linkRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/affiliate/my-link`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const linkData = await linkRes.json();
      setAffiliateLink(linkData.url);
      setCode(linkData.code);

      // Fetch stats
      const statsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/affiliate/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch conversions
      const conversionsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/affiliate/conversions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const conversionsData = await conversionsRes.json();
      setConversions(conversionsData);
    } catch (error) {
      console.error('Failed to fetch affiliate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      APPROVED: 'bg-green-100 text-green-800 border-green-300',
      PAID: 'bg-blue-100 text-blue-800 border-blue-300',
    };

    const labels = {
      PENDING: 'Ausstehend',
      APPROVED: 'Genehmigt',
      PAID: 'Ausgezahlt',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded border ${styles[status as keyof typeof styles] || styles.PENDING}`}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Lade Affiliate-Daten...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Affiliate Dashboard
        </h1>
        <p className="text-gray-600">
          Verdiene 5% Provision für jeden geworbenen Kunden
        </p>
      </div>

      {/* Affiliate Link */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-gold/10 to-gold-light/10 border-2 border-gold/30">
        <h2 className="text-lg font-bold mb-3 text-gray-900">
          Dein persönlicher Affiliate-Link
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={affiliateLink}
            readOnly
            className="flex-1 px-4 py-3 bg-white border-2 border-gold/50 rounded-lg text-gray-900 font-mono text-sm"
          />
          <Button
            onClick={copyLink}
            className="bg-gold hover:bg-gold-dark text-dark font-bold"
          >
            {copied ? (
              <>
                <Check size={16} className="mr-2" />
                Kopiert
              </>
            ) : (
              <>
                <Copy size={16} className="mr-2" />
                Kopieren
              </>
            )}
          </Button>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Code: <span className="font-mono font-bold text-gold">{code}</span>
        </p>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 bg-white border-2 border-gray-200 hover:border-gold/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Klicks</span>
            <MousePointerClick size={20} className="text-gold" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.totalClicks || 0}
          </div>
        </Card>

        <Card className="p-5 bg-white border-2 border-gray-200 hover:border-gold/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Conversions
            </span>
            <TrendingUp size={20} className="text-gold" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.totalConversions || 0}
          </div>
        </Card>

        <Card className="p-5 bg-white border-2 border-gray-200 hover:border-gold/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Conversion-Rate
            </span>
            <BarChart3 size={20} className="text-gold" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.conversionRate || '0.00'}%
          </div>
        </Card>

        <Card className="p-5 bg-white border-2 border-gray-200 hover:border-gold/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Provision (gesamt)
            </span>
            <DollarSign size={20} className="text-gold" />
          </div>
          <div className="text-2xl font-bold text-gold">
            {formatCurrency(stats?.totalEarnings || 0)}
          </div>
        </Card>
      </div>

      {/* Earnings Breakdown */}
      <Card className="p-6 mb-8 bg-white border-2 border-gray-200">
        <h2 className="text-lg font-bold mb-4 text-gray-900">
          Provisions-Übersicht
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-sm text-gray-600 mb-1">Ausstehend</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(stats?.pendingEarnings || 0)}
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Genehmigt</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(stats?.approvedEarnings || 0)}
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Ausgezahlt</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(stats?.paidEarnings || 0)}
            </div>
          </div>
        </div>
      </Card>

      {/* Conversions Table */}
      <Card className="p-6 bg-white border-2 border-gray-200">
        <h2 className="text-lg font-bold mb-4 text-gray-900">
          Deine Conversions
        </h2>

        {conversions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Noch keine Conversions vorhanden
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Datum
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Bestellung
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Kunde
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Bestellwert
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Provision (5%)
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {conversions.map((conversion) => (
                  <tr
                    key={conversion.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {formatDate(conversion.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-gray-700">
                      #{conversion.order.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {conversion.order.user.company ||
                        conversion.order.user.email}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-900">
                      {formatCurrency(Number(conversion.order.totalAmount))}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-bold text-gold">
                      {formatCurrency(Number(conversion.amount))}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(conversion.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
