'use client';

import { useLocale } from '@/lib/i18n';

function SettingRow({ label, value, desc }: { label: string; value: string; desc?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {desc && <p className="mt-0.5 text-xs text-gray-400">{desc}</p>}
      </div>
      <p className="shrink-0 text-sm text-gray-500">{value}</p>
    </div>
  );
}

export default function WorkspacePage() {
  const { t } = useLocale();

  const features = [
    { title: t('pages.workspace.featureTeamTitle'), desc: t('pages.workspace.featureTeamDesc') },
    { title: t('pages.workspace.featureRolesTitle'), desc: t('pages.workspace.featureRolesDesc') },
    { title: t('pages.workspace.featureBillingTitle'), desc: t('pages.workspace.featureBillingDesc') },
    { title: t('pages.workspace.featureApiTitle'), desc: t('pages.workspace.featureApiDesc') },
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

      {/* Workspace overview */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-900">{t('pages.workspace.overviewTitle')}</h2>
        </div>
        <div className="px-6">
          <SettingRow
            label={t('pages.workspace.nameLabel')}
            value={t('pages.workspace.nameValue')}
            desc={t('pages.workspace.nameDesc')}
          />
          <SettingRow
            label={t('pages.workspace.planLabel')}
            value={t('pages.workspace.planValue')}
            desc={t('pages.workspace.planDesc')}
          />
          <SettingRow
            label={t('pages.workspace.membersLabel')}
            value={t('pages.workspace.membersValue')}
            desc={t('pages.workspace.membersDesc')}
          />
          <SettingRow
            label={t('pages.workspace.createdLabel')}
            value={t('pages.workspace.createdValue')}
            desc={t('pages.workspace.createdDesc')}
          />
        </div>
      </div>

      {/* Coming soon notice */}
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
          <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-gray-900">{t('pages.workspace.mgmtTitle')}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">{t('pages.workspace.mgmtDesc')}</p>
      </div>

      {/* Feature list */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900">{f.title}</h3>
            <p className="mt-1 text-xs text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
