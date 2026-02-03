'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { Card } from '@/components/ui/card';

interface Contract {
  id: string;
  contractNumber: string;
  productName: string;
  productQuantity: number;
  purchasePrice: number;
  commissionRate: number;
  iban: string;
  bic: string;
  accountHolder: string;
  status: string;
  user: {
    companyName: string;
    companyStreet: string;
    companyZip: string;
    companyCity: string;
    companyCountry: string;
    vatId: string;
  };
}

export default function SignContractPage() {
  const api = useApi();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const contractId = params.id as string;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: contract, isLoading } = useQuery<Contract>({
    queryKey: ['contract', contractId],
    queryFn: () => api.get(`/contracts/${contractId}`),
    enabled: api.isLoaded && api.isSignedIn,
  });

  const { data: contractText } = useQuery<{ text: string }>({
    queryKey: ['contract-text', contractId],
    queryFn: () => api.get(`/contracts/${contractId}/text`),
    enabled: api.isLoaded && api.isSignedIn && !!contract,
  });

  const signMutation = useMutation({
    mutationFn: (signatureData: string) =>
      api.post(`/contracts/${contractId}/sign`, { signatureData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', contractId] });
      router.push(`/contracts/${contractId}?success=signed`);
    },
    onError: (err: any) => {
      setError(err.message || 'Fehler beim Signieren');
    },
  });

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Set white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set drawing style
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set drawing style for this context
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasSignature) {
      setError('Bitte unterschreiben Sie den Vertrag');
      return;
    }

    if (!accepted) {
      setError('Bitte akzeptieren Sie die Vertragsbedingungen');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL('image/png');
    signMutation.mutate(signatureData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Vertrag...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center">
        <p className="text-gray-600">Vertrag nicht gefunden</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebebeb]">
      <div className="container mx-auto px-4 py-3 max-w-5xl">
        <div className="mb-3">
          <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
            Verkaufskommissionsvertrag
          </h1>
          <p className="text-gray-600">Vertragsnummer: {contract.contractNumber}</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border-2 border-red-500/50 text-red-400 px-3 py-4 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contract Text */}
          <Card className="p-4 bg-white border-gray-300">
            <div className="max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                {contractText?.text || 'Lade Vertragstext...'}
              </pre>
            </div>
          </Card>

          {/* Signature Section */}
          <Card className="p-4 bg-white border-gray-300">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Unterschrift</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Bitte unterschreiben Sie hier:
              </label>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-48 bg-white border-2 border-gray-300 rounded-lg cursor-crosshair"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={clearSignature}
              className="px-4 py-2 bg-white hover:bg-gray-200 text-gray-900 text-sm font-medium rounded-lg transition-all"
            >
              Unterschrift löschen
            </button>
          </Card>

          {/* Acceptance Checkbox */}
          <Card className="p-4 bg-white border-gray-300">
            <label className="flex items-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 text-gold bg-[#ebebeb] border-gold rounded focus:ring-gold"
              />
              <div className="flex-1">
                <p className="text-gray-900 font-medium mb-2">
                  Ich akzeptiere die Vertragsbedingungen
                </p>
                <p className="text-sm text-gray-600">
                  Ich bestätige, dass ich den Verkaufskommissionsvertrag vollständig
                  gelesen und verstanden habe. Mir ist bewusst, dass:
                </p>
                <ul className="mt-2 text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Dies ein B2B-Vertrag ist (kein Verbraucherschutz)</li>
                  <li>Die Kommission 20% des Verkaufspreises beträgt</li>
                  <li>Lagerkosten nach 14 Tagen anfallen (€0,50/Palette/Tag)</li>
                  <li>Keine Verkaufsgarantie besteht</li>
                  <li>Streitigkeiten durch VIAC-Schiedsgericht in Wien entschieden werden</li>
                </ul>
              </div>
            </label>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/orders')}
              className="flex-1 px-4 py-4 bg-white hover:bg-gray-200 text-gray-900 font-bold rounded-lg transition-all"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={!hasSignature || !accepted || signMutation.isPending}
              className="flex-1 px-4 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-bold rounded-lg shadow-lg shadow-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signMutation.isPending ? 'Signiere...' : 'Vertrag signieren'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(212, 175, 55, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </div>
  );
}
