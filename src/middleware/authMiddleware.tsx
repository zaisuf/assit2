'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/api/firebase/firebase';
import type { ComponentType } from 'react';

export function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  const AuthComponent: React.FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push('/login');
        }
      });

      return () => unsubscribe();
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  // Copy static methods
  return Object.assign(AuthComponent, WrappedComponent);
}
