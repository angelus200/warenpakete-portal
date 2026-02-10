'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ecommercerente.com';

interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'INVOICE' | 'DELIVERY_NOTE';
  customerCompany: string;
  customerName: string;
  customerAddress: string;
  netAmount: number;
  taxAmount: number;
  grossAmount: number;
  createdAt: string;
  order: {
    id: string;
    user: {
      name: string | null;
      company: string | null;
      companyName: string | null;
    };
  };
}

export default function AdminInvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchInvoices(token);
  }, [router]);

  const fetchInvoices = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/invoices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
      localStorage.removeItem('adminToken');
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (invoiceId: string, invoiceNumber: string, type: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/invoices/${invoiceId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'INVOICE'
        ? `rechnung-${invoiceNumber}.pdf`
        : `lieferschein-${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Fehler beim Herunterladen des Dokuments');
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'INVOICE' && invoice.type === 'INVOICE') ||
      (filter === 'DELIVERY_NOTE' && invoice.type === 'DELIVERY_NOTE');

    const customerName = invoice.order.user.name ||
                        invoice.order.user.company ||
                        invoice.order.user.companyName ||
                        invoice.customerName;

    const matchesSearch = searchQuery === '' ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getTypeLabel = (type: string) => {
    return type === 'INVOICE' ? 'Rechnung' : 'Lieferschein';
  };

  const getTypeBadgeColor = (type: string) => {
    return type === 'INVOICE'
      ? 'bg-amber-500/20 text-amber-700'
      : 'bg-blue-500/20 text-blue-700';
  };

  const formatAmount = (amountInCents: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amountInCents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Rechnungen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebebeb]">
      <div className="container mx-auto px-4 py-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900 mb-2">Rechnungsübersicht</h1>
            <p className="text-gray-600">{filteredInvoices.length} Dokumente</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-3 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-lg transition-all"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Suche nach Rechnungsnummer oder Kunde..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-amber-500/20 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-amber-600 text-black'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Alle ({invoices.length})
          </button>
          <button
            onClick={() => setFilter('INVOICE')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'INVOICE'
                ? 'bg-amber-600 text-black'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Rechnungen ({invoices.filter(i => i.type === 'INVOICE').length})
          </button>
          <button
            onClick={() => setFilter('DELIVERY_NOTE')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'DELIVERY_NOTE'
                ? 'bg-amber-600 text-black'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Lieferscheine ({invoices.filter(i => i.type === 'DELIVERY_NOTE').length})
          </button>
        </div>

        {/* Invoices List */}
        <div className="space-y-4">
          {filteredInvoices.length === 0 ? (
            <Card className="p-4 bg-white border-amber-500/20 text-center">
              <p className="text-gray-600">
                {searchQuery ? 'Keine Dokumente gefunden' : 'Noch keine Rechnungen vorhanden'}
              </p>
            </Card>
          ) : (
            filteredInvoices.map((invoice) => {
              const customerName = invoice.order.user.name ||
                                  invoice.order.user.company ||
                                  invoice.order.user.companyName ||
                                  invoice.customerName;

              return (
                <Card key={invoice.id} className="p-3 bg-white border-amber-500/20 hover:border-amber-500/40 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Dokument</p>
                      <p className="text-gray-900 font-semibold">{invoice.invoiceNumber}</p>
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(invoice.type)}`}>
                        {getTypeLabel(invoice.type)}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Datum</p>
                      <p className="text-gray-900">{formatDate(invoice.createdAt)}</p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Kunde</p>
                      <p className="text-gray-900 font-medium">{customerName}</p>
                      {invoice.customerCompany && invoice.customerCompany !== 'N/A' && (
                        <p className="text-xs text-gray-600 mt-1">{invoice.customerCompany}</p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {invoice.type === 'INVOICE' && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Betrag</p>
                          <p className="text-gray-900 font-bold">{formatAmount(invoice.grossAmount)}</p>
                        </div>
                      )}
                      <button
                        onClick={() => handleDownload(invoice.id, invoice.invoiceNumber, invoice.type)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-black font-semibold rounded-lg transition-all text-sm"
                      >
                        📥 Download
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
