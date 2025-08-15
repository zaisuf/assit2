'use client';

import React, { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';

export const withUiIdGuard = <P extends object>(Component: ComponentType<P>) => {
  const WithUiIdGuard = (props: P) => {
    const router = useRouter();
    
    useEffect(() => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const uiId = params.get("uiId");
        if (!uiId) {
          router.replace("/");
        }
      }
    }, [router]);
    
    return <Component {...props} />;
  };

  WithUiIdGuard.displayName = `WithUiIdGuard(${Component.displayName || Component.name || 'Component'})`;
  return WithUiIdGuard;

  WithUiIdGuard.displayName = `WithUiIdGuard(${Component.displayName || Component.name || 'Component'})`;
  return WithUiIdGuard;
};
