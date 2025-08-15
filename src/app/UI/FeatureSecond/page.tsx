'use client'
import React from 'react';
import HexagonPattern from '@/components/HexagonPattern';
import SquareBoxPattern from '@/components/SquareBoxPattern';

const FeatureSecond: React.FC = () => {
  return (
    <div>
      <section className="relative h-screen w-full bg-gradient-to-r from-black via-blue-950 to-gray-900 overflow-hidden">
        <HexagonPattern />
        <SquareBoxPattern />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            {/* Right content */}
            <div className="lg:w-1/2 order-2 lg:order-1 space-y-8 relative z-20 text-center lg:text-right">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-l from-purple-400 to-indigo-600 text-transparent bg-clip-text">
                  Transform your vision
                  <span className="block text-transparent bg-clip-text bg-gradient-to-l from-indigo-400 to-purple-600">
                    with AI power
                  </span>
                </span>
              </h1>
              
              <a 
                href="/features" 
                className="inline-block mt-8 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-space rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25"
              >
                Explore Features
              </a>
            </div>

            {/* Right side empty space */}
            <div className="lg:w-1/2 order-1 lg:order-2 relative h-[700px] hidden lg:block">
              <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2">
                {/* Add new content here if needed */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeatureSecond;
