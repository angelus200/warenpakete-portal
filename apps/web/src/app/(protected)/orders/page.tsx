'use client';

import { useQuery } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';
import { useApiClient } from '@/lib/api-client';
import { Order } from '@/types';
import { Card } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Meine Bestellungen</h1>

      {showSuccess && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Zahlung erfolgreich! Ihre Bestellung wird bearbeitet.
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">Loading orders...</div>
      )}

      {orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    Bestellung #{order.id.slice(0, 8)}
                  </h2>
                  <p className="text-sm text-gray-600">
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
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    order.status === 'PAID'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × €{item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-semibold">Gesamt:</span>
                <span className="text-xl font-bold">
                  €{order.totalAmount.toFixed(2)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        !isLoading && (
          <Card className="p-12 text-center text-gray-600">
            <p className="text-lg mb-4">Noch keine Bestellungen</p>
            <a href="/products" className="text-blue-600 hover:underline">
              Produkte ansehen
            </a>
          </Card>
        )
      )}
    </div>
  );
}
