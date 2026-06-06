'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[v0] Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.log('[v0] Service Worker registration failed:', error);
        });

      // Check for updates periodically
      const interval = setInterval(() => {
        navigator.serviceWorker.ready.then((registration) => {
          registration.update();
        });
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, []);

  return null;
}
