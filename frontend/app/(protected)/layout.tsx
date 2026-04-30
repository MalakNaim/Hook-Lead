'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, clearTokens, getRefreshToken } from '@/lib/auth';
import { logout } from '@/services/authService';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    }
  }, [router]);

  async function handleSignOut() {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      // Best-effort server-side logout — clear tokens regardless of outcome.
      try {
        await logout(refreshToken);
      } catch {
        // Silently ignore — tokens are cleared below either way.
      }
    }
    clearTokens();
    router.replace('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link
            href="/leads"
            className="text-base font-semibold text-gray-900 hover:text-gray-700 transition-colors"
          >
            Hook Leads
          </Link>
          <nav className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/leads" className="hover:text-gray-900 transition-colors">
              Leads
            </Link>
            <button
              onClick={handleSignOut}
              className="hover:text-gray-900 transition-colors focus:outline-none"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-8">
        {children}
      </div>
    </div>
  );
}
