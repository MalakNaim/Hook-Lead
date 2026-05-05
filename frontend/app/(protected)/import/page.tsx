'use client';

import { useLocale } from '@/lib/i18n';

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2.5 text-sm text-gray-600">
      <svg className="h-4 w-4 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {children}
    </li>
  );
}

export default function ImportPage() {
  const { t } = useLocale();

  const features = [
    t('pages.import.feature1'),
    t('pages.import.feature2'),
    t('pages.import.feature3'),
    t('pages.import.feature4'),
    t('pages.import.feature5'),
    t('pages.import.feature6'),
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{t('pages.import.title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('pages.import.description')}</p>
      </div>

      {/* Main coming-soon card */}
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          {t('pages.import.comingSoon')}
        </div>

        <h2 className="text-lg font-semibold text-gray-900">{t('pages.import.mainTitle')}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">{t('pages.import.mainDesc')}</p>
      </div>

      {/* Feature preview cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">{t('pages.import.csvTitle')}</h3>
          <p className="mt-1 text-xs text-gray-500">{t('pages.import.csvDesc')}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">{t('pages.import.linkedinTitle')}</h3>
          <p className="mt-1 text-xs text-gray-500">{t('pages.import.linkedinDesc')}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">{t('pages.import.crmTitle')}</h3>
          <p className="mt-1 text-xs text-gray-500">{t('pages.import.crmDesc')}</p>
        </div>
      </div>

      {/* Planned features list */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">{t('pages.import.plannedTitle')}</h3>
        <ul className="space-y-2.5">
          {features.map((feature) => (
            <FeatureItem key={feature}>{feature}</FeatureItem>
          ))}
        </ul>
      </div>
    </div>
  );
}
