'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CrmPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to customers page by default
    router.push('/admin/crm/customers');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
        <p className="text-gray-600">Lade CRM...</p>
      </div>
    </div>
  );
}
