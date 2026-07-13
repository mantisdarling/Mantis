'use client';

import { useEffect } from 'react';

export function AxeReporter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      import('@axe-core/react')
        .then(({ default: axe }) => {
          import('react').then((React) => {
            import('react-dom').then((ReactDOM) => {
              axe(React, ReactDOM, 1000);
            });
          });
        })
        .catch(() => {
          // Axe not installed in this env — silent fail
        });
    }
  }, []);

  return null;
}
