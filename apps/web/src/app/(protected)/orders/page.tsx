'use client';

import { useQuery, useMutation } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';
import { useApi } from '@/hooks/useApi';
import { Order } from '@/types';
import { Card } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface InvoiceResponse {
  id: string;
  invoiceNumber: string;
  type: string;
}

export default function OrdersPage() {
  const api = useApi();
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);
  const [generatingDeliveryNote, setGeneratingDeliveryNote] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders'),
  });

  const createInvoiceMutation = useMutation<InvoiceResponse, Error, string>({
    mutationFn: (orderId: string) => api.post(`/invoices/order/${orderId}/invoice`, {}),
    onSuccess: (data, orderId) => {
      // Download the invoice PDF
      window.open(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${data.id}/download`, '_blank');
      setGeneratingInvoice(null);
    },
    onError: () => {
      alert('Fehler beim Erstellen der Rechnung');
      setGeneratingInvoice(null);
    },
  });

  const createDeliveryNoteMutation = useMutation<InvoiceResponse, Error, string>({
    mutationFn: (orderId: string) => api.post(`/invoices/order/${orderId}/delivery-note`, {}),
    onSuccess: (data, orderId) => {
      // Download the delivery note PDF
      window.open(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${data.id}/download`, '_blank');
      setGeneratingDeliveryNote(null);
    },
    onError: () => {
      alert('Fehler beim Erstellen des Lieferscheins');
      setGeneratingDeliveryNote(null);
    },
  });

  const handleDownloadInvoice = (orderId: string) => {
    setGeneratingInvoice(orderId);
    createInvoiceMutation.mutate(orderId);
  };

  const handleDownloadDeliveryNote = (orderId: string) => {
    setGeneratingDeliveryNote(orderId);
    createDeliveryNoteMutation.mutate(orderId);
  };

  return (
    <div className="min-h-screen bg-[#ebebeb]">
      <div className="container mx-auto px-4 py-3">
        <div className="mb-3">
          <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
            Meine Bestellungen
          </h1>
          <p className="text-gray-600">Übersicht über alle Ihre Bestellungen</p>
        </div>

        {showSuccess && (
          <div className="mb-4 bg-green-500/10 border-2 border-green-500/50 text-green-400 px-3 py-4 rounded-lg flex items-center gap-3">
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
            <p className="text-gray-600">Lade Bestellungen...</p>
          </div>
        )}

        {orders && orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id} className="p-4 bg-white border-gray-300 hover:border-gold transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">
                      Bestellung #{order.id.slice(0, 8).toUpperCase()}
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
                    className={`px-4 py-2 rounded-full text-sm font-bold ${
                      order.status === 'PAID'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                        : order.status === 'PENDING'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                        : 'bg-gray-500/20 text-gray-600 border border-gray-500/40'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-4 mb-3 pb-6 border-b border-gold/10">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-[#ebebeb] p-4 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × €{Number(item.price).toFixed(2)}
                        </p>
                      </div>
                      <p className="font-bold text-gold text-lg">
                        €{(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold text-gray-900">Gesamt:</span>
                  <span className="text-xl font-bold text-gold">
                    €{Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>

                {order.status === 'PAID' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={() => handleDownloadInvoice(order.id)}
                      disabled={generatingInvoice === order.id}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generatingInvoice === order.id ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gold"></div>
                          Erstelle Rechnung...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Rechnung herunterladen
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDownloadDeliveryNote(order.id)}
                      disabled={generatingDeliveryNote === order.id}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generatingDeliveryNote === order.id ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                          Erstelle Lieferschein...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Lieferschein herunterladen
                        </>
                      )}
                    </button>
                  </div>
                )}

                {(order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
                  <div className="mt-2 text-center text-sm text-gray-600">
                    <svg className="w-5 h-5 inline mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                    {order.status === 'SHIPPED' ? 'Bestellung versendet' : 'Bestellung zugestellt'}
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          !isLoading && (
            <Card className="p-16 text-center bg-white border-gray-300">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gold/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-xl text-gray-600 mb-4">Noch keine Bestellungen</p>
              <p className="text-gray-600 mb-4">
                Entdecken Sie unsere Premium-Warenpakete und starten Sie Ihr Business
              </p>
              <Link href="/products">
                <button className="px-4 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold rounded-lg shadow-lg shadow-gold/20 transition-all">
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
