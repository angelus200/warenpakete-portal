'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CrmLayout } from '@/components/crm/CrmLayout';
import { Briefcase, Calendar, Mail, Phone, Globe, ChevronDown } from 'lucide-react';

interface SellerApplication {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string | null;
  website: string | null;
  productCategory: string;
  productCount: string | null;
  message: string;
  status: string;
  adminNotes: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  NEW:       { label: 'Neu',        bg: 'bg-yellow-100',  text: 'text-yellow-800' },
  REVIEWING: { label: 'In Prüfung', bg: 'bg-blue-100',    text: 'text-blue-800'   },
  APPROVED:  { label: 'Angenommen', bg: 'bg-green-100',   text: 'text-green-800'  },
  REJECTED:  { label: 'Abgelehnt',  bg: 'bg-red-100',     text: 'text-red-800'    },
};

export default function SellerApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<SellerApplication | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) { router.push('/admin/login'); return; }

      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seller-applications?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        if (res.status === 401) { router.push('/admin/login'); return; }
        throw new Error('Fehler beim Laden');
      }

      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/seller-applications/${id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      }
    );

    if (res.ok) {
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : prev);
    }
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSaving(true);
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/seller-applications/${selected.id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ adminNotes: notes }),
      }
    );

    if (res.ok) {
      setSelected((prev) => prev ? { ...prev, adminNotes: notes } : prev);
    }
    setSaving(false);
  };

  const openDetail = (app: SellerApplication) => {
    setSelected(app);
    setNotes(app.adminNotes || '');
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const cfg = STATUS_CONFIG[status] ?? { label: status, bg: 'bg-gray-100', text: 'text-gray-800' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
        {cfg.label}
      </span>
    );
  };

  const counts = Object.fromEntries(
    Object.keys(STATUS_CONFIG).map((s) => [s, applications.filter((a) => a.status === s).length])
  );

  return (
    <CrmLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Verkäufer-Bewerbungen</h1>
            <p className="text-sm text-gray-500 mt-1">{applications.length} Bewerbungen insgesamt</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[['all', 'Alle'], ...Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label])].map(
              ([val, label]) => (
                <button
                  key={val}
                  onClick={() => setStatusFilter(val)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === val
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                  {val !== 'all' && counts[val] > 0 && (
                    <span className="ml-1.5 text-xs">({counts[val]})</span>
                  )}
                </button>
              )
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <div key={key} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{cfg.label}</p>
              <p className="text-2xl font-bold text-gray-900">{counts[key] ?? 0}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Tabelle */}
          <div className={`${selected ? 'flex-1' : 'w-full'} bg-white rounded-xl border border-gray-200 overflow-hidden`}>
            {loading ? (
              <div className="p-12 text-center text-gray-400">Lade Bewerbungen...</div>
            ) : applications.length === 0 ? (
              <div className="p-12 text-center">
                <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Keine Bewerbungen vorhanden</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Firma', 'Kontakt', 'Kategorie', 'SKUs', 'Status', 'Datum', ''].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {applications.map((app) => (
                      <tr
                        key={app.id}
                        onClick={() => openDetail(app)}
                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${selected?.id === app.id ? 'bg-yellow-50' : ''}`}
                      >
                        <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{app.company}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{app.contactName}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{app.productCategory}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{app.productCount || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <StatusBadge status={app.status} />
                            <div className="relative">
                              <select
                                value={app.status}
                                onChange={(e) => updateStatus(app.id, e.target.value)}
                                className="text-xs pl-1 pr-5 py-0.5 rounded border border-gray-200 bg-white text-gray-600 focus:outline-none appearance-none cursor-pointer"
                              >
                                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                                  <option key={k} value={k}>{v.label}</option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-0.5 top-0.5 w-3 h-3 text-gray-400 pointer-events-none" />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {new Date(app.createdAt).toLocaleDateString('de-DE')}
                        </td>
                        <td className="px-4 py-3 text-[#D4AF37] text-xs whitespace-nowrap">Details →</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail-Panel */}
          {selected && (
            <div className="w-96 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
              <div className="p-5 border-b border-gray-100 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{selected.company}</h3>
                  <StatusBadge status={selected.status} />
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
              </div>

              <div className="p-5 space-y-3 overflow-y-auto flex-1">
                {/* Kontaktdaten */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {selected.contactName}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${selected.email}`} className="text-[#D4AF37] hover:underline truncate">{selected.email}</a>
                  </div>
                  {selected.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      {selected.phone}
                    </div>
                  )}
                  {selected.website && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a href={selected.website} target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline truncate">{selected.website}</a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {new Date(selected.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                </div>

                {/* Produkt-Info */}
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Produktinfo</p>
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">{selected.productCategory}</span>
                    {selected.productCount && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">{selected.productCount} SKUs</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                {/* Status-Änderung */}
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Status ändern</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => updateStatus(selected.id, key)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                          selected.status === key
                            ? `${cfg.bg} ${cfg.text} border-transparent`
                            : 'bg-white text-gray-600 border-gray-200 hover:border-[#D4AF37]'
                        }`}
                      >
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin-Notizen */}
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Admin-Notizen</p>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Interne Notizen..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-[#D4AF37] resize-none"
                  />
                  <button
                    onClick={saveNotes}
                    disabled={saving}
                    className="mt-2 w-full py-2 rounded-lg bg-[#D4AF37] hover:bg-[#B8960C] disabled:opacity-50 text-black text-sm font-semibold transition-colors"
                  >
                    {saving ? 'Speichern...' : 'Notizen speichern'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CrmLayout>
  );
}
