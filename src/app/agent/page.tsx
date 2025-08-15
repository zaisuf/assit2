"use client";

import React, { useState, useRef, useEffect } from "react";
import Overview from "./over-view";
import AgentSidebar from "./AgentSidebar";
import { IconSend } from "@tabler/icons-react";
import HexagonGrid from "@/components/HexagonGrid";
import { useRouter } from 'next/navigation';
import Button from '@/components/styles/Button';
import { Clipboard, Check, Upload, Save } from 'lucide-react';
import { auth } from '@/app/api/firebase/firebase';
import { db } from '@/app/api/firebase/firebase';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AgentChatPage() {
  // State for partner details overlay
  const [showPartnerOverlay, setShowPartnerOverlay] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  // State for copied partner id (for 'Copied' text)
  const [copiedPartnerId, setCopiedPartnerId] = useState<string | null>(null);
  // State for all partners
  const [partners, setPartners] = useState<any[]>([]);
  const [partnerLoading, setPartnerLoading] = useState(false);
  const [partnerError, setPartnerError] = useState('');

  // Fetch all partners from Firestore only after Firebase Auth state is ready
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    setPartnerLoading(true);
    setPartnerError('');
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setPartnerError('Not logged in');
          setPartners([]);
          setPartnerLoading(false);
          return;
        }
        try {
          const db = getFirestore();
          const uidesingRef = collection(db, `users/${user.uid}/uidesing`);
          const snapshot = await getDocs(uidesingRef);
          if (!snapshot.empty) {
            const docs = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
            setPartners(docs);
          } else {
            setPartners([]);
          }
        } catch (e) {
          setPartnerError('Failed to fetch partners');
        }
        setPartnerLoading(false);
      });
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
  const router = useRouter();
  const [selectedAgent, setSelectedAgent] = useState("overview");
  const [messages, setMessages] = useState<Message[]>(
    [
      {
        role: "assistant",
        content: "Hello! I'm your AI Agent. How can I help you today?",
        timestamp: new Date(),
      },
    ]
  );
  const [input, setInput] = useState("");

  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [editedTemplate, setEditedTemplate] = useState('');
  const [fileName, setFileName] = useState('custom_intents.json');
  const [isSaving, setIsSaving] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Onboarding step options and state
  const onboardingSteps = [
    {
      title: 'What type of website are you building?',
      options: [
        { label: 'Modern House', value: 'modern-house' },
        { label: 'E-commerce', value: 'ecommerce' },
        { label: 'Portfolio', value: 'portfolio' },
        { label: 'Blog', value: 'blog' },
        { label: 'Landing Page', value: 'landing' },
        { label: 'Other', value: 'other' },
      ],
      key: 'websiteCategory',
    },
    {
      title: 'What is your experience level?',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
        { label: 'Expert', value: 'expert' },
      ],
      key: 'experienceLevel',
    },
    {
      title: 'Tell us about your company/partner',
      options: [], // This step uses input fields
      key: 'companyDetails',
    },
  ];

  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    websiteCategory: '',
    experienceLevel: '',
    partnerName: '',
    companyName: '',
    description: '',
    siteUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Overlay onboarding state
  const [onboardStep, setOnboardStep] = useState(1);
  const [onboardSelections, setOnboardSelections] = useState({
    usageType: '',
    websiteCategory: '',
    partnerName: '',
    companyName: '',
    description: '',
    siteUrl: '',
  });
  const [onboardLoading, setOnboardLoading] = useState(false);
  const [onboardError, setOnboardError] = useState('');

  // Option data for steps
  const websiteCategories = [
    { key: 'ecommerce', label: 'E-commerce', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
    ) },
    { key: 'news', label: 'News', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/><line x1="3" y1="9" x2="21" y2="9"/><rect x="7" y="13" width="6" height="4" rx="1"/></svg>
    ) },
    { key: 'youtube', label: 'YouTube Site', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><rect x="2" y="7" width="20" height="10" rx="4"/><polygon points="10 9 15 12 10 15 10 9"/></svg>
    ) },
    { key: 'saas', label: 'SaaS', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><ellipse cx="12" cy="7" rx="8" ry="3"/><path d="M4 7v7c0 1.66 3.58 3 8 3s8-1.34 8-3V7"/><path d="M4 14c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>
    ) },
    { key: 'medicine', label: 'Medicine', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><rect x="3" y="8" width="18" height="8" rx="4"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
    ) },
    { key: 'education', label: 'Education', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><path d="M22 12l-10 5-10-5 10-5 10 5z"/><path d="M2 17l10 5 10-5"/><path d="M12 22V12"/></svg>
    ) },
    { key: 'portfolio', label: 'Portfolio', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
    ) },
    { key: 'blog', label: 'Blog', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>
    ) },
    { key: 'finance', label: 'Finance', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M12 12v4"/><path d="M8 16h8"/></svg>
    ) },
    { key: 'other', label: 'Other', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><circle cx="12" cy="8" r="1"/></svg>
    ) },
  ];
  const helpOptions = [
    { key: 'customer-support', label: 'Customer Support', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><path d="M18 10a6 6 0 1 0-12 0v2a6 6 0 0 0 12 0v-2z"/><circle cx="12" cy="14" r="4"/><path d="M9 18v2a3 3 0 0 0 6 0v-2"/></svg>
    ) },
    { key: 'outbound-sales', label: 'Outbound Sales', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0 1 22 16.92z"/></svg>
    ) },
    { key: 'learning-development', label: 'Learning and Development', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><path d="M22 12l-10 5-10-5 10-5 10 5z"/><path d="M2 17l10 5 10-5"/><path d="M12 22V12"/></svg>
    ) },
    { key: 'scheduling', label: 'Scheduling', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    ) },
    { key: 'lead-qualification', label: 'Lead Qualification', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    ) },
    { key: 'answering-service', label: 'Answering Service', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><circle cx="12" cy="12" r="10"/><path d="M8 15h8M9 9h.01M15 9h.01"/></svg>
    ) },
    { key: 'service-scheduling', label: 'Service Scheduling', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M12 14v4"/><path d="M10 16h4"/></svg>
    ) },
    { key: 'vehicle-diagnostics', label: 'Vehicle Diagnostics', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><rect x="3" y="11" width="18" height="6" rx="2"/><path d="M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>
    ) },
    { key: 'parts-ordering', label: 'Parts Ordering', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/><line x1="3" y1="11" x2="21" y2="11"/></svg>
    ) },
    { key: 'warranty-information', label: 'Warranty Information', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8v8H8z"/><path d="M8 12h8"/></svg>
    ) },
    { key: 'sales-support', label: 'Sales Support', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
    ) },
    { key: 'financing-assistance', label: 'Financing Assistance', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M12 12v4"/><path d="M8 16h8"/></svg>
    ) },
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input.trim(), timestamp: new Date() },
      { role: "assistant", content: `You said: ${input.trim()}`, timestamp: new Date() },
    ]);
    setInput("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          setEditedTemplate(content);
          setFileName(file.name);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSaveToFirebase = async () => {
    setIsSaving(true);
    const db = getFirestore();
    const docRef = doc(db, "users", auth.currentUser?.uid || "default");
    try {
      await setDoc(docRef, { customIntents: editedTemplate }, { merge: true });
      toast.success("JSON saved successfully!");
    } catch (error) {
      console.error("Error saving JSON: ", error);
      toast.error("Failed to save JSON.");
    }
    setIsSaving(false);
  };


  // Add state for uiId and client detection
  const [uiId, setUiId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Check if user already has a UI ID on mount
  useEffect(() => {
    setIsClient(true);
    const checkUiId = async () => {
      try {
        const db = getFirestore();
        const userId = auth.currentUser?.uid;
        if (!userId) {
          setUiId(null);
          return;
        }
        // Query all uidesing docs for this user
        const uidesingRef = collection(db, `users/${userId}/uidesing`);
        const snapshot = await getDocs(uidesingRef);
        if (!snapshot.empty) {
          // Use the first found UI ID (enforce one per user)
          const docData = snapshot.docs[0].data();
          setUiId(docData.designId || snapshot.docs[0].id);
        } else {
          setUiId(null);
        }
      } catch (err) {
        setUiId(null);
      }
    };
    checkUiId();
  }, []);

  // Create UI and save to Firestore, but only if user doesn't already have one
  const handleCreateUi = async () => {
    try {
      const db = getFirestore();
      const userId = auth.currentUser?.uid;
      if (!userId) {
        toast.error('You must be logged in to create a UI.');
        return;
      }
      // Query all uidesing docs for this user
      const uidesingRef = collection(db, `users/${userId}/uidesing`);
      const snapshot = await getDocs(uidesingRef);
      if (!snapshot.empty) {
        // User already has a UI, do not create another
        const docData = snapshot.docs[0].data();
        setUiId(docData.designId || snapshot.docs[0].id);
        toast.success('You already have a UI.');
        return;
      }
      // Generate a new design ID
      const designId = 'ui_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      // Save minimal doc with just the designId
      await setDoc(doc(db, `users/${userId}/uidesing/${designId}`), {
        designId,
        createdAt: new Date().toISOString(),
        userId,
      });
      setUiId(designId);
      toast.success('UI ID created! Now customize your UI.');
      // Redirect to ui232-3 page and pass uiId in query string
      router.push(`/agent/ui232-3?uiId=${designId}`);
    } catch (err) {
      toast.error('Failed to create UI.');
      console.error('Create UI error:', err);
    }
  };

  // Section content for each agent
  const handleOpenPartnerOverlay = (partner: any) => {
    setSelectedPartner(partner);
    setShowPartnerOverlay(true);
  };

  const handleClosePartnerOverlay = () => {
    setShowPartnerOverlay(false);
    setSelectedPartner(null);
  };

  const agentSections: Record<string, React.JSX.Element> = {
    overview: (
      <Overview />
    ),
    design: (
  <div className="w-full max-w-5xl rounded-none shadow-2xl p-8 flex flex-col border border-white/20 text-white h-[500px] relative">
        {/* Black transparent layer only for content, not header */}
        {partners.length === 0 && (
          <button
            className="absolute top-3 right-8 w-auto h-10 flex items-center justify-center gap-2 border-2 border-white/40 rounded-lg text-white text-2xl font-bold transition-all duration-200 bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] z-20 px-4"
            type="button"
            onClick={() => setShowOverlay(true)}
            aria-label="Create New Partner"
          >
            <span className="text-2xl leading-none">+</span>
            <span className="text-base font-semibold">New partner</span>
          </button>
        )}
        <h2 className="text-3xl font-bold text-gradient-animated text-center font-syne z-10 relative" style={{color:'#fff', marginTop:'-0.5rem'}}>My Partner</h2>
        <div className="border-t border-white/20 my-2 -mx-8 z-10 relative" style={{ width: 'calc(100% + 4rem)' }}></div>
        <div className="flex-1 flex flex-col items-center justify-center text-white/80 text-lg font-syne pt-0 mt-[-12px] z-10 relative" style={{position:'relative'}}>
          <div className="absolute inset-0 bg-black/30 rounded-xl z-0" style={{borderRadius:'1rem', top:'1.5rem', left:0, right:0, bottom:0}}></div>
          <div className="w-full flex justify-center items-start mt-[-270px] z-20 relative">
            {partnerLoading ? (
              <span className="text-white/60">Loading...</span>
            ) : partnerError ? (
              <span className="text-red-400">{partnerError}</span>
            ) : partners.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <table className="min-w-full text-white/90 rounded-lg text-base font-syne">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left" style={{color:'#A0A0A0', fontWeight:400}}>Partner Name</th>
                      <th className="px-4 py-2 text-left" style={{color:'#A0A0A0', fontWeight:400}}>Source URL</th>
                      <th className="px-4 py-2 text-left" style={{color:'#A0A0A0', fontWeight:400}}>Website Category</th>
                      <th className="px-4 py-2 text-left" style={{color:'#A0A0A0', fontWeight:400}}>Created At</th>
                      <th className="px-2 py-2 text-center w-10" style={{color:'#A0A0A0', fontWeight:400}}> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map((p) => (
                      <tr key={p.id}>
                        <td className="px-4 py-2">{p.partnerName || '-'}</td>
                        <td className="px-4 py-2">{p.siteUrl ? <a href={p.siteUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-300">{p.siteUrl}</a> : '-'}</td>
                        <td className="px-4 py-2">{p.websiteCategory || '-'}</td>
                        <td className="px-4 py-2">{p.createdAt ? new Date(p.createdAt).toLocaleString() : '-'}</td>
                        <td className="px-2 py-2 text-center">
                          {/* 3-dot icon (vertical ellipsis) */}
                          <button
                            className="p-1 rounded hover:bg-white/10 focus:outline-none"
                            title="Details"
                            type="button"
                            onClick={() => handleOpenPartnerOverlay(p)}
                          >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="5.5" r="1.5"/>
                              <circle cx="12" cy="12" r="1.5"/>
                              <circle cx="12" cy="18.5" r="1.5"/>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <span className="text-white/60">No partner found</span>
            )}
          </div>
        </div>
      </div>
    ),
  // voice: (removed)
  // chatbot: (removed)
   
  };

  const handleOptionSelect = (stepKey: string, value: string) => {
    setOnboardingData((prev) => ({ ...prev, [stepKey]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOnboardingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (onboardingStep < onboardingSteps.length - 1) {
      setOnboardingStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (onboardingStep > 0) {
      setOnboardingStep((prev) => prev - 1);
    }
  };

  const handleOnboardingSubmit = async () => {
    setIsSubmitting(true);
    try {
      const db = getFirestore();
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('Not authenticated');
      const partnerId = onboardingData.partnerName || 'partner';
      await setDoc(doc(db, `users/${userId}/onbording/${partnerId}`), onboardingData, { merge: true });
      toast.success('Onboarding complete!');
      setShowOverlay(false);
      setOnboardingStep(0);
      setOnboardingData({
        websiteCategory: '',
        experienceLevel: '',
        partnerName: '',
        companyName: '',
        description: '',
        siteUrl: '',
      });
    } catch (err) {
      toast.error('Failed to save onboarding.');
    }
    setIsSubmitting(false);
  };

  // Option select handler
  const handleOnboardSelect = (step: number, key: string) => {
    if (step === 1) setOnboardSelections((s) => ({ ...s, usageType: key }));
    if (step === 2) setOnboardSelections((s) => ({ ...s, websiteCategory: key }));
    // Step 3 (helpOption) removed
  };

  // Next/Back logic
  const handleOnboardNext = () => {
    setOnboardError('');
    if (onboardStep === 1 && !onboardSelections.usageType) {
      setOnboardError('Please select usage type.');
      return;
    }
    if (onboardStep === 2 && !onboardSelections.websiteCategory) {
      setOnboardError('Please select a website category.');
      return;
    }
    // Step 3 (helpOption) removed
    if (onboardStep === 3) {
      handleOnboardSubmit();
      return;
    }
    setOnboardStep((s) => s + 1);
  };
  const handleOnboardBack = () => {
    setOnboardError('');
    if (onboardStep > 1) setOnboardStep((s) => s - 1);
  };

  // Submit onboarding (save to Firestore like partner-onboard page)
  const handleOnboardSubmit = async () => {
    setOnboardLoading(true);
    setOnboardError('');
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setOnboardError('You must be logged in to create a UI.');
        setOnboardLoading(false);
        return;
      }
      // Generate unique uidesingId
      const random = Math.random().toString(36).slice(2) + Date.now().toString(36);
      const uidesingId = `ui_${random}`;
      await setDoc(
        doc(db, 'users', userId, 'uidesing', uidesingId),
        {
          designId: uidesingId,
          partnerName: onboardSelections.partnerName || '',
          companyName: onboardSelections.companyName || '',
          companyDescription: onboardSelections.description || '',
          siteUrl: onboardSelections.siteUrl || '',
          usageType: onboardSelections.usageType || '',
          websiteCategory: onboardSelections.websiteCategory || '',
          // helpCategory removed
          createdAt: new Date().toISOString(),
          userId,
        }
      );
      setOnboardLoading(false);
      setShowOverlay(false);
      setOnboardStep(1);
      setOnboardSelections({ usageType: '', websiteCategory: '', partnerName: '', companyName: '', description: '', siteUrl: '' });
      toast.success('UI created!');
      router.push(`/agent/edit-partner?id=${uidesingId}`);
    } catch (e) {
      setOnboardError('Failed to save UI.');
      setOnboardLoading(false);
      console.error('Firestore error:', e);
    }
  };

  // usageTypes definition (move above overlay render)
  const usageTypes = [
    { key: 'personal', label: 'Personal Use', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/></svg>
    ) },
    { key: 'company', label: 'For Company', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F4F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
    ) },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-r from-black via-blue-950 to-gray-900 flex">
      <AgentSidebar selected={selectedAgent} onSelect={setSelectedAgent} />
      {/* Hexagon Pattern Background - ensure it covers the full page */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', width: '100vw', height: '100vh' }}>
        <HexagonGrid />
      </div>
      {/* 'your Partner' button in top right corner - removed */}
      {/* Overlay Big Square */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center">
          <div
            className="relative mb-16"
            style={{
              zIndex: 60,
              width: '40rem',
              height: '28rem',
              minWidth: '40rem',
              minHeight: '28rem',
              maxWidth: '40rem',
              maxHeight: '28rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'slideUpFromBottom 0.4s cubic-bezier(0.4,0,0.2,1)',
              boxSizing: 'border-box',
            }}
          >
            <div
              className="relative w-full h-full flex flex-col items-center justify-between p-4 shadow-2xl border border-white/20 font-sans"
              style={{
                borderRadius: '0px',
                background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)',
                boxShadow: '0 8px 40px 0 rgba(72,98,129,0.18)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '2px solid rgba(255,255,255,0.18)',
                overflow: 'hidden',
                boxSizing: 'border-box',
                fontFamily: 'sans-serif',
              }}
            >
              <h2 className="text-3xl font-bold text-white text-center w-full mt-2 mb-2 flex items-center justify-center gap-3 relative"
                style={onboardStep === 4 ? { marginTop: '0.5rem' } : {}}>
                <button
                  className="inline-block align-middle absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center cursor-pointer bg-transparent border-0 p-0 m-0"
                  style={{ lineHeight: 0 }}
                  onClick={handleOnboardBack}
                  aria-label="Back"
                  type="button"
                  disabled={onboardStep === 1 || onboardLoading}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <span className="mx-auto">Create Your Partner</span>
                <button
                  className="inline-block align-middle absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center cursor-pointer bg-transparent border-0 p-0 m-0"
                  style={{ lineHeight: 0 }}
                  onClick={() => setShowOverlay(false)}
                  aria-label="Close"
                  type="button"
                  disabled={onboardLoading}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </h2>
              <div className="absolute left-0 right-0 border-t border-white/20" style={{top: 96}}></div>
              <div className="flex flex-col items-center justify-center w-full flex-1 pt-8">
                {/* Onboarding Steps */}
                <div className="w-full max-w-xl mx-auto">
                  {onboardStep === 1 && (
                    <>
                      <p className="text-lg text-white/80 mb-6 text-center">Is this for personal use or for a company?</p>
                      <div className="flex flex-wrap gap-4 justify-center mb-4">
                        {usageTypes.map((opt) => (
                          <div
                            key={opt.key}
                            className="flex flex-col items-center cursor-pointer px-2 py-1 rounded group onboarding-option"
                            onClick={() => {
                              setOnboardSelections(s => ({ ...s, usageType: opt.key }));
                              setTimeout(() => setOnboardStep(2), 180);
                            }}
                            style={{ minWidth: '7rem' }}
                          >
                            <span className="onboarding-icon group-hover:onboarding-icon-hover">{opt.icon}</span>
                            <span className="text-sm font-sans font-semibold text-center transition-colors group-hover:text-[#BAFFF5] onboarding-label" style={{color:'#F3F4F6',userSelect:'text'}}>{opt.label}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {onboardStep === 2 && (
                    <>
                      <p className="text-lg text-white/80 mb-6 text-center">What type of website or business is this for?</p>
                      <div className="flex flex-wrap gap-4 justify-center mb-4">
                        {websiteCategories.map((opt) => (
                          <div
                            key={opt.key}
                            className="flex flex-col items-center cursor-pointer px-2 py-1 rounded group onboarding-option"
                            onClick={() => {
                              handleOnboardSelect(2, opt.key);
                              setTimeout(() => setOnboardStep(3), 180);
                            }}
                            style={{ minWidth: '5.5rem' }}
                          >
                            <span className="onboarding-icon group-hover:onboarding-icon-hover">{opt.icon}</span>
                            <span className="text-sm font-sans font-semibold text-center transition-colors group-hover:text-[#BAFFF5] onboarding-label" style={{color:'#F3F4F6',userSelect:'text'}}>{opt.label}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {/* Step 3 (How do you want your partner to help?) removed */}
                  {onboardStep === 3 && (
                    <>
                      <div className="space-y-0 mt-2"> {/* Changed from mt-32 to mt-2 to move fields up */}
                        <label className="block text-white/80 text-sm font-semibold mb-0.5" htmlFor="partnerName">Partner Name<span className="text-red-400 ml-1">*</span></label>
                        <input
                          id="partnerName"
                          type="text"
                          className="w-full px-2 py-1 border-2 border-white/30 rounded-none bg-white/10 text-white/90 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] mb-0.5 font-sans text-base"
                          placeholder="Enter your agent name"
                          value={onboardSelections.partnerName}
                          onChange={e => setOnboardSelections(s => ({ ...s, partnerName: e.target.value }))}
                          maxLength={32}
                          required
                        />
                        <label className="block text-white/80 text-sm font-semibold mb-0.5" htmlFor="companyName">Company Name<span className="text-red-400 ml-1">*</span></label>
                        <input
                          id="companyName"
                          type="text"
                          className="w-full px-2 py-1 border-2 border-white/30 rounded-none bg-white/10 text-white/90 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] mb-0.5 font-sans text-base"
                          placeholder="Enter your company name"
                          value={onboardSelections.companyName}
                          onChange={e => setOnboardSelections(s => ({ ...s, companyName: e.target.value }))}
                          maxLength={64}
                          required
                        />
                        {/* Add your site URL input (NEW) */}
                        <div style={{ marginTop: '0rem' }}></div>
                        <label className="block text-white/80 text-sm font-semibold mb-0.5" htmlFor="siteUrl">URL<span className="text-red-400 ml-1">*</span></label>
                        <input
                          id="siteUrl"
                          type="text"
                          name="siteUrl"
                          value={onboardSelections.siteUrl || ''}
                          onChange={e => setOnboardSelections(s => ({ ...s, siteUrl: e.target.value }))}
                          placeholder="Enter your site URL"
                          className="w-full px-2 py-1 border-2 border-white/30 rounded-none bg-white/10 text-white/90 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] mb-0.5 font-sans text-base"
                          maxLength={128}
                          required
                        />
                      </div>
                    </>
                  )}
                  {onboardError && <div className="text-red-400 text-center mb-2">{onboardError}</div>}
                </div>
              </div>
              {/* Button at the bottom inside overlay for step 4 */}
              {onboardStep === 3 && (
                <div className="w-full flex justify-center mt-4 mb-2">
                  <button
                    className="w-40 h-11 border-2 border-white/30 rounded bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-base font-bold tracking-wide transition-all duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] flex items-center justify-center pointer-events-auto shadow-xl relative"
                    style={{ boxShadow: '0 4px 24px 0 rgba(72,98,129,0.22)' }}
                    type="button"
                    disabled={onboardLoading || !onboardSelections.partnerName || !onboardSelections.companyName}
                    onClick={handleOnboardSubmit}
                  >
                    {onboardLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      'Create Partner'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
          <style>{`
            @keyframes slideUpFromBottom {
              from { transform: translateY(120px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            .onboarding-option .onboarding-icon svg {
              stroke: #F3F4F6;
              transition: stroke 0.18s;
            }
            .onboarding-option:hover .onboarding-icon svg,
            .onboarding-option:focus .onboarding-icon svg,
            .onboarding-option:active .onboarding-icon svg,
            .onboarding-option.group:hover .onboarding-icon svg {
              stroke: #C0C0C0 !important;
            }
            .onboarding-option:hover .onboarding-label,
            .onboarding-option:focus .onboarding-label,
            .onboarding-option:active .onboarding-label {
              color: #C0C0C0 !important;
            }
          `}</style>
        </div>
      )}
      {/* Partner details small side overlay */}
      {showPartnerOverlay && selectedPartner && (
        <>
          {/* Overlay background removed as requested */}
          <div className="fixed top-1/2 right-0 w-40 h-44 shadow-2xl z-[100] flex flex-col transition-all duration-200" style={{
            borderTopLeftRadius: '1rem',
            borderBottomLeftRadius: '1rem',
            transform: 'translateY(-50%)',
            background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)',
            boxShadow: '0 8px 40px 0 rgba(72,98,129,0.18)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '2px solid rgba(255,255,255,0.18)',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}>
            <button
              className="absolute top-2 right-3 text-gray-700 hover:text-black text-2xl font-bold focus:outline-none"
              onClick={handleClosePartnerOverlay}
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
            <div className="p-4 pt-4 flex-1 flex flex-col gap-2">
              <div className="text-sm text-gray-800 space-y-1.5">
                <div>
                  <button
                    className="font-semibold cursor-pointer focus:outline-none flex items-center gap-1"
                    style={{ color: '#fff', fontFamily: 'sans-serif', fontWeight: 500, fontSize: '0.93rem', background: 'none', border: 'none', padding: 0 }}
                    type="button"
                    onClick={() => {
                      const uidesingid = selectedPartner.designId || selectedPartner.id;
                      if (uidesingid) {
                        window.open(`/UI/${uidesingid}`, '_blank');
                      }
                    }}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Agent Link
                  </button>
                </div>
                <div>
                  <button
                    className="font-semibold cursor-pointer focus:outline-none flex items-center gap-1"
                    style={{ color: '#fff', fontFamily: 'sans-serif', fontWeight: 500, fontSize: '0.93rem', background: 'none', border: 'none', padding: 0 }}
                    type="button"
                    onClick={async () => {
                      const uidesingid = selectedPartner.designId || selectedPartner.id;
                      if (uidesingid) {
                        await navigator.clipboard.writeText(uidesingid);
                        setCopiedPartnerId(selectedPartner.id || selectedPartner.designId);
                        toast.success('Agent ID copied');
                        setTimeout(() => setCopiedPartnerId(null), 1500);
                      }
                    }}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    {(copiedPartnerId === (selectedPartner.id || selectedPartner.designId)) ? 'Copied' : 'Copy Agent ID'}
                  </button>
                </div>
                <div>
                  <button
                    className="font-semibold cursor-pointer focus:outline-none flex items-center gap-1"
                    style={{ color: '#fff', fontFamily: 'sans-serif', fontWeight: 500, fontSize: '0.93rem', background: 'none', border: 'none', padding: 0 }}
                    type="button"
                    onClick={() => {
                      // Get the uidesingid from selectedPartner (designId or id)
                      const uidesingid = selectedPartner.designId || selectedPartner.id;
                      if (uidesingid) {
                        window.location.href = `/agent/ui232-3?uiId=${uidesingid}`;
                      }
                    }}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                    Edit UI
                  </button>
                </div>
                <div>
                  <span className="font-semibold flex items-center gap-1" style={{ color: '#fff', fontSize: '0.93rem' }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                    SDK Docs
                  </span>
                </div>
                <div>
                  <button
                    className="font-semibold cursor-pointer focus:outline-none text-blue-400 hover:text-blue-600 flex items-center gap-1"
                    style={{ fontFamily: 'sans-serif', fontWeight: 500, fontSize: '0.93rem', background: 'none', border: 'none', padding: 0 }}
                    type="button"
                    onClick={() => {
                      const uidesingid = selectedPartner.designId || selectedPartner.id;
                      if (uidesingid) {
                        window.location.href = `/agent/edit-partner?id=${uidesingid}`;
                      }
                    }}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 5 15.4a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .38.15.74.41 1.01.26.27.62.41 1 .41.38 0 .74-.15 1.01-.41.27-.26.41-.62.41-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2z"/></svg>
                    Setting
                  </button>
                </div>
                <div>
                  <button
                    className="font-semibold cursor-pointer focus:outline-none text-red-600 hover:text-red-800 flex items-center gap-1"
                    style={{ fontFamily: 'sans-serif', fontWeight: 500, fontSize: '0.93rem', background: 'none', border: 'none', padding: 0 }}
                    type="button"
                    onClick={async () => {
                      try {
                        const dbInstance = getFirestore();
                        const userId = auth.currentUser?.uid;
                        const partnerId = selectedPartner.designId || selectedPartner.id;
                        if (!userId || !partnerId) {
                          toast.error('Missing user or partner ID');
                          return;
                        }
                        await import('firebase/firestore').then(({ deleteDoc, doc }) =>
                          deleteDoc(doc(dbInstance, `users/${userId}/uidesing/${partnerId}`))
                        );
                        setPartners((prev) => prev.filter((p) => (p.designId || p.id) !== partnerId));
                        setShowPartnerOverlay(false);
                        setSelectedPartner(null);
                        toast.success('Partner deleted');
                      } catch (err) {
                        toast.error('Failed to delete partner');
                      }
                    }}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 6v6m4-6v6"/></svg>
                    Delete Partner
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <main className="ml-56 flex-1 flex flex-col items-center justify-center py-16 px-4 relative z-10 font-sans" style={{ fontFamily: 'sans-serif' }}>
        {agentSections[selectedAgent]}
      </main>
    </div>
  );
}
