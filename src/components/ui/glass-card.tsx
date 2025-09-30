"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: "sm" | "md" | "lg"
  opacity?: "light" | "medium" | "heavy"
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, blur = "md", opacity = "medium", ...props }, ref) => {
    const getBlurValue = () => {
      switch (blur) {
        case "sm": return "backdrop-blur-sm"
        case "lg": return "backdrop-blur-lg"
        default: return "backdrop-blur-md"
      }
    }

    const getOpacityValue = () => {
      switch (opacity) {
        case "light": return "bg-white/10"
        case "heavy": return "bg-white/30"
        default: return "bg-white/20"
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-white/20",
          getBlurValue(),
          getOpacityValue(),
          "shadow-lg backdrop-saturate-200",
          "p-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
GlassCard.displayName = "GlassCard"

export { GlassCard, type GlassCardProps }
