'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ICPProfile } from '@/types';
import { ICPFormPanel, type PanelMode } from '@/components/icp/ICPFormPanel';
import { useLocale } from '@/lib/i18n';
import {
  getCurrentIcpProfile,
  createIcpProfile,
  updateIcpProfile,
} from '@/services/icpProfilesService';

// ── Toast ──────────────────────────────────────────────────────────────────────

function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'error' }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm text-white shadow-xl ${
        type === 'error' ? 'bg-red-600' : 'bg-slate-900'
      }`}
    >
      {type === 'success' ? (
        <svg className="h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-4 w-4 shrink-0 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {message}
    </div>
  );
}

// ── Profile Summary Card ───────────────────────────────────────────────────────

function TagPill({ text, color = 'bg-indigo-50 text-indigo-700' }: { text: string; color?: string }) {
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>{text}</span>;
}

function ProfileSummaryCard({
  profile,
  onView,
  onEdit,
}: {
  profile: ICPProfile;
  onView: (p: ICPProfile) => void;
  onEdit: (p: ICPProfile) => void;
}) {
  const { t } = useLocale();
  const updatedDate = new Date(profile.updatedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900">{profile.name}</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-700 uppercase tracking-wide">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t('pages.icp.active')}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            {t('pages.icp.lastUpdated')} {updatedDate}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onView(profile)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            {t('pages.icp.viewBtn')}
          </button>
          <button
            onClick={() => onEdit(profile)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            {t('common.edit')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            {t('pages.icp.industries')}
          </p>
          <div className="flex flex-wrap gap-1">
            {profile.industries.length > 0
              ? profile.industries.slice(0, 2).map((v) => <TagPill key={v} text={v} />)
              : <span className="text-xs text-slate-400 italic">{t('common.none')}</span>}
            {profile.industries.length > 2 && (
              <TagPill text={`+${profile.industries.length - 2}`} color="bg-slate-100 text-slate-500" />
            )}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            {t('pages.icp.jobTitles')}
          </p>
          <div className="flex flex-wrap gap-1">
            {profile.jobTitles.length > 0
              ? profile.jobTitles.slice(0, 2).map((v) => <TagPill key={v} text={v} color="bg-slate-100 text-slate-600" />)
              : <span className="text-xs text-slate-400 italic">{t('common.none')}</span>}
            {profile.jobTitles.length > 2 && (
              <TagPill text={`+${profile.jobTitles.length - 2}`} color="bg-slate-100 text-slate-500" />
            )}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            {t('pages.icp.companySize')}
          </p>
          {profile.companySizeMin || profile.companySizeMax ? (
            <p className="text-xs font-semibold text-slate-700">
              {profile.companySizeMin.toLocaleString()}–{profile.companySizeMax.toLocaleString()}
              <span className="text-slate-400 font-normal"> {t('pages.icpPanel.emp')}</span>
            </p>
          ) : (
            <span className="text-xs text-slate-400 italic">{t('common.none')}</span>
          )}
        </div>

        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            {t('pages.icp.geographies')}
          </p>
          <div className="flex flex-wrap gap-1">
            {profile.locations.length > 0
              ? profile.locations.slice(0, 2).map((v) => <TagPill key={v} text={v} color="bg-slate-100 text-slate-600" />)
              : <span className="text-xs text-slate-400 italic">{t('common.none')}</span>}
            {profile.locations.length > 2 && (
              <TagPill text={`+${profile.locations.length - 2}`} color="bg-slate-100 text-slate-500" />
            )}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            {t('pages.icpPanel.labelDecisionMaker')}
          </p>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            profile.decisionMaker ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
          }`}>
            {profile.decisionMaker ? t('pages.icpPanel.dmRequired') : t('pages.icpPanel.dmNotRequired')}
          </span>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            {t('pages.icpCard.budgetPerMonth')}
          </p>
          {profile.budgetMin || profile.budgetMax ? (
            <p className="text-xs font-semibold text-slate-700">
              ${profile.budgetMin.toLocaleString()}–${profile.budgetMax.toLocaleString()}
            </p>
          ) : (
            <span className="text-xs text-slate-400 italic">{t('common.none')}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ICP Quality Checklist ─────────────────────────────────────────────────────

interface CheckItem {
  label: string;
  pass: boolean;
}

function qualityChecks(profile: ICPProfile, t: (key: string) => string): CheckItem[] {
  return [
    { label: t('pages.icp.checkIndustry'),       pass: profile.industries.length > 0 },
    { label: t('pages.icp.checkJobTitles'),       pass: profile.jobTitles.length > 0 },
    { label: t('pages.icp.checkCompanySize'),     pass: profile.companySizeMax > profile.companySizeMin },
    { label: t('pages.icp.checkLocations'),       pass: profile.locations.length > 0 },
    { label: t('pages.icp.checkPainPoints'),      pass: profile.painPoints.length > 0 },
    { label: t('pages.icp.checkBudget'),          pass: profile.budgetMax > 0 && profile.budgetMax >= profile.budgetMin },
    { label: t('pages.icp.checkBuyingTriggers'),  pass: profile.buyingTriggers.length > 0 },
    { label: t('pages.icp.checkTargetDepth'),     pass: profile.industries.length >= 2 && profile.jobTitles.length >= 2 },
  ];
}

function ICPQualityChecklist({ profile }: { profile: ICPProfile }) {
  const { t } = useLocale();
  const checks = qualityChecks(profile, t);
  const score = checks.filter((c) => c.pass).length;
  const total = checks.length;
  const pct = (score / total) * 100;

  const barColor =
    score === total ? 'bg-emerald-500' : score >= 6 ? 'bg-amber-400' : 'bg-red-400';
  const scoreColor =
    score === total ? 'text-emerald-600' : score >= 6 ? 'text-amber-600' : 'text-red-500';
  const scoreLabel =
    score === total
      ? t('pages.icp.qualityExcellent')
      : score >= 6
      ? t('pages.icp.qualityGood')
      : score >= 4
      ? t('pages.icp.qualityNeedsWork')
      : t('pages.icp.qualityIncomplete');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{t('pages.icp.qualityTitle')}</h3>
            <p className="text-xs text-slate-400 truncate max-w-[160px]">&ldquo;{profile.name}&rdquo;</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className={`text-lg font-bold leading-none ${scoreColor}`}>{score}/{total}</p>
          <p className={`text-[10px] font-medium ${scoreColor}`}>{scoreLabel}</p>
        </div>
      </div>

      <div className="mb-4 w-full bg-slate-100 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>

      <div className="space-y-2">
        {checks.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            {item.pass ? (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            ) : (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-100">
                <svg className="w-2.5 h-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            )}
            <span className={`text-xs ${item.pass ? 'text-slate-700' : 'text-slate-400'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Loading skeleton ───────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-slate-200" />
          <div className="h-4 w-80 rounded bg-slate-100" />
        </div>
        <div className="h-9 w-32 rounded-lg bg-slate-200 shrink-0" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-40 rounded-xl bg-slate-100" />
        <div className="h-40 rounded-xl bg-slate-100" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="h-52 rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  const { t } = useLocale();

  const checklistPreview = [
    t('pages.icp.checkIndustry'),
    t('pages.icp.checkJobTitles'),
    t('pages.icp.checkCompanySize'),
    t('pages.icp.checkLocations'),
    t('pages.icp.checkPainPoints'),
    t('pages.icp.checkBudget'),
    t('pages.icp.checkBuyingTriggers'),
    t('pages.icp.checkTargetDepth'),
  ];

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
        <svg className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-slate-700">{t('pages.icp.emptyTitle')}</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500">{t('pages.icp.emptyDesc')}</p>
      <button
        onClick={onCreateClick}
        className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {t('pages.icp.createFirstProfile')}
      </button>

      <div className="mt-8 w-full max-w-sm px-4">
        <p className="mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {t('pages.icp.completeProfileIncludes')}
        </p>
        <div className="grid grid-cols-2 gap-1.5 text-left">
          {checklistPreview.map((label) => (
            <div key={label} className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 shrink-0 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ICPPage() {
  const { t } = useLocale();
  const [profile, setProfile] = useState<ICPProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>('create');
  const [editingProfile, setEditingProfile] = useState<ICPProfile | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const p = await getCurrentIcpProfile();
      setProfile(p);
    } catch {
      setLoadError(t('pages.icp.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  function openCreate() {
    setEditingProfile(null);
    setPanelMode('create');
    setPanelOpen(true);
  }

  function openEdit(p: ICPProfile) {
    setEditingProfile(p);
    setPanelMode('edit');
    setPanelOpen(true);
  }

  function openView(p: ICPProfile) {
    setEditingProfile(p);
    setPanelMode('view');
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setEditingProfile(null);
  }

  async function handleSave(formData: ICPProfile) {
    const payload = {
      name: formData.name,
      industries: formData.industries,
      jobTitles: formData.jobTitles,
      companySizeMin: formData.companySizeMin,
      companySizeMax: formData.companySizeMax,
      locations: formData.locations,
      decisionMaker: formData.decisionMaker,
      painPoints: formData.painPoints,
      budgetMin: formData.budgetMin,
      budgetMax: formData.budgetMax,
      buyingTriggers: formData.buyingTriggers,
    };

    let saved: ICPProfile;
    if (profile?.id) {
      saved = await updateIcpProfile(profile.id, payload);
      showToast(t('pages.icp.toastUpdated').replace('{name}', saved.name));
    } else {
      saved = await createIcpProfile(payload);
      showToast(t('pages.icp.toastCreated').replace('{name}', saved.name));
    }

    setProfile(saved);
    closePanel();
  }

  if (loading) return <PageSkeleton />;

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 py-16 text-center">
        <p className="text-sm font-medium text-red-600">{loadError}</p>
        <button
          onClick={loadProfile}
          className="mt-4 text-sm font-medium text-red-500 underline hover:text-red-700"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* ── Page header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{t('pages.icp.managementTitle')}</h1>
            <p className="mt-0.5 text-sm text-slate-500 max-w-xl">
              {t('pages.icp.managementDesc')}
            </p>
          </div>
          <button
            onClick={profile ? () => openEdit(profile) : openCreate}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {profile ? (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                {t('pages.icp.editBtn').replace(' →', '')}
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {t('pages.icp.newProfile')}
              </>
            )}
          </button>
        </div>

        {profile ? (
          <>
            {/* ── Active profile banner + quality checklist ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left col: active banner + how-it-powers tiles */}
              <div className="lg:col-span-2 flex flex-col gap-3">
                <div className="flex items-center gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3.5">
                  <svg className="h-4 w-4 shrink-0 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="flex-1 text-sm text-slate-600">
                    {t('pages.icp.activeProfileLabel')}{' '}
                    <span className="font-semibold text-indigo-700">{profile.name}</span>
                    {' '}{t('pages.icp.allLeadsScoredAgainst')}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openView(profile)}
                      className="text-xs font-medium text-indigo-500 transition-colors hover:text-indigo-700"
                    >
                      {t('pages.icp.viewBtn')}
                    </button>
                    <span className="text-indigo-200">|</span>
                    <button
                      onClick={() => openEdit(profile)}
                      className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-800"
                    >
                      {t('pages.icp.editBtn')}
                    </button>
                  </div>
                </div>

                {/* How ICP powers the platform */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      icon: (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      ),
                      label: t('pages.icp.leadScoringLabel'),
                      sub: t('pages.icp.leadScoringDesc'),
                    },
                    {
                      icon: (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                        </svg>
                      ),
                      label: t('pages.icp.leadFilteringLabel'),
                      sub: t('pages.icp.leadFilteringDesc'),
                    },
                    {
                      icon: (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ),
                      label: t('pages.icp.outreachLabel'),
                      sub: t('pages.icp.outreachDesc'),
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-white px-3 py-3 shadow-sm">
                      <div className="mt-0.5 w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{item.label}</p>
                        <p className="text-[11px] text-slate-400">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right col: quality checklist */}
              <div>
                <ICPQualityChecklist profile={profile} />
              </div>
            </div>

            {/* ── Profile summary card ── */}
            <ProfileSummaryCard profile={profile} onView={openView} onEdit={openEdit} />
          </>
        ) : (
          <EmptyState onCreateClick={openCreate} />
        )}
      </div>

      {/* ── Slide-over panel ── */}
      <ICPFormPanel
        profile={editingProfile}
        isOpen={panelOpen}
        mode={panelMode}
        onClose={closePanel}
        onSave={handleSave}
        onEditRequest={
          panelMode === 'view' && editingProfile
            ? () => openEdit(editingProfile)
            : undefined
        }
      />

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
