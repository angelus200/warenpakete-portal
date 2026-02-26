'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useApi } from '@/hooks/useApi';
import { Card } from '@/components/ui/card';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe outside component (prevents re-creation on every render)
// TEMPORARY DEBUG: Hardcoded key to test if env variable is the issue
const stripePromise = loadStripe('pk_live_51R28PnA8fUoWsdr56pd5HX5bZ2cFodfPxhZ1etegfXAyp0BmXm2paXz8P9SrgsY8FjzNq29QjcVgP8KrpAfAWOXE00buifRdXo');

interface KnowledgeProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  isFree: boolean;
  fileUrl: string;
  isActive: boolean;
  sortOrder: number;
}

interface KnowledgePurchase {
  id: string;
  productId: string;
  product: KnowledgeProduct;
}

type Category = 'all' | 'guide' | 'template' | 'academy';

function CheckoutForm({
  clientSecret,
  onSuccess,
  onClose
}: {
  clientSecret: string;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/knowledge?payment=success`,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setIsProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-dark font-bold rounded-lg hover:from-gold-darker hover:via-gold-dark hover:to-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Wird verarbeitet...' : 'Jetzt bezahlen'}
        </button>
      </div>
    </form>
  );
}

export default function KnowledgePage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const api = useApi();
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<KnowledgeProduct | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);

  const { data: products = [] } = useQuery<KnowledgeProduct[]>({
    queryKey: ['knowledge-products'],
    queryFn: () => api.get('/knowledge'),
    enabled: api.isLoaded,
  });

  const { data: purchases = [] } = useQuery<KnowledgePurchase[]>({
    queryKey: ['knowledge-purchases'],
    queryFn: () => api.get('/knowledge/my-purchases'),
    enabled: api.isLoaded && api.isSignedIn,
  });

  const purchasedIds = new Set(purchases.map(p => p.productId));

  const purchaseMutation = useMutation({
    mutationFn: (product: KnowledgeProduct) =>
      api.post<{ isFree: boolean; clientSecret?: string; purchaseId?: string }>(`/knowledge/${product.id}/purchase`, {}),
    onSuccess: (data, product) => {
      console.log('🔵 purchaseMutation.onSuccess called');
      console.log('🔵 data:', data);
      console.log('🔵 product:', product);

      setPendingProductId(null);
      setPurchaseError(null);

      if (data.isFree) {
        queryClient.invalidateQueries({ queryKey: ['knowledge-purchases'] });
        downloadMutation.mutate(product.id);
      } else if (data.clientSecret) {
        console.log('🔵 data.clientSecret exists:', data.clientSecret);
        console.log('🔵 Using product directly (no find needed):', product);

        setClientSecret(data.clientSecret);
        setSelectedProduct(product); // Direct assignment - no find() needed!

        console.log('🔵 State updates called - clientSecret and selectedProduct set');
      }
    },
    onError: (error: any) => {
      console.error('❌ Purchase error:', error);
      setPendingProductId(null);

      // Handle different error types
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        setPurchaseError('Bitte melde dich an, um Produkte zu kaufen.');
      } else if (error.message?.includes('already purchased')) {
        setPurchaseError('Du hast dieses Produkt bereits gekauft.');
      } else {
        setPurchaseError(error.message || 'Fehler beim Kaufvorgang. Bitte versuche es erneut.');
      }
    },
  });

  const downloadMutation = useMutation({
    mutationFn: (productId: string) =>
      api.get<{ downloadUrl: string; fileName: string }>(`/knowledge/${productId}/download`),
    onSuccess: (data) => {
      window.open(data.downloadUrl, '_blank');
    },
  });

  const handlePurchaseSuccess = () => {
    setClientSecret(null);
    setSelectedProduct(null);
    setPurchaseError(null);
    queryClient.invalidateQueries({ queryKey: ['knowledge-purchases'] });
  };

  const handlePurchaseClick = (product: KnowledgeProduct) => {
    // Check if user is signed in
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    // Clear any previous errors
    setPurchaseError(null);
    setPendingProductId(product.id);
    purchaseMutation.mutate(product);
  };

  const filteredProducts = products.filter(
    p => activeCategory === 'all' || p.category === activeCategory
  );

  const categories = [
    { id: 'all' as Category, label: 'Alle' },
    { id: 'guide' as Category, label: 'Guides' },
    { id: 'template' as Category, label: 'Templates' },
    { id: 'academy' as Category, label: 'Academy' },
  ];

  return (
    <div className="min-h-screen bg-[#ebebeb]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block px-4 py-8 md:px-6 md:py-12 bg-gradient-to-r from-gold-dark via-gold to-gold-light rounded-2xl shadow-xl shadow-gold/20 mb-4">
            <h1 className="text-2xl md:text-4xl font-bold text-dark mb-2">
              Knowledge Shop
            </h1>
            <p className="text-dark/80 text-base md:text-lg">
              Premium Templates, Guides & Academy Content
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-start md:justify-center gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-gold text-dark shadow-lg shadow-gold/20'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {purchaseError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-red-600 text-xl">⚠️</span>
              <div className="flex-1">
                <p className="text-red-800 font-medium mb-1">Kaufvorgang fehlgeschlagen</p>
                <p className="text-red-700 text-sm">{purchaseError}</p>
              </div>
              <button
                onClick={() => setPurchaseError(null)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const isPurchased = purchasedIds.has(product.id);
            const isDownloaded = isPurchased && product.isFree;

            return (
              <Card key={product.id} className="bg-white border-gray-300 hover:border-gold transition-all shadow-sm hover:shadow-lg">
                <div className="p-4 md:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full uppercase">
                      {product.category}
                    </span>
                    {product.isFree && (
                      <span className="px-3 py-1 bg-green-500/10 text-green-600 text-xs font-semibold rounded-full uppercase">
                        Kostenlos
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Footer */}
                  <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                    <div className="text-xl md:text-2xl font-bold text-gold">
                      {product.isFree ? 'Gratis' : `€${Number(product.price).toFixed(2)}`}
                    </div>
                    <div>
                      {product.isFree ? (
                        isDownloaded ? (
                          <button
                            disabled
                            className="px-4 py-2 md:px-6 text-sm md:text-base bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                          >
                            ✓ Heruntergeladen
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePurchaseClick(product)}
                            disabled={pendingProductId === product.id}
                            className="px-4 py-2 md:px-6 text-sm md:text-base bg-gold hover:bg-gold-dark text-dark font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {pendingProductId === product.id ? 'Lädt...' : 'Download'}
                          </button>
                        )
                      ) : isPurchased ? (
                        <button
                          onClick={() => downloadMutation.mutate(product.id)}
                          disabled={downloadMutation.isPending}
                          className="px-4 py-2 md:px-6 text-sm md:text-base bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {downloadMutation.isPending ? 'Lädt...' : '✓ Download'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePurchaseClick(product)}
                          disabled={pendingProductId === product.id}
                          className="px-4 py-2 md:px-6 text-sm md:text-base bg-gold hover:bg-gold-dark text-dark font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {pendingProductId === product.id ? 'Lädt...' : 'Kaufen'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Keine Produkte in dieser Kategorie verfügbar.
            </p>
          </div>
        )}
      </div>

      {/* Stripe Payment Modal */}
      {clientSecret && selectedProduct && (() => {
        console.log('🟢 Modal is rendering!');
        console.log('🟢 clientSecret:', clientSecret);
        console.log('🟢 selectedProduct:', selectedProduct);
        console.log('🟢 stripePromise:', stripePromise);
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Zahlung abschließen
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                  {selectedProduct.title} - €{Number(selectedProduct.price).toFixed(2)}
                </p>
              </div>

              <Elements
                key={clientSecret}
                stripe={stripePromise}
                options={{ clientSecret }}
              >
                <CheckoutForm
                  clientSecret={clientSecret}
                  onSuccess={handlePurchaseSuccess}
                  onClose={() => {
                    setClientSecret(null);
                    setSelectedProduct(null);
                  }}
                />
              </Elements>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
