'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/lib/api-client';
import { User, Order, CommissionEarnings, UserRole } from '@/types';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function DashboardPage() {
  const apiClient = useApiClient();

  const { data: user } = useQuery<User>({
    queryKey: ['user', 'me'],
    queryFn: () => apiClient.get('/users/me'),
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => apiClient.get('/orders'),
  });

  const { data: earnings } = useQuery<CommissionEarnings>({
    queryKey: ['commissions', 'total', user?.id],
    queryFn: () => apiClient.get(`/commissions/reseller/${user?.id}/total`),
    enabled: !!user && user.role === UserRole.RESELLER,
  });

  return (
    <div className="min-h-screen bg-dark">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400">
            Willkommen zurück, <span className="text-gold">{user?.firstName || user?.name || 'Partner'}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-dark-light border-gold/20 hover:border-gold/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-400 font-medium">Wallet Balance</h3>
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gold">
              €{user?.walletBalance.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-2">Verfügbares Guthaben</p>
          </Card>

          <Card className="p-6 bg-dark-light border-gold/20 hover:border-gold/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-400 font-medium">Bestellungen</h3>
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{orders?.length || 0}</p>
            <p className="text-xs text-gray-500 mt-2">Gesamt getätigt</p>
          </Card>

          {user?.role === UserRole.RESELLER && (
            <Card className="p-6 bg-dark-light border-gold/20 hover:border-gold/40 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-400 font-medium">Provisionen</h3>
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gold">
                €{earnings?.pending.toFixed(2) || '0.00'}
              </p>
              <p className="text-xs text-gray-500 mt-2">Ausstehend (20%)</p>
            </Card>
          )}
        </div>

        {/* Referral Code Card */}
        {user?.role === UserRole.RESELLER && (
          <Card className="p-8 mb-12 bg-gradient-to-br from-dark-light to-dark border-gold/30 shadow-xl shadow-gold/5">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold-light to-gold flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold/20">
                <svg className="w-8 h-8 text-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Ihr Premium Empfehlungscode
                </h3>
                <p className="text-gray-400 mb-4">
                  Teilen Sie diesen Code mit Kunden und verdienen Sie <span className="text-gold font-semibold">20% Provision</span> auf jeden vermittelten Verkauf
                </p>
                <div className="flex items-center gap-4">
                  <div className="bg-dark border-2 border-gold/40 rounded-lg px-6 py-3">
                    <code className="text-2xl font-mono font-bold text-gold">
                      {user.referralCode}
                    </code>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user.referralCode || '');
                    }}
                    className="px-4 py-3 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 rounded-lg transition-colors font-medium"
                  >
                    Code kopieren
                  </button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Recent Orders */}
        <Card className="p-8 bg-dark-light border-gold/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Letzte Bestellungen</h2>
            <Link
              href="/orders"
              className="text-gold hover:text-gold-light transition-colors text-sm font-medium flex items-center gap-1"
            >
              Alle anzeigen
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center p-4 bg-dark rounded-lg border border-gold/10 hover:border-gold/30 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-white mb-1">
                      Bestellung #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gold text-lg mb-1">
                      €{order.totalAmount.toFixed(2)}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'PAID'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : order.status === 'PENDING'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg mb-2">Noch keine Bestellungen</p>
              <p className="text-gray-500 text-sm mb-6">
                Starten Sie jetzt und entdecken Sie unsere Premium-Warenpakete
              </p>
              <Link href="/products">
                <button className="px-6 py-3 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold rounded-lg shadow-lg shadow-gold/20 transition-all">
                  Produkte entdecken
                </button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
