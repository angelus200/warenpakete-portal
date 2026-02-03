'use client';

import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface Contract {
  id: string;
  contractNumber: string;
  productName: string;
  productQuantity: number;
  purchasePrice: number;
  commissionRate: number;
  status: string;
  createdAt: string;
  signedAt: string | null;
  salesStatus: string;
  salesPrice: number | null;
  payoutAmount: number | null;
  payoutStatus: string;
}

export default function ContractsPage() {
  const api = useApi();

  const { data: contracts, isLoading } = useQuery<Contract[]>({
    queryKey: ['contracts'],
    queryFn: () => api.get('/contracts'),
    enabled: api.isLoaded && api.isSignedIn,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_signature':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'signed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'active':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_signature':
        return 'Signierung ausstehend';
      case 'signed':
        return 'Signiert';
      case 'active':
        return 'Aktiv';
      default:
        return status;
    }
  };

  const getSalesStatusBadge = (salesStatus: string) => {
    switch (salesStatus) {
      case 'pending':
        return 'text-gray-600';
      case 'listed':
        return 'text-blue-400';
      case 'sold':
        return 'text-green-400';
      default:
        return 'text-gray-600';
    }
  };

  const getSalesStatusLabel = (salesStatus: string) => {
    switch (salesStatus) {
      case 'pending':
        return 'Noch nicht gelistet';
      case 'listed':
        return 'Im Verkauf';
      case 'sold':
        return 'Verkauft';
      default:
        return salesStatus;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Verträge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebebeb]">
      <div className="container mx-auto px-4 py-3">
        <div className="mb-3">
          <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
            Meine Verkaufsverträge
          </h1>
          <p className="text-gray-600">
            Übersicht aller Kommissionsverträge
          </p>
        </div>

        {!contracts || contracts.length === 0 ? (
          <Card className="p-3 bg-white border-gray-300 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="w-16 h-16 text-gold/50 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-3 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-xl text-gray-700 mb-2">Keine Verträge vorhanden</p>
              <p className="text-gray-600 mb-3">
                Wenn Sie eine Bestellung mit Verkaufskommission wählen, wird hier ein Vertrag angezeigt.
              </p>
              <Link
                href="/orders"
                className="inline-block px-3 py-3 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold rounded-lg shadow-lg shadow-gold/20 transition-all"
              >
                Zu meinen Bestellungen
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {contracts.map((contract) => (
              <Link key={contract.id} href={`/contracts/${contract.id}`}>
                <Card className="p-3 bg-white border-gray-300 hover:border-gold transition-all cursor-pointer">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Contract Number & Date */}
                    <div className="md:col-span-3">
                      <p className="text-sm text-gray-600 mb-1">Vertragsnummer</p>
                      <p className="text-gray-900 font-semibold">{contract.contractNumber}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(contract.createdAt).toLocaleDateString('de-DE')}
                      </p>
                    </div>

                    {/* Product */}
                    <div className="md:col-span-3">
                      <p className="text-sm text-gray-600 mb-1">Produkt</p>
                      <p className="text-gray-900">{contract.productName}</p>
                      <p className="text-xs text-gray-600">{contract.productQuantity} Stück</p>
                    </div>

                    {/* Price */}
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Einkaufspreis</p>
                      <p className="text-gray-900 font-semibold">
                        {new Intl.NumberFormat('de-DE', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(contract.purchasePrice)}
                      </p>
                      {contract.salesPrice && (
                        <p className="text-xs text-green-400 mt-1">
                          Verkauft: {new Intl.NumberFormat('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(contract.salesPrice)}
                        </p>
                      )}
                    </div>

                    {/* Sales Status */}
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Verkaufsstatus</p>
                      <p className={`text-sm font-medium ${getSalesStatusBadge(contract.salesStatus)}`}>
                        {getSalesStatusLabel(contract.salesStatus)}
                      </p>
                      {contract.payoutAmount && (
                        <p className="text-xs text-amber-400 mt-1">
                          Auszahlung: {new Intl.NumberFormat('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(contract.payoutAmount)}
                        </p>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="md:col-span-2 text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(
                          contract.status
                        )}`}
                      >
                        {getStatusLabel(contract.status)}
                      </span>
                      {contract.signedAt && (
                        <p className="text-xs text-gray-600 mt-2">
                          Signiert: {new Date(contract.signedAt).toLocaleDateString('de-DE')}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
