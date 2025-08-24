'use client'

import React, { useState, useEffect } from 'react';
import { auth } from '@/app/api/firebase/firebase';
import Background from '@/components/styles/Background';
import Button from '@/components/styles/Button';
import Sidebar from '@/components/sidebar/page'; // Updated import path
// ...existing imports...

const APILogs: React.FC = () => {
  // ...existing state and useEffect...

  return (
    <Background variant="dark">
      <Sidebar />
      <div className="min-h-screen text-white pt-12">
        {/* ...existing content... */}
      </div>
    </Background>
  );
};

export default APILogs;
