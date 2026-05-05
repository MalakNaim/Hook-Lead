'use client';

import Link from 'next/link';
import {
  DUMMY_LEADS,
  DASHBOARD_STATS,
  PIPELINE_BREAKDOWN,
  ACTIVITY_FEED,
  type ActivityEventType,
} from '@/lib/dummy-data';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { Badge, classificationVariant } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';

// ── KPI Card ───────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: { label: string; positive: boolean };
}

function KpiCard({ label, value, sub, icon, iconBg, trend }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        {trend && (
          <span
            className={`flex items-center gap-0.5 text-xs font-medium ${
              trend.positive ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              {trend.positive ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              )}
            </svg>
            {trend.label}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="mt-0.5 text-sm text-slate-500">{label}</p>
        {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}

// ── Pipeline Card ──────────────────────────────────────────────────────────────

interface PipelineCardProps {
  label: string;
  count: number;
  total: number;
  barColor: string;
  dotColor: string;
  labelColor: string;
}

function PipelineCard({ label, count, total, barColor, dotColor, labelColor }: PipelineCardProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
        <span className={`text-xs font-semibold uppercase tracking-wider ${labelColor}`}>{label}</span>
      </div>
      <p className="text-3xl font-bold text-slate-900">{count}</p>
      <p className="mt-0.5 text-xs text-slate-400">{pct}% of all leads</p>
      <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Quick Action ───────────────────────────────────────────────────────────────

interface QuickActionProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}

function QuickAction({ href, icon, label, description }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
    >
      <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-700 transition-colors leading-snug">
          {label}
        </p>
        <p className="text-xs text-slate-400 truncate mt-0.5">{description}</p>
      </div>
      <svg
        className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors shrink-0 ml-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

// ── Activity Item ──────────────────────────────────────────────────────────────

const activityMeta: Record<
  ActivityEventType,
  { iconBg: string; iconColor: string; icon: React.ReactNode }
> = {
  enriched: {
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  score: {
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  outreach: {
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  qualified: {
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

function ActivityItem({
  type,
  text,
  time,
}: {
  type: ActivityEventType;
  text: string;
  time: string;
}) {
  const meta = activityMeta[type];
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <div
        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${meta.iconBg} ${meta.iconColor}`}
      >
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-700 leading-snug">{text}</p>
        <p className="mt-0.5 text-[11px] text-slate-400">{time}</p>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const recentLeads = [...DUMMY_LEADS]
    .sort((a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime())
    .slice(0, 6);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* ── Welcome ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Welcome back, Yazan 👋</h1>
          <p className="mt-0.5 text-sm text-slate-500">{today}</p>
        </div>
        <Link
          href="/dashboard/leads"
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.477-3.765M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a4 4 0 015.477-3.765M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          View All Leads
        </Link>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Leads"
          value={DASHBOARD_STATS.totalLeads}
          sub="All time"
          iconBg="bg-indigo-50 text-indigo-600"
          trend={{ label: '+3 this week', positive: true }}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.477-3.765M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a4 4 0 015.477-3.765M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <KpiCard
          label="Qualified Leads"
          value={DASHBOARD_STATS.qualifiedLeads}
          sub="Status: Qualified"
          iconBg="bg-emerald-50 text-emerald-600"
          trend={{ label: `${DASHBOARD_STATS.conversionRate}% of total`, positive: true }}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KpiCard
          label="Reply Rate"
          value={`${DASHBOARD_STATS.replyRate}%`}
          sub="Across all outreach"
          iconBg="bg-sky-50 text-sky-600"
          trend={{ label: '+5% vs last month', positive: true }}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
        />
        <KpiCard
          label="Conversion Rate"
          value={`${DASHBOARD_STATS.conversionRate}%`}
          sub="Lead → Qualified"
          iconBg="bg-amber-50 text-amber-600"
          trend={{ label: '+2% vs last month', positive: true }}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      {/* ── Lead Pipeline Overview ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Lead Pipeline</h2>
            <p className="text-xs text-slate-500 mt-0.5">Classification breakdown</p>
          </div>
          <Link
            href="/dashboard/leads"
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <PipelineCard
            label="Hot"
            count={PIPELINE_BREAKDOWN.hot}
            total={DASHBOARD_STATS.totalLeads}
            barColor="bg-rose-500"
            dotColor="bg-rose-500"
            labelColor="text-rose-600"
          />
          <PipelineCard
            label="Warm"
            count={PIPELINE_BREAKDOWN.warm}
            total={DASHBOARD_STATS.totalLeads}
            barColor="bg-orange-400"
            dotColor="bg-orange-400"
            labelColor="text-orange-600"
          />
          <PipelineCard
            label="Cold"
            count={PIPELINE_BREAKDOWN.cold}
            total={DASHBOARD_STATS.totalLeads}
            barColor="bg-sky-400"
            dotColor="bg-sky-400"
            labelColor="text-sky-600"
          />
          <PipelineCard
            label="Reject"
            count={PIPELINE_BREAKDOWN.reject}
            total={DASHBOARD_STATS.totalLeads}
            barColor="bg-slate-300"
            dotColor="bg-slate-400"
            labelColor="text-slate-500"
          />
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent Leads Table */}
        <Card padding={false} className="lg:col-span-3 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Recent Leads</h2>
              <p className="text-xs text-slate-500 mt-0.5">Latest imports</p>
            </div>
            <Link
              href="/dashboard/leads"
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-6 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                    Job Title
                  </th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-2.5 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-3.5">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 select-none">
                          {lead.firstName[0]}
                          {lead.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-700 transition-colors leading-snug truncate">
                            {lead.firstName} {lead.lastName}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{lead.company}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 hidden md:table-cell">
                      {lead.jobTitle}
                    </td>
                    <td className="px-4 py-3.5">
                      {lead.classification ? (
                        <Badge variant={classificationVariant(lead.classification)}>
                          {lead.classification}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {lead.icpScore !== null ? (
                        <ScoreRing score={lead.icpScore} size="sm" />
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right sidebar */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader title="Quick Actions" description="Jump to key workflows" />
            <div className="space-y-2">
              <QuickAction
                href="/dashboard/icp"
                label="Create ICP"
                description="Define your ideal customer profile"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="4" strokeLinecap="round" />
                    <path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2" />
                  </svg>
                }
              />
              <QuickAction
                href="/dashboard/import"
                label="Import Leads"
                description="Upload a CSV or connect a source"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                }
              />
              <QuickAction
                href="/dashboard/leads"
                label="Review Hot Leads"
                description="Leads with ICP score ≥ 70"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                }
              />
              <QuickAction
                href="/dashboard/outreach"
                label="Create Outreach Sequence"
                description="Draft and send personalized emails"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
            </div>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader title="Recent Activity" description="Latest pipeline events" />
            <div>
              {ACTIVITY_FEED.map((item) => (
                <ActivityItem key={item.id} type={item.type} text={item.text} time={item.time} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
