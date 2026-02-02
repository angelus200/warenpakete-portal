'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ecommercerente.com';

interface Contract {
  id: string;
  contractNumber: string;
  productName: string;
  productQuantity: number;
  purchasePrice: number;
  salesStatus: string;
  salesPrice: number | null;
  payoutStatus: string;
  createdAt: string;
  user: {
    email: string;
    companyName: string;
  };
}

export default function AdminContractsPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchContracts(token);
  }, [router]);

  const fetchContracts = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/contracts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      setContracts(data);
    } catch (error) {
      console.error('Failed to load contracts:', error);
      localStorage.removeItem('adminToken');
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContracts = contracts.filter((contract) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return contract.salesStatus === 'pending';
    if (filter === 'listed') return contract.salesStatus === 'listed';
    if (filter === 'sold') return contract.salesStatus === 'sold';
    if (filter === 'needsPayout') return contract.salesStatus === 'sold' && contract.payoutStatus === 'pending';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'listed': return 'text-blue-500';
      case 'sold': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Offen';
      case 'listed': return 'Gelistet';
      case 'sold': return 'Verkauft';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Lade Verträge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Kommissionsverträge</h1>
            <p className="text-gray-400">{filteredContracts.length} Verträge</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-amber-600 text-black'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            Alle ({contracts.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'pending'
                ? 'bg-amber-600 text-black'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            Offen ({contracts.filter(c => c.salesStatus === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('listed')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'listed'
                ? 'bg-amber-600 text-black'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            Gelistet ({contracts.filter(c => c.salesStatus === 'listed').length})
          </button>
          <button
            onClick={() => setFilter('sold')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'sold'
                ? 'bg-amber-600 text-black'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            Verkauft ({contracts.filter(c => c.salesStatus === 'sold').length})
          </button>
          <button
            onClick={() => setFilter('needsPayout')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'needsPayout'
                ? 'bg-amber-600 text-black'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            Auszahlung offen ({contracts.filter(c => c.salesStatus === 'sold' && c.payoutStatus === 'pending').length})
          </button>
        </div>

        {/* Contracts List */}
        <div className="space-y-4">
          {filteredContracts.length === 0 ? (
            <Card className="p-8 bg-zinc-900 border-amber-500/20 text-center">
              <p className="text-gray-400">Keine Verträge gefunden</p>
            </Card>
          ) : (
            filteredContracts.map((contract) => (
              <Link key={contract.id} href={`/admin/contracts/${contract.id}`}>
                <Card className="p-6 bg-zinc-900 border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Vertrag</p>
                      <p className="text-white font-semibold">{contract.contractNumber}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(contract.createdAt).toLocaleDateString('de-DE')}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">Kunde</p>
                      <p className="text-white">{contract.user.companyName || contract.user.email}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">Produkt</p>
                      <p className="text-white">{contract.productName}</p>
                      <p className="text-xs text-gray-500">{contract.productQuantity} Stück</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">Einkaufspreis</p>
                      <p className="text-white font-semibold">
                        €{Number(contract.purchasePrice).toLocaleString('de-DE')}
                      </p>
                      {contract.salesPrice && (
                        <p className="text-xs text-green-500 mt-1">
                          Verkauft: €{Number(contract.salesPrice).toLocaleString('de-DE')}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.salesStatus)}`}>
                        {getStatusLabel(contract.salesStatus)}
                      </span>
                      {contract.salesStatus === 'sold' && contract.payoutStatus === 'pending' && (
                        <p className="text-xs text-yellow-500 mt-2">⚠️ Auszahlung offen</p>
                      )}
                      {contract.payoutStatus === 'completed' && (
                        <p className="text-xs text-green-500 mt-2">✓ Ausgezahlt</p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
