'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/lib/api-client';
import { Product, PaginatedResponse, ProductStatus } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProductsPage() {
  const apiClient = useApiClient();

  const { data, isLoading, error } = useQuery<PaginatedResponse<Product>>({
    queryKey: ['products'],
    queryFn: () => apiClient.get('/products?limit=50'),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error loading products: {error.message}
        </div>
      </div>
    );
  }

  const products = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">B2B Warenpakete</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const discount = Math.round(
            ((product.retailValue - product.price) / product.retailValue) * 100
          );

          return (
            <div
              key={product.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {product.images.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}

              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-green-600">
                    €{product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    UVP: €{product.retailValue.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-green-600 font-semibold">
                  Sparen Sie {discount}%
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>Paletten: {product.palletCount}</span>
                <span>
                  {product.status === ProductStatus.AVAILABLE
                    ? `Auf Lager: ${product.stock}`
                    : 'Nicht verfügbar'}
                </span>
              </div>

              <Link href={`/products/${product.id}`}>
                <Button className="w-full">Details ansehen</Button>
              </Link>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center text-gray-600 py-12">
          Keine Produkte verfügbar.
        </div>
      )}
    </div>
  );
}
