'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const api = useApi();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    companyName: '',
    vatId: '',
    street: '',
    zip: '',
    city: '',
    country: 'DE',
  });

  const [acceptedTerms, setAcceptedTerms] = useState({
    businessCustomer: false,
    agb: false,
    noWithdrawal: false,
  });

  const onboardingMutation = useMutation({
    mutationFn: (data: typeof formData) => api.post('/users/onboarding', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/dashboard');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms.businessCustomer || !acceptedTerms.agb || !acceptedTerms.noWithdrawal) {
      alert('Bitte akzeptieren Sie alle erforderlichen Bedingungen.');
      return;
    }

    onboardingMutation.mutate(formData);
  };

  const isFormValid =
    formData.companyName &&
    formData.vatId &&
    formData.street &&
    formData.zip &&
    formData.city &&
    acceptedTerms.businessCustomer &&
    acceptedTerms.agb &&
    acceptedTerms.noWithdrawal;

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <Card className="p-8 bg-dark-light border-gold/30 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-light to-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold/30">
              <svg className="w-8 h-8 text-dark" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">B2B Registrierung</h1>
            <p className="text-gray-400">
              Warenpakete Portal verkauft ausschließlich an Gewerbetreibende
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Firmenname *
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-4 py-3 bg-dark border-2 border-gold/40 text-white rounded-lg focus:outline-none focus:border-gold"
                placeholder="Ihre Firma GmbH"
              />
            </div>

            {/* VAT ID */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                USt-IdNr. (Umsatzsteuer-Identifikationsnummer) *
              </label>
              <input
                type="text"
                required
                value={formData.vatId}
                onChange={(e) => setFormData({ ...formData, vatId: e.target.value })}
                className="w-full px-4 py-3 bg-dark border-2 border-gold/40 text-white rounded-lg focus:outline-none focus:border-gold"
                placeholder="DE123456789"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: DE + 9 Ziffern (z.B. DE123456789)
              </p>
            </div>

            {/* Street */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Straße + Hausnummer *
              </label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-4 py-3 bg-dark border-2 border-gold/40 text-white rounded-lg focus:outline-none focus:border-gold"
                placeholder="Musterstraße 123"
              />
            </div>

            {/* ZIP and City */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  PLZ *
                </label>
                <input
                  type="text"
                  required
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border-2 border-gold/40 text-white rounded-lg focus:outline-none focus:border-gold"
                  placeholder="12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stadt *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border-2 border-gold/40 text-white rounded-lg focus:outline-none focus:border-gold"
                  placeholder="Berlin"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Land *
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-3 bg-dark border-2 border-gold/40 text-white rounded-lg focus:outline-none focus:border-gold"
              >
                <option value="DE">Deutschland</option>
                <option value="AT">Österreich</option>
                <option value="CH">Schweiz</option>
                <option value="LU">Luxemburg</option>
                <option value="NL">Niederlande</option>
                <option value="BE">Belgien</option>
              </select>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4 pt-4 border-t border-gold/20">
              <h3 className="font-semibold text-white text-lg mb-4">
                Bestätigungen (alle erforderlich)
              </h3>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptedTerms.businessCustomer}
                  onChange={(e) => setAcceptedTerms({ ...acceptedTerms, businessCustomer: e.target.checked })}
                  className="mt-1 w-5 h-5 text-gold bg-dark border-2 border-gold/40 rounded focus:ring-gold"
                />
                <span className="text-sm text-gray-300 group-hover:text-white">
                  Ich bestätige, dass ich als <strong className="text-gold">Unternehmer im Sinne von § 14 BGB</strong> handle
                  und nicht als Verbraucher (§ 13 BGB) auftrete.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptedTerms.agb}
                  onChange={(e) => setAcceptedTerms({ ...acceptedTerms, agb: e.target.checked })}
                  className="mt-1 w-5 h-5 text-gold bg-dark border-2 border-gold/40 rounded focus:ring-gold"
                />
                <span className="text-sm text-gray-300 group-hover:text-white">
                  Ich habe die <a href="/agb" target="_blank" className="text-gold hover:text-gold-light underline">AGB</a> gelesen
                  und akzeptiere diese.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptedTerms.noWithdrawal}
                  onChange={(e) => setAcceptedTerms({ ...acceptedTerms, noWithdrawal: e.target.checked })}
                  className="mt-1 w-5 h-5 text-gold bg-dark border-2 border-gold/40 rounded focus:ring-gold"
                />
                <span className="text-sm text-gray-300 group-hover:text-white">
                  Mir ist bekannt, dass als Unternehmer <strong className="text-gold">kein Widerrufsrecht</strong> besteht (§ 312g BGB).
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid || onboardingMutation.isPending}
              className="w-full py-4 text-lg font-bold bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark shadow-2xl shadow-gold/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {onboardingMutation.isPending ? 'Wird verarbeitet...' : 'Registrierung abschließen'}
            </Button>

            {onboardingMutation.error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/40 rounded-lg">
                <p className="text-red-400 text-sm">
                  Fehler: {onboardingMutation.error.message}
                </p>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
