'use client';

import { useState, useEffect } from 'react';
import { CrmLayout } from '@/components/crm/CrmLayout';
import { CrmKpiCard } from '@/components/crm/CrmKpiCard';
import { CrmStatusBadge } from '@/components/crm/CrmStatusBadge';
import { Search, Users, TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface Customer {
  id: string;
  company: string;
  companyName: string;
  email: string;
  firstName: string;
  lastName: string;
  companyCountry: string;
  customerStatus: string;
  vatId: string;
  totalSpent: number;
  createdAt: string;
  totalOrders: number;
  lastOrder: { createdAt: string } | null;
}

export default function CrmCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [statusFilter, search]);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/crm/customers?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(
    (c) => c.customerStatus === 'active',
  ).length;
  const totalRevenue = customers.reduce((sum, c) => sum + Number(c.totalSpent || 0), 0);
  const avgCustomerValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  const filteredCustomers = customers;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('de-DE');

  const getCountryFlag = (code: string) => {
    const flags: Record<string, string> = {
      DE: '🇩🇪',
      AT: '🇦🇹',
      CH: '🇨🇭',
      SE: '🇸🇪',
      CZ: '🇨🇿',
      ES: '🇪🇸',
      EE: '🇪🇪',
    };
    return flags[code] || '🌍';
  };

  return (
    <CrmLayout>
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <CrmKpiCard
          label="Kunden gesamt"
          value={totalCustomers}
          sub={`${activeCustomers} aktiv`}
          icon={<Users size={24} />}
        />
        <CrmKpiCard
          label="Gesamtumsatz"
          value={formatCurrency(totalRevenue)}
          sub="Alle Kunden"
          icon={<DollarSign size={24} />}
        />
        <CrmKpiCard
          label="Ø Kundenwert"
          value={formatCurrency(avgCustomerValue)}
          sub="Pro Kunde"
          icon={<TrendingUp size={24} />}
        />
        <CrmKpiCard
          label="Neue Kunden"
          value={
            customers.filter(
              (c) =>
                new Date(c.createdAt).getMonth() === new Date().getMonth(),
            ).length
          }
          sub="Diesen Monat"
          icon={<Calendar size={24} />}
        />
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Users size={20} className="text-[#D4AF37]" />
            Kundenverwaltung
          </h2>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37] w-64"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex gap-2 flex-wrap">
          {['all', 'active', 'pending', 'inactive', 'vip'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                statusFilter === status
                  ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37] text-[#B8960C]'
                  : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? 'Alle' : status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' &&
                ` (${customers.filter((c) => c.customerStatus === status).length})`}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2 border-[#D4AF37]/20">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Firma
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Kontakt
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Land
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Bestellungen
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Umsatz
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Letzte Bestellung
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Lade Kunden...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Keine Kunden gefunden
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() =>
                      setExpandedId(
                        expandedId === customer.id ? null : customer.id,
                      )
                    }
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                        <strong className="text-gray-900">
                          {customer.company || customer.companyName || 'N/A'}
                        </strong>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        {customer.firstName} {customer.lastName}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {customer.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-lg mr-1">
                        {getCountryFlag(customer.companyCountry)}
                      </span>
                      {customer.companyCountry}
                    </td>
                    <td className="px-4 py-3">
                      <CrmStatusBadge status={customer.customerStatus} />
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {customer.totalOrders}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[#B8960C]">
                      {formatCurrency(Number(customer.totalSpent || 0))}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {customer.lastOrder
                        ? formatDate(customer.lastOrder.createdAt)
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CrmLayout>
  );
}
