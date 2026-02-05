'use client';

import { useState, useEffect } from 'react';
import { CrmLayout } from '@/components/crm/CrmLayout';
import { CrmKpiCard } from '@/components/crm/CrmKpiCard';
import { CrmStatusBadge } from '@/components/crm/CrmStatusBadge';
import { Warehouse, Package, DollarSign, Clock } from 'lucide-react';

interface StorageFee {
  id: string;
  palletCount: number;
  amount: number;
  daysCharged: number;
  createdAt: string;
  order: {
    id: string;
    user: {
      company: string;
      companyName: string;
    };
    commissionContract: {
      storageStartDate: string;
      storageFeePerDay: number;
    } | null;
  };
  daysStored: number;
  freeUntil: string;
  status: string;
}

export default function CrmStoragePage() {
  const [storage, setStorage] = useState<StorageFee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStorage();
  }, []);

  const fetchStorage = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/crm/storage`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setStorage(data);
    } catch (error) {
      console.error('Failed to fetch storage:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('de-DE');

  const totalPallets = storage.reduce((sum, s) => sum + s.palletCount, 0);
  const totalFees = storage.reduce((sum, s) => sum + Number(s.amount), 0);
  const freePallets = storage
    .filter((s) => s.status === 'free_period')
    .reduce((sum, s) => sum + s.palletCount, 0);
  const billingPallets = storage
    .filter((s) => s.status === 'billing')
    .reduce((sum, s) => sum + s.palletCount, 0);

  const dailyRate = storage.reduce(
    (sum, s) =>
      sum + Number(s.order.commissionContract?.storageFeePerDay || 0) * s.palletCount,
    0,
  );

  const avgDays =
    storage.length > 0
      ? Math.round(
          storage.reduce((sum, s) => sum + s.daysStored, 0) / storage.length,
        )
      : 0;

  return (
    <CrmLayout>
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <CrmKpiCard
          label="Paletten gesamt"
          value={totalPallets}
          sub={`${freePallets} kostenlos / ${billingPallets} kostenpflichtig`}
          icon={<Package size={24} />}
        />
        <CrmKpiCard
          label="Lagerkosten (offen)"
          value={formatCurrency(totalFees)}
          sub="Aktueller Zeitraum"
          icon={<DollarSign size={24} />}
        />
        <CrmKpiCard
          label="Tagesrate"
          value={formatCurrency(dailyRate)}
          sub="Alle Paletten / Tag"
          icon={<Warehouse size={24} />}
        />
        <CrmKpiCard
          label="Ø Lagerdauer"
          value={`${avgDays} Tage`}
          sub="Durchschnitt"
          icon={<Clock size={24} />}
        />
      </div>

      {/* Storage List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Warehouse size={20} className="text-[#D4AF37]" />
              Lager @ Fly Fulfilment (DE)
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Betrieben durch commercehelden GmbH
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2 border-[#D4AF37]/20">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Bestell-ID
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Kunde
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Paletten
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Tage im Lager
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Kostenlos bis
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Tagesrate
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Kosten bisher
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Lade Lagerübersicht...
                  </td>
                </tr>
              ) : storage.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Keine Ware im Lager
                  </td>
                </tr>
              ) : (
                storage.map((item) => {
                  const dailyRate =
                    Number(item.order.commissionContract?.storageFeePerDay || 0) *
                    item.palletCount;
                  const isUrgent =
                    item.status === 'billing' && Number(item.amount) > 10000;

                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isUrgent ? 'bg-red-50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <strong className="text-gray-900">
                          {item.order.id.substring(0, 12).toUpperCase()}
                        </strong>
                      </td>
                      <td className="px-4 py-3">
                        {item.order.user.company || item.order.user.companyName}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <strong>{item.palletCount}</strong>
                          <div className="flex gap-0.5">
                            {Array.from({
                              length: Math.min(item.palletCount, 8),
                            }).map((_, i) => (
                              <div
                                key={i}
                                className="w-1.5 h-3 rounded-sm"
                                style={{
                                  backgroundColor:
                                    item.status === 'billing'
                                      ? '#dc3545'
                                      : '#D4AF37',
                                  opacity: 0.6 + (i / item.palletCount) * 0.4,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <strong>{item.daysStored}</strong>
                        <div className="mt-1 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min((item.daysStored / 60) * 100, 100)}%`,
                              backgroundColor:
                                item.daysStored > 30
                                  ? '#dc3545'
                                  : item.daysStored > 14
                                    ? '#f0ad4e'
                                    : '#5cb85c',
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {formatDate(item.freeUntil)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatCurrency(dailyRate)}
                        <span className="text-gray-400 text-xs">/Tag</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <strong
                          className={
                            Number(item.amount) > 10000
                              ? 'text-red-600'
                              : Number(item.amount) > 0
                                ? 'text-orange-600'
                                : 'text-green-600'
                          }
                        >
                          {formatCurrency(Number(item.amount))}
                        </strong>
                      </td>
                      <td className="px-4 py-3">
                        <CrmStatusBadge status={item.status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CrmLayout>
  );
}
