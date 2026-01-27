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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Wallet Balance</h3>
          <p className="text-3xl font-bold">
            €{user?.walletBalance.toFixed(2) || '0.00'}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Bestellungen</h3>
          <p className="text-3xl font-bold">{orders?.length || 0}</p>
        </Card>

        {user?.role === UserRole.RESELLER && (
          <Card className="p-6">
            <h3 className="text-sm text-gray-600 mb-2">
              Provisionen (Ausstehend)
            </h3>
            <p className="text-3xl font-bold">
              €{earnings?.pending.toFixed(2) || '0.00'}
            </p>
          </Card>
        )}
      </div>

      {user?.role === UserRole.RESELLER && (
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2">Ihr Empfehlungscode</h3>
          <div className="flex items-center gap-4">
            <code className="text-2xl font-mono bg-gray-100 px-4 py-2 rounded">
              {user.referralCode}
            </code>
            <p className="text-sm text-gray-600">
              Teilen Sie diesen Code mit Kunden, um 5% Provision zu verdienen
            </p>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Letzte Bestellungen</h2>
          <Link
            href="/orders"
            className="text-blue-600 hover:underline text-sm"
          >
            Alle anzeigen
          </Link>
        </div>

        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div>
                  <p className="font-semibold">Bestellung #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('de-DE')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">€{order.totalAmount.toFixed(2)}</p>
                  <p className="text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        order.status === 'PAID'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">
            Noch keine Bestellungen
          </p>
        )}
      </Card>
    </div>
  );
}
