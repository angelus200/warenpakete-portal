'use client';

import { useEffect } from 'react';

export default function ElevenLabsWidget() {
  useEffect(() => {
    // ElevenLabs Conversational AI Widget Script laden
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    return () => {
      // Cleanup: Script entfernen beim Unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      {/* @ts-ignore - Custom ElevenLabs Web Component */}
      <elevenlabs-convai agent-id="agent_6601kj0cyf5xe07scznt8w8pdmw9"></elevenlabs-convai>
    </>
  );
}
