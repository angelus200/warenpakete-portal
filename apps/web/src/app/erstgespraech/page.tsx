'use client';

import { useState } from 'react';
import { InlineWidget } from 'react-calendly';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface FormData {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;

  // Step 2
  budget: string;
  industry: string;
  ecommerceExperience: string;
  companySize: string;
  source: string;
  timeframe: string;
}

export default function ErstgespraechPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    budget: '',
    industry: '',
    ecommerceExperience: '',
    companySize: '',
    source: '',
    timeframe: '',
  });
  const [isQualified, setIsQualified] = useState(false);
  const [consultantUrl, setConsultantUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep1 = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.company
    );
  };

  const validateStep2 = () => {
    return (
      formData.budget &&
      formData.industry &&
      formData.ecommerceExperience &&
      formData.companySize &&
      formData.source &&
      formData.timeframe
    );
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      setError('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }

    setError('');

    if (currentStep === 2) {
      submitLead();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const submitLead = async () => {
    setLoading(true);
    setError('');

    try {
      // Get UTM params from URL
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source') || undefined;
      const utmMedium = urlParams.get('utm_medium') || undefined;
      const utmCampaign = urlParams.get('utm_campaign') || undefined;

      // Get affiliate ref from cookie
      const affiliateRef = document.cookie
        .split('; ')
        .find((row) => row.startsWith('affiliate_ref='))
        ?.split('=')[1] || undefined;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/funnel/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          utmSource,
          utmMedium,
          utmCampaign,
          affiliateRef,
        }),
      });

      if (!res.ok) {
        throw new Error('Fehler beim Absenden. Bitte versuchen Sie es erneut.');
      }

      const lead = await res.json();

      setIsQualified(lead.isQualified);

      if (lead.isQualified && lead.consultant) {
        setConsultantUrl(lead.consultant.calendlyUrl);
      }

      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  const budgetOptions = [
    { value: '5k-10k', label: '5.000 – 9.999 €' },
    { value: '10k-25k', label: '10.000 – 24.999 €' },
    { value: '25k-50k', label: '25.000 – 49.999 €' },
    { value: '50k-100k', label: '50.000 – 99.999 €' },
    { value: '100k+', label: '100.000 €+' },
  ];

  const experienceOptions = [
    { value: 'none', label: 'Keine Erfahrung' },
    { value: 'basic', label: 'Grundkenntnisse' },
    { value: 'advanced', label: 'Fortgeschritten' },
    { value: 'pro', label: 'Profi / bereits aktiver Seller' },
  ];

  const companySizeOptions = [
    { value: '1', label: '1 Person (Einzelunternehmer)' },
    { value: '2-10', label: '2–10 Mitarbeiter' },
    { value: '11-50', label: '11–50 Mitarbeiter' },
    { value: '51-200', label: '51–200 Mitarbeiter' },
    { value: '200+', label: '200+ Mitarbeiter' },
  ];

  const sourceOptions = [
    { value: 'google', label: 'Google' },
    { value: 'social', label: 'Social Media' },
    { value: 'referral', label: 'Empfehlung' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'podcast', label: 'Podcast' },
    { value: 'event', label: 'Messe/Event' },
    { value: 'other', label: 'Sonstiges' },
  ];

  const timeframeOptions = [
    { value: 'immediate', label: 'Sofort starten' },
    { value: '1-3months', label: 'In 1–3 Monaten' },
    { value: '3-6months', label: 'In 3–6 Monaten' },
    { value: 'just_info', label: 'Nur informieren' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f0] py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentStep >= step
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {currentStep > step ? <CheckCircle2 size={20} /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step ? 'bg-[#D4AF37]' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Schritt {currentStep} von 3
              {currentStep === 1 && ' - Kontaktdaten'}
              {currentStep === 2 && ' - Qualifizierung'}
              {currentStep === 3 && ' - Terminbuchung'}
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Jetzt <span className="text-[#D4AF37]">Erstgespräch</span> vereinbaren
          </h1>
          <p className="text-lg text-gray-600">
            Besprechen Sie Ihre Möglichkeiten mit unseren Experten
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-red-300">
            <p className="text-red-800 text-sm">{error}</p>
          </Card>
        )}

        {/* Guide Hinweis */}
        {currentStep < 3 && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-[#fffbeb] to-[#fef3c7] border-2 border-gold/30">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">
                  Noch nicht bereit für ein Gespräch?
                </h3>
                <p className="text-sm text-gray-700">
                  Laden Sie zuerst unseren kostenlosen B2B-Guide herunter und informieren Sie sich in Ruhe.
                </p>
              </div>
              <Link href="/guide" className="flex-shrink-0">
                <button className="px-4 py-2 bg-gold hover:bg-gold-dark text-dark font-semibold rounded-lg transition-colors text-sm">
                  Guide herunterladen
                </button>
              </Link>
            </div>
          </Card>
        )}

        {/* Step 1: Kontaktdaten */}
        {currentStep === 1 && (
          <Card className="p-8 bg-white shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ihre Kontaktdaten</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vorname *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                    placeholder="Max"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nachname *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                    placeholder="Mustermann"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  E-Mail *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                  placeholder="max@beispiel.de"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                  placeholder="+49 123 456789"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Firmenname *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                  placeholder="Musterfirma GmbH"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position im Unternehmen (Optional)
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                  placeholder="Geschäftsführer"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleNextStep}
                className="bg-[#D4AF37] hover:bg-[#B8960C] text-black font-bold px-8 py-3 flex items-center gap-2"
              >
                Weiter
                <ArrowRight size={20} />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Qualifizierung */}
        {currentStep === 2 && (
          <Card className="p-8 bg-white shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Qualifizierung</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Investitionsbudget *
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="">Bitte wählen...</option>
                  {budgetOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Branche / Geschäftsfeld *
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                  placeholder="z.B. Elektronik, Fashion, Haushalt"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Erfahrung mit E-Commerce / Amazon *
                </label>
                <select
                  value={formData.ecommerceExperience}
                  onChange={(e) => handleInputChange('ecommerceExperience', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="">Bitte wählen...</option>
                  {experienceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Firmengröße *
                </label>
                <select
                  value={formData.companySize}
                  onChange={(e) => handleInputChange('companySize', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="">Bitte wählen...</option>
                  {companySizeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Wie auf uns aufmerksam geworden? *
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="">Bitte wählen...</option>
                  {sourceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Zeitrahmen *
                </label>
                <select
                  value={formData.timeframe}
                  onChange={(e) => handleInputChange('timeframe', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="">Bitte wählen...</option>
                  {timeframeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button
                onClick={handlePrevStep}
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 font-bold px-8 py-3 flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                Zurück
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={loading}
                className="bg-[#D4AF37] hover:bg-[#B8960C] text-black font-bold px-8 py-3 flex items-center gap-2"
              >
                {loading ? 'Wird gesendet...' : 'Absenden'}
                <ArrowRight size={20} />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Ergebnis */}
        {currentStep === 3 && (
          <>
            {isQualified && consultantUrl ? (
              <div>
                <Card className="p-8 bg-white shadow-lg mb-6">
                  <div className="text-center mb-6">
                    <CheckCircle2 size={64} className="text-green-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      Herzlichen Glückwunsch! 🎉
                    </h2>
                    <p className="text-lg text-gray-600">
                      Sie sind für ein persönliches Erstgespräch qualifiziert.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Buchen Sie jetzt Ihren Wunschtermin direkt im Kalender.
                    </p>
                  </div>
                </Card>

                {/* Calendly Embed */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <InlineWidget
                    url={consultantUrl}
                    styles={{
                      height: '700px',
                    }}
                  />
                </div>
              </div>
            ) : (
              <Card className="p-8 bg-orange-50 border-2 border-orange-300 shadow-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🙏</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Vielen Dank für Ihr Interesse!
                  </h2>
                  <p className="text-lg text-gray-700 mb-4">
                    Aufgrund unseres Mindestinvestitionsvolumens von <strong>10.000 €</strong> können wir Ihnen aktuell kein persönliches Erstgespräch anbieten.
                  </p>
                  <p className="text-gray-600 mb-6">
                    Wir speichern Ihre Anfrage und melden uns bei Ihnen, sobald passende Angebote für Ihr Budget verfügbar sind.
                  </p>
                  <p className="text-sm text-gray-500">
                    Eine Bestätigungs-E-Mail wurde an <strong>{formData.email}</strong> gesendet.
                  </p>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
