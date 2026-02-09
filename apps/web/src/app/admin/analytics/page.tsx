'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ecommercerente.com';

interface AnalyticsData {
  users: {
    total: number;
    active: number;
    new30d: number;
    conversionRate: number;
    registrationsPerDay: Array<{ date: string; count: number }>;
    registrationsPerWeek: Array<{ week: string; count: number }>;
  };
  orders: {
    total: number;
    revenue30d: number;
    revenue90d: number;
    revenueTotal: number;
    avgOrderValue: number;
    ordersPerDay: Array<{ date: string; count: number }>;
    ordersPerWeek: Array<{ week: string; count: number }>;
    topProducts: Array<{ name: string; count: number; revenue: number }>;
  };
  commissions: {
    total: number;
    byStatus: { pending: number; listed: number; sold: number };
    avgSalesTimeDays: number;
    totalCommissionEarned: number;
    newContractsPerWeek: Array<{ week: string; count: number }>;
  };
  fulfillment: {
    commission: number;
    delivery: number;
  };
}

const COLORS = {
  gold: '#D4AF37',
  darkGold: '#B8860B',
  gray: '#1f2937',
  lightGray: '#f3f4f6',
  green: '#10b981',
  blue: '#3b82f6',
  red: '#ef4444',
};

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchAnalytics(token);
  }, [router]);

  const fetchAnalytics = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      localStorage.removeItem('adminToken');
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center">
        <p className="text-gray-600">Keine Daten verfügbar</p>
      </div>
    );
  }

  const pieData = [
    { name: 'Kommission', value: analytics.fulfillment.commission, color: COLORS.gold },
    { name: 'Auslieferung', value: analytics.fulfillment.delivery, color: COLORS.darkGold },
  ];

  return (
    <div className="min-h-screen bg-[#ebebeb]">
      <div className="container mx-auto px-4 py-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900 mb-2">Marketing & Analytics</h1>
            <p className="text-gray-600">Übersicht über Website-Performance und Marketing-Metriken</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-3 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-lg transition-all"
          >
            ← Dashboard
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-white border-amber-500/20">
            <p className="text-sm text-gray-600 mb-2">Gesamt-Nutzer</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.users.total}</p>
            <p className="text-sm text-green-600 mt-2">
              {analytics.users.active} aktiv ({Math.round((analytics.users.active / analytics.users.total) * 100)}%)
            </p>
          </Card>

          <Card className="p-4 bg-white border-amber-500/20">
            <p className="text-sm text-gray-600 mb-2">Neue Registrierungen (30d)</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.users.new30d}</p>
            <p className="text-sm text-gray-600 mt-2">
              Ø {Math.round(analytics.users.new30d / 30)} pro Tag
            </p>
          </Card>

          <Card className="p-4 bg-white border-amber-500/20">
            <p className="text-sm text-gray-600 mb-2">Gesamtumsatz (30d)</p>
            <p className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(analytics.orders.revenue30d)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Ø Bestellwert: {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(analytics.orders.avgOrderValue)}
            </p>
          </Card>

          <Card className="p-4 bg-white border-amber-500/20">
            <p className="text-sm text-gray-600 mb-2">Conversion Rate</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.users.conversionRate}%</p>
            <p className="text-sm text-gray-600 mt-2">Registrierung → Bestellung</p>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Registrations Chart */}
          <Card className="p-4 bg-white border-amber-500/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registrierungen (30 Tage)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.users.registrationsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.lightGray} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString('de-DE')}
                />
                <Line type="monotone" dataKey="count" stroke={COLORS.gold} strokeWidth={2} name="Registrierungen" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Orders Chart */}
          <Card className="p-4 bg-white border-amber-500/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bestellungen (12 Wochen)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.orders.ordersPerWeek}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.lightGray} />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="count" fill={COLORS.gold} name="Bestellungen" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Top Products */}
          <Card className="p-4 bg-white border-amber-500/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Produkte</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-600">Produkt</th>
                    <th className="text-right py-2 text-gray-600">Anzahl</th>
                    <th className="text-right py-2 text-gray-600">Umsatz</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.orders.topProducts.map((product, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-3 text-gray-900">{product.name}</td>
                      <td className="py-3 text-right text-gray-900 font-semibold">{product.count}</td>
                      <td className="py-3 text-right text-gray-900 font-semibold">
                        {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(product.revenue)}
                      </td>
                    </tr>
                  ))}
                  {analytics.orders.topProducts.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-gray-600">
                        Keine Daten verfügbar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Commission Pipeline */}
          <Card className="p-4 bg-white border-amber-500/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kommissions-Pipeline</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="text-sm font-semibold text-gray-900">{analytics.commissions.byStatus.pending}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-500 h-3 rounded-full"
                    style={{
                      width: `${(analytics.commissions.byStatus.pending / analytics.commissions.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Listed</span>
                  <span className="text-sm font-semibold text-gray-900">{analytics.commissions.byStatus.listed}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{
                      width: `${(analytics.commissions.byStatus.listed / analytics.commissions.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Sold</span>
                  <span className="text-sm font-semibold text-gray-900">{analytics.commissions.byStatus.sold}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{
                      width: `${(analytics.commissions.byStatus.sold / analytics.commissions.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 mt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ø Verkaufszeit</span>
                  <span className="text-sm font-semibold text-gray-900">{analytics.commissions.avgSalesTimeDays} Tage</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600">Gesamtkommission</span>
                  <span className="text-sm font-semibold text-amber-600">
                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(analytics.commissions.totalCommissionEarned)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Fulfillment Analysis */}
        <Card className="p-4 bg-white border-amber-500/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fulfillment-Analyse</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                <span className="text-gray-700">Kommissionsverkauf</span>
                <span className="text-2xl font-bold text-gray-900">{analytics.fulfillment.commission}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-100 rounded-lg">
                <span className="text-gray-700">Direktauslieferung</span>
                <span className="text-2xl font-bold text-gray-900">{analytics.fulfillment.delivery}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span className="text-gray-700">Gesamt</span>
                <span className="text-2xl font-bold text-gray-900">
                  {analytics.fulfillment.commission + analytics.fulfillment.delivery}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
