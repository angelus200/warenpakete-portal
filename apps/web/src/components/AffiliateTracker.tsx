'use client';

import { useEffect } from 'react';

/**
 * Invisible component that tracks affiliate referrals
 * Checks for "ref" URL parameter and stores it in a cookie
 */
export function AffiliateTracker() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');

    if (refCode) {
      // Store in cookie for 30 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      document.cookie = `affiliate_ref=${refCode}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;

      // Track the click via API
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/affiliate/track/${refCode}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log('Affiliate click tracked:', refCode);
          }
        })
        .catch((err) => {
          console.error('Failed to track affiliate click:', err);
        });
    }
  }, []);

  // This component renders nothing
  return null;
}
