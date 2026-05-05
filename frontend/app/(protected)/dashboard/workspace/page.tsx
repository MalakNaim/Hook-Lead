'use client';

import { useLocale } from '@/lib/i18n';

export default function WorkspacePage() {
  const { t } = useLocale();

  const features = [
    {
      title: t('pages.workspace.featureTeamTitle'),
      description: t('pages.workspace.featureTeamDesc'),
      icon: (
        <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.477-3.765M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a4 4 0 015.477-3.765M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: t('pages.workspace.featureRolesTitle'),
      description: t('pages.workspace.featureRolesDesc'),
      icon: (
        <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: t('pages.workspace.featureBillingTitle'),
      description: t('pages.workspace.featureBillingDesc'),
      icon: (
        <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      title: t('pages.workspace.featureApiTitle'),
      description: t('pages.workspace.featureApiDesc'),
      icon: (
        <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
  ];

  const overview = [
    { label: t('pages.workspace.nameLabel'), value: t('pages.workspace.nameValue'), desc: t('pages.workspace.nameDesc') },
    { label: t('pages.workspace.planLabel'), value: t('pages.workspace.planValue'), desc: t('pages.workspace.planDesc') },
    { label: t('pages.workspace.membersLabel'), value: t('pages.workspace.membersValue'), desc: t('pages.workspace.membersDesc') },
    { label: t('pages.workspace.createdLabel'), value: t('pages.workspace.createdValue'), desc: t('pages.workspace.createdDesc') },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t('pages.workspace.title')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('pages.workspace.description')}</p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          {t('pages.workspace.comingSoon')}
        </div>
      </div>

      {/* Overview */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-gray-900">{t('pages.workspace.overviewTitle')}</h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {overview.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-5 py-4 ${
                i < overview.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{row.label}</p>
                <p className="text-xs text-gray-400">{row.desc}</p>
              </div>
              <p className="text-sm text-gray-600 font-medium">{row.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Coming soon */}
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
          <svg className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-gray-900">{t('pages.workspace.mgmtTitle')}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">{t('pages.workspace.mgmtDesc')}</p>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
              {feature.icon}
            </div>
            <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
            <p className="mt-1 text-xs text-gray-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
