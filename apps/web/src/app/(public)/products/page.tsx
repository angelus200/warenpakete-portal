'use client';

import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { Product, PaginatedResponse, ProductStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function ProductsPage() {
  const api = useApi();

  const { data, isLoading, error } = useQuery<PaginatedResponse<Product>>({
    queryKey: ['products'],
    queryFn: () => api.get('/products?limit=50'),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ebebeb]">
        <div className="container mx-auto px-4 py-3">
          <div className="text-center text-gray-600">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            Lade Premium-Produkte...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#ebebeb]">
        <div className="container mx-auto px-4 py-3">
          <div className="text-center">
            <div className="text-red-400 mb-4">Fehler beim Laden der Produkte</div>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const products = data?.data || [];

  return (
    <div className="min-h-screen bg-[#ebebeb]">
      <div className="container mx-auto px-4 py-3">
        {/* Header */}
        <div className="mb-3 text-center">
          <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
            Premium <span className="text-gold">B2B Warenpakete</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Exklusive Angebote mit bis zu 70% unter UVP
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const discount = Math.round(
              ((product.retailValue - product.price) / product.retailValue) * 100
            );

            return (
              <Card
                key={product.id}
                className="bg-white border-gray-300 hover:border-gold/50 transition-all hover:shadow-xl hover:shadow-gold/10 overflow-hidden group"
              >
                {product.images.length > 0 && (
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 group-hover:opacity-0"
                    />
                    {product.images.length > 1 && (
                      <img
                        src={product.images[1]}
                        alt={`${product.name} - Bild 2`}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    )}
                    <div className="absolute top-4 right-4 bg-gold text-dark px-3 py-1 rounded-full font-bold text-sm shadow-lg z-10">
                      -{discount}%
                    </div>
                  </div>
                )}

                <div className="p-3">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gold transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="space-y-3 mb-3">
                    <div className="flex items-baseline gap-3">
                      <span className="text-xl font-bold text-gold">
                        €{Number(product.price).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-600 line-through">
                        UVP: €{Number(product.retailValue).toFixed(2)}
                      </span>
                    </div>
                    <div className="inline-block px-3 py-1 bg-gold/10 border border-gold/30 rounded-full">
                      <span className="text-gold font-semibold text-sm">
                        Sie sparen {discount}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3 pb-6 border-b border-gray-300">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                      <span>{product.palletCount} Paletten</span>
                    </div>
                    <span className={product.status === ProductStatus.AVAILABLE ? 'text-green-400' : 'text-red-400'}>
                      {product.status === ProductStatus.AVAILABLE
                        ? `${product.stock} verfügbar`
                        : 'Ausverkauft'}
                    </span>
                  </div>

                  <Link href={`/products/${product.id}`} className="block">
                    <Button className="w-full bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold shadow-lg shadow-gold/20">
                      Details ansehen
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-600 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4 text-gold/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">Derzeit keine Premium-Produkte verfügbar</p>
            <p className="text-gray-600 text-sm mt-2">Schauen Sie bald wieder vorbei</p>
          </div>
        )}
      </div>
    </div>
  );
}
