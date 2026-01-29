'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useApiClient } from '@/lib/api-client';
import { Product, ProductStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import Link from 'next/link';

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const apiClient = useApiClient();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', params.id],
    queryFn: () => apiClient.get(`/products/${params.id}`),
  });

  const createOrderMutation = useMutation({
    mutationFn: (orderData: { items: Array<{ productId: string; quantity: number; price: number }> }) =>
      apiClient.post('/orders', orderData),
    onSuccess: (data: any) => {
      router.push(`/checkout?orderId=${data.id}`);
    },
  });

  const handleBuyNow = () => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    if (!product) return;

    createOrderMutation.mutate({
      items: [
        {
          productId: product.id,
          quantity,
          price: product.price,
        },
      ],
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-gray-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            Lade Produktdetails...
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-dark">
        <div className="container mx-auto px-4 py-12">
          <Card className="p-16 text-center bg-dark-light border-gold/20">
            <p className="text-xl text-gray-400 mb-4">Produkt nicht gefunden</p>
            <Link href="/products">
              <button className="px-6 py-3 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold rounded-lg shadow-lg shadow-gold/20">
                Zurück zu Produkten
              </button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const discount = Math.round(
    ((product.retailValue - product.price) / product.retailValue) * 100
  );

  return (
    <div className="min-h-screen bg-dark">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href="/products" className="inline-flex items-center gap-2 text-gold hover:text-gold-light mb-8 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zurück zu Produkten
        </Link>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image Gallery */}
            <div className="relative">
              {product.images.length > 0 ? (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-dark-light border border-gold/20">
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full h-auto"
                    />
                    <div className="absolute top-6 right-6 bg-gold text-dark px-4 py-2 rounded-full font-bold text-lg shadow-xl">
                      -{discount}%
                    </div>
                  </div>
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index
                              ? 'border-gold shadow-lg shadow-gold/30'
                              : 'border-gold/20 hover:border-gold/50'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} - Bild ${index + 1}`}
                            className="w-full h-20 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 bg-dark-light rounded-xl border border-gold/20 flex flex-col items-center justify-center">
                  <svg className="w-16 h-16 text-gold/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-500">Kein Bild verfügbar</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {product.name}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Pricing */}
              <Card className="p-6 bg-dark-light border-gold/30 mb-8">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-5xl font-bold text-gold">
                    €{Number(product.price).toFixed(2)}
                  </span>
                  <span className="text-2xl text-gray-500 line-through">
                    €{Number(product.retailValue).toFixed(2)}
                  </span>
                </div>
                <div className="inline-block px-4 py-2 bg-gold/10 border border-gold/40 rounded-full">
                  <span className="text-gold font-bold text-lg">
                    Sie sparen {discount}% • €{(Number(product.retailValue) - Number(product.price)).toFixed(2)}
                  </span>
                </div>
              </Card>

              {/* Product Info */}
              <Card className="p-6 bg-dark-light border-gold/20 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Produktdetails</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gold/10">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                      <span className="text-gray-400">Paletten:</span>
                    </div>
                    <span className="font-bold text-white text-lg">{product.palletCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gold/10">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-400">Status:</span>
                    </div>
                    <span className={`font-bold text-lg ${product.status === ProductStatus.AVAILABLE ? 'text-green-400' : 'text-red-400'}`}>
                      {product.status === ProductStatus.AVAILABLE
                        ? `${product.stock} auf Lager`
                        : 'Nicht verfügbar'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-400">UVP Gesamtwert:</span>
                    </div>
                    <span className="font-bold text-white text-lg">€{Number(product.retailValue).toFixed(2)}</span>
                  </div>
                </div>
              </Card>

              {/* Purchase Section */}
              {product.status === ProductStatus.AVAILABLE && (
                <Card className="p-6 bg-gradient-to-br from-dark-light to-dark border-gold/30">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                      Menge auswählen:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      className="w-32 px-4 py-3 bg-dark border-2 border-gold/40 text-white rounded-lg focus:outline-none focus:border-gold text-lg font-semibold"
                    />
                  </div>

                  <Button
                    onClick={handleBuyNow}
                    disabled={createOrderMutation.isPending}
                    className="w-full py-6 text-lg font-bold bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark shadow-2xl shadow-gold/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createOrderMutation.isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-dark"></div>
                        Wird verarbeitet...
                      </span>
                    ) : (
                      <>Jetzt kaufen • €{(Number(product.price) * quantity).toFixed(2)}</>
                    )}
                  </Button>

                  {!isSignedIn && (
                    <p className="text-sm text-gray-400 text-center mt-4 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Sie müssen angemeldet sein, um zu bestellen
                    </p>
                  )}
                </Card>
              )}

              {product.status !== ProductStatus.AVAILABLE && (
                <Card className="p-6 bg-red-500/10 border-2 border-red-500/40 text-red-400">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-bold">Derzeit nicht verfügbar</p>
                      <p className="text-sm text-red-300">Dieses Produkt ist ausverkauft oder nicht mehr verfügbar.</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
