'use client';

import { useState } from 'react';
import { DUMMY_USER_SETTINGS } from '@/lib/dummy-data';
import type { UserSettings } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';

const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'GMT / London' },
  { value: 'Europe/Berlin', label: 'Central European Time (CET)' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)' },
  { value: 'Asia/Singapore', label: 'Singapore Time (SGT)' },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية (Arabic)' },
];

// ── Section ────────────────────────────────────────────────────────────────────

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500 leading-relaxed">{description}</p>
        )}
      </div>
      <div className="md:col-span-2">{children}</div>
    </div>
  );
}

// ── Notification Row ───────────────────────────────────────────────────────────

function NotificationRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(DUMMY_USER_SETTINGS);
  const [draft, setDraft] = useState<UserSettings>(DUMMY_USER_SETTINGS);
  const [editingProfile, setEditingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSection, setSavedSection] = useState<string | null>(null);

  function startEdit() {
    setDraft({ ...settings });
    setEditingProfile(true);
  }

  function cancelEdit() {
    setDraft({ ...settings });
    setEditingProfile(false);
  }

  function saveProfile() {
    setSaving(true);
    setTimeout(() => {
      setSettings({ ...draft });
      setSaving(false);
      setEditingProfile(false);
      setSavedSection('profile');
      setTimeout(() => setSavedSection(null), 3000);
    }, 700);
  }

  function updateNotification(key: keyof UserSettings['notifications'], value: boolean) {
    const updated: UserSettings = {
      ...settings,
      notifications: { ...settings.notifications, [key]: value },
    };
    setSettings(updated);
    setSavedSection('notifications');
    setTimeout(() => setSavedSection(null), 2000);
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Manage your account preferences and workspace settings.
        </p>
      </div>

      {/* Profile */}
      <SettingsSection
        title="Profile"
        description="Your personal information visible to your workspace members."
      >
        <Card>
          {editingProfile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={draft.firstName}
                  onChange={(e) => setDraft({ ...draft, firstName: e.target.value })}
                  placeholder="First name"
                />
                <Input
                  label="Last Name"
                  value={draft.lastName}
                  onChange={(e) => setDraft({ ...draft, lastName: e.target.value })}
                  placeholder="Last name"
                />
              </div>
              <Input
                label="Email"
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                placeholder="you@company.com"
              />
              <Input
                label="Role"
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                placeholder="e.g. Admin"
                hint="Your role within the workspace"
              />
              <div className="flex items-center gap-2 pt-2">
                <Button variant="primary" size="sm" onClick={saveProfile} loading={saving}>
                  {saving ? 'Saving…' : 'Save Profile'}
                </Button>
                <Button variant="outline" size="sm" onClick={cancelEdit} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
                  {settings.firstName[0]}{settings.lastName[0]}
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {settings.firstName} {settings.lastName}
                  </p>
                  <p className="text-sm text-slate-500">{settings.email}</p>
                  <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                    {settings.role}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                {savedSection === 'profile' && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Changes saved
                  </span>
                )}
                <div className="ml-auto">
                  <Button variant="outline" size="sm" onClick={startEdit}>
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </SettingsSection>

      <div className="border-t border-slate-100" />

      {/* Preferences */}
      <SettingsSection
        title="Preferences"
        description="Language, timezone, and display settings."
      >
        <Card>
          <div className="space-y-4">
            <Select
              label="Language"
              options={LANGUAGE_OPTIONS}
              value={settings.language}
              onChange={(e) => {
                setSettings({ ...settings, language: e.target.value });
                setSavedSection('preferences');
                setTimeout(() => setSavedSection(null), 2000);
              }}
            />
            <Select
              label="Timezone"
              options={TIMEZONE_OPTIONS}
              value={settings.timezone}
              onChange={(e) => {
                setSettings({ ...settings, timezone: e.target.value });
                setSavedSection('preferences');
                setTimeout(() => setSavedSection(null), 2000);
              }}
            />
            {savedSection === 'preferences' && (
              <p className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Preferences saved
              </p>
            )}
          </div>
        </Card>
      </SettingsSection>

      <div className="border-t border-slate-100" />

      {/* Notifications */}
      <SettingsSection
        title="Notifications"
        description="Choose what you want to be notified about."
      >
        <Card>
          {savedSection === 'notifications' && (
            <p className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mb-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Notification preferences saved
            </p>
          )}
          <NotificationRow
            label="New Leads"
            description="Get notified when new leads are imported or added."
            checked={settings.notifications.newLeads}
            onChange={(v) => updateNotification('newLeads', v)}
          />
          <NotificationRow
            label="Outreach Drafts Ready"
            description="Be alerted when AI generates a new outreach draft."
            checked={settings.notifications.outreachDrafts}
            onChange={(v) => updateNotification('outreachDrafts', v)}
          />
          <NotificationRow
            label="Weekly Digest"
            description="Receive a weekly summary of pipeline activity."
            checked={settings.notifications.weeklyDigest}
            onChange={(v) => updateNotification('weeklyDigest', v)}
          />
          <NotificationRow
            label="Email Alerts"
            description="Receive important alerts to your registered email."
            checked={settings.notifications.emailAlerts}
            onChange={(v) => updateNotification('emailAlerts', v)}
          />
        </Card>
      </SettingsSection>

      <div className="border-t border-slate-100" />

      {/* Danger Zone */}
      <SettingsSection
        title="Danger Zone"
        description="Irreversible actions. Proceed with caution."
      >
        <Card className="border-red-200 bg-red-50/50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Delete Account</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
            </div>
            <Button variant="danger" size="sm" disabled>
              Delete Account
            </Button>
          </div>
        </Card>
      </SettingsSection>
    </div>
  );
}
