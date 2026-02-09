'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ecommercerente.com';

// Anonymer Session-Hash aus Browser-Fingerprint (KEINE Cookies, KEINE IP)
function generateSessionId(): string {
  if (typeof window === 'undefined') return '';

  const nav = window.navigator;
  const screen = window.screen;
  const raw = [
    nav.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().toDateString(), // Neuer Session-Hash pro Tag
    nav.hardwareConcurrency,
  ].join('|');

  // Einfacher Hash
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'v' + Math.abs(hash).toString(36);
}

function getDevice(): string {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export function PageTracker() {
  const pathname = usePathname();
  const startTime = useRef<number>(Date.now());
  const lastPath = useRef<string>('');

  useEffect(() => {
    // Nicht im Admin-Bereich tracken
    if (pathname.startsWith('/admin')) return;

    const sessionId = generateSessionId();
    const device = getDevice();

    // Verweildauer der vorherigen Seite senden
    if (lastPath.current && lastPath.current !== pathname) {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      // Fire-and-forget via Beacon API
      const data = JSON.stringify({
        path: lastPath.current,
        sessionId,
        device,
        duration,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          `${API_URL}/tracking/pageview`,
          new Blob([data], { type: 'application/json' })
        );
      }
    }

    // Neuen Seitenaufruf tracken
    startTime.current = Date.now();
    lastPath.current = pathname;

    fetch(`${API_URL}/tracking/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: typeof document !== 'undefined' ? document.referrer || null : null,
        sessionId,
        device,
      }),
    }).catch(() => {}); // Fehler ignorieren, Tracking darf nie die UX stören

    // Verweildauer beim Verlassen senden
    const handleBeforeUnload = () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      const data = JSON.stringify({
        path: pathname,
        sessionId,
        device,
        duration,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          `${API_URL}/tracking/pageview`,
          new Blob([data], { type: 'application/json' })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pathname]);

  return null; // Rendert nichts
}
