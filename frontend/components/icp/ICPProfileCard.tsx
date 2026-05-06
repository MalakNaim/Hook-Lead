'use client';

import { useState } from 'react';
import type { ICPProfile } from '@/types';
import { useLocale } from '@/lib/i18n';

interface ICPProfileCardProps {
  profile: ICPProfile;
  isActive: boolean;
  onView: (profile: ICPProfile) => void;
  onEdit: (profile: ICPProfile) => void;
  onDuplicate: (profile: ICPProfile) => void;
  onDelete: (id: string) => void;
  onSetActive: (id: string) => void;
}

export function ICPProfileCard({
  profile,
  isActive,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onSetActive,
}: ICPProfileCardProps) {
  const { t } = useLocale();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const updatedDate = new Date(profile.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const painCount = profile.painPoints.length;
  const triggerCount = profile.buyingTriggers.length;

  return (
    <div
      className={`relative flex flex-col bg-white rounded-xl shadow-sm transition-all duration-200 overflow-hidden ${
        isActive
          ? 'border-2 border-indigo-400 ring-4 ring-indigo-50'
          : 'border border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Active top bar */}
      {isActive && <div className="h-1 bg-indigo-600 shrink-0" />}

      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Header: name + updated + action icons */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-slate-900 leading-tight">{profile.name}</h3>
              {isActive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-700 uppercase tracking-wide">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t('pages.icpCard.active')}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              {t('pages.icpCard.updatedOn').replace('{date}', updatedDate)}
            </p>
          </div>

          {/* Action icon row: View · Edit · Duplicate · Delete */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => onView(profile)}
              title={t('pages.icpCard.viewTitle')}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={() => onEdit(profile)}
              title={t('pages.icpCard.editTitle')}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDuplicate(profile)}
              title={t('pages.icpCard.duplicateTitle')}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              title={t('pages.icpCard.deleteBtn')}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-3 flex-1">
          {/* Industries */}
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              {t('pages.icpCard.industries')}
            </p>
            <div className="flex flex-wrap gap-1">
              {profile.industries.slice(0, 2).map((ind) => (
                <span
                  key={ind}
                  className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-medium"
                >
                  {ind}
                </span>
              ))}
              {profile.industries.length > 2 && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">
                  {t('pages.icpCard.more').replace('{count}', String(profile.industries.length - 2))}
                </span>
              )}
            </div>
          </div>

          {/* Job Titles */}
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              {t('pages.icpCard.jobTitles')}
            </p>
            <div className="flex flex-wrap gap-1">
              {profile.jobTitles.slice(0, 2).map((title) => (
                <span
                  key={title}
                  className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium"
                >
                  {title}
                </span>
              ))}
              {profile.jobTitles.length > 2 && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">
                  {t('pages.icpCard.more').replace('{count}', String(profile.jobTitles.length - 2))}
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          {profile.locations.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                {t('pages.icpCard.locations')}
              </p>
              <div className="flex flex-wrap gap-1">
                {profile.locations.slice(0, 2).map((loc) => (
                  <span
                    key={loc}
                    className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-600 rounded text-xs border border-slate-200"
                  >
                    <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {loc}
                  </span>
                ))}
                {profile.locations.length > 2 && (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">
                    {t('pages.icpCard.more').replace('{count}', String(profile.locations.length - 2))}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Size + Budget */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {t('pages.icpCard.companySize')}
              </p>
              <p className="text-xs font-semibold text-slate-700">
                {profile.companySizeMin.toLocaleString()}–
                {profile.companySizeMax.toLocaleString()}
                <span className="font-normal text-slate-400"> emp.</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {t('pages.icpCard.budgetPerMonth')}
              </p>
              <p className="text-xs font-semibold text-slate-700">
                ${profile.budgetMin.toLocaleString()}–${profile.budgetMax.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Summary row: pain points · buying triggers · decision maker */}
          <div className="flex items-center gap-3 flex-wrap text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {painCount === 1
                ? t('pages.icpCard.painPoints').replace('{count}', '1')
                : t('pages.icpCard.painPointsPlural').replace('{count}', String(painCount))}
            </span>
            <span className="text-slate-200">·</span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {triggerCount === 1
                ? t('pages.icpCard.triggers').replace('{count}', '1')
                : t('pages.icpCard.triggersPlural').replace('{count}', String(triggerCount))}
            </span>
            <span className="text-slate-200">·</span>
            <span className="flex items-center gap-1">
              {profile.decisionMaker ? (
                <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-slate-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {profile.decisionMaker ? t('pages.icpCard.dmOnly') : t('pages.icpCard.anySeniority')}
            </span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60">
        {isActive ? (
          <p className="text-center text-xs text-slate-400 py-0.5">
            {t('pages.icpCard.scoringAgainst')}
          </p>
        ) : (
          <button
            onClick={() => onSetActive(profile.id)}
            className="w-full py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            {t('pages.icpCard.setAsActive')}
          </button>
        )}
      </div>

      {/* Delete confirmation overlay */}
      {confirmDelete && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center p-6 text-center z-10">
          <div className="w-11 h-11 bg-red-100 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-5 h-5 text-red-600"
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
          </div>
          <p className="text-sm font-semibold text-slate-800">
            {t('pages.icpCard.deleteTitle').replace('{name}', profile.name)}
          </p>
          <p className="text-xs text-slate-500 mt-1 mb-4">{t('pages.icpCard.deleteDesc')}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-3.5 py-1.5 border border-slate-300 bg-white text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={() => {
                onDelete(profile.id);
                setConfirmDelete(false);
              }}
              className="px-3.5 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors"
            >
              {t('common.yesDelete')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
