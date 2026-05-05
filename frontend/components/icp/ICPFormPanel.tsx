'use client';

import { useState, useEffect } from 'react';
import type { ICPProfile } from '@/types';
import { Input } from '@/components/ui/Input';
import { TagInput } from '@/components/ui/TagInput';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';

// ── Suggestions ────────────────────────────────────────────────────────────────

const INDUSTRY_SUGGESTIONS = [
  'SaaS / Cloud', 'Software & Technology', 'Cloud Infrastructure', 'FinTech',
  'Enterprise Software', 'Financial Services', 'Healthcare IT', 'Manufacturing',
  'E-commerce', 'Retail', 'Professional Services', 'Consulting',
  'AI / ML', 'DevTools', 'CyberSecurity', 'HR Tech', 'EdTech', 'Data & Analytics',
];

const JOB_TITLE_SUGGESTIONS = [
  'CTO', 'CEO', 'CFO', 'COO', 'CIO', 'Founder',
  'VP of Engineering', 'VP of Sales', 'VP of Product', 'VP of IT',
  'Director of Operations', 'Director of Technology', 'Head of Sales',
  'Head of Growth', 'Head of Marketing', 'Chief Digital Officer',
  'Engineering Manager', 'Growth Manager', 'Product Manager', 'IT Manager',
];

const LOCATION_SUGGESTIONS = [
  'North America', 'United States', 'Canada', 'Europe',
  'United Kingdom', 'Western Europe', 'DACH Region', 'Nordics',
  'Middle East', 'APAC', 'Australia', 'Singapore',
];

const PAIN_POINT_SUGGESTIONS = [
  'manual lead qualification', 'slow outreach response times', 'poor lead scoring accuracy',
  'disconnected CRM tools', 'sales pipeline visibility', 'long sales cycles',
  'high customer acquisition cost', 'manual outreach processes',
  'limited sales team bandwidth', 'no lead scoring system',
  'legacy system modernization', 'data security compliance', 'IT budget optimization',
  'integration complexity', 'slow procurement cycles',
];

const TRIGGER_SUGGESTIONS = [
  'recent funding round', 'team expansion', 'new GTM hire', 'switching CRM',
  'missed sales targets', 'new product launch', 'entering new market',
  'merger or acquisition', 'leadership change', 'digital transformation initiative',
  'compliance requirement', 'security audit failure', 'budget approval cycle',
  'vendor contract expiry', 'growth plateau', 'competitor pressure',
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function freshProfile(): ICPProfile {
  return {
    id: `icp-${Date.now()}`,
    name: '',
    industries: [],
    jobTitles: [],
    companySizeMin: 10,
    companySizeMax: 500,
    locations: [],
    decisionMaker: true,
    painPoints: [],
    budgetMin: 500,
    budgetMax: 5000,
    buyingTriggers: [],
    updatedAt: new Date().toISOString(),
  };
}

function SectionDivider({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
        {num}
      </span>
      <h3 className="text-sm font-semibold text-slate-700 whitespace-nowrap">{title}</h3>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

// ── View mode sub-components ───────────────────────────────────────────────────

function ViewLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
      {children}
    </p>
  );
}

function TagPills({
  tags,
  colorClass = 'bg-slate-100 text-slate-600',
}: {
  tags: string[];
  colorClass?: string;
}) {
  if (tags.length === 0) {
    return <p className="text-xs text-slate-400 italic">None specified</p>;
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span key={tag} className={`px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
          {tag}
        </span>
      ))}
    </div>
  );
}

function ViewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
        <div className="flex-1 h-px bg-slate-100" />
      </div>
      {children}
    </section>
  );
}

function ViewBody({ profile }: { profile: ICPProfile }) {
  const updatedDate = new Date(profile.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-7 px-6 py-6">
        {/* Profile name banner */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 mb-0.5">
            Profile Name
          </p>
          <p className="text-base font-semibold text-slate-900">{profile.name}</p>
          <p className="mt-0.5 text-xs text-slate-400">Last updated {updatedDate}</p>
        </div>

        {/* Target Market */}
        <ViewSection title="Target Market">
          <div>
            <ViewLabel>Industries</ViewLabel>
            <TagPills tags={profile.industries} colorClass="bg-indigo-50 text-indigo-700" />
          </div>
          <div>
            <ViewLabel>Job Titles</ViewLabel>
            <TagPills tags={profile.jobTitles} colorClass="bg-slate-100 text-slate-600" />
          </div>
        </ViewSection>

        {/* Company Criteria */}
        <ViewSection title="Company Criteria">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <ViewLabel>Company Size</ViewLabel>
              <p className="text-sm font-semibold text-slate-800">
                {profile.companySizeMin.toLocaleString()}–{profile.companySizeMax.toLocaleString()}
                <span className="text-slate-400 font-normal"> emp.</span>
              </p>
            </div>
            <div>
              <ViewLabel>Budget / mo</ViewLabel>
              <p className="text-sm font-semibold text-slate-800">
                ${profile.budgetMin.toLocaleString()}–${profile.budgetMax.toLocaleString()}
              </p>
            </div>
          </div>
          <div>
            <ViewLabel>Locations</ViewLabel>
            <TagPills tags={profile.locations} colorClass="bg-slate-100 text-slate-600" />
          </div>
        </ViewSection>

        {/* Qualification */}
        <ViewSection title="Qualification">
          <div>
            <ViewLabel>Decision Maker Required</ViewLabel>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                profile.decisionMaker
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {profile.decisionMaker ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {profile.decisionMaker ? 'Yes — required' : 'No — any seniority'}
            </span>
          </div>
          <div>
            <ViewLabel>Pain Points</ViewLabel>
            <TagPills tags={profile.painPoints} colorClass="bg-rose-50 text-rose-700" />
          </div>
        </ViewSection>

        {/* Intent */}
        <ViewSection title="Buying Intent">
          <div>
            <ViewLabel>Buying Triggers</ViewLabel>
            <TagPills tags={profile.buyingTriggers} colorClass="bg-amber-50 text-amber-700" />
          </div>
        </ViewSection>
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export type PanelMode = 'create' | 'edit' | 'view';

interface ICPFormPanelProps {
  profile: ICPProfile | null;
  isOpen: boolean;
  mode?: PanelMode;
  onClose: () => void;
  onSave: (profile: ICPProfile) => void;
  onEditRequest?: () => void;
}

export function ICPFormPanel({
  profile,
  isOpen,
  mode,
  onClose,
  onSave,
  onEditRequest,
}: ICPFormPanelProps) {
  const effectiveMode: PanelMode = mode ?? (profile !== null ? 'edit' : 'create');
  const isView = effectiveMode === 'view';
  const isEdit = effectiveMode === 'edit';

  const [form, setForm] = useState<ICPProfile>(freshProfile);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  useEffect(() => {
    if (!isOpen) return;
    setForm(profile ?? freshProfile());
    setErrors({});
  }, [profile, isOpen]);

  function validate(): boolean {
    const e: Partial<Record<string, string>> = {};
    if (!form.name.trim()) e.name = 'Profile name is required';
    if (form.industries.length === 0) e.industries = 'Add at least one industry';
    if (form.jobTitles.length === 0) e.jobTitles = 'Add at least one job title';
    if (form.companySizeMin < 1) e.companySizeMin = 'Must be ≥ 1';
    if (form.companySizeMax <= form.companySizeMin)
      e.companySizeMax = 'Must be greater than minimum';
    if (form.budgetMax < form.budgetMin) e.budgetMax = 'Must be ≥ minimum budget';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      onSave({ ...form, updatedAt: new Date().toISOString() });
      setSaving(false);
    }, 600);
  }

  function set<K extends keyof ICPProfile>(key: K, value: ICPProfile[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const headerTitle =
    effectiveMode === 'view'
      ? 'View ICP Profile'
      : effectiveMode === 'edit'
      ? 'Edit ICP Profile'
      : 'New ICP Profile';

  const headerSub =
    effectiveMode === 'view'
      ? `Viewing "${profile?.name ?? ''}"`
      : effectiveMode === 'edit'
      ? `Editing "${profile!.name}"`
      : 'Define a new ideal customer profile';

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-[580px] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="ICP profile panel"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{headerTitle}</h2>
            <p className="mt-0.5 text-xs text-slate-500">{headerSub}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close panel"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body — view vs form */}
        {isView ? (
          <ViewBody profile={form} />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-8 px-6 py-6">

              {/* ── 1. Profile Info ── */}
              <section className="space-y-4">
                <SectionDivider num="1" title="Profile Info" />
                <Input
                  label="Profile Name"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Primary ICP, Enterprise, SMB Growth"
                  error={errors.name}
                />
              </section>

              {/* ── 2. Target Market ── */}
              <section className="space-y-4">
                <SectionDivider num="2" title="Target Market" />
                <TagInput
                  label="Industries"
                  tags={form.industries}
                  onChange={(tags) => set('industries', tags)}
                  suggestions={INDUSTRY_SUGGESTIONS}
                  hint="Type or pick from suggestions — press Enter to add"
                  error={errors.industries}
                />
                <TagInput
                  label="Job Titles"
                  tags={form.jobTitles}
                  onChange={(tags) => set('jobTitles', tags)}
                  suggestions={JOB_TITLE_SUGGESTIONS}
                  hint="Add target decision-maker titles"
                  error={errors.jobTitles}
                />
              </section>

              {/* ── 3. Company Criteria ── */}
              <section className="space-y-4">
                <SectionDivider num="3" title="Company Criteria" />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Min Employees"
                    type="number"
                    min={1}
                    value={form.companySizeMin}
                    onChange={(e) => set('companySizeMin', Number(e.target.value))}
                    hint="e.g. 11"
                    error={errors.companySizeMin}
                  />
                  <Input
                    label="Max Employees"
                    type="number"
                    min={1}
                    value={form.companySizeMax}
                    onChange={(e) => set('companySizeMax', Number(e.target.value))}
                    hint="e.g. 500"
                    error={errors.companySizeMax}
                  />
                </div>
                <TagInput
                  label="Locations"
                  tags={form.locations}
                  onChange={(tags) => set('locations', tags)}
                  suggestions={LOCATION_SUGGESTIONS}
                  hint="Target regions or countries"
                />
              </section>

              {/* ── 4. Qualification ── */}
              <section className="space-y-4">
                <SectionDivider num="4" title="Qualification" />
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2.5 text-sm font-medium text-slate-700">
                    Decision Maker Required
                  </p>
                  <Toggle
                    checked={form.decisionMaker}
                    onChange={(val) => set('decisionMaker', val)}
                    description={
                      form.decisionMaker
                        ? 'Only C-level / VP / Director titles will qualify'
                        : 'All seniority levels accepted'
                    }
                  />
                </div>
                <TagInput
                  label="Pain Points"
                  tags={form.painPoints}
                  onChange={(tags) => set('painPoints', tags)}
                  suggestions={PAIN_POINT_SUGGESTIONS}
                  hint="Problems your product directly solves"
                />
              </section>

              {/* ── 5. Budget & Intent ── */}
              <section className="space-y-4">
                <SectionDivider num="5" title="Budget & Intent" />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Min Budget ($/mo)"
                    type="number"
                    min={0}
                    value={form.budgetMin}
                    onChange={(e) => set('budgetMin', Number(e.target.value))}
                    hint="e.g. 500"
                    suffix="$"
                  />
                  <Input
                    label="Max Budget ($/mo)"
                    type="number"
                    min={0}
                    value={form.budgetMax}
                    onChange={(e) => set('budgetMax', Number(e.target.value))}
                    hint="e.g. 5000"
                    suffix="$"
                    error={errors.budgetMax}
                  />
                </div>
                <TagInput
                  label="Buying Triggers"
                  tags={form.buyingTriggers}
                  onChange={(tags) => set('buyingTriggers', tags)}
                  suggestions={TRIGGER_SUGGESTIONS}
                  hint="Events that signal purchase intent"
                />
              </section>

            </div>
          </div>
        )}

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-6 py-4">
          {isView ? (
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
              >
                Close
              </button>
              {onEditRequest && (
                <button
                  onClick={onEditRequest}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
              >
                Cancel
              </button>
              <div className="flex items-center gap-3">
                {Object.keys(errors).length > 0 && (
                  <p className="text-xs text-red-500">Please fix the errors above</p>
                )}
                <Button onClick={handleSave} loading={saving} size="md">
                  {saving ? 'Saving…' : isEdit ? 'Update Profile' : 'Create Profile'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
