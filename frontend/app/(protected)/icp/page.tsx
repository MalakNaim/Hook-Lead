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
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">ICP Management</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Define and manage your Ideal Customer Profiles. The active profile powers
              lead scoring and outreach personalisation.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Profile
          </button>
        </div>

        {/* ── Active profile info bar ── */}
        {activeProfile ? (
          <div className="flex items-center gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
            <svg
              className="h-4 w-4 shrink-0 text-indigo-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
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
            <button
              onClick={() => openEdit(activeProfile)}
              className="shrink-0 text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-800"
            >
              Edit →
            </button>
          </div>
        ) : profiles.length > 0 ? (
          <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            No active ICP profile. Set one of your profiles as active to enable lead scoring.
          </div>
        ) : null}

        {/* ── Profile grid / empty state ── */}
        {profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
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
              Create your first ideal customer profile to start scoring and filtering leads automatically.
            </p>
            <button
              onClick={openCreate}
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create First Profile
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-400">
              {profiles.length} profile{profiles.length !== 1 ? 's' : ''} — click a card to
              edit, or set it as active
            </p>
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
      </div>

      {/* ── Slide-over form panel ── */}
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
