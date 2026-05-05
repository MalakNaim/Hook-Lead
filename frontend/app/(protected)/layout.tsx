'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, clearTokens, getRefreshToken } from '@/lib/auth';
import { logout } from '@/services/authService';
import { useLocale } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// ── Icons ──────────────────────────────────────────────────────────────────────

function IconDashboard() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconLeads() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.477-3.765M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a4 4 0 015.477-3.765M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconImport() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function IconOutreach() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IconIcp() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4" strokeLinecap="round" />
      <path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2" />
    </svg>
  );
}

function IconScoring() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function IconWorkspace() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconSignOut() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ── Page title helper ──────────────────────────────────────────────────────────

function getPageTitle(pathname: string, t: (key: string) => string): string {
  if (pathname.startsWith('/dashboard/leads/')) return t('layout.pageTitles.leadDetail');
  const map: Record<string, string> = {
    '/dashboard':            t('layout.pageTitles.dashboard'),
    '/dashboard/leads':      t('layout.pageTitles.leads'),
    '/dashboard/import':     t('layout.pageTitles.import'),
    '/dashboard/outreach':   t('layout.pageTitles.outreach'),
    '/dashboard/icp':        t('layout.pageTitles.icp'),
    '/dashboard/scoring':    t('layout.pageTitles.scoring'),
    '/dashboard/workspace':  t('layout.pageTitles.workspace'),
    '/dashboard/settings':   t('layout.pageTitles.settings'),
  };
  return map[pathname] ?? 'Hook Leads';
}

// ── NavSection ─────────────────────────────────────────────────────────────────

function NavSection({ label }: { label: string }) {
  return (
    <p className="px-2.5 pb-1 pt-5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
      {label}
    </p>
  );
}

// ── NavItem ────────────────────────────────────────────────────────────────────

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  soon?: boolean;
}

function NavItem({ href, icon, children, onClick, soon }: NavItemProps) {
  const pathname = usePathname();
  const { t } = useLocale();
  const isActive =
    pathname === href ||
    (href !== '/dashboard' && href.length > 1 && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-gray-900 text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <span className={`shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`}>{icon}</span>
      <span className="flex-1 leading-none">{children}</span>
      {soon && !isActive && (
        <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium leading-none text-gray-400">
          {t('nav.soonBadge')}
        </span>
      )}
    </Link>
  );
}

// ── Layout ─────────────────────────────────────────────────────────────────────

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { t, dir } = useLocale();
  const isRtl = dir === 'rtl';
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    }
  }, [router]);

  async function handleSignOut() {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await logout(refreshToken);
      } catch {
        // Silently ignore — tokens are cleared below either way.
      }
    }
    clearTokens();
    router.replace('/login');
  }

  const closeMobile = () => setMobileOpen(false);
  const pageTitle = getPageTitle(pathname, t);

  // First letter of admin name for avatar
  const adminInitial = t('layout.admin').charAt(0).toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 z-30 flex w-60 flex-col border-gray-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isRtl
            ? `right-0 border-l ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`
            : `left-0 border-r ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`
        }`}
      >
        {/* Brand / workspace */}
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-gray-100 px-4">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-900">
            <span className="text-xs font-bold tracking-tight text-white">{t('common.brand')}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">{t('layout.brand')}</p>
            <p className="truncate text-[11px] leading-none text-gray-400">{t('layout.myWorkspace')}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <NavSection label={t('nav.sections.main')} />
          <div className="space-y-0.5">
            <NavItem href="/dashboard" icon={<IconDashboard />} onClick={closeMobile}>
              {t('nav.items.dashboard')}
            </NavItem>
            <NavItem href="/dashboard/leads" icon={<IconLeads />} onClick={closeMobile}>
              {t('nav.items.leads')}
            </NavItem>
          </div>

          <NavSection label={t('nav.sections.pipeline')} />
          <div className="space-y-0.5">
            <NavItem href="/dashboard/import" icon={<IconImport />} onClick={closeMobile} soon>
              {t('nav.items.import')}
            </NavItem>
            <NavItem href="/dashboard/outreach" icon={<IconOutreach />} onClick={closeMobile}>
              {t('nav.items.outreach')}
            </NavItem>
          </div>

          <NavSection label={t('nav.sections.intelligence')} />
          <div className="space-y-0.5">
            <NavItem href="/dashboard/icp" icon={<IconIcp />} onClick={closeMobile}>
              {t('nav.items.icp')}
            </NavItem>
            <NavItem href="/dashboard/scoring" icon={<IconScoring />} onClick={closeMobile} soon>
              {t('nav.items.scoring')}
            </NavItem>
          </div>

          <NavSection label={t('nav.sections.account')} />
          <div className="space-y-0.5">
            <NavItem href="/dashboard/workspace" icon={<IconWorkspace />} onClick={closeMobile} soon>
              {t('nav.items.workspace')}
            </NavItem>
            <NavItem href="/dashboard/settings" icon={<IconSettings />} onClick={closeMobile}>
              {t('nav.items.settings')}
            </NavItem>
          </div>
        </nav>

        {/* User footer */}
        <div className="shrink-0 border-t border-gray-100 p-3 space-y-0.5">
          <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
              {adminInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{t('layout.admin')}</p>
              <p className="truncate text-[11px] leading-none text-gray-400">{t('layout.myWorkspace')}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <span className="shrink-0 text-gray-400">
              <IconSignOut />
            </span>
            {t('layout.signOut')}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none lg:hidden"
              aria-label={mobileOpen ? t('layout.closeNav') : t('layout.openNav')}
            >
              {mobileOpen ? <IconClose /> : <IconMenu />}
            </button>
            <span className="text-sm font-semibold text-gray-900">{pageTitle}</span>
          </div>

          {/* Right side: workspace status pill + language switcher */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 lg:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              {t('layout.activeWorkspace')}
            </div>
            <LanguageSwitcher />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
