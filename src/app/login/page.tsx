'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { auth, db } from '@/app/api/firebase/firebase';
import { GoogleAuthProvider, signInWithPopup, browserPopupRedirectResolver } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import HexagonGrid from "@/components/HexagonGrid";

const Login: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Automatically refresh token and update cookie
  React.useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        const expires = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `token=${idToken}; path=/; expires=${expires}; secure; samesite=strict`;
      } else {
        // Remove token cookie if user logs out
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict';
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      if (result.user) {
        // Save user details to Firestore
        const user = result.user;
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          email: user.email || '',
          displayName: user.displayName || '',
          provider: user.providerData[0]?.providerId || 'google',
          photoURL: user.photoURL || '',
          createdAt: serverTimestamp(),
        }, { merge: true });
        // Explicitly redirect to dashboard
        window.location.href = '/dashboard';
        return;
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      setError(error.message || 'Failed to sign in with Google. Please try again.');
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        setError('Popup was blocked or closed. Please enable popups and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for GitHub login handler
  const handleGithubLogin = () => {
    // Implement GitHub login logic here
    alert('GitHub login not implemented.');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-r from-black via-blue-950 to-gray-900 flex items-center justify-center p-6 pt-16">
      {/* Hexagon Pattern Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <HexagonGrid />
      </div>
      {/* Full vertical center line */}
      <div className="absolute left-1/2 top-0 h-full w-px bg-gray-700 z-10" style={{transform: 'translateX(-50%)'}} />
      {/* Left Side Square Box (AI Chat Assistant style) */}
      <div className="hidden md:flex flex-col items-center justify-center h-[480px] w-[380px] mr-12 z-20">
        <div className="w-full h-full bg-gradient-to-br from-black/40 via-black/20 to-transparent backdrop-blur-lg p-4 border border-white/10 shadow-[0_0_15px_rgba(124,58,237,0.1)] flex flex-col justify-center" style={{ borderRadius: 0 }}>
          {/* Social Login Buttons moved here */}
          <div className="flex flex-col gap-4 w-full">
            <button
              type="button"
              className="w-full py-3 px-4 rounded-lg bg-[#262341] border border-gray-700 font-space hover:border-yellow-500 transition-colors flex items-center justify-center"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <FcGoogle className="h-5 w-5 mr-2" />
              {isLoading ? 'Signing in...' : 'Google'}
            </button>
            <button
              type="button"
              className="w-full py-3 px-4 rounded-lg bg-dark-lighter border border-gray-700 font-space hover:border-secondary-cyan transition-colors flex items-center justify-center"
              onClick={handleGithubLogin}
            >
              <FaGithub className="h-5 w-5 mr-2" />
              GitHub
            </button>
          </div>
        </div>
      </div>
      {/* Login Form Centered */}
      <div className="w-full max-w-md z-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron mb-2 bg-gradient-to-r from-secondary-cyan to-accent-gold text-transparent bg-clip-text">
            Welcome Back
          </h1>
          <p className="text-gray-400 font-space">
            Sign in to continue to your dashboard
          </p>
        </div>
        <div className="w-full bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-md bg-opacity-10 border border-white/20 hover:border-blue-400 hover:bg-blue-900/10 rounded-xl p-8 transition-all duration-200" style={{backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)'}}>
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded-lg font-space mb-6">
              {error}
            </div>
          )}
          {/* Removed social login buttons from here */}
        </div>
      </div>
    </div>
  );
};

export default Login;