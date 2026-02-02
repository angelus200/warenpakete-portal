'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ecommercerente.com';

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  companyName: string | null;
  role: string;
  walletBalance: number;
  createdAt: string;
  _count: {
    orders: number;
    commissionsEarned: number;
  };
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchUsers(token);
  }, [router]);

  const fetchUsers = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
      localStorage.removeItem('adminToken');
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setUpdatingUserId(userId);

    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      // Refresh user list
      await fetchUsers(token);
      alert(`Rolle erfolgreich geändert zu ${newRole}`);
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Fehler beim Ändern der Rolle');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter === 'all') return true;
    return user.role === filter;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-500/20 text-red-400';
      case 'RESELLER': return 'bg-blue-500/20 text-blue-400';
      case 'BUYER': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Lade Benutzer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Benutzer-Verwaltung</h1>
            <p className="text-gray-400">{filteredUsers.length} Benutzer</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-amber-600 text-black'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            Alle ({users.length})
          </button>
          <button
            onClick={() => setFilter('ADMIN')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'ADMIN'
                ? 'bg-amber-600 text-black'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            Admins ({users.filter(u => u.role === 'ADMIN').length})
          </button>
          <button
            onClick={() => setFilter('RESELLER')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'RESELLER'
                ? 'bg-amber-600 text-black'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            Reseller ({users.filter(u => u.role === 'RESELLER').length})
          </button>
          <button
            onClick={() => setFilter('BUYER')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'BUYER'
                ? 'bg-amber-600 text-black'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            Käufer ({users.filter(u => u.role === 'BUYER').length})
          </button>
        </div>

        {/* Users Table */}
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <Card className="p-8 bg-zinc-900 border-amber-500/20 text-center">
              <p className="text-gray-400">Keine Benutzer gefunden</p>
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.id} className="p-6 bg-zinc-900 border-amber-500/20 hover:border-amber-500/40 transition-all">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-400 mb-1">Benutzer</p>
                    <p className="text-white font-semibold">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.email}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    {(user.company || user.companyName) && (
                      <p className="text-xs text-gray-500 mt-1">
                        🏢 {user.companyName || user.company}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Rolle</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Guthaben</p>
                    <p className="text-white font-semibold">
                      {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Number(user.walletBalance))}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Aktivität</p>
                    <p className="text-white">{user._count.orders} Bestellungen</p>
                    <p className="text-xs text-gray-500">{user._count.commissionsEarned} Kommissionen</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-400 mb-2">Rolle ändern</p>
                    <select
                      value={user.role}
                      onChange={(e) => {
                        if (confirm(`Rolle wirklich zu ${e.target.value} ändern?`)) {
                          updateUserRole(user.id, e.target.value);
                        }
                      }}
                      disabled={updatingUserId === user.id}
                      className="bg-zinc-800 text-white px-3 py-1 rounded-lg border border-amber-500/20 hover:border-amber-500/40 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    >
                      <option value="BUYER">BUYER</option>
                      <option value="RESELLER">RESELLER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    {updatingUserId === user.id && (
                      <p className="text-xs text-amber-500 mt-1">Aktualisiere...</p>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
