
'use client';
import RenderUiDesign from '@/components/RenderUiDesign';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/api/firebase/firebase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import Sidebar from '@/components/sidebar/page';
import Background from '@/components/styles/Background';
import Button from '@/components/styles/Button';
import SectionLine from '@/components/styles/SectionLine';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [activeApiKey, setActiveApiKey] = useState('sk_live_XXX...XXX');
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

  // Sample data for the usage chart
  const usageData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'API Calls',
        data: [1200, 1900, 3000, 5000, 4800, 6000],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      }
    ],
  };

  // Sample data for the usage distribution
  const distributionData = {
    labels: ['Voice Recognition', 'Text Analysis', 'Sentiment Analysis', 'Language Processing'],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
        ],
      },
    ],
  };

  return (
    <Background variant="gradient"> {/* Changed from "dark" to "gradient" */}
      <Sidebar />
      <div className="min-h-screen text-white pt-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Section */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-orbitron bg-gradient-to-r from-secondary-cyan to-accent-gold text-transparent bg-clip-text">
                Dashboard
              </h1>
              <p className="text-gray-400 font-space">Monitor your API usage and manage your account</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="primary" 
                size="md"
                onClick={() => handleNavigation('/logs')}
              >
                View API Logs
              </Button>
              <a
                href="http://localhost:3000/UI/dffc474b-fad3-4abc-98ec-d6107e8c6d08"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="md">
                  Open Custom UI
                </Button>
              </a>
              <Button 
                variant="secondary"
                size="md"
                onClick={() => handleNavigation('/profile')}
                className="flex items-center gap-3"
              >
                {userProfile.photoURL ? (
                  <img src={userProfile.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    {userProfile.displayName ? userProfile.displayName[0].toUpperCase() : '?'}
                  </div>
                )}
                <span>{userProfile.displayName || 'My Profile'}</span>
              </Button>
            </div>
          </div>

          <SectionLine className="mb-8" />

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="border border-[#BAFFF5]/20 rounded-xl p-6 hover:border-[#BAFFF5]/40 transition-colors">
              <h3 className="text-secondary-cyan text-sm font-poppins mb-2">Total API Calls</h3>
              <p className="text-2xl font-orbitron">124,892</p>
              <span className="text-accent-green text-sm font-space">↑ 12% vs last month</span>
            </div>
            <div className="border border-[#BAFFF5]/20 rounded-xl p-6 hover:border-[#BAFFF5]/40 transition-colors">
              <h3 className="text-secondary-cyan text-sm font-poppins mb-2">Success Rate</h3>
              <p className="text-2xl font-orbitron">99.9%</p>
              <span className="text-accent-green text-sm font-space">↑ 0.2% vs last month</span>
            </div>
            <div className="border border-[#BAFFF5]/20 rounded-xl p-6 hover:border-[#BAFFF5]/40 transition-colors">
              <h3 className="text-secondary-cyan text-sm font-poppins mb-2">Avg Response Time</h3>
              <p className="text-2xl font-orbitron">235ms</p>
              <span className="text-red-500 text-sm font-space">↓ 15ms vs last month</span>
            </div>
            <div className="border border-[#BAFFF5]/20 rounded-xl p-6 hover:border-[#BAFFF5]/40 transition-colors">
              <h3 className="text-secondary-cyan text-sm font-poppins mb-2">Active Users</h3>
              <p className="text-2xl font-orbitron">1,892</p>
              <span className="text-accent-green text-sm font-space">↑ 8% vs last month</span>
            </div>
          </div>

          <SectionLine className="mb-8" />

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Usage Over Time */}
            <div className="border border-[#BAFFF5]/20 rounded-xl p-6 hover:border-[#BAFFF5]/40 transition-colors">
              <h2 className="text-xl font-orbitron bg-gradient-to-r from-secondary-cyan to-accent-gold text-transparent bg-clip-text mb-4">
                API Usage Over Time
              </h2>
              <Line data={usageData} options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                  },
                  x: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                  }
                },
                plugins: {
                  legend: {
                    labels: { color: 'rgba(255, 255, 255, 0.7)' }
                  }
                }
              }} />
            </div>

            {/* Usage Distribution */}
            <div className="border border-[#BAFFF5]/20 rounded-xl p-6 hover:border-[#BAFFF5]/40 transition-colors">
              <h2 className="text-xl font-orbitron bg-gradient-to-r from-secondary-cyan to-accent-gold text-transparent bg-clip-text mb-4">
                API Usage Distribution
              </h2>
              <div className="h-[300px] flex items-center justify-center">
                <Doughnut data={distributionData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { color: 'rgba(255, 255, 255, 0.7)' }
                    }
                  }
                }} />
              </div>
            </div>
          </div>

          <SectionLine className="mb-8" />

          {/* Subscription & Payment Section */}
          <div className="border border-[#BAFFF5]/20 rounded-xl p-6 mb-8 hover:border-[#BAFFF5]/40 transition-colors">
            <h2 className="text-xl font-orbitron bg-gradient-to-r from-secondary-cyan to-accent-gold text-transparent bg-clip-text mb-4">
              Subscription & Payment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-secondary-cyan font-poppins mb-2">Current Plan</h3>
                <div className="border border-[#BAFFF5]/20 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-space font-semibold">Enterprise Plan</span>
                    <span className="bg-primary-purple text-sm font-space px-2 py-1 rounded">Active</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">Next billing date: July 30, 2023</p>
                  <Button variant="outline" size="sm">Change Plan</Button>
                </div>
              </div>
              <div>
                <h3 className="text-secondary-cyan font-poppins mb-2">Payment Method</h3>
                <div className="border border-[#BAFFF5]/20 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-xl">💳</div>
                    <div>
                      <p className="font-space font-semibold">•••• •••• •••• 4242</p>
                      <p className="text-gray-400 text-sm">Expires 12/24</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update Payment Method</Button>
                </div>
              </div>
            </div>
          </div>

          <SectionLine className="mb-8" />

          {/* API Keys Section */}
          <div className="border border-[#BAFFF5]/20 rounded-xl p-6 mb-8 hover:border-[#BAFFF5]/40 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-orbitron">API Keys</h2>
              <Button variant="primary" size="sm">
                Generate New Key
              </Button>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold">Live API Key</p>
                  <p className="text-gray-400 text-sm">Created on June 15, 2023</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(activeApiKey)}
                >
                  Copy
                </Button>
              </div>
              <p className="font-mono text-sm bg-gray-800 p-2 rounded">{activeApiKey}</p>
            </div>
          </div>

          <SectionLine className="mb-8" />

          {/* Documentation Access */}
          <div className="border border-[#BAFFF5]/20 rounded-xl p-6 hover:border-[#BAFFF5]/40 transition-colors">
            <h2 className="text-xl font-orbitron bg-gradient-to-r from-secondary-cyan to-accent-gold text-transparent bg-clip-text mb-4">
              API Documentation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Quick Start Guide', 'API Reference', 'Code Examples'].map((title) => (
                <Button
                  key={title}
                  variant="secondary"
                  size="lg"
                  className="w-full text-left p-6 h-auto flex flex-col items-start"
                  onClick={() => handleNavigation('/docs')}
                >
                  <h3 className="font-semibold mb-2 text-secondary-cyan">{title}</h3>
                  <p className="text-gray-400 text-sm">View documentation</p>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Render Chatbot UI directly */}
      <div className="mt-12 flex justify-center">
        <div style={{ width: '450px', height: '500px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          <RenderUiDesign designId="dffc474b-fad3-4abc-98ec-d6107e8c6d08" />
        </div>
      </div>
    </Background>
  );
};

export default Dashboard;

// --- How to embed your custom chatbot UI in another project ---
// Import and use the RenderUiDesign component:
// import RenderUiDesign from '@/components/RenderUiDesign';
// 
// <div style={{ width: '450px', height: '500px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
//   <RenderUiDesign designId="your-design-id" />
// </div>