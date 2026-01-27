'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useApiClient } from '@/lib/api-client';
import { Product, ProductStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const apiClient = useApiClient();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [quantity, setQuantity] = useState(1);

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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Product not found</div>
      </div>
    );
  }

  const discount = Math.round(
    ((product.retailValue - product.price) / product.retailValue) * 100
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="space-y-4 mb-6">
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-green-600">
                    €{product.price.toFixed(2)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    €{product.retailValue.toFixed(2)}
                  </span>
                </div>
                <div className="text-lg text-green-600 font-semibold">
                  Sie sparen {discount}% (€
                  {(product.retailValue - product.price).toFixed(2)})
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Paletten:</span>
                  <span className="font-semibold">{product.palletCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verfügbar:</span>
                  <span className="font-semibold">
                    {product.status === ProductStatus.AVAILABLE
                      ? `${product.stock} Stück`
                      : 'Nicht verfügbar'}
                  </span>
                </div>
              </div>
            </div>

            {product.status === ProductStatus.AVAILABLE && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Menge:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-24 px-3 py-2 border rounded-md"
                  />
                </div>

                <Button
                  onClick={handleBuyNow}
                  disabled={createOrderMutation.isPending}
                  className="w-full py-6 text-lg"
                >
                  {createOrderMutation.isPending
                    ? 'Wird verarbeitet...'
                    : 'Jetzt kaufen'}
                </Button>

                {!isSignedIn && (
                  <p className="text-sm text-gray-600 text-center">
                    Sie müssen angemeldet sein, um zu bestellen
                  </p>
                )}
              </div>
            )}

            {product.status !== ProductStatus.AVAILABLE && (
              <div className="bg-gray-100 text-gray-700 px-4 py-3 rounded-md">
                Dieses Produkt ist derzeit nicht verfügbar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
