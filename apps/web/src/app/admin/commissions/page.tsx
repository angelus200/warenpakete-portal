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
  commissionRate: number;
  payoutStatus: string;
  payoutAmount: number | null;
  paidAt: string | null;
  createdAt: string;
  soldAt: string | null;
  user: {
    email: string;
    companyName: string | null;
    firstName: string | null;
    lastName: string | null;
  };
}

export default function AdminCommissionsPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('sold');

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
    if (filter === 'sold') return contract.salesStatus === 'sold';
    if (filter === 'needsPayout') return contract.salesStatus === 'sold' && contract.payoutStatus === 'pending';
    if (filter === 'completed') return contract.payoutStatus === 'completed';
    return true;
  });

  const calculateCommission = (contract: Contract): number => {
    if (!contract.salesPrice) return 0;
    return contract.salesPrice * contract.commissionRate;
  };

  const totalCommissions = filteredContracts.reduce(
    (sum, c) => sum + calculateCommission(c),
    0
  );

  const totalPayouts = filteredContracts
    .filter(c => c.payoutAmount)
    .reduce((sum, c) => sum + (c.payoutAmount || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Lade Kommissionen...</p>
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
            <h1 className="text-4xl font-bold text-white mb-2">Kommissions-Übersicht</h1>
            <p className="text-gray-400">{filteredContracts.length} Verträge</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-zinc-900 border-amber-500/20">
            <h3 className="text-sm text-gray-400 font-medium mb-2">Gesamt-Kommission</h3>
            <p className="text-3xl font-bold text-amber-500">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalCommissions)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {filteredContracts.filter(c => c.salesPrice).length} verkaufte Verträge
            </p>
          </Card>

          <Card className="p-6 bg-zinc-900 border-amber-500/20">
            <h3 className="text-sm text-gray-400 font-medium mb-2">Ausstehende Auszahlungen</h3>
            <p className="text-3xl font-bold text-yellow-500">
              {filteredContracts.filter(c => c.salesStatus === 'sold' && c.payoutStatus === 'pending').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Bereit zur Auszahlung</p>
          </Card>

          <Card className="p-6 bg-zinc-900 border-amber-500/20">
            <h3 className="text-sm text-gray-400 font-medium mb-2">Ausgezahlt</h3>
            <p className="text-3xl font-bold text-green-500">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalPayouts)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {filteredContracts.filter(c => c.payoutStatus === 'completed').length} Auszahlungen
            </p>
          </Card>
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
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'completed'
                ? 'bg-amber-600 text-black'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            Ausgezahlt ({contracts.filter(c => c.payoutStatus === 'completed').length})
          </button>
        </div>

        {/* Commissions List */}
        <div className="space-y-4">
          {filteredContracts.length === 0 ? (
            <Card className="p-8 bg-zinc-900 border-amber-500/20 text-center">
              <p className="text-gray-400">Keine Kommissionen gefunden</p>
            </Card>
          ) : (
            filteredContracts.map((contract) => (
              <Link key={contract.id} href={`/admin/contracts/${contract.id}`}>
                <Card className="p-6 bg-zinc-900 border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Vertrag</p>
                      <p className="text-white font-semibold">{contract.contractNumber}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(contract.createdAt).toLocaleDateString('de-DE')}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">Kunde</p>
                      <p className="text-white">
                        {contract.user.companyName ||
                         `${contract.user.firstName || ''} ${contract.user.lastName || ''}`.trim() ||
                         contract.user.email}
                      </p>
                      <p className="text-xs text-gray-500">{contract.user.email}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">Produkt</p>
                      <p className="text-white">{contract.productName}</p>
                      <p className="text-xs text-gray-500">{contract.productQuantity} Stück</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">Verkaufspreis</p>
                      {contract.salesPrice ? (
                        <>
                          <p className="text-white font-semibold">
                            {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(contract.salesPrice)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Einkauf: {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(contract.purchasePrice)}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500">Noch nicht verkauft</p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">Kommission</p>
                      <p className="text-amber-500 font-semibold">
                        {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(calculateCommission(contract))}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(contract.commissionRate * 100).toFixed(0)}% vom Verkaufspreis
                      </p>
                    </div>

                    <div className="text-right">
                      {contract.payoutStatus === 'completed' ? (
                        <>
                          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
                            ✓ Ausgezahlt
                          </span>
                          {contract.payoutAmount && (
                            <p className="text-xs text-gray-400 mt-2">
                              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(contract.payoutAmount)}
                            </p>
                          )}
                          {contract.paidAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(contract.paidAt).toLocaleDateString('de-DE')}
                            </p>
                          )}
                        </>
                      ) : contract.salesStatus === 'sold' ? (
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400">
                          ⚠️ Auszahlung offen
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-500/20 text-gray-400">
                          Noch nicht verkauft
                        </span>
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
