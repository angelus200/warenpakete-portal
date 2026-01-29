'use client';

import { useQuery } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';
import { useApiClient } from '@/lib/api-client';
import { Order } from '@/types';
import { Card } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OrdersPage() {
  const apiClient = useApiClient();
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => apiClient.get('/orders'),
  });

  return (
    <div className="min-h-screen bg-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Meine Bestellungen
          </h1>
          <p className="text-gray-400">Übersicht über alle Ihre Bestellungen</p>
        </div>

        {showSuccess && (
          <div className="mb-8 bg-green-500/10 border-2 border-green-500/50 text-green-400 px-6 py-4 rounded-lg flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">Zahlung erfolgreich!</p>
              <p className="text-sm text-green-300">Ihre Bestellung wird bearbeitet.</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-gray-400">Lade Bestellungen...</p>
          </div>
        )}

        {orders && orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-8 bg-dark-light border-gold/20 hover:border-gold/40 transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Bestellung #{order.id.slice(0, 8).toUpperCase()}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${
                      order.status === 'PAID'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                        : order.status === 'PENDING'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/40'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b border-gold/10">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-dark p-4 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-white mb-1">{item.product.name}</p>
                        <p className="text-sm text-gray-400">
                          {item.quantity} × €{item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-bold text-gold text-lg">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-white">Gesamt:</span>
                  <span className="text-3xl font-bold text-gold">
                    €{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          !isLoading && (
            <Card className="p-16 text-center bg-dark-light border-gold/20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-xl text-gray-400 mb-4">Noch keine Bestellungen</p>
              <p className="text-gray-500 mb-8">
                Entdecken Sie unsere Premium-Warenpakete und starten Sie Ihr Business
              </p>
              <Link href="/products">
                <button className="px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold rounded-lg shadow-lg shadow-gold/20 transition-all">
                  Produkte ansehen
                </button>
              </Link>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
