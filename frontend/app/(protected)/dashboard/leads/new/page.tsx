'use client';

import { useState, useId } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createLead, type CreateLeadRequest } from '@/services/leadsService';
import { useLocale } from '@/lib/i18n';

// ── Field component ────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}

const INPUT_CLASS =
  'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400';

const INPUT_ERROR_CLASS =
  'block w-full rounded-lg border border-red-400 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:bg-slate-50';

const SELECT_CLASS =
  'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-50';

// ── Section header ─────────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-4 border-b border-slate-100 pb-2">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</h2>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

type FormErrors = Partial<Record<string, string>>;

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  company: string;
  companyWebsite: string;
  industry: string;
  companySize: string;
  geography: string;
  revenueRange: string;
  linkedInUrl: string;
  phone: string;
  whatsapp: string;
  emailVerificationStatus: string;
  enrichmentStatus: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  jobTitle: '',
  company: '',
  companyWebsite: '',
  industry: '',
  companySize: '',
  geography: '',
  revenueRange: '',
  linkedInUrl: '',
  phone: '',
  whatsapp: '',
  emailVerificationStatus: '',
  enrichmentStatus: '',
  notes: '',
};

export default function NewLeadPage() {
  const router = useRouter();
  const { t } = useLocale();
  const formId = useId();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (serverError) setServerError(null);
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.firstName.trim()) e.firstName = t('pages.leads.fieldFirstName') + ' is required.';
    if (!form.lastName.trim()) e.lastName = t('pages.leads.fieldLastName') + ' is required.';
    if (!form.email.trim()) {
      e.email = t('pages.leads.fieldEmail') + ' is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = 'Please enter a valid email address.';
    }
    if (form.linkedInUrl.trim() && !/^https?:\/\//i.test(form.linkedInUrl.trim())) {
      e.linkedInUrl = 'LinkedIn URL must start with https://';
    }
    if (form.companyWebsite.trim() && !/^https?:\/\//i.test(form.companyWebsite.trim())) {
      e.companyWebsite = 'Website URL must start with https://';
    }
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    const payload: CreateLeadRequest = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      ...(form.jobTitle.trim() && { jobTitle: form.jobTitle.trim() }),
      ...(form.company.trim() && { company: form.company.trim() }),
      ...(form.industry.trim() && { industry: form.industry.trim() }),
      ...(form.companySize.trim() && { companySize: form.companySize.trim() }),
      ...(form.geography.trim() && { geography: form.geography.trim() }),
      ...(form.revenueRange.trim() && { revenueRange: form.revenueRange.trim() }),
      ...(form.linkedInUrl.trim() && { linkedInUrl: form.linkedInUrl.trim() }),
      ...(form.notes.trim() && { notes: form.notes.trim() }),
      ...(form.companyWebsite.trim() && { companyWebsite: form.companyWebsite.trim() }),
      ...(form.phone.trim() && { phone: form.phone.trim() }),
      ...(form.whatsapp.trim() && { whatsApp: form.whatsapp.trim() }),
      ...(form.emailVerificationStatus && { emailVerificationStatus: form.emailVerificationStatus }),
      ...(form.enrichmentStatus && { enrichmentStatus: form.enrichmentStatus }),
      source: 'Manual',
    };

    setSubmitting(true);
    setServerError(null);
    try {
      const created = await createLead(payload);
      router.push(`/dashboard/leads/${created.id}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t('pages.leads.errorGeneric');
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const disabled = submitting;

  return (
    <div className="mx-auto max-w-2xl space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/leads"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('pages.leads.backToLeads')}
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-bold text-slate-900">{t('pages.leads.addLeadTitle')}</h1>
        <p className="mt-0.5 text-sm text-slate-500">{t('pages.leads.addLeadSubtitle')}</p>
      </div>

      {/* ── Form card ── */}
      <form id={formId} onSubmit={handleSubmit} noValidate>
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          {/* ── Contact Information ── */}
          <div>
            <SectionHeader title={t('pages.leads.sectionContact')} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t('pages.leads.fieldFirstName')} required error={errors.firstName}>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => set('firstName', e.target.value)}
                  placeholder={t('pages.leads.placeholderFirstName')}
                  disabled={disabled}
                  autoComplete="given-name"
                  className={errors.firstName ? INPUT_ERROR_CLASS : INPUT_CLASS}
                />
              </Field>
              <Field label={t('pages.leads.fieldLastName')} required error={errors.lastName}>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => set('lastName', e.target.value)}
                  placeholder={t('pages.leads.placeholderLastName')}
                  disabled={disabled}
                  autoComplete="family-name"
                  className={errors.lastName ? INPUT_ERROR_CLASS : INPUT_CLASS}
                />
              </Field>
              <Field label={t('pages.leads.fieldEmail')} required error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder={t('pages.leads.placeholderEmail')}
                  disabled={disabled}
                  autoComplete="email"
                  className={errors.email ? INPUT_ERROR_CLASS : INPUT_CLASS}
                />
              </Field>
              <Field label={t('pages.leads.fieldEmailVerification')} error={errors.emailVerificationStatus}>
                <select
                  value={form.emailVerificationStatus}
                  onChange={(e) => set('emailVerificationStatus', e.target.value)}
                  disabled={disabled}
                  className={SELECT_CLASS}
                >
                  <option value="">{t('pages.leads.optionUnknown')}</option>
                  <option value="Verified">{t('pages.leads.optionVerified')}</option>
                  <option value="Unverified">{t('pages.leads.optionUnverified')}</option>
                </select>
              </Field>
              <Field label={t('pages.leads.fieldJobTitle')} error={errors.jobTitle}>
                <input
                  type="text"
                  value={form.jobTitle}
                  onChange={(e) => set('jobTitle', e.target.value)}
                  placeholder={t('pages.leads.placeholderJobTitle')}
                  disabled={disabled}
                  className={errors.jobTitle ? INPUT_ERROR_CLASS : INPUT_CLASS}
                />
              </Field>
              <Field label={t('pages.leads.fieldLinkedInUrl')} error={errors.linkedInUrl}>
                <input
                  type="url"
                  value={form.linkedInUrl}
                  onChange={(e) => set('linkedInUrl', e.target.value)}
                  placeholder={t('pages.leads.placeholderLinkedInUrl')}
                  disabled={disabled}
                  className={errors.linkedInUrl ? INPUT_ERROR_CLASS : INPUT_CLASS}
                />
              </Field>
              <Field label={t('pages.leads.fieldPhone')} error={errors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder={t('pages.leads.placeholderPhone')}
                  disabled={disabled}
                  className={errors.phone ? INPUT_ERROR_CLASS : INPUT_CLASS}
                />
              </Field>
              <Field label={t('pages.leads.fieldWhatsApp')} error={errors.whatsapp}>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => set('whatsapp', e.target.value)}
                  placeholder={t('pages.leads.placeholderWhatsApp')}
                  disabled={disabled}
                  className={errors.whatsapp ? INPUT_ERROR_CLASS : INPUT_CLASS}
                />
              </Field>
            </div>
          </div>

          {/* ── Company Details ── */}
          <div>
            <SectionHeader title={t('pages.leads.sectionCompany')} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t('pages.leads.fieldCompany')} error={errors.company}>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => set('company', e.target.value)}
                  placeholder={t('pages.leads.placeholderCompany')}
                  disabled={disabled}
                  className={errors.company ? INPUT_ERROR_CLASS : INPUT_CLASS}
                />
              </Field>
              <Field label={t('pages.leads.fieldCompanyWebsite')} error={errors.companyWebsite}>
                <input
                  type="url"
                  value={form.companyWebsite}
                  onChange={(e) => set('companyWebsite', e.target.value)}
                  placeholder={t('pages.leads.placeholderCompanyWebsite')}
                  disabled={disabled}
                  className={errors.companyWebsite ? INPUT_ERROR_CLASS : INPUT_CLASS}
                />
              </Field>
              <Field label={t('pages.leads.fieldIndustry')} error={errors.industry}>
                <input
                  type="text"
                  value={form.industry}
                  onChange={(e) => set('industry', e.target.value)}
                  placeholder={t('pages.leads.placeholderIndustry')}
                  disabled={disabled}
                  className={errors.industry ? INPUT_ERROR_CLASS : INPUT_CLASS}
                />
              </Field>
              <Field label={t('pages.leads.fieldCompanySize')} error={errors.companySize}>
                <input
                  type="text"
                  value={form.companySize}
                  onChange={(e) => set('companySize', e.target.value)}
                  placeholder={t('pages.leads.placeholderCompanySize')}
                  disabled={disabled}
                  className={errors.companySize ? INPUT_ERROR_CLASS : INPUT_CLASS}
                />
              </Field>
              <Field label={t('pages.leads.fieldGeography')} error={errors.geography}>
                <input
                  type="text"
                  value={form.geography}
                  onChange={(e) => set('geography', e.target.value)}
                  placeholder={t('pages.leads.placeholderGeography')}
                  disabled={disabled}
                  className={errors.geography ? INPUT_ERROR_CLASS : INPUT_CLASS}
                />
              </Field>
              <Field label={t('pages.leads.fieldRevenueRange')} error={errors.revenueRange}>
                <input
                  type="text"
                  value={form.revenueRange}
                  onChange={(e) => set('revenueRange', e.target.value)}
                  placeholder={t('pages.leads.placeholderRevenueRange')}
                  disabled={disabled}
                  className={errors.revenueRange ? INPUT_ERROR_CLASS : INPUT_CLASS}
                />
              </Field>
            </div>
          </div>

          {/* ── Enrichment ── */}
          <div>
            <SectionHeader title={t('pages.leads.sectionEnrichment')} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t('pages.leads.fieldEnrichmentStatus')} error={errors.enrichmentStatus}>
                <select
                  value={form.enrichmentStatus}
                  onChange={(e) => set('enrichmentStatus', e.target.value)}
                  disabled={disabled}
                  className={SELECT_CLASS}
                >
                  <option value="">{t('pages.leads.optionUnknown')}</option>
                  <option value="Enriched">{t('pages.leads.optionEnriched')}</option>
                  <option value="Partial">{t('pages.leads.optionPartial')}</option>
                  <option value="Failed">{t('pages.leads.optionFailed')}</option>
                </select>
              </Field>
            </div>
          </div>

          {/* ── Additional Information ── */}
          <div>
            <SectionHeader title={t('pages.leads.sectionExtra')} />
            <Field label={t('pages.leads.fieldNotes')} error={errors.notes}>
              <textarea
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder={t('pages.leads.placeholderNotes')}
                disabled={disabled}
                rows={4}
                className={`resize-none ${errors.notes ? INPUT_ERROR_CLASS : INPUT_CLASS}`}
              />
            </Field>
          </div>

          {/* ── Server error ── */}
          {serverError && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{serverError}</span>
            </div>
          )}
        </div>

        {/* ── Form actions ── */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-400">{t('pages.leads.requiredHint')}</p>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/leads"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
            >
              {t('pages.leads.backToLeads')}
            </Link>
            <button
              type="submit"
              disabled={disabled}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t('pages.leads.submitting')}
                </>
              ) : (
                t('pages.leads.submitCreateLead')
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
