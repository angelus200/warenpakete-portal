'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ecommercerente.com';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Login fehlgeschlagen');
      }

      const data = await response.json();

      // Token im localStorage speichern
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));

      // Redirect zum Dashboard
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 bg-zinc-900 border-amber-500/20">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Commercehelden Admin
          </h1>
          <p className="text-gray-400">
            Melde dich mit deinen Admin-Zugangsdaten an
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@commercehelden.com"
              className="w-full px-4 py-3 bg-black border border-amber-500/20 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-black border border-amber-500/20 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 hover:from-amber-700 hover:via-amber-600 hover:to-amber-500 text-black font-bold rounded-lg shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-amber-500/10 text-center">
          <p className="text-sm text-gray-500">
            Nur für autorisierte Commercehelden-Mitarbeiter
          </p>
        </div>
      </Card>
    </div>
  );
}
