'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/lib/api-client';
import { User, Order, Commission } from '@/types';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const apiClient = useApiClient();

  const { data: users } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => apiClient.get('/users'),
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => apiClient.get('/orders'),
  });

  const { data: pendingCommissions } = useQuery<Commission[]>({
    queryKey: ['commissions', 'pending'],
    queryFn: () => apiClient.get('/commissions/pending'),
  });

  const totalRevenue =
    orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
  const pendingCommissionAmount =
    pendingCommissions?.reduce((sum, comm) => sum + comm.amount, 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{users?.length || 0}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">{orders?.length || 0}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">€{totalRevenue.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Pending Commissions</h3>
          <p className="text-3xl font-bold">
            €{pendingCommissionAmount.toFixed(2)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-blue-600 text-sm hover:underline">
              View all
            </Link>
          </div>

          {orders && orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div>
                    <p className="font-semibold">#{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-600">
                      {order.user?.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      €{order.totalAmount.toFixed(2)}
                    </p>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No orders yet</p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </div>

          <div className="space-y-3">
            <Link
              href="/admin/products"
              className="block p-4 border rounded hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold">Manage Products</h3>
              <p className="text-sm text-gray-600">
                Add, edit, or remove products
              </p>
            </Link>

            <Link
              href="/admin/commissions"
              className="block p-4 border rounded hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold">Manage Commissions</h3>
              <p className="text-sm text-gray-600">
                View and pay pending commissions
              </p>
            </Link>

            <Link
              href="/admin/users"
              className="block p-4 border rounded hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage user accounts</p>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
