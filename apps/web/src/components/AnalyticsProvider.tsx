'use client';

import { createContext, useContext, ReactNode } from 'react';

interface AnalyticsContextType {
  track: (event: string, properties?: Record<string, unknown>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType>({ track: () => {} });

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const track = (event: string, properties?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // TODO: swap for PostHog / Mixpanel / Segment
      console.log('[MANTIS Analytics]', event, properties);
    }
  };

  return (
    <AnalyticsContext.Provider value={{ track }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export const useAnalytics = () => useContext(AnalyticsContext);
