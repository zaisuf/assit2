import React, { useEffect, useState } from 'react';
import { GlassButton } from './ui/glass-button';
import { GlassNav } from './ui/glass-nav';
import { auth } from '@/app/api/firebase/firebase';
import { useRouter } from 'next/navigation';
import { RiLoginCircleLine, RiDashboardLine } from 'react-icons/ri';

const Header: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const navItems = [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <header className="w-full py-1 px-8 mt-1 flex items-center justify-between bg-transparent z-50">
      <div className="flex items-center gap-6">
        <span className="text-sm font-orbitron font-normal bg-gradient-to-r from-secondary-cyan to-accent-gold text-transparent bg-clip-text select-none font-sans" style={{fontFamily: 'sans-serif'}}>
          makelAI
        </span>
      </div>
      <GlassNav items={navItems} />
      <div className="flex gap-4 pointer-events-auto">
          <GlassButton 
            variant="primary" 
            size="md" 
            className="min-w-[150px] font-bold flex items-center justify-center gap-2 group"
            onClick={handleAuthClick}
            type="button"
          >
            {isLoggedIn ? (
              <>
                <RiDashboardLine className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Dashboard</span>
              </>
            ) : (
              <>
                <RiLoginCircleLine className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Login</span>
              </>
            )}
          </GlassButton>
      </div>
    </header>
  );
};

export default Header;
