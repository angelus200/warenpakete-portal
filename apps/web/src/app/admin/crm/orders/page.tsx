'use client';

import { useState, useEffect } from 'react';
import { CrmLayout } from '@/components/crm/CrmLayout';
import { CrmKpiCard } from '@/components/crm/CrmKpiCard';
import { CrmStatusBadge } from '@/components/crm/CrmStatusBadge';
import { ShoppingCart, DollarSign, Package, TrendingUp } from 'lucide-react';

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  fulfillmentType: string;
  invoiceNumber?: string;
  createdAt: string;
  user: {
    company: string;
    companyName: string;
  };
  items: Array<{
    product: { name: string; palletCount: number };
    quantity: number;
  }>;
}

interface Pipeline {
  pending: Order[];
  paid: Order[];
  contract_pending: Order[];
  in_fulfillment: Order[];
  completed: Order[];
}

const PIPELINE_STAGES = [
  {
    key: 'pending',
    label: 'Ausstehend',
    color: '#f0ad4e',
  },
  {
    key: 'paid',
    label: 'Bezahlt',
    color: '#5cb85c',
  },
  {
    key: 'contract_pending',
    label: 'Vertrag',
    color: '#D4AF37',
  },
  {
    key: 'in_fulfillment',
    label: 'In Abwicklung',
    color: '#5bc0de',
  },
  {
    key: 'completed',
    label: 'Abgeschlossen',
    color: '#777',
  },
];

export default function CrmOrdersPage() {
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPipeline();
  }, []);

  const fetchPipeline = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/crm/orders/pipeline`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setPipeline(data);
    } catch (error) {
      console.error('Failed to fetch pipeline:', error);
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

  const allOrders = pipeline
    ? Object.values(pipeline).flat()
    : [];
  const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const openOrders = allOrders.filter((o) => o.status !== 'DELIVERED').length;

  return (
    <CrmLayout>
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <CrmKpiCard
          label="Bestellungen gesamt"
          value={allOrders.length}
          sub={`${openOrders} offen`}
          icon={<ShoppingCart size={24} />}
        />
        <CrmKpiCard
          label="Bestellvolumen"
          value={formatCurrency(totalRevenue)}
          sub="Alle Bestellungen"
          icon={<DollarSign size={24} />}
        />
        <CrmKpiCard
          label="Kommissionsverkäufe"
          value={allOrders.filter((o) => o.fulfillmentType === 'COMMISSION').length}
          sub={`von ${allOrders.length} gesamt`}
          icon={<TrendingUp size={24} />}
        />
        <CrmKpiCard
          label="Paletten im Lager"
          value={allOrders
            .filter((o) => o.fulfillmentType === 'COMMISSION')
            .reduce(
              (sum, o) =>
                sum +
                o.items.reduce(
                  (s: number, i: any) => s + i.product.palletCount * i.quantity,
                  0,
                ),
              0,
            )}
          sub="Gesamt"
          icon={<Package size={24} />}
        />
      </div>

      {/* Pipeline */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart size={20} className="text-[#D4AF37]" />
            Auftrags-Pipeline
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Lade Pipeline...
          </div>
        ) : (
          <div className="p-6 grid grid-cols-5 gap-3">
            {PIPELINE_STAGES.map((stage) => {
              const orders =
                pipeline?.[stage.key as keyof Pipeline] || [];
              return (
                <div key={stage.key} className="bg-gray-50 rounded-lg">
                  <div
                    className="p-3 border-b-4 flex items-center justify-between"
                    style={{ borderColor: stage.color }}
                  >
                    <span className="text-xs font-bold uppercase tracking-wide">
                      {stage.label}
                    </span>
                    <span className="bg-gray-200 text-xs font-bold px-2 py-1 rounded-full">
                      {orders.length}
                    </span>
                  </div>
                  <div className="p-2 space-y-2 max-h-[600px] overflow-y-auto">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white p-3 rounded-md shadow-sm text-xs"
                      >
                        <div className="font-bold text-sm mb-1">
                          {order.user.company || order.user.companyName}
                        </div>
                        <div className="text-gray-600 mb-2 truncate">
                          {order.items[0]?.product.name || 'N/A'}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#B8960C]">
                            {formatCurrency(Number(order.totalAmount))}
                          </span>
                          <span className="text-gray-400 text-[11px]">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                        {order.fulfillmentType && (
                          <div
                            className={`mt-2 text-[10px] font-semibold ${order.fulfillmentType === 'COMMISSION' ? 'text-[#D4AF37]' : 'text-blue-600'}`}
                          >
                            {order.fulfillmentType === 'COMMISSION'
                              ? '⚡ Kommission'
                              : '📦 Lieferung'}
                          </div>
                        )}
                        {order.invoiceNumber && (
                          <div className="mt-2 text-[10px] text-gray-500">
                            📄 {order.invoiceNumber}
                          </div>
                        )}
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="p-4 text-center text-gray-400 text-xs">
                        Keine
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CrmLayout>
  );
}
