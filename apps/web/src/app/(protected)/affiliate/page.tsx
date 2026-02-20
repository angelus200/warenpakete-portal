'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
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
  tier1Earnings: number;
  tier2Earnings: number;
  tier3Earnings: number;
  directReferrals: number;
}

interface Conversion {
  id: string;
  amount: number;
  status: string;
  tier: number;
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

interface Withdrawal {
  id: string;
  amount: number;
  method: string;
  iban?: string;
  accountHolder?: string;
  paypalEmail?: string;
  status: string;
  createdAt: string;
  notes?: string;
}

export default function AffiliatePage() {
  const api = useApi();
  const [affiliateLink, setAffiliateLink] = useState('');
  const [code, setCode] = useState('');
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Withdrawal state
  const [availableBalance, setAvailableBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState<'BANK' | 'PAYPAL'>('BANK');
  const [iban, setIban] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [submittingWithdrawal, setSubmittingWithdrawal] = useState(false);

  useEffect(() => {
    if (api.isSignedIn && api.isLoaded) {
      fetchAffiliateData();
    }
  }, [api.isSignedIn, api.isLoaded]);

  const fetchAffiliateData = async () => {
    try {
      setError(null);

      const linkData = await api.get<{ url: string; code: string; createdAt: string }>('/affiliate/my-link');
      setAffiliateLink(linkData.url);
      setCode(linkData.code);

      const statsData = await api.get<AffiliateStats>('/affiliate/stats');
      setStats(statsData);

      const conversionsData = await api.get<Conversion[]>('/affiliate/conversions');
      setConversions(conversionsData);

      const balanceData = await api.get<{ availableBalance: number }>('/affiliate/withdrawal/balance');
      setAvailableBalance(balanceData.availableBalance);

      const withdrawalsData = await api.get<Withdrawal[]>('/affiliate/withdrawals');
      setWithdrawals(withdrawalsData);
    } catch (err) {
      console.error('Failed to fetch affiliate data:', err);
      setError('Fehler beim Laden der Affiliate-Daten');
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
    const styles: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      APPROVED: 'bg-green-100 text-green-800 border-green-300',
      PAID: 'bg-blue-100 text-blue-800 border-blue-300',
    };

    const labels: Record<string, string> = {
      PENDING: 'Ausstehend',
      APPROVED: 'Genehmigt',
      PAID: 'Ausgezahlt',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded border ${styles[status] || styles.PENDING}`}
      >
        {labels[status] || status}
      </span>
    );
  };

  const getWithdrawalStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Ausstehend' },
      APPROVED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Genehmigt' },
      PAID: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ausgezahlt' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Abgelehnt' },
    };

    const { bg, text, label } = config[status] || config.PENDING;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded border ${bg} ${text}`}>
        {label}
      </span>
    );
  };

  const handleWithdrawalSubmit = async () => {
    try {
      setSubmittingWithdrawal(true);
      setError(null);

      const amount = Math.round(parseFloat(withdrawalAmount) * 100);

      if (amount <= 0) {
        setError('Betrag muss größer als 0 sein');
        return;
      }

      if (amount > availableBalance) {
        setError('Betrag übersteigt verfügbares Guthaben');
        return;
      }

      const payload: any = {
        amount,
        method: withdrawalMethod,
      };

      if (withdrawalMethod === 'BANK') {
        if (!iban || !accountHolder) {
          setError('Bitte IBAN und Kontoinhaber angeben');
          return;
        }
        payload.iban = iban;
        payload.accountHolder = accountHolder;
      } else {
        if (!paypalEmail) {
          setError('Bitte PayPal E-Mail-Adresse angeben');
          return;
        }
        payload.paypalEmail = paypalEmail;
      }

      await api.post('/affiliate/withdrawals', payload);

      // Reset form and refresh
      setWithdrawalAmount('');
      setIban('');
      setAccountHolder('');
      setPaypalEmail('');
      await fetchAffiliateData();
    } catch (err: any) {
      console.error('Withdrawal request failed:', err);
      setError(err.message || 'Fehler beim Erstellen der Auszahlungsanfrage');
    } finally {
      setSubmittingWithdrawal(false);
    }
  };

  if (!api.isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Lade Affiliate-Daten...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Affiliate Dashboard
        </h1>
        <p className="text-gray-600">
          Verdiene bis zu 5% Provision mit dem 3-Ebenen-System (3% + 1% + 1%)
        </p>
      </div>

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
            <span className="text-sm font-medium text-gray-600">Conversions</span>
            <TrendingUp size={20} className="text-gold" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.totalConversions || 0}
          </div>
        </Card>

        <Card className="p-5 bg-white border-2 border-gray-200 hover:border-gold/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Conversion-Rate</span>
            <BarChart3 size={20} className="text-gold" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.conversionRate || '0.00'}%
          </div>
        </Card>

        <Card className="p-5 bg-white border-2 border-gray-200 hover:border-gold/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Provision (gesamt)</span>
            <DollarSign size={20} className="text-gold" />
          </div>
          <div className="text-2xl font-bold text-gold">
            {formatCurrency(stats?.totalEarnings || 0)}
          </div>
        </Card>
      </div>

      <Card className="p-6 mb-8 bg-white border-2 border-gray-200">
        <h2 className="text-lg font-bold mb-4 text-gray-900">Provisions-Übersicht</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-sm text-gray-600 mb-1">Ausstehend</div>
            <div className="text-xl font-bold text-gray-900">{formatCurrency(stats?.pendingEarnings || 0)}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Genehmigt</div>
            <div className="text-xl font-bold text-gray-900">{formatCurrency(stats?.approvedEarnings || 0)}</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Ausgezahlt</div>
            <div className="text-xl font-bold text-gray-900">{formatCurrency(stats?.paidEarnings || 0)}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-8 bg-white border-2 border-gray-200">
        <h2 className="text-lg font-bold mb-4 text-gray-900">3-Ebenen-Provisionen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-5 bg-gradient-to-br from-gold/10 to-gold-light/20 rounded-lg border-2 border-gold/40">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Ebene 1 (3%)</div>
              <div className="text-xs bg-gold/20 text-gold-dark px-2 py-1 rounded-full font-bold">Direkt</div>
            </div>
            <div className="text-2xl font-bold text-gold mb-1">{formatCurrency(stats?.tier1Earnings || 0)}</div>
            <div className="text-xs text-gray-600">{stats?.directReferrals || 0} direkte Empfehlungen</div>
          </div>
          <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Ebene 2 (1%)</div>
              <div className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-bold">Indirekt</div>
            </div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats?.tier2Earnings || 0)}</div>
            <div className="text-xs text-gray-600">Empfehlungen deiner Referrals</div>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Ebene 3 (1%)</div>
              <div className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full font-bold">2. Stufe</div>
            </div>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats?.tier3Earnings || 0)}</div>
            <div className="text-xs text-gray-600">Dritte Ebene</div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Wie funktioniert das 3-Ebenen-System?</span><br/>
            <span className="text-gray-600">
              • <strong>Ebene 1:</strong> Du empfiehlst jemanden direkt → 3% Provision<br/>
              • <strong>Ebene 2:</strong> Deine Empfehlung empfiehlt jemanden → 1% Provision<br/>
              • <strong>Ebene 3:</strong> Die Empfehlung deiner Empfehlung empfiehlt jemanden → 1% Provision<br/>
              <span className="text-gold font-semibold">Maximum: 5% pro Verkauf</span>
            </span>
          </p>
        </div>
      </Card>

      <Card className="p-6 mb-8 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300">
        <h2 className="text-lg font-bold mb-2 text-gray-900">Verfügbares Guthaben</h2>
        <div className="text-4xl font-bold text-green-600 mb-2">
          {formatCurrency(availableBalance)}
        </div>
        <p className="text-sm text-gray-600">Genehmigt und verfügbar zur Auszahlung</p>
      </Card>

      <Card className="p-6 mb-8 bg-white border-2 border-gray-200">
        <h2 className="text-lg font-bold mb-4 text-gray-900">Auszahlung beantragen</h2>

        <div className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Betrag (€)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Verfügbar: {formatCurrency(availableBalance)}
            </p>
          </div>

          {/* Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Auszahlungsmethode</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="BANK"
                  checked={withdrawalMethod === 'BANK'}
                  onChange={() => setWithdrawalMethod('BANK')}
                  className="mr-2"
                />
                Banküberweisung
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="PAYPAL"
                  checked={withdrawalMethod === 'PAYPAL'}
                  onChange={() => setWithdrawalMethod('PAYPAL')}
                  className="mr-2"
                />
                PayPal
              </label>
            </div>
          </div>

          {/* Bank Fields */}
          {withdrawalMethod === 'BANK' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IBAN</label>
                <input
                  type="text"
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  placeholder="DE89 3704 0044 0532 0130 00"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kontoinhaber</label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Max Mustermann"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PayPal E-Mail</label>
              <input
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                placeholder="ihre-email@beispiel.de"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleWithdrawalSubmit}
            disabled={submittingWithdrawal}
            className="w-full px-6 py-3 bg-[#D4AF37] hover:bg-[#B8960C] text-black font-bold rounded-lg disabled:opacity-50"
          >
            {submittingWithdrawal ? 'Wird verarbeitet...' : 'Auszahlung beantragen'}
          </button>
        </div>
      </Card>

      <Card className="p-6 mb-8 bg-white border-2 border-gray-200">
        <h2 className="text-lg font-bold mb-4 text-gray-900">Auszahlungsanträge</h2>
        {withdrawals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Noch keine Auszahlungsanträge</div>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((w) => (
              <div key={w.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(Number(w.amount))}</p>
                    <p className="text-sm text-gray-600">
                      {w.method === 'BANK' ? `${w.iban} (${w.accountHolder})` : w.paypalEmail}
                    </p>
                  </div>
                  {getWithdrawalStatusBadge(w.status)}
                </div>
                <div className="text-xs text-gray-500">
                  Beantragt: {formatDate(w.createdAt)}
                </div>
                {w.notes && (
                  <p className="mt-2 text-sm text-gray-700 bg-blue-50 p-2 rounded">{w.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6 bg-white border-2 border-gray-200">
        <h2 className="text-lg font-bold mb-4 text-gray-900">Deine Conversions</h2>
        {conversions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Noch keine Conversions vorhanden</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Datum</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Bestellung</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Kunde</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Ebene</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Bestellwert</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Provision</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {conversions.map((conversion) => (
                  <tr key={conversion.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{formatDate(conversion.createdAt)}</td>
                    <td className="py-3 px-4 text-sm font-mono text-gray-700">#{conversion.order.id.substring(0, 8).toUpperCase()}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{conversion.order.user.company || conversion.order.user.email}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                        conversion.tier === 1 ? 'bg-gold/20 text-gold-dark' :
                        conversion.tier === 2 ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        Ebene {conversion.tier}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-900">{formatCurrency(Number(conversion.order.totalAmount))}</td>
                    <td className="py-3 px-4 text-sm text-right font-bold text-gold">
                      {formatCurrency(Number(conversion.amount))}
                      <span className="text-xs text-gray-500 ml-1">({conversion.tier === 1 ? '3%' : '1%'})</span>
                    </td>
                    <td className="py-3 px-4 text-center">{getStatusBadge(conversion.status)}</td>
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
