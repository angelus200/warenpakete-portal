'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ecommercerente.com';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  retailValue: number;
  stock: number;
  palletCount: number;
  status: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchProducts(token);
  }, [router]);

  const fetchProducts = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      localStorage.removeItem('adminToken');
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    if (filter === 'all') return true;
    return product.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-500/20 text-green-400';
      case 'RESERVED': return 'bg-yellow-500/20 text-yellow-400';
      case 'SOLD': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'Verfügbar';
      case 'RESERVED': return 'Reserviert';
      case 'SOLD': return 'Verkauft';
      default: return status;
    }
  };

  const totalInventoryValue = filteredProducts.reduce(
    (sum, p) => sum + (p.price * p.stock),
    0
  );

  const totalRetailValue = filteredProducts.reduce(
    (sum, p) => sum + (p.retailValue * p.stock),
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Produkte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebebeb]">
      <div className="container mx-auto px-4 py-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900 mb-2">Produkt-Verwaltung</h1>
            <p className="text-gray-600">{filteredProducts.length} Produkte</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/dashboard"
              className="px-3 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-lg transition-all"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <Card className="p-3 bg-white border-amber-500/20">
            <h3 className="text-sm text-gray-600 font-medium mb-2">Gesamt-Bestand</h3>
            <p className="text-xl font-bold text-gray-900">
              {filteredProducts.reduce((sum, p) => sum + p.stock, 0)}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {filteredProducts.filter(p => p.status === 'AVAILABLE').length} verfügbar
            </p>
          </Card>

          <Card className="p-3 bg-white border-amber-500/20">
            <h3 className="text-sm text-gray-600 font-medium mb-2">Bestandswert (EK)</h3>
            <p className="text-xl font-bold text-amber-500">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalInventoryValue)}
            </p>
            <p className="text-xs text-gray-600 mt-1">Einkaufspreis</p>
          </Card>

          <Card className="p-3 bg-white border-amber-500/20">
            <h3 className="text-sm text-gray-600 font-medium mb-2">Warenwert (UVP)</h3>
            <p className="text-xl font-bold text-green-500">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalRetailValue)}
            </p>
            <p className="text-xs text-gray-600 mt-1">Unverbindliche Preisempfehlung</p>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-amber-600 text-black'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Alle ({products.length})
          </button>
          <button
            onClick={() => setFilter('AVAILABLE')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'AVAILABLE'
                ? 'bg-amber-600 text-black'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Verfügbar ({products.filter(p => p.status === 'AVAILABLE').length})
          </button>
          <button
            onClick={() => setFilter('RESERVED')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'RESERVED'
                ? 'bg-amber-600 text-black'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Reserviert ({products.filter(p => p.status === 'RESERVED').length})
          </button>
          <button
            onClick={() => setFilter('SOLD')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'SOLD'
                ? 'bg-amber-600 text-black'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Verkauft ({products.filter(p => p.status === 'SOLD').length})
          </button>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <Card className="p-4 bg-white border-amber-500/20 text-center">
              <p className="text-gray-600">Keine Produkte gefunden</p>
            </Card>
          ) : (
            filteredProducts.map((product) => (
              <Card key={product.id} className="p-3 bg-white border-amber-500/20 hover:border-amber-500/40 transition-all">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Produkt</p>
                    <p className="text-gray-900 font-semibold">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                    )}
                    <p className="text-xs text-gray-600 mt-1">
                      {product.images.length} Bilder · {product.palletCount} Paletten
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
                      {getStatusLabel(product.status)}
                    </span>
                    <p className="text-xs text-gray-600 mt-1">Bestand: {product.stock}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Einkaufspreis</p>
                    <p className="text-gray-900 font-semibold">
                      {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(product.price)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Gesamt: {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(product.price * product.stock)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">UVP</p>
                    <p className="text-green-500 font-semibold">
                      {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(product.retailValue)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Gesamt: {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(product.retailValue * product.stock)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-2">Erstellt</p>
                    <p className="text-gray-900 text-sm">
                      {new Date(product.createdAt).toLocaleDateString('de-DE')}
                    </p>
                    {product.updatedAt !== product.createdAt && (
                      <p className="text-xs text-gray-600 mt-1">
                        Geändert: {new Date(product.updatedAt).toLocaleDateString('de-DE')}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
