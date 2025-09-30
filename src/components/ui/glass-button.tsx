"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      // primary uses the decorative layers for color; keep background transparent
      primary: "text-white",
      secondary: "text-white",
      ghost: "text-white/90"
    }

    const sizes = {
      sm: "h-8 px-8 text-sm rounded-[8px]",
      md: "h-9 px-10 text-base rounded-[10px]",
      lg: "h-10 px-12 text-lg rounded-[12px]"
    }

    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center overflow-visible",
          "backdrop-blur-[12px] backdrop-saturate-[1.8]",
          "transition-all duration-300 ease-out",
          "disabled:opacity-50 disabled:pointer-events-none",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
          "hover:scale-[1.02] active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {/* Main glass panel with strong blur and slight transparency */}
        <span 
          className="absolute inset-0 rounded-[10px] pointer-events-none"
          style={{
            background: 'linear-gradient(165deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.02) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        />

        {/* Outer glass rim - creates that thick edge look */}
        <span className="absolute -inset-[0.5px] rounded-[10px] pointer-events-none border-[1.5px] border-white/20" />
        
        {/* Inner glass rim - double border effect */}
        <span className="absolute inset-0 rounded-[10px] pointer-events-none border border-white/10" />

        {/* Subtle inner lighting from top */}
        <span 
          className="absolute inset-0 rounded-[10px] pointer-events-none opacity-50"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, transparent 50%)',
          }}
        />

        {/* Hover highlight effect */}
        <span
          className="absolute -inset-[0.5px] rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(165deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 100%)',
          }}
        />

        {/* content (kept above decorative layers) */}
        <span className="relative z-10 flex items-center gap-3 select-none pr-2 pl-2">
          {children}
        </span>
      </button>
    )
  }
)
GlassButton.displayName = "GlassButton"

export { GlassButton, type GlassButtonProps }
