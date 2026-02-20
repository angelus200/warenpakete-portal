'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CrmLayout } from '@/components/crm/CrmLayout';
import { CrmKpiCard } from '@/components/crm/CrmKpiCard';
import { CrmStatusBadge } from '@/components/crm/CrmStatusBadge';
import { DollarSign, TrendingUp, Package, AlertCircle } from 'lucide-react';

interface Commission {
  id: string;
  salesStatus: string;
  salesPrice: number | null;
  payoutAmount: number | null;
  commissionRate: number;
  payoutStatus: string;
  soldAt: string | null;
  order: {
    id: string;
    user: {
      company: string;
      companyName: string;
    };
  };
}

export default function CrmCommissionsPage() {
  const router = useRouter();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        router.push('/admin/login');
        return;
      }

      const [commissionsRes, statsRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/crm/commissions${filter !== 'all' ? `?status=${filter}` : ''}`,
          { headers: { Authorization: `Bearer ${token}` } },
        ),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/commissions/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!commissionsRes.ok || !statsRes.ok) {
        if (commissionsRes.status === 401 || statsRes.status === 401) {
          router.push('/admin/login');
          return;
        }
        setCommissions([]);
        setStats(null);
        return;
      }

      const commissionsData = await commissionsRes.json();
      const statsData = await statsRes.json();

      if (Array.isArray(commissionsData)) {
        setCommissions(commissionsData);
      } else {
        setCommissions([]);
      }

      if (statsData && typeof statsData === 'object') {
        setStats(statsData);
      } else {
        setStats(null);
      }
    } catch (error) {
      console.error('Failed to fetch commissions:', error);
      setCommissions([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100);

  const formatDate = (date: string | null) =>
    date ? new Date(date).toLocaleDateString('de-DE') : '—';

  return (
    <CrmLayout>
      {/* KPIs */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <CrmKpiCard
            label="Bruttoumsatz Amazon"
            value={formatCurrency(stats.totalGrossRevenue || 0)}
            sub="Abgeschlossene Verkäufe"
            icon={<TrendingUp size={24} />}
          />
          <CrmKpiCard
            label="Kommission (20%)"
            value={formatCurrency(stats.totalCommission || 0)}
            sub="Einnahmen commercehelden"
            icon={<DollarSign size={24} />}
          />
          <CrmKpiCard
            label="Netto-Auszahlungen"
            value={formatCurrency(stats.totalPayouts || 0)}
            sub="An Kunden"
            icon={<Package size={24} />}
          />
          <CrmKpiCard
            label="Lagergebühren"
            value={formatCurrency(stats.totalStorageFees || 0)}
            sub="Abgezogen"
            icon={<AlertCircle size={24} />}
          />
        </div>
      )}

      {/* Commission List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <DollarSign size={20} className="text-[#D4AF37]" />
            Kommissions-Abrechnung
          </h2>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex gap-2 flex-wrap">
          {[
            ['all', 'Alle'],
            ['pending', 'Ausstehend'],
            ['listed', 'Im Verkauf'],
            ['sold', 'Verkauft'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                filter === key
                  ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37] text-[#B8960C]'
                  : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}{' '}
              {key !== 'all' &&
                `(${commissions.filter((c) => c.salesStatus === key).length})`}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2 border-[#D4AF37]/20">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Komm.-ID
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Kunde
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Bruttoumsatz
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Kommission (20%)
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Netto-Auszahlung
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Verkauft am
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Lade Kommissionen...
                  </td>
                </tr>
              ) : commissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Keine Kommissionen gefunden
                  </td>
                </tr>
              ) : (
                commissions.map((comm) => {
                  const commissionAmount = comm.salesPrice
                    ? Number(comm.salesPrice) * Number(comm.commissionRate)
                    : null;
                  return (
                    <tr
                      key={comm.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <strong className="text-gray-900">{comm.id.substring(0, 8).toUpperCase()}</strong>
                      </td>
                      <td className="px-4 py-3">
                        {comm.order.user.company || comm.order.user.companyName}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {comm.salesPrice ? formatCurrency(Number(comm.salesPrice)) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-green-600">
                          {commissionAmount ? formatCurrency(commissionAmount) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <strong className="text-[#B8960C]">
                          {comm.payoutAmount ? formatCurrency(Number(comm.payoutAmount)) : '—'}
                        </strong>
                      </td>
                      <td className="px-4 py-3">
                        <CrmStatusBadge status={comm.salesStatus} />
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {formatDate(comm.soldAt)}
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
