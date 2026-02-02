'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { Suspense, useState } from 'react';

export const dynamic = 'force-dynamic';
import { useApi } from '@/hooks/useApi';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const api = useApi();
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [acceptedB2BPurchase, setAcceptedB2BPurchase] = useState(false);

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: () => api.get(`/orders/${orderId}`),
    enabled: api.isLoaded && api.isSignedIn && !!orderId,
  });

  const checkoutMutation = useMutation({
    mutationFn: (orderId: string) =>
      api.post<{ sessionId: string; url: string }>(
        '/payments/create-checkout-session',
        { orderId }
      ),
    onSuccess: async (data) => {
      window.location.href = data.url;
    },
  });

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">No order ID provided</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Order not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Bestellübersicht</h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div>
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Menge: {item.quantity} × €{Number(item.price).toFixed(2)}
                  </p>
                </div>
                <div className="font-semibold">
                  €{(Number(item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Gesamt:</span>
              <span>€{Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="my-6 p-4 bg-gold/10 border border-gold/30 rounded-lg">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={acceptedB2BPurchase}
              onChange={(e) => setAcceptedB2BPurchase(e.target.checked)}
              className="mt-1 w-5 h-5 text-gold bg-dark border-2 border-gold/40 rounded focus:ring-gold"
            />
            <span className="text-sm text-gray-300 group-hover:text-white">
              Ich kaufe als <strong className="text-gold">Unternehmer (§ 14 BGB)</strong>, nicht als Verbraucher.
              Mir ist bekannt, dass kein Widerrufsrecht besteht.
            </span>
          </label>
        </div>

        <Button
          onClick={() => checkoutMutation.mutate(orderId)}
          disabled={checkoutMutation.isPending || !acceptedB2BPurchase}
          className="w-full py-6 text-lg"
        >
          {checkoutMutation.isPending
            ? 'Wird verarbeitet...'
            : 'Zur Zahlung'}
        </Button>

        {!acceptedB2BPurchase && (
          <p className="text-sm text-yellow-400 text-center mt-2">
            Bitte bestätigen Sie, dass Sie als Unternehmer kaufen
          </p>
        )}

        {checkoutMutation.error && (
          <div className="mt-4 text-red-600 text-center">
            Error: {checkoutMutation.error.message}
          </div>
        )}
      </div>
    </div>
  );
}
