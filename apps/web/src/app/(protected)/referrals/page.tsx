'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { User, CommissionEarnings } from '@/types';

interface Commission {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  order: {
    id: string;
    totalAmount: number;
    user: {
      email: string;
    };
  };
}

export default function ReferralsPage() {
  const apiClient = useApiClient();

  const { data: user } = useQuery<User>({
    queryKey: ['user', 'me'],
    queryFn: () => apiClient.get('/users/me'),
  });

  const { data: earnings } = useQuery<CommissionEarnings>({
    queryKey: ['commissions', 'total', user?.id],
    queryFn: () => apiClient.get(`/commissions/reseller/${user?.id}/total`),
    enabled: !!user,
  });

  const { data: commissions } = useQuery<Commission[]>({
    queryKey: ['commissions', user?.id],
    queryFn: () => apiClient.get(`/commissions/reseller/${user?.id}`),
    enabled: !!user,
  });

  const referralUrl = user?.referralCode
    ? `${window.location.origin}/sign-up?ref=${user.referralCode}`
    : '';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('In Zwischenablage kopiert!');
  };

  return (
    <div className="min-h-screen bg-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Reseller Programm
          </h1>
          <p className="text-gray-400">Verdienen Sie 20% Provision auf jeden vermittelten Verkauf</p>
        </div>

        {/* Referral Code Card */}
        <Card className="p-8 mb-12 bg-gradient-to-br from-dark-light to-dark border-gold/30 shadow-xl shadow-gold/10">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gold-light to-gold flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold/30">
              <svg className="w-10 h-10 text-dark" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">
                Ihr Premium Empfehlungscode
              </h3>
              <p className="text-gray-400 mb-6">
                Teilen Sie diesen Code mit Ihren Kunden. Für jeden Verkauf über Ihren Code erhalten Sie 20% Provision.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Referral Code</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-dark border-2 border-gold/40 rounded-lg px-6 py-4">
                      <code className="text-2xl font-mono font-bold text-gold">
                        {user?.referralCode || 'Lädt...'}
                      </code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(user?.referralCode || '')}
                      className="px-6 py-4 bg-gold/10 hover:bg-gold/20 text-gold border-2 border-gold/40 rounded-lg transition-colors font-medium"
                    >
                      Kopieren
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Referral Link</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-dark border-2 border-gold/40 rounded-lg px-6 py-4">
                      <code className="text-sm font-mono text-gold break-all">
                        {referralUrl || 'Lädt...'}
                      </code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(referralUrl)}
                      className="px-6 py-4 bg-gold/10 hover:bg-gold/20 text-gold border-2 border-gold/40 rounded-lg transition-colors font-medium"
                    >
                      Kopieren
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-dark-light border-gold/20 hover:border-gold/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-400 font-medium">Provisionen ausstehend</h3>
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-yellow-400">
              €{earnings?.pending.toFixed(2) || '0.00'}
            </p>
          </Card>

          <Card className="p-6 bg-dark-light border-gold/20 hover:border-gold/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-400 font-medium">Provisionen bezahlt</h3>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-green-400">
              €{earnings?.paid.toFixed(2) || '0.00'}
            </p>
          </Card>

          <Card className="p-6 bg-dark-light border-gold/20 hover:border-gold/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-400 font-medium">Gesamt verdient</h3>
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gold">
              €{earnings?.total.toFixed(2) || '0.00'}
            </p>
          </Card>
        </div>

        {/* Commission History */}
        <Card className="p-8 bg-dark-light border-gold/20">
          <h2 className="text-2xl font-bold text-white mb-6">Provisionsverlauf</h2>
          {commissions && commissions.length > 0 ? (
            <div className="space-y-4">
              {commissions.map((commission) => (
                <div key={commission.id} className="p-5 bg-dark rounded-lg border border-gold/10 hover:border-gold/30 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-white text-lg mb-1">
                        Bestellung #{commission.order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-400">Kunde: {commission.order.user.email}</p>
                      <p className="text-sm text-gray-400">
                        Bestellwert: €{commission.order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gold mb-1">
                        €{commission.amount.toFixed(2)}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                          commission.status === 'PAID'
                            ? 'bg-green-500/20 text-green-400 border-green-500/40'
                            : commission.status === 'PENDING'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/40'
                        }`}
                      >
                        {commission.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(commission.createdAt).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-gold/50" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg mb-2">Noch keine Provisionen verdient</p>
              <p className="text-gray-500 text-sm">
                Teilen Sie Ihren Referral-Link, um Kunden zu gewinnen
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
