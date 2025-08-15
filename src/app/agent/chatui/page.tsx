"use client";
import React from "react";
import AGSidebar from "../components/sidebar/botsidebar";

const CHAT_BG = "bg-gradient-to-br from-emerald-900 via-cyan-900 to-blue-900 min-h-screen w-full flex";

const ChatUIPage: React.FC = () => {
  // Sidebar state
  const [style1IconStyle, setStyle1IconStyle] = React.useState<string>("default");
  const [style1BtnTextColor, setStyle1BtnTextColor] = React.useState<string>("#ffffff");
  const [selectedChatbotLogo, setSelectedChatbotLogo] = React.useState<string>("/chatbot1.jpg");
  const [selectedVoiceLogo, setSelectedVoiceLogo] = React.useState<string>("/voicechat1.jpg");
  const [sidebarOverlay, setSidebarOverlay] = React.useState<string | null>(null);
  const [selectedWaveformVideo, setSelectedWaveformVideo] = React.useState<string>("/videos/r49.gif");
  const [style1BtnSize, setStyle1BtnSize] = React.useState<string>("Medium");
  const [style1BtnColor, setStyle1BtnColor] = React.useState<string>("#10b981");
  const [showLogoOverlay, setShowLogoOverlay] = React.useState<"chatbot" | "voice" | null>(null);

  // Dummy handler for chatbox UI
  const handleShowChatboxUI = () => {};

  return (
    <div className={CHAT_BG}>
      {/* Sidebar state and handlers */}
      <AGSidebar
        style1IconStyle={style1IconStyle}
        setStyle1IconStyle={setStyle1IconStyle}
        style1BtnTextColor={style1BtnTextColor}
        setStyle1BtnTextColor={setStyle1BtnTextColor}
        selectedChatbotLogo={selectedChatbotLogo}
        selectedVoiceLogo={selectedVoiceLogo}
        handleShowChatboxUI={handleShowChatboxUI}
        setShowLogoOverlay={setShowLogoOverlay}
        setSidebarOverlay={setSidebarOverlay}
        overlay={sidebarOverlay}
        selectedWaveformVideo={selectedWaveformVideo}
        setSelectedWaveformVideo={setSelectedWaveformVideo}
        style1BtnSize={style1BtnSize}
        setStyle1BtnSize={setStyle1BtnSize}
        style1BtnColor={style1BtnColor}
        setStyle1BtnColor={setStyle1BtnColor}
      />
      {/* Main chat UI content goes here */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Replace this with your chat messages, input bar, etc. */}
      </div>
    </div>
  );
};

export default ChatUIPage;
