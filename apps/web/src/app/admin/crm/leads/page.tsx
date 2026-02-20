'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CrmLayout } from '@/components/crm/CrmLayout';
import { CrmKpiCard } from '@/components/crm/CrmKpiCard';
import { CrmStatusBadge } from '@/components/crm/CrmStatusBadge';
import { Users, Target, TrendingUp, DollarSign, Search } from 'lucide-react';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string | null;
  budget: string;
  industry: string;
  ecommerceExperience: string;
  companySize: string;
  source: string;
  timeframe: string;
  isQualified: boolean;
  status: string;
  notes: string | null;
  createdAt: string;
  consultant: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface Stats {
  total: number;
  qualified: number;
  contacted: number;
  converted: number;
  conversionRate: number;
}

export default function CrmLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [qualifiedFilter, setQualifiedFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [statusFilter, qualifiedFilter, search]);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        router.push('/admin/login');
        return;
      }

      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (qualifiedFilter === 'true') params.append('isQualified', 'true');
      if (qualifiedFilter === 'false') params.append('isQualified', 'false');
      if (search) params.append('search', search);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/funnel/leads?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        setLeads([]);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setLeads(data);
      } else {
        setLeads([]);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/funnel/leads/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        setStats(null);
        return;
      }

      const data = await res.json();

      if (data && typeof data === 'object') {
        setStats(data);
      } else {
        setStats(null);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats(null);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/funnel/leads/${leadId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        console.error('Failed to update status');
        return;
      }

      await fetchLeads();
      await fetchStats();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getBudgetLabel = (budget: string) => {
    const labels: Record<string, string> = {
      '5k-10k': '5.000 – 9.999 €',
      '10k-25k': '10.000 – 24.999 €',
      '25k-50k': '25.000 – 49.999 €',
      '50k-100k': '50.000 – 99.999 €',
      '100k+': '100.000 €+',
    };
    return labels[budget] || budget;
  };

  return (
    <CrmLayout>
      {/* KPIs */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <CrmKpiCard
            label="Leads gesamt"
            value={stats.total}
            sub={`${stats.qualified} qualifiziert`}
            icon={<Users size={24} />}
          />
          <CrmKpiCard
            label="Qualifiziert"
            value={stats.qualified}
            sub={`${((stats.qualified / stats.total) * 100).toFixed(0)}%`}
            icon={<Target size={24} />}
          />
          <CrmKpiCard
            label="Conversion Rate"
            value={`${stats.conversionRate}%`}
            sub={`${stats.converted} konvertiert`}
            icon={<TrendingUp size={24} />}
          />
          <CrmKpiCard
            label="Kontaktiert"
            value={stats.contacted}
            sub="In Bearbeitung"
            icon={<DollarSign size={24} />}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Users size={20} className="text-[#D4AF37]" />
            Lead-Verwaltung
          </h2>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex gap-3 flex-wrap items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37] w-full"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">Alle Status</option>
            <option value="NEW">Neu</option>
            <option value="CONTACTED">Kontaktiert</option>
            <option value="CONVERTED">Konvertiert</option>
            <option value="REJECTED">Abgelehnt</option>
          </select>

          {/* Qualified Filter */}
          <select
            value={qualifiedFilter}
            onChange={(e) => setQualifiedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">Alle</option>
            <option value="true">Qualifiziert</option>
            <option value="false">Nicht qualifiziert</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2 border-[#D4AF37]/20">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Firma
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Email
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Budget
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Qualifiziert
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Berater
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Erstellt
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Lade Leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Keine Leads gefunden
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <strong className="text-gray-900">
                        {lead.firstName} {lead.lastName}
                      </strong>
                    </td>
                    <td className="px-4 py-3">{lead.company}</td>
                    <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded ${
                          lead.isQualified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {getBudgetLabel(lead.budget)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {lead.isQualified ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(lead.id, e.target.value);
                        }}
                        className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="NEW">Neu</option>
                        <option value="CONTACTED">Kontaktiert</option>
                        <option value="CONVERTED">Konvertiert</option>
                        <option value="REJECTED">Abgelehnt</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {lead.consultant ? (
                        <span className="text-sm">{lead.consultant.name}</span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Details Sidebar (if selected) */}
      {selectedLead && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Lead Details
              </h3>

              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-semibold">
                      {selectedLead.firstName} {selectedLead.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Firma</p>
                    <p className="font-semibold">{selectedLead.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-semibold">{selectedLead.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Telefon</p>
                    <p className="font-semibold">{selectedLead.phone}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-600">Position</p>
                  <p className="font-semibold">{selectedLead.position || '—'}</p>
                </div>

                <hr />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Budget</p>
                    <p className="font-semibold">{getBudgetLabel(selectedLead.budget)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Branche</p>
                    <p className="font-semibold">{selectedLead.industry}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">E-Commerce Erfahrung</p>
                    <p className="font-semibold">{selectedLead.ecommerceExperience}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Firmengröße</p>
                    <p className="font-semibold">{selectedLead.companySize}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Quelle</p>
                    <p className="font-semibold">{selectedLead.source}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Zeitrahmen</p>
                    <p className="font-semibold">{selectedLead.timeframe}</p>
                  </div>
                </div>

                <hr />

                <div>
                  <p className="text-gray-600">Berater</p>
                  <p className="font-semibold">
                    {selectedLead.consultant
                      ? `${selectedLead.consultant.name} (${selectedLead.consultant.email})`
                      : '—'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600">Notizen</p>
                  <p className="font-semibold">{selectedLead.notes || '—'}</p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded hover:bg-gray-300"
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CrmLayout>
  );
}
