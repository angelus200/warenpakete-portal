'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ecommercerente.com';

interface DashboardStats {
  totalContracts: number;
  pendingContracts: number;
  listedContracts: number;
  soldContracts: number;
  totalGoodsValue: number;
  pendingPayouts: number;
  totalCommissionEarned: number;
  totalPayoutsCompleted: number;
  totalPayoutAmount: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    // Check Admin-Token
    const token = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (adminUser) {
      const user = JSON.parse(adminUser);
      setAdminName(user.name);
    }

    // Lade Dashboard-Stats
    fetchStats(token);
  }, [router]);

  const fetchStats = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebebeb]">
      <div className="container mx-auto px-4 py-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Willkommen zurück, <span className="text-amber-500">{adminName}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-lg transition-all"
          >
            Abmelden
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <Card className="p-3 bg-white border-amber-500/20 hover:border-amber-500/40 transition-colors">
            <h3 className="text-sm text-gray-600 font-medium mb-2">Verträge Gesamt</h3>
            <p className="text-lg font-bold text-gray-900 mb-1">{stats?.totalContracts || 0}</p>
            <p className="text-sm text-amber-500">
              {stats?.pendingContracts || 0} offen · {stats?.listedContracts || 0} gelistet · {stats?.soldContracts || 0} verkauft
            </p>
          </Card>

          <Card className="p-3 bg-white border-amber-500/20 hover:border-amber-500/40 transition-colors">
            <h3 className="text-sm text-gray-600 font-medium mb-2">Warenwert</h3>
            <p className="text-lg font-bold text-gray-900 mb-1">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(stats?.totalGoodsValue || 0)}
            </p>
            <p className="text-sm text-gray-600">Gesamtwert aller Waren</p>
          </Card>

          <Card className="p-3 bg-white border-amber-500/20 hover:border-amber-500/40 transition-colors">
            <h3 className="text-sm text-gray-600 font-medium mb-2">Kommission Verdient</h3>
            <p className="text-lg font-bold text-amber-500 mb-1">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(stats?.totalCommissionEarned || 0)}
            </p>
            <p className="text-sm text-gray-600">20% vom Verkaufspreis</p>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <Card className="p-3 bg-white border-amber-500/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Offene Auszahlungen</h3>
            <p className="text-xl font-bold text-amber-500 mb-4">
              {stats?.pendingPayouts || 0}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Verträge bereit für Auszahlung
            </p>
            <Link
              href="/admin/contracts"
              className="inline-block px-3 py-3 bg-amber-600 hover:bg-amber-700 text-black font-semibold rounded-lg transition-all"
            >
              Verträge verwalten
            </Link>
          </Card>

          <Card className="p-3 bg-white border-amber-500/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Abgeschlossene Auszahlungen</h3>
            <p className="text-xl font-bold text-gray-900 mb-4">
              {stats?.totalPayoutsCompleted || 0}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Ausgezahlt: {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(stats?.totalPayoutAmount || 0)}
            </p>
            <p className="text-xs text-gray-600">
              80% vom Verkaufspreis (nach Lagerkosten)
            </p>
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="p-3 bg-white border-amber-500/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Schnellzugriff</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/crm"
              className="p-4 bg-gradient-to-br from-[#D4AF37] to-[#B8960C] hover:from-[#B8960C] hover:to-[#D4AF37] rounded-lg transition-all text-center shadow-lg"
            >
              <p className="text-[#1a1a1a] font-bold">CRM System</p>
              <p className="text-sm text-[#1a1a1a]/80 mt-1">Kunden, Bestellungen, Lager</p>
            </Link>
            <Link
              href="/admin/contracts"
              className="p-4 bg-white hover:bg-gray-100 rounded-lg transition-all text-center"
            >
              <p className="text-gray-900 font-semibold">Alle Verträge</p>
              <p className="text-sm text-gray-600 mt-1">Übersicht & Verwaltung</p>
            </Link>
            <Link
              href="/admin/users"
              className="p-4 bg-white hover:bg-gray-100 rounded-lg transition-all text-center"
            >
              <p className="text-gray-900 font-semibold">Benutzer</p>
              <p className="text-sm text-gray-600 mt-1">Rollen & Verwaltung</p>
            </Link>
            <Link
              href="/admin/commissions"
              className="p-4 bg-white hover:bg-gray-100 rounded-lg transition-all text-center"
            >
              <p className="text-gray-900 font-semibold">Kommissionen</p>
              <p className="text-sm text-gray-600 mt-1">Auszahlungen & Übersicht</p>
            </Link>
            <Link
              href="/admin/products"
              className="p-4 bg-white hover:bg-gray-100 rounded-lg transition-all text-center"
            >
              <p className="text-gray-900 font-semibold">Produkte</p>
              <p className="text-sm text-gray-600 mt-1">Lager & Bestand</p>
            </Link>
            <Link
              href="/admin/analytics"
              className="p-4 bg-white hover:bg-gray-100 rounded-lg transition-all text-center"
            >
              <p className="text-gray-900 font-semibold">📊 Analytics</p>
              <p className="text-sm text-gray-600 mt-1">Marketing & Performance</p>
            </Link>
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white hover:bg-gray-100 rounded-lg transition-all text-center"
            >
              <p className="text-gray-900 font-semibold">Stripe Dashboard</p>
              <p className="text-sm text-gray-600 mt-1">Zahlungen prüfen</p>
            </a>
            <a
              href="https://railway.app/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white hover:bg-gray-100 rounded-lg transition-all text-center"
            >
              <p className="text-gray-900 font-semibold">Railway Dashboard</p>
              <p className="text-sm text-gray-600 mt-1">Server & Datenbank</p>
            </a>
            <Link
              href="/admin/crm/affiliates"
              className="p-4 bg-white hover:bg-gray-100 rounded-lg transition-all text-center"
            >
              <p className="text-gray-900 font-semibold">Affiliates</p>
              <p className="text-sm text-gray-600 mt-1">Partnerprogramm & Provisionen</p>
            </Link>
            <Link
              href="/admin/crm/support"
              className="p-4 bg-white hover:bg-gray-100 rounded-lg transition-all text-center"
            >
              <p className="text-gray-900 font-semibold">Support</p>
              <p className="text-sm text-gray-600 mt-1">Kunden-Chat & Anfragen</p>
            </Link>
            <Link
              href="/admin/chat"
              className="p-4 bg-white hover:bg-gray-100 rounded-lg transition-all text-center"
            >
              <p className="text-gray-900 font-semibold">💬 Chat</p>
              <p className="text-sm text-gray-600 mt-1">Kunden & Affiliates anschreiben</p>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
