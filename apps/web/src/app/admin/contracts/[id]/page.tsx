'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ecommercerente.com';

interface Contract {
  id: string;
  contractNumber: string;
  productName: string;
  productQuantity: number;
  purchasePrice: number;
  commissionRate: number;
  salesStatus: string;
  salesPrice: number | null;
  payoutStatus: string;
  payoutAmount: number | null;
  paidAt: string | null;
  iban: string;
  bic: string;
  accountHolder: string;
  storageStartDate: string;
  storageFeePerDay: number;
  createdAt: string;
  user: {
    email: string;
    name: string;
    companyName: string;
    companyStreet: string;
    companyZip: string;
    companyCity: string;
    companyCountry: string;
    vatId: string;
  };
  order: {
    id: string;
    totalAmount: number;
    status: string;
    paidAt: string;
  };
}

export default function AdminContractDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contractId = params.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [newStatus, setNewStatus] = useState('');
  const [newSalesPrice, setNewSalesPrice] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchContract(token);
  }, [router, contractId]);

  const fetchContract = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/contracts/${contractId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load contract');
      }

      const data = await response.json();
      setContract(data);
      setNewStatus(data.salesStatus);
      setNewSalesPrice(data.salesPrice ? String(data.salesPrice) : '');
    } catch (error) {
      console.error('Failed to load contract:', error);
      setError('Vertrag konnte nicht geladen werden');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData: any = {};

      if (newStatus !== contract?.salesStatus) {
        updateData.salesStatus = newStatus;
      }

      if (newSalesPrice && parseFloat(newSalesPrice) !== contract?.salesPrice) {
        updateData.salesPrice = parseFloat(newSalesPrice);
      }

      const response = await fetch(`${API_URL}/admin/contracts/${contractId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      setSuccess('Vertrag erfolgreich aktualisiert');
      fetchContract(token);
    } catch (error) {
      setError('Aktualisierung fehlgeschlagen');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTriggerPayout = async () => {
    if (!confirm('Auszahlung wirklich auslösen?')) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_URL}/admin/contracts/${contractId}/payout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: 'Admin-Auszahlung' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Payout failed');
      }

      setSuccess('Auszahlung erfolgreich ausgelöst');
      fetchContract(token);
    } catch (error: any) {
      setError(error.message || 'Auszahlung fehlgeschlagen');
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateStorageCosts = () => {
    if (!contract) return 0;

    const startDate = new Date(contract.storageStartDate);
    const today = new Date();
    const daysStored = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const freeStorageDays = 14;
    const chargeableDays = Math.max(0, daysStored - freeStorageDays);
    const storageFeePerDay = Number(contract.storageFeePerDay);
    const palletCount = contract.productQuantity;

    return chargeableDays * storageFeePerDay * palletCount;
  };

  const calculatePayout = () => {
    if (!contract || !contract.salesPrice) return 0;

    const salesPrice = Number(contract.salesPrice);
    const commissionRate = Number(contract.commissionRate);
    const payoutBeforeFees = salesPrice * (1 - commissionRate);
    const storageCosts = calculateStorageCosts();

    return Math.max(0, payoutBeforeFees - storageCosts);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Lade Vertrag...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Vertrag nicht gefunden</p>
      </div>
    );
  }

  const daysStored = Math.floor((new Date().getTime() - new Date(contract.storageStartDate).getTime()) / (1000 * 60 * 60 * 24));
  const storageCosts = calculateStorageCosts();
  const estimatedPayout = calculatePayout();

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Vertrag {contract.contractNumber}
            </h1>
            <p className="text-gray-400">
              Erstellt am {new Date(contract.createdAt).toLocaleDateString('de-DE')}
            </p>
          </div>
          <Link
            href="/admin/contracts"
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all"
          >
            ← Zurück
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card className="p-6 bg-zinc-900 border-amber-500/20">
              <h2 className="text-xl font-bold text-white mb-4">Kundendaten</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Firma</p>
                  <p className="text-white">{contract.user.companyName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Adresse</p>
                  <p className="text-white">
                    {contract.user.companyStreet}<br />
                    {contract.user.companyZip} {contract.user.companyCity}<br />
                    {contract.user.companyCountry}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">USt-IdNr.</p>
                  <p className="text-white">{contract.user.vatId || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{contract.user.email}</p>
                </div>
              </div>
            </Card>

            {/* Product Info */}
            <Card className="p-6 bg-zinc-900 border-amber-500/20">
              <h2 className="text-xl font-bold text-white mb-4">Produktinformationen</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Produkt</p>
                  <p className="text-white font-semibold">{contract.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Menge</p>
                  <p className="text-white">{contract.productQuantity} Stück/Paletten</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Einkaufspreis (Kunde bezahlt)</p>
                  <p className="text-white text-2xl font-bold">
                    €{Number(contract.purchasePrice).toLocaleString('de-DE')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Kommissionsrate</p>
                  <p className="text-white">{(Number(contract.commissionRate) * 100).toFixed(0)}%</p>
                </div>
              </div>
            </Card>

            {/* Bank Info */}
            <Card className="p-6 bg-zinc-900 border-amber-500/20">
              <h2 className="text-xl font-bold text-white mb-4">Bankdaten (Auszahlung)</h2>
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
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card className="p-6 bg-zinc-900 border-amber-500/20">
              <h2 className="text-xl font-bold text-white mb-4">Status & Verkauf</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-amber-500/20 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="pending">Offen</option>
                    <option value="listed">Gelistet</option>
                    <option value="sold">Verkauft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Verkaufspreis (€)
                  </label>
                  <input
                    type="number"
                    value={newSalesPrice}
                    onChange={(e) => setNewSalesPrice(e.target.value)}
                    placeholder="6500.00"
                    step="0.01"
                    className="w-full px-4 py-3 bg-black border border-amber-500/20 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="w-full px-6 py-4 bg-amber-600 hover:bg-amber-700 text-black font-bold rounded-lg transition-all disabled:opacity-50"
              >
                {isUpdating ? 'Speichere...' : 'Status/Preis Speichern'}
              </button>
            </Card>

            {/* Storage Costs */}
            <Card className="p-6 bg-zinc-900 border-amber-500/20">
              <h2 className="text-xl font-bold text-white mb-4">Lagerkosten</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Lagerung seit</p>
                  <p className="text-white">
                    {new Date(contract.storageStartDate).toLocaleDateString('de-DE')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Tage gelagert</p>
                  <p className="text-white">{daysStored} Tage</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Kostenlos: 14 Tage</p>
                  <p className="text-white">
                    Berechenbar: {Math.max(0, daysStored - 14)} Tage
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Kosten pro Palette/Tag</p>
                  <p className="text-white">€{Number(contract.storageFeePerDay).toFixed(2)}</p>
                </div>
                <div className="pt-3 border-t border-amber-500/20">
                  <p className="text-sm text-gray-400">Gesamte Lagerkosten</p>
                  <p className="text-amber-500 text-2xl font-bold">
                    €{storageCosts.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Payout Calculation */}
            {contract.salesPrice && (
              <Card className="p-6 bg-zinc-900 border-amber-500/20">
                <h2 className="text-xl font-bold text-white mb-4">Auszahlungsberechnung</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Verkaufspreis</p>
                    <p className="text-white text-xl">
                      €{Number(contract.salesPrice).toLocaleString('de-DE')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">
                      - Kommission (20%)
                    </p>
                    <p className="text-white">
                      -€{(Number(contract.salesPrice) * 0.2).toLocaleString('de-DE')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">- Lagerkosten</p>
                    <p className="text-white">-€{storageCosts.toFixed(2)}</p>
                  </div>
                  <div className="pt-3 border-t border-amber-500/20">
                    <p className="text-sm text-gray-400">Auszahlung an Kunde (80%)</p>
                    <p className="text-green-500 text-3xl font-bold">
                      €{estimatedPayout.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {contract.payoutStatus === 'pending' && contract.salesStatus === 'sold' && (
                  <button
                    onClick={handleTriggerPayout}
                    disabled={isUpdating}
                    className="w-full mt-6 px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                  >
                    {isUpdating ? 'Verarbeite...' : '💰 Auszahlung auslösen'}
                  </button>
                )}

                {contract.payoutStatus === 'completed' && (
                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                    <p className="text-green-400 font-semibold">✓ Auszahlung abgeschlossen</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Ausgezahlt am: {contract.paidAt ? new Date(contract.paidAt).toLocaleDateString('de-DE') : '-'}
                    </p>
                    <p className="text-sm text-gray-400">
                      Betrag: €{contract.payoutAmount ? Number(contract.payoutAmount).toLocaleString('de-DE', { minimumFractionDigits: 2 }) : '-'}
                    </p>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
