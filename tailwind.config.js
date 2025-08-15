/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'dark-lighter': '#1A1B2E',
        'dark': '#000000',
        'dark-light': '#151626',
        'secondary-cyan': '#67e8f9',
        'accent-gold': '#fbbf24',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 0.3 },
        },
        moveGradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'float-text': {
          '0%, 100%': { 
            transform: 'translateZ(50px) rotateX(10deg)',
            textShadow: '0 0 20px rgba(255,255,255,0.5)'
          },
          '50%': { 
            transform: 'translateZ(-50px) rotateX(-10deg)',
            textShadow: '0 0 40px rgba(255,255,255,0.8)'
          }
        },
        'float-particle': {
          '0%, 100%': { 
            transform: 'translateZ(0) scale(1)',
            opacity: 0.8
          },
          '50%': { 
            transform: 'translateZ(100px) scale(1.5)',
            opacity: 1
          }
        },
        'bubble-float': {
          '0%, 100%': { 
            transform: 'translate3d(0, 0, 0)',
            opacity: 0.8
          },
          '50%': { 
            transform: 'translate3d(0, -20px, 0)',
            opacity: 1
          }
        },
        'line-pulse': {
          '0%, 100%': { opacity: 0.1 },
          '50%': { opacity: 0.3 }
        },
        rotateGradient: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: 'float 3s ease-in-out infinite alternate',
        pulse: 'pulse 2s ease-in-out infinite',
        moveGradient: 'moveGradient 3s linear infinite',
        'float-text': 'float-text 6s ease-in-out infinite',
        'float-particle': 'float-particle 8s ease-in-out infinite',
        'bubble-float': 'bubble-float 3s ease-in-out infinite',
        'line-pulse': 'line-pulse 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'rotate-gradient': 'rotateGradient 4s linear infinite',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        montserrat: ['var(--font-montserrat)'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
        space: ['var(--font-space)', 'sans-serif'],
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}



