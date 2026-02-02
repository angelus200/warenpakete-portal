'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { Card } from '@/components/ui/card';
import { Order } from '@/types';

export default function FulfillmentPage() {
  const api = useApi();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const orderId = params.id as string;

  const [selectedOption, setSelectedOption] = useState<'delivery' | 'commission' | null>(null);
  const [bankData, setBankData] = useState({
    iban: '',
    bic: '',
    accountHolder: '',
  });
  const [error, setError] = useState<string | null>(null);

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: () => api.get(`/orders/${orderId}`),
    enabled: api.isLoaded && api.isSignedIn,
  });

  const deliveryMutation = useMutation({
    mutationFn: () => api.post(`/orders/${orderId}/choose-delivery`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      router.push('/orders');
    },
    onError: (err: any) => {
      setError(err.message || 'Fehler bei der Auswahl');
    },
  });

  const commissionMutation = useMutation({
    mutationFn: () =>
      api.post('/contracts/create-from-order', {
        orderId,
        ...bankData,
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      router.push(`/contracts/${data.id}/sign`);
    },
    onError: (err: any) => {
      setError(err.message || 'Fehler bei der Vertragserstellung');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedOption === 'delivery') {
      deliveryMutation.mutate();
    } else if (selectedOption === 'commission') {
      if (!bankData.iban || !bankData.bic || !bankData.accountHolder) {
        setError('Bitte füllen Sie alle Bankdaten aus');
        return;
      }
      commissionMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-400">Lade Bestellung...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <p className="text-gray-400">Bestellung nicht gefunden</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Fulfillment-Optionen
          </h1>
          <p className="text-gray-400">
            Bestellung #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border-2 border-red-500/50 text-red-400 px-6 py-4 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 mb-8">
            {/* Delivery Option */}
            <Card
              className={`p-8 cursor-pointer transition-all ${
                selectedOption === 'delivery'
                  ? 'bg-gold/10 border-2 border-gold'
                  : 'bg-dark-light border border-gold/20 hover:border-gold/40'
              }`}
              onClick={() => setSelectedOption('delivery')}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <input
                    type="radio"
                    name="fulfillment"
                    checked={selectedOption === 'delivery'}
                    onChange={() => setSelectedOption('delivery')}
                    className="w-5 h-5 text-gold bg-dark border-gold/40 focus:ring-gold"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Sofortige Lieferung
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Die Ware wird direkt an Sie geliefert. Sie erhalten die Ware
                    innerhalb von 3-5 Werktagen und können sofort mit dem Verkauf
                    beginnen.
                  </p>
                  <div className="flex items-center gap-2 text-gold">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm">Schnelle Lieferung</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Commission Option */}
            <Card
              className={`p-8 cursor-pointer transition-all ${
                selectedOption === 'commission'
                  ? 'bg-gold/10 border-2 border-gold'
                  : 'bg-dark-light border border-gold/20 hover:border-gold/40'
              }`}
              onClick={() => setSelectedOption('commission')}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <input
                    type="radio"
                    name="fulfillment"
                    checked={selectedOption === 'commission'}
                    onChange={() => setSelectedOption('commission')}
                    className="w-5 h-5 text-gold bg-dark border-gold/40 focus:ring-gold"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Verkaufskommission (20%)
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Wir verkaufen die Ware für Sie im eigenen Namen. Sie zahlen nur
                    20% Kommission vom Verkaufspreis. Lagerung: 14 Tage kostenlos,
                    danach €0,50/Palette/Tag.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gold">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm">Keine Vorabkosten</span>
                    </div>
                    <div className="flex items-center gap-2 text-gold">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm">Professioneller Verkauf</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedOption === 'commission' && (
                <div className="mt-6 pt-6 border-t border-gold/20 space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Bankverbindung für Auszahlung
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      IBAN *
                    </label>
                    <input
                      type="text"
                      value={bankData.iban}
                      onChange={(e) =>
                        setBankData({ ...bankData, iban: e.target.value.toUpperCase() })
                      }
                      placeholder="DE89 3704 0044 0532 0130 00"
                      className="w-full px-4 py-3 bg-dark border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      BIC *
                    </label>
                    <input
                      type="text"
                      value={bankData.bic}
                      onChange={(e) =>
                        setBankData({ ...bankData, bic: e.target.value.toUpperCase() })
                      }
                      placeholder="COBADEFFXXX"
                      className="w-full px-4 py-3 bg-dark border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Kontoinhaber *
                    </label>
                    <input
                      type="text"
                      value={bankData.accountHolder}
                      onChange={(e) =>
                        setBankData({ ...bankData, accountHolder: e.target.value })
                      }
                      placeholder="Ihr Name oder Firmenname"
                      className="w-full px-4 py-3 bg-dark border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                      required
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/orders')}
              className="flex-1 px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={
                !selectedOption ||
                deliveryMutation.isPending ||
                commissionMutation.isPending
              }
              className="flex-1 px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold rounded-lg shadow-lg shadow-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deliveryMutation.isPending || commissionMutation.isPending
                ? 'Verarbeite...'
                : 'Weiter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
