'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

export default function CookieConsent() {
    const [showConsent, setShowConsent] = useState(false)

    useEffect(() => {
        // Check if user has already consented
        const hasConsented = localStorage.getItem('cookieConsent')
        if (!hasConsented) {
            setShowConsent(true)
        }
    }, [])

    const acceptCookies = () => {
        localStorage.setItem('cookieConsent', 'true')
        setShowConsent(false)
    }

    const declineCookies = () => {
        localStorage.setItem('cookieConsent', 'false')
        setShowConsent(false)
    }

    if (!showConsent) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-gray-200 p-4 md:p-6 z-50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 text-sm text-gray-300">
                    <p>
                        We use cookies to enhance your browsing experience, serve personalized content, 
                        and analyze our traffic. By clicking Accept All, you consent to our use of cookies. 
                        <a href="/privacy-policy" className="text-blue-500 hover:text-blue-400 ml-1 underline">
                            Learn more
                        </a>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={declineCookies}
                        className="text-white border-gray-600 hover:bg-gray-800"
                    >
                        Decline
                    </Button>
                    <Button
                        onClick={acceptCookies}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Accept All
                    </Button>
                    <button
                        onClick={declineCookies}
                        className="text-gray-400 hover:text-gray-300"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
