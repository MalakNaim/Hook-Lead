'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { DUMMY_OUTREACH, DUMMY_LEADS, DASHBOARD_STATS } from '@/lib/dummy-data';
import type { OutreachStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

type Tab = OutreachStatus | 'All';
const TABS: Tab[] = ['All', 'Draft', 'Sent', 'Cancelled'];

export default function OutreachPage() {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [messages, setMessages] = useState(DUMMY_OUTREACH);

  const filtered = useMemo(
    () =>
      activeTab === 'All'
        ? messages
        : messages.filter((m) => m.status === activeTab),
    [activeTab, messages]
  );

  function getCount(tab: Tab) {
    if (tab === 'All') return messages.length;
    return messages.filter((m) => m.status === tab).length;
  }

  function markAsSent(id: string) {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: 'Sent' as const, sentAt: new Date().toISOString() } : m
      )
    );
  }

  function cancelMessage(id: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'Cancelled' as const } : m))
    );
  }

  const statusVariant = (s: OutreachStatus) => {
    if (s === 'Sent') return 'qualified' as const;
    if (s === 'Draft') return 'warning' as const;
    return 'neutral' as const;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Outreach</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Manage your AI-generated messages and drafts.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: 'Messages Sent',
            value: DASHBOARD_STATS.outreachSent,
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            ),
            accent: 'bg-sky-50 text-sky-600',
          },
          {
            label: 'Drafts Pending',
            value: DASHBOARD_STATS.outreachDrafts,
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ),
            accent: 'bg-amber-50 text-amber-600',
          },
          {
            label: 'Total Messages',
            value: messages.length,
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            ),
            accent: 'bg-indigo-50 text-indigo-600',
          },
        ].map((stat) => (
          <Card key={stat.label} className="flex items-center gap-4 !p-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${stat.accent}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1">
        {TABS.map((tab) => {
          const count = getCount(tab);
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Messages */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            title="No messages"
            description={
              activeTab === 'All'
                ? 'No outreach messages yet. Generate one from a lead profile.'
                : `No ${activeTab.toLowerCase()} messages.`
            }
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => {
            const lead = DUMMY_LEADS.find((l) => l.id === msg.leadId);
            return (
              <Card key={msg.id} padding={false} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Subject + Status */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-900">{msg.subject}</p>
                        <Badge variant={statusVariant(msg.status)}>{msg.status}</Badge>
                      </div>

                      {/* Lead info */}
                      {lead && (
                        <Link
                          href={`/leads/${lead.id}`}
                          className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
                        >
                          <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {lead.firstName[0]}{lead.lastName[0]}
                          </div>
                          {lead.firstName} {lead.lastName}
                          <span className="text-slate-300">·</span>
                          {lead.company}
                          <span className="text-slate-300">·</span>
                          {lead.jobTitle}
                        </Link>
                      )}

                      {/* Body preview */}
                      <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {msg.body.replace(/\n+/g, ' ').slice(0, 200)}
                      </p>

                      {/* Dates */}
                      <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-400">
                        <span>
                          Created{' '}
                          {new Date(msg.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        {msg.sentAt && (
                          <span>
                            Sent{' '}
                            {new Date(msg.sentAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Draft actions */}
                {msg.status === 'Draft' && (
                  <div className="px-5 pb-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => markAsSent(msg.id)}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Mark as Sent
                    </button>
                    <button
                      onClick={() => cancelMessage(msg.id)}
                      className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                      Discard
                    </button>
                    {lead && (
                      <Link
                        href={`/leads/${lead.id}?tab=outreach`}
                        className="ml-auto text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        View in lead →
                      </Link>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
