'use client';

import { useEffect, useRef } from 'react';

interface ElevenLabsWidgetProps {
  agentId?: string;
}

export function ElevenLabsWidget({ agentId = 'agent_5501k89ms48gehwva0wk29he4mcz' }: ElevenLabsWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the ElevenLabs ConvAI widget script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';

    // Append script to body
    document.body.appendChild(script);

    // Create the custom element after script loads
    script.onload = () => {
      if (containerRef.current && agentId) {
        // Create the elevenlabs-convai element
        const widget = document.createElement('elevenlabs-convai');
        widget.setAttribute('agent-id', agentId);

        // Clear container and append widget
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(widget);
      }
    };

    return () => {
      // Cleanup: remove script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [agentId]);

  return (
    <div
      ref={containerRef}
      className="elevenlabs-widget-container min-h-[100px] flex items-center justify-center"
    >
      {/* Widget will be injected here */}
      <div className="text-xs text-gray-500 animate-pulse">
        Cargando widget de voz...
      </div>
    </div>
  );
}
