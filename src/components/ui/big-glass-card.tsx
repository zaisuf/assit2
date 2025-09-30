"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface BigGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: "sm" | "md" | "lg"
  opacity?: "light" | "medium" | "heavy"
  gradient?: boolean
  /** Render the component as a small pill/button style like the provided image */
  mode?: "panel" | "button"
  /** optional left icon for button mode */
  icon?: React.ReactNode
}

const BigGlassCard = React.forwardRef<any, BigGlassCardProps>(
  ({ className, children, blur = "md", opacity = "medium", gradient = false, mode = "panel", icon, ...props }, ref) => {
    // separate props for div vs button to avoid incompatible DOM attribute types
    const divProps = props as React.HTMLAttributes<HTMLDivElement>
    const btnProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>
    const getBlurValue = () => {
      switch (blur) {
        case "sm": return "backdrop-blur-sm"
        case "lg": return "backdrop-blur-lg"
        default: return "backdrop-blur-md"
      }
    }
    const getOpacityValue = () => {
      // Very subtle base tint to keep it nearly transparent (water-like)
      switch (opacity) {
        case "light": return "bg-[rgba(255,255,255,0.01)]"
        case "heavy": return "bg-[rgba(255,255,255,0.03)]"
        default: return "bg-[rgba(255,255,255,0.02)]"
      }
    }

    // If button mode requested, render a pill-shaped clickable element matching the image
    if (mode === "button") {
      return (
        <button
          ref={ref}
          type="button"
          className={cn(
            "relative inline-flex items-center justify-center overflow-visible",
            "backdrop-blur-[12px] backdrop-saturate-[1.8]",
            "disabled:opacity-50 disabled:pointer-events-none",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
            "text-white rounded-[10px] px-10 h-12",
            className
          )}
          {...(btnProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
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



          {/* left icon slot */}
          {icon && (
            <span className="relative z-10 flex items-center justify-center w-8 h-8">
              {icon}
            </span>
          )}

          <span className="relative z-10 flex items-center gap-3 select-none">{children}</span>
        </button>
      )
    }

    // default panel rendering
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-visible",
          "backdrop-blur-[12px] backdrop-saturate-[1.8]",
          "rounded-[10px]",
          "p-8 min-h-[400px]",
          className
        )}
        {...(divProps as React.HTMLAttributes<HTMLDivElement>)}
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



        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }
)
BigGlassCard.displayName = "BigGlassCard"

export { BigGlassCard, type BigGlassCardProps }
