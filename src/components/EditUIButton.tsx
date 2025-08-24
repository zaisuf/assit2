'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface EditUIButtonProps {
  uidesingid: string;
  target?: 'ui232-3' | 'wedgetui1';
}

export const EditUIButton: React.FC<EditUIButtonProps> = ({ 
  uidesingid, 
  target = 'ui232-3' 
}) => {
  const router = useRouter();
  
  const handleEdit = () => {
    router.push(`/agent/${target}?uiId=${uidesingid}`);
  };
  
  return (
    <button 
      onClick={handleEdit} 
      className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition"
    >
      Edit UI
    </button>
  );
};
