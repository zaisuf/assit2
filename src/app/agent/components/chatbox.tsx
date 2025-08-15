import React from "react";
import Image from "next/image";

interface ChatMainBox2Props {
  voiceLogo: string;
  boxShapeClass: string;
  chatboxSizeClass: string;
  onLogoClick?: () => void;
}

const ChatMainBox2: React.FC<ChatMainBox2Props> = ({
  voiceLogo,
  boxShapeClass,
  chatboxSizeClass,
  onLogoClick,
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center shadow-2xl border border-emerald-400 bg-white/10 ${boxShapeClass} ${chatboxSizeClass}`}
    >
      <Image
        src={voiceLogo}
        alt="Voice Chat Main Box 2"
        width={48}
        height={48}
        className="mt-4 mb-2 rounded-full border-2 border-emerald-400 bg-white/20 cursor-pointer"
        onClick={onLogoClick}
      />
      <span className="text-emerald-200 text-base font-bold mt-1">
        Voice Chat
      </span>
    </div>
  );
};

export default ChatMainBox2;
