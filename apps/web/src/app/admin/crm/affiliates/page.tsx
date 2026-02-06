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

export default function AdminAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAffiliates();
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

  return (
    <CrmLayout>
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
    </CrmLayout>
  );
}
