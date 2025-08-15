"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import VoiceBotBox, { VoiceBotBox1, VoiceCallContainer } from "../components/voicecall";
import { db } from "@/app/api/firebase/firebase";
import CustomSidebar from "@/components/sidebar/CustomSidebar";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import { FaEdit } from "react-icons/fa";
import AGSidebar from "../components/sidebar/wedsidebar";
import VoiceSidebar from "../components/sidebar/voicesidebar";
import Wedget from "../components/wedget";

const SHAPE_OPTIONS = [
	{ label: "Rounded", value: "rounded-2xl" },
	{ label: "Square", value: "rounded-none" },
	{ label: "Pill", value: "rounded-full" },
	{ label: "Circle", value: "rounded-full" },
	{ label: "Dashed", value: "rounded-lg border-dashed" },
	{ label: "Double Border", value: "rounded-xl border-4 border-double" },
	{ label: "Shadow", value: "rounded-xl shadow-lg" },
	{ label: "Outline", value: "rounded-xl border-2 border-emerald-400" },
];

// Add style options for Style Overlay
// Remove global handler, will use prop instead
// Will inject open handler later
let injectedOpenVoiceBotBox: (() => void) | null = null;
const STYLE_OPTIONS = [
	{
		name: "Style 1",
		render: (
			inputBarStyle: number = 0,
			inputBarColor?: string,
			inputBarPlaceholder: string = "Type a message...",
			sizeClass: string = "w-[200px] h-[56px]"
		) => {
			const colorStyle = inputBarColor ? { background: inputBarColor } : {};
			let iconSize = "w-8 h-8";
			if (sizeClass.includes("w-[250px]")) iconSize = "w-12 h-12";
			else if (sizeClass.includes("w-[230px]")) iconSize = "w-10 h-10";
			else if (sizeClass.includes("w-[200px]")) iconSize = "w-8 h-8";
			const styles = [
				// 1. Minimal rounded
				<input key="1" className="flex-1 px-2 py-1 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 2. Underline only
				<input key="2" className="flex-1 px-2 py-1 border-b-2 border-emerald-400 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 3. Filled, pill
				<input key="3" className="flex-1 px-3 py-1 rounded-full bg-emerald-900/30 border-none text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 4. Shadowed
				<input key="4" className="flex-1 px-2 py-1 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm shadow-lg" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 5. Square
				<input key="5" className="flex-1 px-2 py-1 rounded-none bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 6. Double border
				<input key="6" className="flex-1 px-2 py-1 rounded-xl border-4 border-double border-emerald-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 7. Dashed border
				<input key="7" className="flex-1 px-2 py-1 rounded-lg border-2 border-dashed border-emerald-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 8. Outline
				<input key="8" className="flex-1 px-2 py-1 rounded-xl border-2 border-emerald-400 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 9. Shadowed square
				<input key="9" className="flex-1 px-2 py-1 rounded-none bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm shadow-lg" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 10. Pill, shadow, border
				<input key="10" className="flex-1 px-3 py-1 rounded-full bg-white/10 border-2 border-emerald-400 text-white placeholder:text-white/40 focus:outline-none text-sm shadow" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 11. Circle input
				<input key="11" className="flex-1 px-2 py-1 rounded-full border-4 border-blue-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 12. Minimal, no border
				<input key="12" className="flex-1 px-2 py-1 rounded bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 13. Glassmorphism
				<input key="13" className="flex-1 px-2 py-1 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder:text-white/40 focus:outline-none text-sm shadow" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 14. Gradient border
				<input key="14" className="flex-1 px-2 py-1 rounded-xl border-2 border-transparent bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #10b981, #3b82f6)', backgroundClip: 'padding-box, border-box', backgroundOrigin: 'padding-box, border-box', ...colorStyle }} />,
				// 15. Inset shadow
				<input key="15" className="flex-1 px-2 py-1 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm shadow-inner" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 16. Large pill
				<input key="16" className="flex-1 px-4 py-2 rounded-full bg-emerald-900/30 border-2 border-emerald-400 text-white placeholder:text-white/40 focus:outline-none text-base" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 17. Underline, shadow
				<input key="17" className="flex-1 px-2 py-1 border-b-2 border-blue-400 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm shadow" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 18. Square, thick border
				<input key="18" className="flex-1 px-2 py-1 rounded-none border-4 border-emerald-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 19. Pill, dashed border
				<input key="19" className="flex-1 px-3 py-1 rounded-full border-2 border-dashed border-blue-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
				// 20. Shadowed, outline
				<input key="20" className="flex-1 px-2 py-1 rounded-xl border-2 border-emerald-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm shadow-lg" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
			];
			return (
				<div className="flex items-center w-full gap-2">
					{styles[inputBarStyle]}
					<img
						src="/voicechat1.jpg"
						alt="Voice Agent"
						className={`${iconSize} rounded-full border-2 border-emerald-400 cursor-pointer`}
						onClick={() => { if (injectedOpenVoiceBotBox) injectedOpenVoiceBotBox(); }}
					/>
				</div>
			);
		},
	},
	{
		name: "Style 2",
		render: (
	sizeClass: string = "w-[200px] h-[56px]",
	btnColor?: string,
	btnTextColor?: string,
	btnShape?: string
  ) => {
	  let iconSize = "w-8 h-8";
	  let btnSize = "px-4 py-2 text-base";
	  if (sizeClass.includes("w-[250px]")) { iconSize = "w-12 h-12"; btnSize = "px-6 py-3 text-xl"; }
	  else if (sizeClass.includes("w-[230px]")) { iconSize = "w-10 h-10"; btnSize = "px-5 py-2.5 text-lg"; }
	  else if (sizeClass.includes("w-[200px]")) { iconSize = "w-8 h-8"; btnSize = "px-3 py-1.5 text-sm"; } // reduced for small
	  const buttonStyle = btnColor ? { background: btnColor } : {};
	  const textStyle = btnTextColor ? { color: btnTextColor } : {};
	  const shapeClass = btnShape || "rounded-full";
			return (
				<div className="flex items-center w-full justify-between gap-2">
					<button className={`${shapeClass} shadow ${btnSize} flex items-center gap-2`} style={{ ...buttonStyle, ...textStyle }} onClick={() => { if (injectedOpenVoiceBotBox) injectedOpenVoiceBotBox(); }}>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
				  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18c2.21 0 4-1.79 4-4V7a4 4 0 10-8 0v7c0 2.21 1.79 4 4 4zm0 0v2m-4 0h8" />
				</svg>
				Voice chat
				</button>
				<img
					src="/chatbot1.jpg"
					alt="Chatbot"
					className={`${iconSize} rounded-full border-2 border-blue-400`}
				/>
				</div>
			);
		},
	},
	{
		name: "Style 3",
		render: (
	sizeClass: string = "w-[200px] h-[56px]",
	btnColor?: string,
	btnTextColor?: string,
	btnShape?: string
  ) => {
	  let iconSize = "w-8 h-8";
	  let btnSize = "px-4 py-2 text-base";
	  if (sizeClass.includes("w-[250px]")) { iconSize = "w-12 h-12"; btnSize = "px-6 py-3 text-xl"; }
	  else if (sizeClass.includes("w-[230px]")) { iconSize = "w-10 h-10"; btnSize = "px-5 py-2.5 text-lg"; }
	  else if (sizeClass.includes("w-[200px]")) { iconSize = "w-8 h-8"; btnSize = "px-3 py-1.5 text-sm"; } // reduced for small
	  const buttonStyle = btnColor ? { background: btnColor } : {};
	  const textStyle = btnTextColor ? { color: btnTextColor } : {};
	  const shapeClass = btnShape || "rounded-full";
			return (
				<div className="flex items-center w-full justify-between gap-2">
				  <img
						src="/chatbot1.jpg"
						alt="Chatbot"
						className={`${iconSize} rounded-full border-2 border-blue-400`}
				  />
				  <button className={`${shapeClass} shadow ${btnSize} flex items-center gap-2`} style={{ ...buttonStyle, ...textStyle }} onClick={() => { if (injectedOpenVoiceBotBox) injectedOpenVoiceBotBox(); }}>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
				  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18c2.21 0 4-1.79 4-4V7a4 4 0 10-8 0v7c0 2.21 1.79 4 4 4zm0 0v2m-4 0h8" />
				</svg>
				Voice chat
				  </button>
				</div>
			  );
		},
	  },
			   {
				   name: "Style 4",
				   render: (
					 sizeClass = "w-[200px] h-[56px]"
				   ) => {
					 let iconSize = "w-8 h-8";
					 if (sizeClass.includes("w-[250px]")) iconSize = "w-12 h-12";
					 else if (sizeClass.includes("w-[230px]")) iconSize = "w-10 h-10";
					 else if (sizeClass.includes("w-[200px]")) iconSize = "w-8 h-8";
					 return (
					   <div className="flex items-center w-full justify-center gap-4">
						 <img
						   src="/chatbot1.jpg"
						   alt="Chatbot Logo"
						   className={`${iconSize} rounded-full border-2 border-blue-400`}
						 />
						 <img
						   src="/voicechat1.jpg"
						   alt="Voice Chat Logo"
						   className={`${iconSize} rounded-full border-2 border-emerald-400`}
						 />
					   </div>
					 );
				   },
			   },
	{
		name: "Style 5",
		render: () => (
			<div className="flex flex-col items-center w-full">
				<span className="text-white/80">Style 5 Example</span>
			</div>
		),
	},
];


import DottedGrid from "@/components/dottedgrid";

const AwedgetUI1: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
	if (typeof window !== "undefined") {
	  const params = new URLSearchParams(window.location.search);
	  const uiId = params.get("uiId");
	  if (!uiId) {
		router.replace("/");
	  }
	}
  }, []);
  // Get uiId from query string
  const [uiId, setUiId] = useState<string | null>(null);
  useEffect(() => {
	if (typeof window !== "undefined") {
	  const params = new URLSearchParams(window.location.search);
	  const id = params.get("uiId");
	  if (id) setUiId(id);
	}
  }, []);
  const [showCustomSidebar, setShowCustomSidebar] = useState(false);
  
  // Add state for Button Custom Text Color (Style 1) for VoiceSidebar
  const [voiceSidebarBtnTextColor, setVoiceSidebarBtnTextColor] = useState<string>("#fff");
  // Add state for Button Size (Style 1) for VoiceSidebar
  const [voiceSidebarBtnSize, setVoiceSidebarBtnSize] = useState<string>("Medium");
  // Add state for Button Custom Color (Style 1) for VoiceSidebar
  const [voiceSidebarBtnColor, setVoiceSidebarBtnColor] = useState<string>("#10b981");
  // State for showing VoiceBotBox
  const [showVoiceBotBox, setShowVoiceBotBox] = useState(false);
  // State for selected waveform video animation
  const [selectedWaveformVideo, setSelectedWaveformVideo] = useState("/bubble3.mp4");
  // Inject the handler for use in STYLE_OPTIONS
  injectedOpenVoiceBotBox = () => setShowVoiceBotBox(true);
  const [sidebarOverlay, setSidebarOverlay] = useState<string | null>(null);
  const [voiceSidebarOverlay, setVoiceSidebarOverlay] = useState<string | null>(null);
  const [selectedChatbotLogo, setSelectedChatbotLogo] = useState("/chatbot1.jpg");
  const [selectedVoiceBotLogo, setSelectedVoiceBotLogo] = useState("/voicechat1.jpg");
  const [wedgetBoxSize, setWedgetBoxSize] = useState("w-[200px] h-[56px]"); // Set Small as default
  // New: state for voice chat button size (for Style 2/3) - now controlled independently
  const [style2BtnSizeClass, setStyle2BtnSizeClass] = useState("px-3 py-1.5 text-sm");
  const [selectedShape, setSelectedShape] = useState(SHAPE_OPTIONS[0].value);
  const [customBgColor, setCustomBgColor] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState(STYLE_OPTIONS[0]);
  const [inputBarStyle, setInputBarStyle] = useState(0); // Track input bar style for Style 1
  const [inputBarColor, setInputBarColor] = useState<string>("");
  const [inputBarPlaceholder, setInputBarPlaceholder] = useState<string>("Type a message...");
  // Add state for Style 2 button and text color
  const [style2BtnColor, setStyle2BtnColor] = useState<string>("#10b981"); // emerald-500 default
  const [style2BtnTextColor, setStyle2BtnTextColor] = useState<string>("#fff");
  // Add state for custom input border line color
  const [inputBorderLineColor, setInputBorderLineColor] = useState<string>("#10b981");
  // Add state for Style 2 button shape
  const [style2BtnShape, setStyle2BtnShape] = useState<string>("rounded-full"); // default to rounded-full
  // Add state for logo shape
  const [logoShape, setLogoShape] = useState<string>("rounded-full");
	// Style 1 icon style state for VoiceSidebar disconnect button
	const [style1IconStyle, setStyle1IconStyle] = useState<string>("minimix1");
	// Minimize icon style state for VoiceSidebar and VoiceBotBox header
	const [minimizeBtnIconStyle, setMinimizeBtnIconStyle] = useState<string>("minimix1");

  // Save widget and voice bot box design to Firestore
  // Auto-detect userId and designId (ui232-3 style):
  const saveWedgetDesign = async () => {
	// TODO: Replace with actual user id from auth if available
	const userId = "test-user-id";
	// Use uiId from query string if present, otherwise fallback
	const designId = uiId || userId;
	try {
	  // Read existing document first to preserve chatbotui design data
	  const docRef = doc(db, `users/${userId}/uidesing/${designId}`);
	  let existingData = {};
	  try {
		const snap = await import("firebase/firestore").then(firestore => firestore.getDoc(docRef));
		if (snap && snap.exists()) {
		  existingData = snap.data();
		}
	  } catch (e) {
		// If not found, just use empty
	  }

	  // Overwrite wedgetBox with only the selected style's fields (remove all others)
	  let newWedgetBox: any = {};
	  if (selectedStyle.name === "Style 1") {
		newWedgetBox = {
		  selectedVoiceBotLogo,
		  wedgetBoxSize,
		  selectedShape,
		  customBgColor,
		  selectedStyle: selectedStyle.name,
		  logoShape,
		  inputBarStyle,
		  inputBarColor,
		  inputBarPlaceholder,
		  inputBorderLineColor,
		  style5LogoSize,
		  hideBg,
		};
	  } else if (selectedStyle.name === "Style 2") {
		newWedgetBox = {
		  selectedChatbotLogo,
		  wedgetBoxSize,
		  selectedShape,
		  customBgColor,
		  selectedStyle: selectedStyle.name,
		  logoShape,
		  style2BtnColor,
		  style2BtnTextColor,
		  style2BtnShape,
		  style2BtnSizeClass,
		  style5LogoSize,
		  style5MicIconStyle,
		  style5BotIconColor,
		};
	  } else if (selectedStyle.name === "Style 3") {
		newWedgetBox = {
		  selectedChatbotLogo,
		  wedgetBoxSize,
		  selectedShape,
		  customBgColor,
		  selectedStyle: selectedStyle.name,
		  logoShape,
		  style2BtnColor,
		  style2BtnTextColor,
		  style2BtnShape,
		  style2BtnSizeClass,
		  style5LogoSize,
		  style5MicIconStyle,
		  style5BotIconColor,
		};
	  } else if (selectedStyle.name === "Style 4") {
		newWedgetBox = {
		  selectedChatbotLogo,
		  selectedVoiceBotLogo,
		  wedgetBoxSize,
		  selectedShape,
		  customBgColor,
		  selectedStyle: selectedStyle.name,
		  logoShape,
		  style5LogoSize,
		};
	  } else if (selectedStyle.name === "Style 5") {
		newWedgetBox = {
		  wedgetBoxSize,
		  selectedShape,
		  customBgColor,
		  selectedStyle: selectedStyle.name,
		  style5MicIconStyle,
		  style5BotIconStyle,
		  style5BotIconColor,
		  style5IconSize: style5IconSize,
		};
	  }

	  // Remove wedgetBox field first
	  const { deleteField } = await import("firebase/firestore");
	  await setDoc(docRef, { wedgetBox: deleteField() }, { merge: true });
	  // Now save new wedgetBox and other fields
	  const designData = {
		...existingData,
		wedgetBox: newWedgetBox,
		voiceBotBox: {
		  sizeClass: wedgetBoxSize,
		  shapeClass: selectedShape,
		  customBgColor,
		  videoSrc: selectedWaveformVideo,
		  disconnectBtnSize: voiceSidebarBtnSize,
		  disconnectBtnColor: voiceSidebarBtnColor,
		  disconnectBtnTextColor: voiceSidebarBtnTextColor,
		  disconnectBtnIconStyle: style1IconStyle,
		},
		voiceBotBox1: {
		  sizeClass: "w-[110px] h-[56px]",
		  shapeClass: selectedShape,
		  customBgColor,
		  videoSrc: selectedWaveformVideo,
		},
		savedAt: new Date().toISOString(),
	  };
	  await setDoc(docRef, designData, { merge: true });
	  alert("Widget/VoiceBot design saved! Only selected style fields are kept in wedgetBox.");
	} catch (e) {
	  alert("Failed to save design: " + e);
	}
  };
  const [style5MicIconStyle, setStyle5MicIconStyle] = useState<string>("default");
  const [style5BotIconStyle, setStyle5BotIconStyle] = useState<string>("default");
  const [style5LogoSize, setStyle5LogoSize] = useState<string>("w-8 h-8");
  // Style 5 icon size (for mic/bot icons)
  const [style5IconSize, setStyle5IconSize] = useState<string>("w-8 h-8");
  // Style 5 bot icon color
  const [style5BotIconColor, setStyle5BotIconColor] = useState<string>("#3b82f6");
  // Add state for hiding/minimizing background
  const [hideBg, setHideBg] = useState<boolean>(false);

  // Sync with localStorage (for live update from sidebar)
  useEffect(() => {
	const updateHideBg = () => {
	  if (typeof window !== 'undefined' && window.localStorage) {
		setHideBg(localStorage.getItem('wedgetHideBg') === '1');
	  }
	};
	updateHideBg();
	window.addEventListener('storage', updateHideBg);
	return () => window.removeEventListener('storage', updateHideBg);
  }, []);

	const handleShowChatboxUI = () => {};

	// Helper to get current size for style render
	const getCurrentSize = () => wedgetBoxSize || "w-[200px] h-[56px]";

  const [activeSidebar, setActiveSidebar] = useState<'chat' | 'voice'>('chat');

  return (
	<>
	  {/* Always show DottedGrid as fixed background */}
	  <DottedGrid />
	  {showCustomSidebar && <CustomSidebar />}
	  {/* Background media: use <img> for GIF, <video> for video */}
	  <div className="fixed inset-0 -z-20 w-full h-full overflow-hidden pointer-events-none">
		{/* If you want to show a video or image background, add it here, but DottedGrid will always be visible */}
		{/* Example: <video ... /> or <img ... /> */}
	  </div>
	{/* Main content without navigation bar */}
	<div className="min-h-screen w-full bg-gradient-to-r from-black via-blue-950 to-gray-900 overflow-hidden">
	<div className="relative w-full flex flex-row items-center justify-start mt-16">
	<button onClick={saveWedgetDesign} className="fixed left-32 bottom-4 z-10 px-4 py-2 bg-emerald-600 text-white rounded shadow">Save</button>
  <AGSidebar
	selectedChatbotLogo={selectedChatbotLogo}
	setSelectedChatbotLogo={setSelectedChatbotLogo}
	selectedVoiceBotLogo={selectedVoiceBotLogo}
	setSelectedVoiceBotLogo={setSelectedVoiceBotLogo}
	handleShowChatboxUI={handleShowChatboxUI}
	setShowLogoOverlay={() => {}}
	setSidebarOverlay={(label) => {
	  setSidebarOverlay(label);
	  setVoiceSidebarOverlay(null); // Always close voicesidebar overlay when wedsidebar overlay changes
	}}
	onSizeSelect={size => {
	  setWedgetBoxSize(size);
	  if (size.includes("w-[250px]")) setStyle2BtnSizeClass("px-6 py-3 text-xl");
	  else if (size.includes("w-[230px]")) setStyle2BtnSizeClass("px-5 py-2.5 text-lg");
	  else if (size.includes("w-[200px]")) setStyle2BtnSizeClass("px-3 py-1.5 text-sm");
	  else setStyle2BtnSizeClass("px-3 py-1.5 text-sm");
	}}
	selectedSize={sidebarOverlay === "Size" ? wedgetBoxSize : undefined}
	onShapeSelect={setSelectedShape}
	selectedShape={selectedShape}
	onBgColorChange={setCustomBgColor}
	customBgColor={customBgColor}
	onStyleSelect={name => setSelectedStyle(STYLE_OPTIONS.find(s => s.name === name) || STYLE_OPTIONS[0])}
	selectedStyle={selectedStyle.name}
	inputBarStyle={inputBarStyle}
	setInputBarStyle={setInputBarStyle}
	inputBarColor={inputBarColor}
	setInputBarColor={setInputBarColor}
	inputBarPlaceholder={inputBarPlaceholder}
	setInputBarPlaceholder={setInputBarPlaceholder}
	inputBorderLineColor={inputBorderLineColor}
	setInputBorderLineColor={setInputBorderLineColor}
	style2BtnColor={style2BtnColor}
	setStyle2BtnColor={setStyle2BtnColor}
	style2BtnTextColor={style2BtnTextColor}
	setStyle2BtnTextColor={setStyle2BtnTextColor}
	style2BtnShape={style2BtnShape}
	setStyle2BtnShape={setStyle2BtnShape}
	logoShape={logoShape}
	setLogoShape={setLogoShape}
	style2BtnSizeClass={style2BtnSizeClass}
	setStyle2BtnSizeClass={setStyle2BtnSizeClass}
	style5MicIconStyle={style5MicIconStyle}
	setStyle5MicIconStyle={setStyle5MicIconStyle}
	style5BotIconStyle={style5BotIconStyle}
	setStyle5BotIconStyle={setStyle5BotIconStyle}
	style5LogoSize={style5LogoSize}
	setStyle5LogoSize={setStyle5LogoSize}
	style5IconSize={style5IconSize}
	setStyle5IconSize={setStyle5IconSize}
	style5BotIconColor={style5BotIconColor}
	setStyle5BotIconColor={setStyle5BotIconColor}
	hideOverlays={!!voiceSidebarOverlay}
	closeVoiceSidebarOverlay={() => setVoiceSidebarOverlay(null)}
  />
  {!(sidebarOverlay || voiceSidebarOverlay) && (
	<button 
	  className={`fixed top-80 z-50 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors ${
		showCustomSidebar ? 'left-60' : 'left-32'
	  }`}
	  onClick={() => setShowCustomSidebar(!showCustomSidebar)}
	>
	  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4L6 20" />
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8h8M12 12h8M12 16h8" />
	  </svg>
	</button>
  )}
	<VoiceSidebar
		style1IconStyle={style1IconStyle}
		setStyle1IconStyle={setStyle1IconStyle}
		minimizeBtnIconStyle={minimizeBtnIconStyle}
		setMinimizeBtnIconStyle={setMinimizeBtnIconStyle}
		style1BtnTextColor={voiceSidebarBtnTextColor}
		setStyle1BtnTextColor={setVoiceSidebarBtnTextColor}
		selectedChatbotLogo={selectedChatbotLogo}
		selectedVoiceLogo={selectedVoiceBotLogo}
		handleShowChatboxUI={handleShowChatboxUI}
		setShowLogoOverlay={() => {}}
		setSidebarOverlay={(label) => {
			setVoiceSidebarOverlay(label);
			setSidebarOverlay(null); // Always close wedsidebar overlay when voicesidebar overlay changes
		}}
		overlay={voiceSidebarOverlay}
		selectedWaveformVideo={selectedWaveformVideo}
		setSelectedWaveformVideo={setSelectedWaveformVideo}
		style1BtnSize={voiceSidebarBtnSize}
		setStyle1BtnSize={setVoiceSidebarBtnSize}
		style1BtnColor={voiceSidebarBtnColor}
		setStyle1BtnColor={setVoiceSidebarBtnColor}
	/>
		{/* Show Wedget box in bottom right corner, but hide if voicebot box is open */}
		{!showVoiceBotBox && (
		  <div className="fixed bottom-8 right-8 z-10">
			<Wedget
			  boxShapeClass={selectedShape}
			  chatboxSizeClass={wedgetBoxSize}
			  style={hideBg ? { background: 'transparent', border: 'none', boxShadow: 'none' } : (customBgColor ? { background: customBgColor } : undefined)}
			  selectedStyle={selectedStyle}
			  inputBarStyle={inputBarStyle}
			  inputBarColor={inputBarColor}
			  inputBarPlaceholder={inputBarPlaceholder}
			  inputBorderLineColor={inputBorderLineColor}
			  style2BtnColor={style2BtnColor}
			  style2BtnTextColor={style2BtnTextColor}
			  style2BtnShape={style2BtnShape}
			  logoShape={logoShape}
			  style5MicIconStyle={style5MicIconStyle}
			  style5BotIconStyle={style5BotIconStyle}
			  style5BotIconColor={style5BotIconColor}
			  style5LogoSize={style5LogoSize}
			  logoSizeClass={selectedStyle.name === "Style 5" ? style5IconSize : style5LogoSize}
			  chatbotLogo={selectedChatbotLogo}
			  voiceBotLogo={selectedVoiceBotLogo}
			  voiceBtnSizeClass={style2BtnSizeClass}
			  onOpenVoiceBotBox={() => setShowVoiceBotBox(true)}
			/>
		  </div>
		)}
	  </div>
	  {/* Render VoiceBotBox if showVoiceBotBox is true */}
	{showVoiceBotBox && (
		<VoiceCallContainer
			sizeClass={wedgetBoxSize}
			shapeClass={selectedShape}
			customBgColor={customBgColor}
			videoSrc={selectedWaveformVideo}
			disconnectBtnSize={voiceSidebarBtnSize}
			disconnectBtnColor={voiceSidebarBtnColor}
			disconnectBtnTextColor={voiceSidebarBtnTextColor}
			disconnectBtnIconStyle={style1IconStyle}
			minimizeBtnIconStyle={minimizeBtnIconStyle}
		/>
	)}
	  </div>
	</>
  );
};

export default AwedgetUI1;
