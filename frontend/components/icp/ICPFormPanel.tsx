'use client';

import { useState, useEffect } from 'react';
import type { ICPProfile } from '@/types';
import { Input } from '@/components/ui/Input';
import { TagInput } from '@/components/ui/TagInput';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { useLocale } from '@/lib/i18n';

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
  const { t } = useLocale();

  if (tags.length === 0) {
    return <p className="text-xs text-slate-400 italic">{t('pages.icpPanel.noneSpecified')}</p>;
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
  const { t } = useLocale();

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
            {t('pages.icpPanel.profileName')}
          </p>
          <p className="text-base font-semibold text-slate-900">{profile.name}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {t('pages.icpPanel.lastUpdated').replace('{date}', updatedDate)}
          </p>
        </div>

        {/* Target Market */}
        <ViewSection title={t('pages.icpPanel.sectionTargetMarket')}>
          <div>
            <ViewLabel>{t('pages.icpPanel.labelIndustries')}</ViewLabel>
            <TagPills tags={profile.industries} colorClass="bg-indigo-50 text-indigo-700" />
          </div>
          <div>
            <ViewLabel>{t('pages.icpPanel.labelJobTitles')}</ViewLabel>
            <TagPills tags={profile.jobTitles} colorClass="bg-slate-100 text-slate-600" />
          </div>
        </ViewSection>

        {/* Company Criteria */}
        <ViewSection title={t('pages.icpPanel.sectionCompanyCriteria')}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <ViewLabel>{t('pages.icpPanel.labelCompanySize')}</ViewLabel>
              <p className="text-sm font-semibold text-slate-800">
                {profile.companySizeMin.toLocaleString()}–{profile.companySizeMax.toLocaleString()}
                <span className="text-slate-400 font-normal"> {t('pages.icpPanel.emp')}</span>
              </p>
            </div>
            <div>
              <ViewLabel>{t('pages.icpPanel.labelBudgetPerMonth')}</ViewLabel>
              <p className="text-sm font-semibold text-slate-800">
                ${profile.budgetMin.toLocaleString()}–${profile.budgetMax.toLocaleString()}
              </p>
            </div>
          </div>
          <div>
            <ViewLabel>{t('pages.icpPanel.labelLocations')}</ViewLabel>
            <TagPills tags={profile.locations} colorClass="bg-slate-100 text-slate-600" />
          </div>
        </ViewSection>

        {/* Qualification */}
        <ViewSection title={t('pages.icpPanel.sectionQualification')}>
          <div>
            <ViewLabel>{t('pages.icpPanel.labelDecisionMaker')}</ViewLabel>
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
              {profile.decisionMaker
                ? t('pages.icpPanel.dmRequired')
                : t('pages.icpPanel.dmNotRequired')}
            </span>
          </div>
          <div>
            <ViewLabel>{t('pages.icpPanel.labelPainPoints')}</ViewLabel>
            <TagPills tags={profile.painPoints} colorClass="bg-rose-50 text-rose-700" />
          </div>
        </ViewSection>

        {/* Intent */}
        <ViewSection title={t('pages.icpPanel.sectionBuyingIntent')}>
          <div>
            <ViewLabel>{t('pages.icpPanel.labelBuyingTriggers')}</ViewLabel>
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
  onSave: (profile: ICPProfile) => Promise<void> | void;
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
  const { t } = useLocale();
  const effectiveMode: PanelMode = mode ?? (profile !== null ? 'edit' : 'create');
  const isView = effectiveMode === 'view';
  const isEdit = effectiveMode === 'edit';

  const [form, setForm] = useState<ICPProfile>(freshProfile);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setForm(profile ?? freshProfile());
    setErrors({});
    setApiError(null);
  }, [profile, isOpen]);

  function validate(): boolean {
    const e: Partial<Record<string, string>> = {};
    if (!form.name.trim()) e.name = t('pages.icpPanel.errorNameRequired');
    if (form.industries.length === 0) e.industries = t('pages.icpPanel.errorIndustriesRequired');
    if (form.jobTitles.length === 0) e.jobTitles = t('pages.icpPanel.errorJobTitlesRequired');
    if (form.companySizeMin < 1) e.companySizeMin = t('pages.icpPanel.errorMinEmployees');
    if (form.companySizeMax <= form.companySizeMin)
      e.companySizeMax = t('pages.icpPanel.errorMaxEmployees');
    if (form.budgetMax < form.budgetMin) e.budgetMax = t('pages.icpPanel.errorBudgetMax');
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    setApiError(null);
    try {
      await onSave({ ...form, updatedAt: new Date().toISOString() });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function set<K extends keyof ICPProfile>(key: K, value: ICPProfile[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const headerTitle =
    effectiveMode === 'view'
      ? t('pages.icpPanel.viewTitle')
      : effectiveMode === 'edit'
      ? t('pages.icpPanel.editTitle')
      : t('pages.icpPanel.newTitle');

  const headerSub =
    effectiveMode === 'view'
      ? t('pages.icpPanel.viewingSub').replace('{name}', profile?.name ?? '')
      : effectiveMode === 'edit'
      ? t('pages.icpPanel.editingSub').replace('{name}', profile?.name ?? t('pages.icpPanel.profileFallbackName'))
      : t('pages.icpPanel.newSub');

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
            aria-label={t('pages.icpPanel.closePanel')}
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
                <SectionDivider num="1" title={t('pages.icpPanel.sectionProfileInfo')} />
                <Input
                  label={t('pages.icpPanel.inputProfileName')}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder={t('pages.icpPanel.inputProfileNamePlaceholder')}
                  error={errors.name}
                />
              </section>

              {/* ── 2. Target Market ── */}
              <section className="space-y-4">
                <SectionDivider num="2" title={t('pages.icpPanel.sectionTargetMarket')} />
                <TagInput
                  label={t('pages.icpPanel.inputIndustries')}
                  tags={form.industries}
                  onChange={(tags) => set('industries', tags)}
                  suggestions={INDUSTRY_SUGGESTIONS}
                  hint={t('pages.icpPanel.inputIndustriesHint')}
                  error={errors.industries}
                />
                <TagInput
                  label={t('pages.icpPanel.inputJobTitles')}
                  tags={form.jobTitles}
                  onChange={(tags) => set('jobTitles', tags)}
                  suggestions={JOB_TITLE_SUGGESTIONS}
                  hint={t('pages.icpPanel.inputJobTitlesHint')}
                  error={errors.jobTitles}
                />
              </section>

              {/* ── 3. Company Criteria ── */}
              <section className="space-y-4">
                <SectionDivider num="3" title={t('pages.icpPanel.sectionCompanyCriteria')} />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label={t('pages.icpPanel.inputMinEmployees')}
                    type="number"
                    min={1}
                    value={form.companySizeMin}
                    onChange={(e) => set('companySizeMin', Number(e.target.value))}
                    hint="e.g. 11"
                    error={errors.companySizeMin}
                  />
                  <Input
                    label={t('pages.icpPanel.inputMaxEmployees')}
                    type="number"
                    min={1}
                    value={form.companySizeMax}
                    onChange={(e) => set('companySizeMax', Number(e.target.value))}
                    hint="e.g. 500"
                    error={errors.companySizeMax}
                  />
                </div>
                <TagInput
                  label={t('pages.icpPanel.inputLocations')}
                  tags={form.locations}
                  onChange={(tags) => set('locations', tags)}
                  suggestions={LOCATION_SUGGESTIONS}
                  hint={t('pages.icpPanel.inputLocationsHint')}
                />
              </section>

              {/* ── 4. Qualification ── */}
              <section className="space-y-4">
                <SectionDivider num="4" title={t('pages.icpPanel.sectionQualification')} />
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2.5 text-sm font-medium text-slate-700">
                    {t('pages.icpPanel.inputDecisionMaker')}
                  </p>
                  <Toggle
                    checked={form.decisionMaker}
                    onChange={(val) => set('decisionMaker', val)}
                    description={
                      form.decisionMaker
                        ? t('pages.icpPanel.inputDmOnDesc')
                        : t('pages.icpPanel.inputDmOffDesc')
                    }
                  />
                </div>
                <TagInput
                  label={t('pages.icpPanel.inputPainPoints')}
                  tags={form.painPoints}
                  onChange={(tags) => set('painPoints', tags)}
                  suggestions={PAIN_POINT_SUGGESTIONS}
                  hint={t('pages.icpPanel.inputPainPointsHint')}
                />
              </section>

              {/* ── 5. Budget & Intent ── */}
              <section className="space-y-4">
                <SectionDivider num="5" title={t('pages.icpPanel.sectionBudgetIntent')} />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label={t('pages.icpPanel.inputMinBudget')}
                    type="number"
                    min={0}
                    value={form.budgetMin}
                    onChange={(e) => set('budgetMin', Number(e.target.value))}
                    hint="e.g. 500"
                    suffix="$"
                  />
                  <Input
                    label={t('pages.icpPanel.inputMaxBudget')}
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
                  label={t('pages.icpPanel.inputBuyingTriggers')}
                  tags={form.buyingTriggers}
                  onChange={(tags) => set('buyingTriggers', tags)}
                  suggestions={TRIGGER_SUGGESTIONS}
                  hint={t('pages.icpPanel.inputBuyingTriggersHint')}
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
                {t('common.close')}
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
                  {t('pages.icpPanel.editBtn')}
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
              >
                {t('common.cancel')}
              </button>
              <div className="flex items-center gap-3">
                {(Object.keys(errors).length > 0 || apiError) && (
                  <p className="text-xs text-red-500">
                    {apiError ?? t('pages.icpPanel.errorFixAbove')}
                  </p>
                )}
                <Button onClick={handleSave} loading={saving} size="md">
                  {saving
                    ? t('pages.icpPanel.saving')
                    : isEdit
                    ? t('pages.icpPanel.updateBtn')
                    : t('pages.icpPanel.createBtn')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
