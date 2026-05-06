'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { DUMMY_USER_SETTINGS } from '@/lib/dummy-data';
import type { UserSettings } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import { useLocale } from '@/lib/i18n';

// ── Local types ────────────────────────────────────────────────────────────────

type SettingsTab = 'workspace' | 'profile' | 'notifications' | 'team' | 'api-keys' | 'billing';

type TeamMemberRole = 'Admin' | 'Member' | 'Viewer';

interface WorkspaceDraft {
  name: string;
  slug: string;
  description: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  joinedAt: string;
  initials: string;
  color: string;
}

interface ApiKeyRecord {
  id: string;
  label: string;
  masked: string;
  createdAt: string;
  lastUsed: string | null;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const TIMEZONE_OPTIONS = [
  { value: 'America/New_York',  label: 'Eastern Time (ET)' },
  { value: 'America/Chicago',   label: 'Central Time (CT)' },
  { value: 'America/Denver',    label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London',     label: 'GMT / London' },
  { value: 'Europe/Berlin',     label: 'Central European Time (CET)' },
  { value: 'Asia/Dubai',        label: 'Gulf Standard Time (GST)' },
  { value: 'Asia/Singapore',    label: 'Singapore Time (SGT)' },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية (Arabic)' },
];

const ROLE_OPTIONS = [
  { value: 'Admin',  label: 'Admin' },
  { value: 'Member', label: 'Member' },
  { value: 'Viewer', label: 'Viewer' },
];

const INIT_WORKSPACE: WorkspaceDraft = {
  name: 'Hook Leads',
  slug: 'hook-leads',
  description: 'AI-powered lead scoring and outreach automation for modern sales teams.',
};

const MOCK_TEAM: TeamMember[] = [
  { id: 't1', name: 'Yazan Naim',   email: 'yazan@hookleads.io', role: 'Admin',  joinedAt: 'Jan 2025', initials: 'YN', color: 'bg-indigo-600' },
  { id: 't2', name: 'Sara Al-Farsi', email: 'sara@hookleads.io', role: 'Member', joinedAt: 'Feb 2025', initials: 'SA', color: 'bg-emerald-600' },
  { id: 't3', name: 'Omar Khalil',  email: 'omar@hookleads.io', role: 'Viewer', joinedAt: 'Apr 2025', initials: 'OK', color: 'bg-amber-600' },
];

const MOCK_API_KEY: ApiKeyRecord = {
  id: 'key-1',
  label: 'Production API Key',
  masked: 'hl_live_••••••••••••••••a1b2',
  createdAt: 'Apr 1, 2025',
  lastUsed: 'Today',
};

const PLAN_FEATURES = [
  '100 leads / month',
  '50 AI outreach drafts',
  '1 ICP profile',
  'CSV import',
  'Email support',
];

// ── Icons ──────────────────────────────────────────────────────────────────────

function IconBuilding() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}
function IconTeam() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.477-3.765M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a4 4 0 015.477-3.765M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function IconKey() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  );
}
function IconCreditCard() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
function IconCopy() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

// ── Shared sub-components ──────────────────────────────────────────────────────

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-slate-500 leading-relaxed">{description}</p>
        )}
      </div>
      <div className="md:col-span-2">{children}</div>
    </div>
  );
}

function SectionDivider() {
  return <div className="border-t border-slate-100" />;
}

function SavedFeedback({ show, message = 'Changes saved' }: { show: boolean; message?: string }) {
  if (!show) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
      <IconCheck />
      {message}
    </span>
  );
}

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

function UsageBar({ label, used, total }: { label: string; used: number; total: number }) {
  const pct = Math.min(100, Math.round((used / total) * 100));
  const isHigh = pct >= 80;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-slate-700">{label}</span>
        <span className={`text-xs font-medium ${isHigh ? 'text-amber-600' : 'text-slate-500'}`}>
          {used} / {total}
        </span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isHigh ? 'bg-amber-500' : 'bg-indigo-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Workspace tab ──────────────────────────────────────────────────────────────

function WorkspaceTab() {
  const { t } = useLocale();
  const [workspace, setWorkspace] = useState<WorkspaceDraft>(INIT_WORKSPACE);
  const [draft, setDraft] = useState<WorkspaceDraft>(INIT_WORKSPACE);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setWorkspace({ ...draft });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 700);
  }

  return (
    <div className="space-y-8">
      <SettingsSection
        title={t('pages.settings.workspace.generalTitle')}
        description={t('pages.settings.workspace.generalDesc')}
      >
        <Card>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-white font-bold text-xl">
                HL
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{workspace.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">app.hookleads.io/ws/{workspace.slug}</p>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <Input
                label={t('pages.settings.workspace.workspaceName')}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="My Workspace"
              />
              <Input
                label={t('pages.settings.workspace.workspaceUrl')}
                value={draft.slug}
                onChange={(e) =>
                  setDraft({ ...draft, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })
                }
                placeholder="my-workspace"
                hint={t('pages.settings.workspace.workspaceUrlHint')}
              />
              <Textarea
                label={t('pages.settings.workspace.description')}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                placeholder={t('pages.settings.workspace.descriptionPlaceholder')}
                rows={3}
                hint={t('pages.settings.workspace.descriptionHint')}
              />
              <div className="flex items-center gap-3 pt-1">
                <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
                  {saving ? t('pages.settings.workspace.saving') : t('pages.settings.workspace.saveChanges')}
                </Button>
                <SavedFeedback show={saved} />
              </div>
            </div>
          </div>
        </Card>
      </SettingsSection>

      <SectionDivider />

      <SettingsSection
        title={t('pages.settings.workspace.dangerZoneTitle')}
        description={t('pages.settings.workspace.dangerZoneDesc')}
      >
        <Card className="border-red-200 bg-red-50/50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">{t('pages.settings.workspace.deleteWorkspace')}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('pages.settings.workspace.deleteWorkspaceDesc')}
              </p>
            </div>
            <Button variant="danger" size="sm" disabled>
              {t('pages.settings.workspace.deleteWorkspace')}
            </Button>
          </div>
        </Card>
      </SettingsSection>
    </div>
  );
}

// ── Profile tab ────────────────────────────────────────────────────────────────

function ProfileTab() {
  const { t } = useLocale();
  const [settings, setSettings] = useState<UserSettings>(DUMMY_USER_SETTINGS);
  const [draft, setDraft] = useState<UserSettings>(DUMMY_USER_SETTINGS);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);
  const [savedPrefs, setSavedPrefs] = useState(false);

  function startEdit() {
    setDraft({ ...settings });
    setEditing(true);
  }

  function cancelEdit() {
    setDraft({ ...settings });
    setEditing(false);
  }

  function saveProfile() {
    setSaving(true);
    setTimeout(() => {
      setSettings({ ...draft });
      setSaving(false);
      setEditing(false);
      setSavedProfile(true);
      setTimeout(() => setSavedProfile(false), 3000);
    }, 700);
  }

  function updatePref(key: 'language' | 'timezone', value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSavedPrefs(true);
    setTimeout(() => setSavedPrefs(false), 2000);
  }

  return (
    <div className="space-y-8">
      <SettingsSection
        title={t('pages.settings.profile.personalInfoTitle')}
        description={t('pages.settings.profile.personalInfoDesc')}
      >
        <Card>
          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t('pages.settings.profile.firstName')}
                  value={draft.firstName}
                  onChange={(e) => setDraft({ ...draft, firstName: e.target.value })}
                  placeholder="First name"
                />
                <Input
                  label={t('pages.settings.profile.lastName')}
                  value={draft.lastName}
                  onChange={(e) => setDraft({ ...draft, lastName: e.target.value })}
                  placeholder="Last name"
                />
              </div>
              <Input
                label={t('pages.settings.profile.emailAddress')}
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                placeholder="you@company.com"
              />
              <Input
                label={t('pages.settings.profile.role')}
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                placeholder={t('pages.settings.profile.rolePlaceholder')}
                hint={t('pages.settings.profile.roleHint')}
              />
              <div className="flex items-center gap-2 pt-1">
                <Button variant="primary" size="sm" onClick={saveProfile} loading={saving}>
                  {saving ? t('pages.settings.profile.saving') : t('pages.settings.profile.saveProfile')}
                </Button>
                <Button variant="outline" size="sm" onClick={cancelEdit} disabled={saving}>
                  {t('pages.settings.profile.cancel')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white text-xl font-bold">
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
                <SavedFeedback show={savedProfile} message={t('pages.settings.profile.profileSaved')} />
                <div className="ml-auto">
                  <Button variant="outline" size="sm" onClick={startEdit}>
                    {t('pages.settings.profile.editProfile')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </SettingsSection>

      <SectionDivider />

      <SettingsSection
        title={t('pages.settings.profile.preferencesTitle')}
        description={t('pages.settings.profile.preferencesDesc')}
      >
        <Card>
          <div className="space-y-4">
            <Select
              label={t('pages.settings.profile.language')}
              options={LANGUAGE_OPTIONS}
              value={settings.language}
              onChange={(e) => updatePref('language', e.target.value)}
            />
            <Select
              label={t('pages.settings.profile.timezone')}
              options={TIMEZONE_OPTIONS}
              value={settings.timezone}
              onChange={(e) => updatePref('timezone', e.target.value)}
            />
            {savedPrefs && (
              <SavedFeedback show={savedPrefs} message={t('pages.settings.profile.preferencesSaved')} />
            )}
          </div>
        </Card>
      </SettingsSection>
    </div>
  );
}

// ── Notifications tab ──────────────────────────────────────────────────────────

function NotificationsTab() {
  const { t } = useLocale();
  const [notifications, setNotifications] = useState(DUMMY_USER_SETTINGS.notifications);
  const [frequency, setFrequency] = useState('daily');
  const [savedToggles, setSavedToggles] = useState(false);
  const [savedFreq, setSavedFreq] = useState(false);
  const [savingFreq, setSavingFreq] = useState(false);

  const EMAIL_FREQUENCY_OPTIONS = [
    { value: 'realtime', label: t('pages.settings.notifications.freqRealtime') },
    { value: 'daily',    label: t('pages.settings.notifications.freqDaily') },
    { value: 'weekly',   label: t('pages.settings.notifications.freqWeekly') },
    { value: 'never',    label: t('pages.settings.notifications.freqNever') },
  ];

  function updateToggle(key: keyof typeof notifications, value: boolean) {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    setSavedToggles(true);
    setTimeout(() => setSavedToggles(false), 2000);
  }

  function saveFrequency() {
    setSavingFreq(true);
    setTimeout(() => {
      setSavingFreq(false);
      setSavedFreq(true);
      setTimeout(() => setSavedFreq(false), 3000);
    }, 600);
  }

  return (
    <div className="space-y-8">
      <SettingsSection
        title={t('pages.settings.notifications.prefsTitle')}
        description={t('pages.settings.notifications.prefsDesc')}
      >
        <Card>
          {savedToggles && (
            <div className="mb-3">
              <SavedFeedback show={savedToggles} message={t('pages.settings.notifications.prefsUpdated')} />
            </div>
          )}
          <NotificationRow
            label={t('pages.settings.notifications.newLeads')}
            description={t('pages.settings.notifications.newLeadsDesc')}
            checked={notifications.newLeads}
            onChange={(v) => updateToggle('newLeads', v)}
          />
          <NotificationRow
            label={t('pages.settings.notifications.outreachDrafts')}
            description={t('pages.settings.notifications.outreachDraftsDesc')}
            checked={notifications.outreachDrafts}
            onChange={(v) => updateToggle('outreachDrafts', v)}
          />
          <NotificationRow
            label={t('pages.settings.notifications.weeklyDigest')}
            description={t('pages.settings.notifications.weeklyDigestDesc')}
            checked={notifications.weeklyDigest}
            onChange={(v) => updateToggle('weeklyDigest', v)}
          />
          <NotificationRow
            label={t('pages.settings.notifications.emailAlerts')}
            description={t('pages.settings.notifications.emailAlertsDesc')}
            checked={notifications.emailAlerts}
            onChange={(v) => updateToggle('emailAlerts', v)}
          />
        </Card>
      </SettingsSection>

      <SectionDivider />

      <SettingsSection
        title={t('pages.settings.notifications.freqTitle')}
        description={t('pages.settings.notifications.freqDesc')}
      >
        <Card>
          <div className="space-y-4">
            <Select
              label={t('pages.settings.notifications.freqLabel')}
              options={EMAIL_FREQUENCY_OPTIONS}
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            />
            <div className="flex items-center gap-3">
              <Button variant="primary" size="sm" onClick={saveFrequency} loading={savingFreq}>
                {savingFreq ? t('pages.settings.notifications.saving') : t('pages.settings.notifications.save')}
              </Button>
              <SavedFeedback show={savedFreq} message={t('pages.settings.notifications.frequencySaved')} />
            </div>
          </div>
        </Card>
      </SettingsSection>
    </div>
  );
}

// ── Team Members tab ───────────────────────────────────────────────────────────

function TeamTab() {
  const { t } = useLocale();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');
  const [inviting, setInviting] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [inviteError, setInviteError] = useState('');

  function handleInvite() {
    if (!inviteEmail.trim()) {
      setInviteError(t('pages.settings.team.emailError'));
      return;
    }
    if (!inviteEmail.includes('@')) {
      setInviteError(t('pages.settings.team.emailInvalidError'));
      return;
    }
    setInviteError('');
    setInviting(true);
    setTimeout(() => {
      setInviting(false);
      setInviteSent(true);
      setInviteEmail('');
      setTimeout(() => setInviteSent(false), 4000);
    }, 800);
  }

  function roleVariant(role: TeamMemberRole) {
    const map: Record<TeamMemberRole, 'primary' | 'success' | 'neutral'> = {
      Admin: 'primary',
      Member: 'success',
      Viewer: 'neutral',
    };
    return map[role];
  }

  return (
    <div className="space-y-8">
      <SettingsSection
        title={t('pages.settings.team.membersTitle')}
        description={t('pages.settings.team.membersDesc')}
      >
        <Card padding={false}>
          <ul className="divide-y divide-slate-100">
            {MOCK_TEAM.map((member) => (
              <li key={member.id} className="flex items-center gap-4 px-6 py-4">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${member.color} text-white text-sm font-semibold`}
                >
                  {member.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
                  <p className="text-xs text-slate-500 truncate">{member.email}</p>
                </div>
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                  <Badge variant={roleVariant(member.role)}>{member.role}</Badge>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {t('pages.settings.team.joined').replace('{date}', member.joinedAt)}
                  </span>
                </div>
                <Button variant="ghost" size="sm" disabled className="shrink-0 text-slate-400">
                  {t('pages.settings.team.remove')}
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      </SettingsSection>

      <SectionDivider />

      <SettingsSection
        title={t('pages.settings.team.inviteTitle')}
        description={t('pages.settings.team.inviteDesc')}
      >
        <Card>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="sm:col-span-3">
                <Input
                  label={t('pages.settings.team.emailLabel')}
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    if (inviteError) setInviteError('');
                  }}
                  placeholder="colleague@company.com"
                  error={inviteError}
                />
              </div>
              <div className="sm:col-span-2">
                <Select
                  label={t('pages.settings.team.roleLabel')}
                  options={ROLE_OPTIONS}
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={handleInvite}
                loading={inviting}
                icon={!inviting ? <IconPlus /> : undefined}
              >
                {inviting ? t('pages.settings.team.sending') : t('pages.settings.team.sendInvite')}
              </Button>
              {inviteSent && (
                <SavedFeedback show={inviteSent} message={t('pages.settings.team.inviteSent')} />
              )}
            </div>
            <p className="text-xs text-slate-400">
              {t('pages.settings.team.inviteExpiry')}
            </p>
          </div>
        </Card>
      </SettingsSection>
    </div>
  );
}

// ── API Keys tab ───────────────────────────────────────────────────────────────

function ApiKeysTab() {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  function handleCopy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setTimeout(() => setGenerated(false), 4000);
    }, 900);
  }

  return (
    <div className="space-y-8">
      <SettingsSection
        title={t('pages.settings.apiKeys.title')}
        description={t('pages.settings.apiKeys.description')}
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('pages.settings.apiKeys.secretWarning')}
          </p>
          <Card padding={false}>
            <div className="px-6 py-4 border-b border-slate-100">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{MOCK_API_KEY.label}</p>
                  <p className="mt-1 font-mono text-xs text-slate-500 bg-slate-50 rounded-md px-2 py-1 inline-block tracking-wider">
                    {MOCK_API_KEY.masked}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:block text-xs text-slate-400 whitespace-nowrap">
                    {t('pages.settings.apiKeys.created').replace('{date}', MOCK_API_KEY.createdAt)}
                  </span>
                  {MOCK_API_KEY.lastUsed && (
                    <span className="hidden sm:block text-xs text-slate-400 whitespace-nowrap">
                      · {t('pages.settings.apiKeys.used').replace('{date}', MOCK_API_KEY.lastUsed)}
                    </span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    icon={copied ? <IconCheck /> : <IconCopy />}
                  >
                    {copied ? t('pages.settings.apiKeys.copied') : t('pages.settings.apiKeys.copy')}
                  </Button>
                  <Button variant="ghost" size="sm" disabled className="text-red-500 hover:bg-red-50">
                    {t('pages.settings.apiKeys.revoke')}
                  </Button>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50/60">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  loading={generating}
                  icon={!generating ? <IconPlus /> : undefined}
                >
                  {generating ? t('pages.settings.apiKeys.generating') : t('pages.settings.apiKeys.generateNew')}
                </Button>
                {generated && (
                  <SavedFeedback show={generated} message={t('pages.settings.apiKeys.newGenerated')} />
                )}
              </div>
            </div>
          </Card>
        </div>
      </SettingsSection>

      <SectionDivider />

      <SettingsSection
        title={t('pages.settings.apiKeys.webhooksTitle')}
        description={t('pages.settings.apiKeys.webhooksDesc')}
      >
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">{t('pages.settings.apiKeys.webhookEndpoints')}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('pages.settings.apiKeys.webhookEndpointsDesc')}
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
              {t('pages.settings.apiKeys.comingSoon')}
            </span>
          </div>
        </Card>
      </SettingsSection>
    </div>
  );
}

// ── Billing tab ────────────────────────────────────────────────────────────────

function BillingTab() {
  const { t } = useLocale();

  return (
    <div className="space-y-8">
      <SettingsSection
        title={t('pages.settings.billing.planTitle')}
        description={t('pages.settings.billing.planDesc')}
      >
        <Card>
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-base font-bold text-slate-900">{t('pages.settings.billing.starterPlan')}</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                    {t('pages.settings.billing.currentPlan')}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{t('pages.settings.billing.freeTier')}</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                disabled
                icon={<IconStar />}
              >
                {t('pages.settings.billing.upgradePro')}
              </Button>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                {t('pages.settings.billing.includedTitle')}
              </p>
              <ul className="space-y-2">
                {PLAN_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-emerald-500 shrink-0">
                      <IconCheck />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </SettingsSection>

      <SectionDivider />

      <SettingsSection
        title={t('pages.settings.billing.usageTitle')}
        description={t('pages.settings.billing.usageDesc')}
      >
        <Card>
          <div className="space-y-5">
            <UsageBar label={t('pages.settings.billing.leadsImported')} used={35} total={100} />
            <UsageBar label={t('pages.settings.billing.aiDrafts')}      used={6}  total={50} />
            <p className="text-xs text-slate-400">{t('pages.settings.billing.usageResets')}</p>
          </div>
        </Card>
      </SettingsSection>

      <SectionDivider />

      <SettingsSection
        title={t('pages.settings.billing.billingInfoTitle')}
        description={t('pages.settings.billing.billingInfoDesc')}
      >
        <Card className="border-dashed">
          <div className="text-center py-4">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <IconCreditCard />
            </div>
            <p className="text-sm font-medium text-slate-700">{t('pages.settings.billing.noPaymentMethod')}</p>
            <p className="mt-1 text-xs text-slate-500">
              {t('pages.settings.billing.billingManaged')}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              {t('pages.settings.billing.contactSupport')}{' '}
              <span className="font-medium text-indigo-600">support@hookleads.io</span>
            </p>
          </div>
        </Card>
      </SettingsSection>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<SettingsTab>('workspace');

  const TABS: { id: SettingsTab; label: string; renderIcon: () => ReactNode }[] = [
    { id: 'workspace',     label: t('pages.settings.tabs.workspace'),      renderIcon: () => <IconBuilding /> },
    { id: 'profile',       label: t('pages.settings.tabs.profile'),         renderIcon: () => <IconUser /> },
    { id: 'notifications', label: t('pages.settings.tabs.notifications'),   renderIcon: () => <IconBell /> },
    { id: 'team',          label: t('pages.settings.tabs.team'),            renderIcon: () => <IconTeam /> },
    { id: 'api-keys',      label: t('pages.settings.tabs.apiKeys'),         renderIcon: () => <IconKey /> },
    { id: 'billing',       label: t('pages.settings.tabs.billing'),         renderIcon: () => <IconCreditCard /> },
  ];

  function renderContent() {
    switch (activeTab) {
      case 'workspace':     return <WorkspaceTab />;
      case 'profile':       return <ProfileTab />;
      case 'notifications': return <NotificationsTab />;
      case 'team':          return <TeamTab />;
      case 'api-keys':      return <ApiKeysTab />;
      case 'billing':       return <BillingTab />;
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">{t('pages.settings.title')}</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          {t('pages.settings.description')}
        </p>
      </div>

      <div className="flex gap-8 min-h-0">
        {/* ── Sidebar nav ── */}
        <nav className="w-48 shrink-0">
          <ul className="space-y-0.5">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      isActive
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className={`shrink-0 ${isActive ? 'text-slate-700' : 'text-slate-400'}`}>
                      {tab.renderIcon()}
                    </span>
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
