'use client'

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/app/api/firebase/firebase';
import Link from 'next/link';
import { 
  Squares2X2Icon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [userProfile, setUserProfile] = useState({
    photoURL: null as string | null,
    displayName: null as string | null,
    email: null as string | null
  });
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserProfile({
          photoURL: user.photoURL,
          displayName: user.displayName,
          email: user.email
        });
      } else {
        setUserProfile({
          photoURL: null,
          displayName: null,
          email: null
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Don't render on public routes
  const isPublicRoute = ['/', '/login', '/signup', '/reset-password'].includes(pathname || '');
  if (isPublicRoute) return null;

  // Add mouse enter/leave handlers for auto-expand
  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  const navigationItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Squares2X2Icon className="w-4 h-4" />,
    },
    {
      name: 'Agent',
      path: '/agent',
      icon: <UserIcon className="w-4 h-4" />,
    },
    {
      name: 'API',
      path: '/your-api',
      icon: <Squares2X2Icon className="w-4 h-4" />,
    },
  ];

  const handleLogout = async () => {
    try {
      await auth.signOut();
      Cookies.remove('token', { path: '/' }); // Remove the auth token cookie
      Cookies.remove('accessToken', { path: '/' }); // Remove accessToken if used
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Overlay close handler
  const handleCloseOverlay = () => setShowProfileOverlay(false);

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed top-0 left-0 right-0 bg-dark-lighter flex justify-between items-center px-4 py-1 transition-all duration-300 z-50 ${
        isExpanded ? 'h-12' : 'h-8'
      }`}
    >
      {/* Logo */}
      <div 
        className="w-6 h-6 bg-gradient-to-r from-secondary-cyan to-accent-gold rounded-md flex items-center justify-center cursor-pointer"
        onClick={() => router.push('/')}
      >
        <span className="text-xs font-orbitron text-dark">A</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mx-8">
        <ul className="flex items-center justify-center space-x-8">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center px-3 py-1 rounded-md relative group transition-all duration-200 font-sans ${
                  pathname === item.path 
                    ? 'text-accent-gold bg-dark/50' 
                    : 'text-gray-400 hover:text-white hover:bg-dark/30'
                }`}
              >
                <div className="w-4 h-4 transition-transform group-hover:scale-110">{item.icon}</div>
                <span className={`ml-2 text-xs transition-all duration-200 font-sans ${
                  isExpanded 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-2 hidden'
                }`}>
                  {item.name}
                </span>
                {pathname === item.path && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary-cyan to-accent-gold"></div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div>
        <button 
          onClick={() => setShowProfileOverlay(true)}
          className={`flex items-center px-3 py-1 rounded-md transition-all duration-200 font-sans ${
            pathname === '/profile'
              ? 'text-accent-gold bg-dark/50'
              : 'text-gray-400 hover:text-white hover:bg-dark/30'
          }`}
        >
          <div className="w-6 h-6 transition-transform hover:scale-110 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
            {userProfile.photoURL ? (
              <img
                src={userProfile.photoURL}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <span className={`ml-2 text-xs transition-all duration-200 font-sans ${
            isExpanded 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-2 hidden'
          }`}>
            Profile
          </span>
        </button>
      </div>

      {/* Side Profile Overlay */}
      {showProfileOverlay && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay background for outside click */}
          <div
            className="absolute inset-0 bg-transparent"
            onClick={handleCloseOverlay}
            tabIndex={-1}
            aria-label="Close profile overlay"
          />
          {/* Side panel only, no dark background */}
          <div className="ml-auto w-64 max-w-full h-[72vh] bg-dark-lighter shadow-lg p-6 flex flex-col justify-center relative animate-slide-in-right self-start mt-8 mb-2 pointer-events-auto">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
              onClick={handleCloseOverlay}
              aria-label="Close profile overlay"
            >
              ×
            </button>
            <div className="flex flex-col items-center h-full flex-1">
              <div className="mb-2 mt-4 flex flex-col gap-1 items-start w-full">
                <Link href="/terms" className="text-xs text-gray-400 hover:text-white no-underline hover:no-underline transition font-bold font-sans text-left">Terms</Link>
                <Link href="/privacy-policy" className="text-xs text-gray-400 hover:text-white no-underline hover:no-underline transition font-bold font-sans text-left">Privacy Policy</Link>
              </div>
              <div className="flex-1" />
                <hr className="w-[123%] -ml-0 border-t border-gray-700 mb-4" />
              <div className="flex flex-row-reverse items-center gap-2 mb-4 self-start group min-w-[180px]">
                <div className="relative flex flex-col items-center ml-2 min-w-[32px]">
                  <span className="absolute bottom-full mb-2 px-2 py-1 bg-dark-lighter text-xs text-red-500 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Logout
                  </span>
                  <ArrowRightOnRectangleIcon
                    onClick={handleLogout}
                    className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition"
                    role="button"
                    tabIndex={0}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="text-sm font-semibold text-white font-sans text-left truncate">
                    {userProfile.displayName && userProfile.displayName.trim() !== ''
                      ? userProfile.displayName
                      : userProfile.email
                        ? userProfile.email.split('@')[0]
                        : 'User'}
                  </div>
                  <div className="text-xs text-gray-400 font-sans text-left truncate max-w-[120px]">{userProfile.email}</div>
                </div>
              </div>
              {/* Logout moved next to user info above */}
            </div>
          </div>
          {/* Animation keyframes (Tailwind custom, add to global CSS if not present) */}
          {/*
            .animate-slide-in-right {
              animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          */}
        </div>
      )}
    </div>
  );
};

export default Sidebar;