'use client';

import { useState, useEffect } from 'react';
import { CrmLayout } from '@/components/crm/CrmLayout';

interface Affiliate {
  id: string;
  code: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    company: string | null;
  };
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  pendingEarnings: number;
  createdAt: string;
}

interface Withdrawal {
  id: string;
  amount: number;
  method: string;
  iban?: string;
  accountHolder?: string;
  paypalEmail?: string;
  status: string;
  createdAt: string;
  processedAt?: string;
  notes?: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    company: string | null;
  };
}

export default function AdminAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'withdrawals'>('overview');
  const [processingWithdrawal, setProcessingWithdrawal] = useState<string | null>(null);

  useEffect(() => {
    fetchAffiliates();
    fetchWithdrawals();
  }, []);

  const fetchAffiliates = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/affiliate/admin/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setAffiliates(data);
    } catch (error) {
      console.error('Failed to fetch affiliates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/affiliate/admin/withdrawals`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setWithdrawals(data);
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const getUserName = (user: Affiliate['user']) => {
    if (user.company) return user.company;
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user.email;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Ausstehend' },
      APPROVED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Genehmigt' },
      PAID: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ausgezahlt' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Abgelehnt' },
    };

    const { bg, text, label } = config[status] || config.PENDING;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded border ${bg} ${text}`}>
        {label}
      </span>
    );
  };

  const handleUpdateWithdrawalStatus = async (
    withdrawalId: string,
    status: 'APPROVED' | 'PAID' | 'REJECTED',
    notes?: string
  ) => {
    try {
      setProcessingWithdrawal(withdrawalId);
      const token = localStorage.getItem('adminToken');

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/affiliate/admin/withdrawals/${withdrawalId}/status`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status, notes }),
        }
      );

      await fetchWithdrawals();
    } catch (error) {
      console.error('Failed to update withdrawal:', error);
      alert('Fehler beim Aktualisieren der Auszahlung');
    } finally {
      setProcessingWithdrawal(null);
    }
  };

  return (
    <CrmLayout>
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setSelectedTab('overview')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'overview'
              ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
              : 'text-gray-600'
          }`}
        >
          Affiliate-Übersicht
        </button>
        <button
          onClick={() => setSelectedTab('withdrawals')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'withdrawals'
              ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
              : 'text-gray-600'
          }`}
        >
          Auszahlungsanträge
          {withdrawals.filter(w => w.status === 'PENDING').length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
              {withdrawals.filter(w => w.status === 'PENDING').length}
            </span>
          )}
        </button>
      </div>

      {selectedTab === 'overview' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[#D4AF37]">👥</span>
              Affiliate-Übersicht
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Alle Affiliates und ihre Performance
            </p>
          </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Lade Daten...</div>
        ) : affiliates.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Noch keine Affiliates vorhanden
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Code
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Name / Firma
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Email
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">
                    Klicks
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">
                    Conversions
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">
                    Provision gesamt
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">
                    Ausstehend
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">
                    Erstellt
                  </th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map((affiliate) => (
                  <tr
                    key={affiliate.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded border border-[#D4AF37]/30 font-bold">
                        {affiliate.code}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {getUserName(affiliate.user)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {affiliate.user.email}
                    </td>
                    <td className="py-3 px-4 text-center text-sm font-medium text-gray-900">
                      {affiliate.totalClicks}
                    </td>
                    <td className="py-3 px-4 text-center text-sm font-bold text-[#D4AF37]">
                      {affiliate.totalConversions}
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-bold text-gray-900">
                      {formatCurrency(affiliate.totalEarnings)}
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-medium text-yellow-600">
                      {formatCurrency(affiliate.pendingEarnings)}
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-gray-500">
                      {formatDate(affiliate.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                <tr>
                  <td
                    colSpan={3}
                    className="py-3 px-4 text-sm font-bold text-gray-700"
                  >
                    Gesamt
                  </td>
                  <td className="py-3 px-4 text-center text-sm font-bold text-gray-900">
                    {affiliates.reduce((sum, a) => sum + a.totalClicks, 0)}
                  </td>
                  <td className="py-3 px-4 text-center text-sm font-bold text-[#D4AF37]">
                    {affiliates.reduce((sum, a) => sum + a.totalConversions, 0)}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-bold text-gray-900">
                    {formatCurrency(
                      affiliates.reduce((sum, a) => sum + a.totalEarnings, 0)
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-bold text-yellow-600">
                    {formatCurrency(
                      affiliates.reduce((sum, a) => sum + a.pendingEarnings, 0)
                    )}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
        </div>
      )}

      {selectedTab === 'withdrawals' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Auszahlungsanträge</h2>
          </div>

          {withdrawals.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Keine Auszahlungsanträge</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4">Benutzer</th>
                  <th className="text-right py-3 px-4">Betrag</th>
                  <th className="text-left py-3 px-4">Methode</th>
                  <th className="text-left py-3 px-4">Details</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Datum</th>
                  <th className="text-center py-3 px-4">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {w.user.company || `${w.user.firstName || ''} ${w.user.lastName || ''}`.trim() || w.user.email}
                        </p>
                        <p className="text-xs text-gray-500">{w.user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#D4AF37]">
                      {formatCurrency(Number(w.amount))}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {w.method === 'BANK' ? 'Bank' : 'PayPal'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {w.method === 'BANK' ? (
                        <>
                          <p>{w.iban}</p>
                          <p className="text-xs">{w.accountHolder}</p>
                        </>
                      ) : (
                        <p>{w.paypalEmail}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(w.status)}
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-gray-500">
                      {formatDate(w.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      {w.status === 'PENDING' && (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleUpdateWithdrawalStatus(w.id, 'APPROVED')}
                            disabled={processingWithdrawal === w.id}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                          >
                            Genehmigen
                          </button>
                          <button
                            onClick={() => {
                              const notes = prompt('Ablehnungsgrund:');
                              if (notes !== null) {
                                handleUpdateWithdrawalStatus(w.id, 'REJECTED', notes);
                              }
                            }}
                            disabled={processingWithdrawal === w.id}
                            className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            Ablehnen
                          </button>
                        </div>
                      )}
                      {w.status === 'APPROVED' && (
                        <button
                          onClick={() => handleUpdateWithdrawalStatus(w.id, 'PAID')}
                          disabled={processingWithdrawal === w.id}
                          className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                        >
                          Als ausgezahlt markieren
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </CrmLayout>
  );
}
