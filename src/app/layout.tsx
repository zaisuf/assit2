import './globals.css'
import type { Metadata } from 'next'
import { Inter, Poppins, Space_Grotesk, Orbitron } from 'next/font/google'
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/theme-provider'
import CookieConsent from '@/components/CookieConsent'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space'
});
const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron'
});

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Assistlore",
  "url": "https://Assistlore.co",
  "logo": "https://Assistlore.co/logo.png",
  "image": "https://Assistlore.co/twitter-card.png",
  "description": "Assistlore create a modern look houses with AI ",
  "sameAs": [
    "https://twitter.com/Assistloree"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "url": "https://Assistlore.co/contact"
  }
};

export const metadata: Metadata = {
  metadataBase: new URL('https://Assistlore.co'),
  title: 'Rebuild home look with AI ',
  description: 'Create Beutifull house style with AI ',
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Create modern houses layout with AI',
    description: 'Create modern houses style with AI upload refrence image and let AI create stunnig home style quickly',
    type: 'website',
    url: 'https://Assistlore.co',
    images: [{
      url: 'https://modernhouese.co/twitter-card.png',
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Assistlore',
    creator: '@hasnain',
    title: 'Assistlore Create Foamous arch laytout wiht AI',
    description: 'Assistlore create modern style houses with AI ',
    images: ['https://Assistlore.co/twitter-card.png'],
  },
  icons: {
    icon: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
    shortcut: '/favicon/favicon-96x96.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} ${spaceGrotesk.variable} ${orbitron.variable}`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="White" enableSystem>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
          {children}
          <Toaster position="top-center" />
          <CookieConsent />
        </ThemeProvider>  
      </body>
    </html>
  )
}
