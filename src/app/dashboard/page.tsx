'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/api/firebase/firebase';
import HexagonGrid from '@/components/HexagonGrid';
import Sidebar from '@/components/sidebar/page';
import HomeSidebar from './homeSidebar';
import Button from '@/components/styles/Button';
import SectionLine from '@/components/styles/SectionLine';
import RenderUiDesign from '@/components/RenderUiDesign';

const Home: React.FC = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState({
    photoURL: null as string | null,
    displayName: null as string | null
  });

  useEffect(() => {
    const checkAuth = () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
        return;
      }
      setUserProfile({
        photoURL: user.photoURL,
        displayName: user.displayName
      });
    };

    checkAuth();
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-r from-black via-blue-950 to-gray-900 flex">
      {/* Hexagon Pattern Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <HexagonGrid />
      </div>
      <Sidebar />
      <HomeSidebar 
        selected="home" 
        onSelect={(id: string) => handleNavigation(`/${id}`)} 
      />
      <div className="min-h-screen text-white pt-12 z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Section */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-syne bg-gradient-to-r from-secondary-cyan to-accent-gold text-transparent bg-clip-text">
                home
              </h1>
            </div>
          </div>

          <SectionLine className="mb-8" />

          {/* Embedded Chatbot Design removed due to missing design */}

        </div>
      </div>

  {/* Chatbot UI Modal Bottom Right removed due to missing design */}
    </div>
  );
};

export default Home;