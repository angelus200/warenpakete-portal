'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}

interface PayoutRequest {
  id: string;
  amount: number;
  iban: string;
  bankName?: string;
  status: string;
  createdAt: string;
  processedAt?: string;
}

export default function WalletPage() {
  const api = useApi();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [iban, setIban] = useState('');
  const [bankName, setBankName] = useState('');

  const { data: balance } = useQuery<{ balance: number }>({
    queryKey: ['wallet', 'balance'],
    queryFn: () => api.get('/wallet/balance'),
    enabled: api.isLoaded && api.isSignedIn,
  });

  const { data: transactions } = useQuery<WalletTransaction[]>({
    queryKey: ['wallet', 'transactions'],
    queryFn: () => api.get('/wallet/transactions'),
    enabled: api.isLoaded && api.isSignedIn,
  });

  const { data: payoutRequests } = useQuery<PayoutRequest[]>({
    queryKey: ['wallet', 'payouts'],
    queryFn: () => api.get('/wallet/payouts'),
    enabled: api.isLoaded && api.isSignedIn,
  });

  const requestPayoutMutation = useMutation({
    mutationFn: (data: { amount: number; iban: string; bankName?: string }) =>
      api.post('/wallet/request-payout', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      setAmount('');
      setIban('');
      setBankName('');
    },
  });

  const handleRequestPayout = () => {
    const amountNum = parseFloat(amount);
    if (amountNum < 10) {
      alert('Mindestauszahlungsbetrag ist €10.00');
      return;
    }
    if (!iban) {
      alert('Bitte IBAN angeben');
      return;
    }
    requestPayoutMutation.mutate({ amount: amountNum, iban, bankName });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'COMMISSION_EARNED':
        return '💰';
      case 'PAYOUT_REQUESTED':
      case 'PAYOUT_COMPLETED':
        return '💸';
      case 'STORAGE_FEE_CHARGED':
        return '📦';
      case 'REFUND':
        return '↩️';
      default:
        return '📝';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'REJECTED':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/40';
    }
  };

  return (
    <div className="min-h-screen bg-[#ebebeb]">
      <div className="container mx-auto px-4 py-3">
        <div className="mb-3">
          <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
            Wallet
          </h1>
          <p className="text-gray-600">Verwalten Sie Ihr Guthaben und Auszahlungen</p>
        </div>

        {/* Balance Card */}
        <Card className="p-4 mb-3 bg-gradient-to-br from-dark-light to-dark border-gold/30 shadow-xl shadow-gold/10">
          <div className="text-center">
            <p className="text-gray-600 mb-2 text-lg">Verfügbares Guthaben</p>
            <p className="text-6xl font-bold text-gold mb-4">
              €{balance?.balance ? Number(balance.balance).toFixed(2) : '0.00'}
            </p>
            <p className="text-sm text-gray-600">
              Mindestauszahlung: €10.00 • Auszahlung innerhalb von 30 Tagen
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
          {/* Payout Request Form */}
          <Card className="p-4 bg-white border-gray-300">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Auszahlung beantragen</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Betrag (€)
                </label>
                <input
                  type="number"
                  min="10"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Mindestens €10.00"
                  className="w-full px-4 py-3 bg-[#ebebeb] border-2 border-gold text-gray-900 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  IBAN
                </label>
                <input
                  type="text"
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  placeholder="DE89 3704 0044 0532 0130 00"
                  className="w-full px-4 py-3 bg-[#ebebeb] border-2 border-gold text-gray-900 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Bankname (optional)
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="z.B. Sparkasse"
                  className="w-full px-4 py-3 bg-[#ebebeb] border-2 border-gold text-gray-900 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>
              <Button
                onClick={handleRequestPayout}
                disabled={requestPayoutMutation.isPending || !amount || !iban}
                className="w-full py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold shadow-lg shadow-gold/20 disabled:opacity-50"
              >
                {requestPayoutMutation.isPending ? 'Wird verarbeitet...' : 'Auszahlung beantragen'}
              </Button>
            </div>
          </Card>

          {/* Payout Requests */}
          <Card className="p-4 bg-white border-gray-300">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Auszahlungsanträge</h2>
            {payoutRequests && payoutRequests.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {payoutRequests.map((request) => (
                  <div key={request.id} className="p-4 bg-[#ebebeb] rounded-lg border border-gold/10">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gold text-lg">€{Number(request.amount).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{request.iban}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {new Date(request.createdAt).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">Keine Auszahlungsanträge</p>
            )}
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="p-4 bg-white border-gray-300">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Transaktionsverlauf</h2>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center p-4 bg-[#ebebeb] rounded-lg border border-gold/10 hover:border-gold/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-lg">{getTransactionIcon(tx.type)}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{tx.description || tx.type}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(tx.createdAt).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${tx.type.includes('PAYOUT') || tx.type.includes('FEE') ? 'text-red-400' : 'text-green-400'}`}>
                      {tx.type.includes('PAYOUT') || tx.type.includes('FEE') ? '-' : '+'}€{Number(tx.amount).toFixed(2)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3">
              <p className="text-gray-600 text-lg">Keine Transaktionen vorhanden</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
