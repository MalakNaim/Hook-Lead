'use client';

import { useState } from 'react';
import { DUMMY_ICP_PROFILES } from '@/lib/dummy-data';
import type { ICPProfile } from '@/types';
import { ICPProfileCard } from '@/components/icp/ICPProfileCard';
import { ICPFormPanel, type PanelMode } from '@/components/icp/ICPFormPanel';

// ── Toast ──────────────────────────────────────────────────────────────────────

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl">
      <svg
        className="h-4 w-4 shrink-0 text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {message}
    </div>
  );
}

// ── ICP Quality Checklist ─────────────────────────────────────────────────────

interface CheckItem {
  label: string;
  pass: boolean;
}

function qualityChecks(profile: ICPProfile): CheckItem[] {
  return [
    { label: 'Industry defined',           pass: profile.industries.length > 0 },
    { label: 'Job titles specified',        pass: profile.jobTitles.length > 0 },
    { label: 'Company size range set',      pass: profile.companySizeMax > profile.companySizeMin },
    { label: 'Target locations added',      pass: profile.locations.length > 0 },
    { label: 'Pain points described',       pass: profile.painPoints.length > 0 },
    { label: 'Budget range configured',     pass: profile.budgetMax > 0 && profile.budgetMax >= profile.budgetMin },
    { label: 'Buying triggers identified',  pass: profile.buyingTriggers.length > 0 },
    { label: 'Targeting depth',             pass: profile.industries.length >= 2 && profile.jobTitles.length >= 2 },
  ];
}

function ICPQualityChecklist({ profile }: { profile: ICPProfile }) {
  const checks = qualityChecks(profile);
  const score = checks.filter((c) => c.pass).length;
  const total = checks.length;
  const pct = (score / total) * 100;

  const barColor =
    score === total ? 'bg-emerald-500' : score >= 6 ? 'bg-amber-400' : 'bg-red-400';
  const scoreColor =
    score === total ? 'text-emerald-600' : score >= 6 ? 'text-amber-600' : 'text-red-500';
  const scoreLabel =
    score === total ? 'Excellent' : score >= 6 ? 'Good' : score >= 4 ? 'Needs work' : 'Incomplete';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Profile Quality</h3>
            <p className="text-xs text-slate-400 truncate max-w-[160px]">&ldquo;{profile.name}&rdquo;</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className={`text-lg font-bold leading-none ${scoreColor}`}>{score}/{total}</p>
          <p className={`text-[10px] font-medium ${scoreColor}`}>{scoreLabel}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4 w-full bg-slate-100 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Checklist items */}
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

// ── Empty State ────────────────────────────────────────────────────────────────

const CHECKLIST_PREVIEW = [
  'Industry defined',
  'Job titles specified',
  'Company size range',
  'Target locations',
  'Pain points described',
  'Budget range configured',
  'Buying triggers',
  'Targeting depth',
];

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
        <svg
          className="h-7 w-7 text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-slate-700">No ICP profiles yet</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500">
        Create your first ideal customer profile to start scoring and filtering leads
        automatically.
      </p>
      <button
        onClick={onCreateClick}
        className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Create First Profile
      </button>

      {/* Checklist preview */}
      <div className="mt-8 w-full max-w-sm px-4">
        <p className="mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          A complete ICP profile includes
        </p>
        <div className="grid grid-cols-2 gap-1.5 text-left">
          {CHECKLIST_PREVIEW.map((label) => (
            <div key={label} className="flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5 shrink-0 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
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
  const [profiles, setProfiles] = useState<ICPProfile[]>(DUMMY_ICP_PROFILES);
  const [activeId, setActiveId] = useState<string>('icp-1');
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>('create');
  const [editingProfile, setEditingProfile] = useState<ICPProfile | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const activeProfile = profiles.find((p) => p.id === activeId);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function openCreate() {
    setEditingProfile(null);
    setPanelMode('create');
    setPanelOpen(true);
  }

  function openEdit(profile: ICPProfile) {
    setEditingProfile(profile);
    setPanelMode('edit');
    setPanelOpen(true);
  }

  function openView(profile: ICPProfile) {
    setEditingProfile(profile);
    setPanelMode('view');
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setEditingProfile(null);
  }

  function handleSave(saved: ICPProfile) {
    const isNew = !profiles.find((p) => p.id === saved.id);
    setProfiles((prev) =>
      isNew ? [...prev, saved] : prev.map((p) => (p.id === saved.id ? saved : p))
    );
    closePanel();
    showToast(`"${saved.name}" ${isNew ? 'created' : 'updated'} successfully`);
  }

  function handleDelete(id: string) {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (activeId === id) {
      const remaining = profiles.filter((p) => p.id !== id);
      setActiveId(remaining[0]?.id ?? '');
    }
    showToast('Profile deleted');
  }

  function handleDuplicate(profile: ICPProfile) {
    const copy: ICPProfile = {
      ...profile,
      id: `icp-${Date.now()}`,
      name: `Copy of ${profile.name}`,
      updatedAt: new Date().toISOString(),
    };
    setProfiles((prev) => [...prev, copy]);
    showToast(`"${copy.name}" created as a duplicate`);
  }

  function handleSetActive(id: string) {
    setActiveId(id);
    const name = profiles.find((p) => p.id === id)?.name;
    if (name) showToast(`"${name}" set as active profile`);
  }

  return (
    <>
      <div className="space-y-6">
        {/* ── Page header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">ICP Management</h1>
            <p className="mt-0.5 text-sm text-slate-500 max-w-xl">
              Define your Ideal Customer Profiles to power lead scoring and outreach
              personalisation. The active profile is applied to every lead automatically.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Profile
          </button>
        </div>

        {profiles.length > 0 && (
          <>
            {/* ── Active profile banner + quality checklist ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left col: active banner + how-it-powers tiles */}
              <div className="lg:col-span-2 flex flex-col gap-3">
                {activeProfile ? (
                  <div className="flex items-center gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3.5">
                    <svg className="h-4 w-4 shrink-0 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="flex-1 text-sm text-slate-600">
                      Active profile:{' '}
                      <span className="font-semibold text-indigo-700">{activeProfile.name}</span>
                      {' '}— all leads are scored against this ICP.
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openView(activeProfile)}
                        className="text-xs font-medium text-indigo-500 transition-colors hover:text-indigo-700"
                      >
                        View
                      </button>
                      <span className="text-indigo-200">|</span>
                      <button
                        onClick={() => openEdit(activeProfile)}
                        className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-800"
                      >
                        Edit →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-700">
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    No active ICP profile. Open any profile card and click &ldquo;Set as Active&rdquo; to enable lead scoring.
                  </div>
                )}

                {/* How ICP powers the platform */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      icon: (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      ),
                      label: 'Lead Scoring',
                      sub: 'Powers ICP fit scores',
                    },
                    {
                      icon: (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                        </svg>
                      ),
                      label: 'Lead Filtering',
                      sub: 'Filter by ICP match',
                    },
                    {
                      icon: (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ),
                      label: 'Outreach',
                      sub: 'Personalises emails',
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-white px-3 py-3 shadow-sm"
                    >
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
                {activeProfile ? (
                  <ICPQualityChecklist profile={activeProfile} />
                ) : (
                  <div className="h-full rounded-xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-5 text-center">
                    <svg className="w-8 h-8 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <p className="text-xs text-slate-400">
                      Set an active profile to see its quality score
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Profile count ── */}
            <p className="text-xs text-slate-400">
              {profiles.length} profile{profiles.length !== 1 ? 's' : ''} — click a card to view or edit
            </p>

            {/* ── Profile grid ── */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {profiles.map((profile) => (
                <ICPProfileCard
                  key={profile.id}
                  profile={profile}
                  isActive={profile.id === activeId}
                  onView={openView}
                  onEdit={openEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  onSetActive={handleSetActive}
                />
              ))}
            </div>
          </>
        )}

        {/* ── Empty state ── */}
        {profiles.length === 0 && <EmptyState onCreateClick={openCreate} />}
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
      {toast && <Toast message={toast} />}
    </>
  );
}
