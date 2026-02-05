'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { Card } from '@/components/ui/card';

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  items: Array<{
    product: {
      name: string;
    };
    quantity: number;
    price: number;
  }>;
  deliveryAddress?: {
    street: string;
    zipCode: string;
    city: string;
    country: string;
    phone?: string;
  };
}

export default function DeliveryConfirmationPage() {
  const api = useApi();
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: () => api.get(`/orders/${orderId}`),
    enabled: api.isLoaded && api.isSignedIn,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Bestellung...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center">
        <p className="text-gray-600">Bestellung nicht gefunden</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebebeb]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Ihre Bestellung wird bearbeitet!
          </h1>
          <p className="text-gray-600">
            Vielen Dank für Ihre Bestellung. Wir bereiten Ihre Lieferung vor.
          </p>
        </div>

        {/* Order Summary */}
        <Card className="bg-white p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Bestellübersicht
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Bestellnummer:</span>
              <span className="font-semibold text-gray-900">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between mb-2">
                  <span className="text-gray-900">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-semibold text-gray-900">
                    €{(Number(item.price) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-lg">
              <span className="font-bold text-gray-900">Gesamt:</span>
              <span className="font-bold text-gold">
                €{(Number(order.totalAmount) / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <Card className="bg-white p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Lieferadresse
            </h2>
            <div className="text-gray-900 space-y-1">
              <p>{order.deliveryAddress.street}</p>
              <p>
                {order.deliveryAddress.zipCode} {order.deliveryAddress.city}
              </p>
              <p>
                {order.deliveryAddress.country === 'AT' && 'Österreich'}
                {order.deliveryAddress.country === 'DE' && 'Deutschland'}
                {order.deliveryAddress.country === 'CH' && 'Schweiz'}
              </p>
              {order.deliveryAddress.phone && (
                <p className="text-gray-600 mt-2">
                  Tel: {order.deliveryAddress.phone}
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Delivery Info */}
        <Card className="bg-gold/10 border-2 border-gold p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Voraussichtliche Lieferzeit
              </h3>
              <p className="text-gray-600">
                Ihre Bestellung wird innerhalb von <strong>5-10 Werktagen</strong> geliefert.
                Sie erhalten eine Benachrichtigung, sobald die Ware versandt wurde.
              </p>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/orders')}
            className="px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold rounded-lg shadow-lg shadow-gold/20 transition-all"
          >
            Zurück zu Bestellungen
          </button>
        </div>
      </div>
    </div>
  );
}
