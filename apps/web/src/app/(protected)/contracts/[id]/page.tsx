'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
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
  signatureData: string | null;
  iban: string;
  bic: string;
  accountHolder: string;
  salesStatus: string;
  salesPrice: number | null;
  soldAt: string | null;
  payoutAmount: number | null;
  payoutStatus: string;
  paidAt: string | null;
  storageStartDate: string;
  storageFeePerDay: number;
  user: {
    companyName: string;
    companyStreet: string;
    companyZip: string;
    companyCity: string;
    companyCountry: string;
    vatId: string;
  };
}

export default function ContractDetailPage() {
  const api = useApi();
  const params = useParams();
  const router = useRouter();
  const contractId = params.id as string;

  const { data: contract, isLoading } = useQuery<Contract>({
    queryKey: ['contract', contractId],
    queryFn: () => api.get(`/contracts/${contractId}`),
    enabled: api.isLoaded && api.isSignedIn,
  });

  const { data: contractText } = useQuery<{ text: string }>({
    queryKey: ['contract-text', contractId],
    queryFn: () => api.get(`/contracts/${contractId}/text`),
    enabled: api.isLoaded && api.isSignedIn && !!contract,
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
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-400">Lade Vertrag...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <p className="text-gray-400">Vertrag nicht gefunden</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/contracts"
            className="inline-flex items-center text-gold hover:text-gold-light mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Zurück zur Übersicht
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Verkaufskommissionsvertrag
              </h1>
              <p className="text-gray-400">
                Vertragsnummer: {contract.contractNumber}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadge(
                contract.status
              )}`}
            >
              {getStatusLabel(contract.status)}
            </span>
          </div>
        </div>

        {/* Contract Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Product Info */}
          <Card className="p-6 bg-dark-light border-gold/20">
            <h3 className="text-xl font-bold text-white mb-4">Produktinformationen</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Produkt</p>
                <p className="text-white font-medium">{contract.productName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Menge</p>
                <p className="text-white">{contract.productQuantity} Stück</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Einkaufspreis</p>
                <p className="text-white font-semibold">
                  {new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(contract.purchasePrice)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Kommissionsrate</p>
                <p className="text-amber-500 font-semibold">
                  {(contract.commissionRate * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </Card>

          {/* Sales Info */}
          <Card className="p-6 bg-dark-light border-gold/20">
            <h3 className="text-xl font-bold text-white mb-4">Verkaufsinformationen</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Verkaufsstatus</p>
                <p className="text-white font-medium">
                  {contract.salesStatus === 'pending' && 'Noch nicht gelistet'}
                  {contract.salesStatus === 'listed' && 'Im Verkauf'}
                  {contract.salesStatus === 'sold' && 'Verkauft'}
                </p>
              </div>
              {contract.salesPrice && (
                <div>
                  <p className="text-sm text-gray-400">Verkaufspreis</p>
                  <p className="text-green-400 font-semibold">
                    {new Intl.NumberFormat('de-DE', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(contract.salesPrice)}
                  </p>
                </div>
              )}
              {contract.soldAt && (
                <div>
                  <p className="text-sm text-gray-400">Verkauft am</p>
                  <p className="text-white">
                    {new Date(contract.soldAt).toLocaleDateString('de-DE')}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-400">Auszahlungsstatus</p>
                <p className="text-white">
                  {contract.payoutStatus === 'pending' && 'Ausstehend'}
                  {contract.payoutStatus === 'processing' && 'In Bearbeitung'}
                  {contract.payoutStatus === 'completed' && 'Ausgezahlt'}
                </p>
              </div>
              {contract.payoutAmount && (
                <div>
                  <p className="text-sm text-gray-400">Auszahlungsbetrag</p>
                  <p className="text-amber-500 font-semibold">
                    {new Intl.NumberFormat('de-DE', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(contract.payoutAmount)}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Bank Details */}
          <Card className="p-6 bg-dark-light border-gold/20">
            <h3 className="text-xl font-bold text-white mb-4">Bankverbindung</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">IBAN</p>
                <p className="text-white font-mono">{contract.iban}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">BIC</p>
                <p className="text-white font-mono">{contract.bic}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Kontoinhaber</p>
                <p className="text-white">{contract.accountHolder}</p>
              </div>
            </div>
          </Card>

          {/* Dates */}
          <Card className="p-6 bg-dark-light border-gold/20">
            <h3 className="text-xl font-bold text-white mb-4">Vertragsdaten</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Erstellt am</p>
                <p className="text-white">
                  {new Date(contract.createdAt).toLocaleDateString('de-DE')}
                </p>
              </div>
              {contract.signedAt && (
                <div>
                  <p className="text-sm text-gray-400">Signiert am</p>
                  <p className="text-white">
                    {new Date(contract.signedAt).toLocaleDateString('de-DE')}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-400">Lagerung seit</p>
                <p className="text-white">
                  {new Date(contract.storageStartDate).toLocaleDateString('de-DE')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Lagerkosten</p>
                <p className="text-white">
                  14 Tage kostenlos, danach{' '}
                  {new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(contract.storageFeePerDay)}{' '}
                  pro Palette/Tag
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Signature */}
        {contract.signatureData && (
          <Card className="p-6 bg-dark-light border-gold/20 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Unterschrift</h3>
            <div className="bg-dark border-2 border-gold/40 rounded-lg p-4 inline-block">
              <img
                src={contract.signatureData}
                alt="Unterschrift"
                className="max-w-md max-h-48"
              />
            </div>
          </Card>
        )}

        {/* Contract Text */}
        <Card className="p-6 bg-dark-light border-gold/20 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Vertragstext</h3>
          <div className="max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
              {contractText?.text || 'Lade Vertragstext...'}
            </pre>
          </div>
        </Card>

        {/* Actions */}
        {contract.status === 'pending_signature' && (
          <div className="flex justify-center">
            <Link
              href={`/contracts/${contract.id}/sign`}
              className="px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold rounded-lg shadow-lg shadow-gold/20 transition-all"
            >
              Vertrag jetzt signieren
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(212, 175, 55, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </div>
  );
}
