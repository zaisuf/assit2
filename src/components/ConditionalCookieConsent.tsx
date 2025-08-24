"use client";

import { usePathname } from 'next/navigation';
import CookieConsent from '@/components/CookieConsent';

/**
 * This component wraps the CookieConsent component and conditionally renders it.
 * It uses the `usePathname` hook to check the current URL.
 * If the URL path starts with '/UI/', it means we are on a public widget page,
 * and the cookie consent banner should not be displayed.
 * For all other pages, it renders the standard CookieConsent component.
 */
export default function ConditionalCookieConsent() {
  const pathname = usePathname();

  // Do not render the cookie consent on the public UI/widget pages
  if (!pathname || pathname.startsWith('/UI/')) {
    return null;
  }

  // Render the cookie consent for all other pages
  return <CookieConsent />;
}
