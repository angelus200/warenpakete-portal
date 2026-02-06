'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface VidyardLazyVideoProps {
  videoId: string;
  thumbnailUrl: string;
  className?: string;
}

export default function VidyardLazyVideo({
  videoId,
  thumbnailUrl,
  className = '',
}: VidyardLazyVideoProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadingRef = useRef(false);

  // Intersection Observer - lädt Script wenn Video in Sicht kommt
  useEffect(() => {
    if (hasIntersected) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasIntersected) {
            setHasIntersected(true);
            loadVidyardScript();
          }
        });
      },
      {
        rootMargin: '200px', // Script laden 200px bevor Video sichtbar wird
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasIntersected]);

  // Vidyard Script laden
  const loadVidyardScript = () => {
    if (scriptLoadingRef.current || isScriptLoaded) return;

    scriptLoadingRef.current = true;
    setIsLoading(true);

    // Prüfen ob Script bereits existiert
    const existingScript = document.querySelector(
      'script[src="https://play.vidyard.com/embed/v4.js"]'
    );

    if (existingScript) {
      setIsScriptLoaded(true);
      setIsLoading(false);
      scriptLoadingRef.current = false;
      return;
    }

    // Script laden
    const script = document.createElement('script');
    script.src = 'https://play.vidyard.com/embed/v4.js';
    script.async = true;

    script.onload = () => {
      setIsScriptLoaded(true);
      setIsLoading(false);
      scriptLoadingRef.current = false;
    };

    script.onerror = () => {
      console.error('Failed to load Vidyard script');
      setIsLoading(false);
      scriptLoadingRef.current = false;
    };

    document.body.appendChild(script);
  };

  // Play Button Click Handler
  const handlePlayClick = () => {
    if (!isScriptLoaded && !scriptLoadingRef.current) {
      loadVidyardScript();
    }
    setIsPlayerActive(true);
  };

  // Player initialisieren wenn Script geladen ist
  useEffect(() => {
    if (isScriptLoaded && isPlayerActive && window.VidyardV4) {
      window.VidyardV4.api.renderPlayer({
        uuid: videoId,
        container: containerRef.current,
        type: 'inline',
      });
    }
  }, [isScriptLoaded, isPlayerActive, videoId]);

  return (
    <div ref={containerRef} className={className}>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {!isPlayerActive ? (
          <>
            {/* Thumbnail */}
            <div className="absolute inset-0 bg-black">
              <Image
                src={thumbnailUrl}
                alt="Video Thumbnail"
                fill
                className="object-cover"
                priority={false}
              />
            </div>

            {/* Play Button Overlay */}
            <button
              onClick={handlePlayClick}
              className="absolute inset-0 flex items-center justify-center group cursor-pointer z-10"
              aria-label="Video abspielen"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 group-hover:bg-[#B8960C]">
                {isLoading ? (
                  // Loading Spinner
                  <div className="w-10 h-10 border-4 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  // Play Icon (Triangle)
                  <div className="w-0 h-0 border-l-[20px] md:border-l-[24px] border-l-black border-y-[12px] md:border-y-[14px] border-y-transparent ml-1.5" />
                )}
              </div>
            </button>

            {/* Video Duration Badge (optional) */}
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 text-white text-sm rounded backdrop-blur-sm">
              Video
            </div>
          </>
        ) : (
          <>
            {/* Vidyard Player Container */}
            {isScriptLoaded ? (
              <div
                className="vidyard-player-embed absolute inset-0"
                data-uuid={videoId}
                data-v="4"
                data-type="inline"
              />
            ) : (
              // Loading State
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Video wird geladen...</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Fallback für NoScript */}
      <noscript>
        <a
          href={`https://share.vidyard.com/watch/${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={thumbnailUrl}
            alt="Ecommerce Service Erklärvideo"
            style={{ width: '100%' }}
          />
        </a>
      </noscript>
    </div>
  );
}

// TypeScript Declaration für Vidyard
declare global {
  interface Window {
    VidyardV4?: {
      api: {
        renderPlayer: (options: {
          uuid: string;
          container: HTMLElement | null;
          type: string;
        }) => void;
      };
    };
  }
}
