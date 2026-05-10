'use client';

import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import {
  previewCsvImport,
  confirmCsvImport,
  type ImportPreviewResult,
  type ImportPreviewRow,
  type ImportSummaryResult,
} from '@/services/importService';

// ── Phase machine ──────────────────────────────────────────────────────────────

type ImportPhase =
  | { kind: 'idle' }
  | { kind: 'parsing' }
  | { kind: 'preview'; data: ImportPreviewResult }
  | { kind: 'importing' }
  | { kind: 'success'; summary: ImportSummaryResult }
  | { kind: 'error'; message: string };

// ── Upload icon ────────────────────────────────────────────────────────────────

function IconUpload({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function Spinner() {
  return (
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
  );
}

// ── Upload zone ────────────────────────────────────────────────────────────────

interface UploadZoneProps {
  dragging: boolean;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onBrowse: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  t: (k: string) => string;
}

function UploadZone({
  dragging,
  onDrop,
  onDragOver,
  onDragLeave,
  onBrowse,
  inputRef,
  onFileChange,
  t,
}: UploadZoneProps) {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`rounded-2xl border-2 border-dashed bg-white transition-colors ${
        dragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex flex-col items-center px-8 py-16 text-center">
        <div
          className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${
            dragging ? 'bg-indigo-100' : 'bg-gray-100'
          }`}
        >
          <IconUpload className={`h-8 w-8 ${dragging ? 'text-indigo-500' : 'text-gray-400'}`} />
        </div>

        <h2 className="text-base font-semibold text-gray-900">{t('pages.import.uploadTitle')}</h2>
        <p className="mt-1.5 text-sm text-gray-500">{t('pages.import.uploadSubtitle')}</p>

        <Button
          variant="outline"
          size="sm"
          className="mt-5"
          onClick={onBrowse}
          type="button"
        >
          {t('pages.import.browseBtn')}
        </Button>

        <p className="mt-6 max-w-md text-xs text-gray-400 leading-relaxed">
          {t('pages.import.uploadHint')}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}

// ── Preview table ──────────────────────────────────────────────────────────────

function fullName(row: ImportPreviewRow): string {
  const parts = [row.firstName, row.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : '—';
}

function Cell({ value }: { value: string | null | undefined }) {
  return (
    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-700 max-w-[140px] truncate">
      {value ?? <span className="text-gray-300">—</span>}
    </td>
  );
}

interface PreviewTableProps {
  data: ImportPreviewResult;
  onConfirm: () => void;
  onCancel: () => void;
  t: (k: string) => string;
  dir: string;
}

function PreviewTable({ data, onConfirm, onCancel, t, dir }: PreviewTableProps) {
  const validCount = data.validCount;
  const invalidCount = data.invalidCount;
  const hasValid = validCount > 0;

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <IconCheck className="h-3 w-3" />
          {t('pages.import.validRows').replace('{count}', String(validCount))}
        </span>
        {invalidCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
            <IconX className="h-3 w-3" />
            {t('pages.import.invalidRows').replace('{count}', String(invalidCount))}{' '}
            — {t('pages.import.willBeSkipped')}
          </span>
        )}
      </div>

      {/* Empty state */}
      {data.rows.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white px-8 py-16 text-center">
          <p className="text-sm font-medium text-gray-700">{t('pages.import.emptyFile')}</p>
          <p className="mt-1 text-sm text-gray-400">{t('pages.import.emptyFileDesc')}</p>
        </div>
      )}

      {/* No valid rows */}
      {data.rows.length > 0 && !hasValid && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-8 py-10 text-center">
          <p className="text-sm font-medium text-red-700">{t('pages.import.noValidRows')}</p>
          <p className="mt-1 text-sm text-red-500">{t('pages.import.noValidRowsDesc')}</p>
        </div>
      )}

      {/* Table */}
      {data.rows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                {[
                  t('pages.import.colFullName'),
                  t('pages.import.colEmail'),
                  t('pages.import.colJobTitle'),
                  t('pages.import.colCompany'),
                  t('pages.import.colLinkedIn'),
                  t('pages.import.colLocation'),
                  t('pages.import.colCompanySize'),
                  t('pages.import.colIndustry'),
                  t('pages.import.colStatus'),
                ].map((col) => (
                  <th
                    key={col}
                    className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-400"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.rows.map((row, idx) => (
                <tr
                  key={idx}
                  className={row.isValid ? 'hover:bg-gray-50/50' : 'bg-red-50/40'}
                >
                  <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900">
                    {fullName(row)}
                  </td>
                  <Cell value={row.email} />
                  <Cell value={row.jobTitle} />
                  <Cell value={row.company} />
                  <Cell value={row.linkedInUrl} />
                  <Cell value={row.geography} />
                  <Cell value={row.companySize} />
                  <Cell value={row.industry} />
                  <td className="px-3 py-3">
                    {row.isValid ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        <IconCheck className="h-3 w-3" />
                        {t('pages.import.statusReady')}
                      </span>
                    ) : (
                      <div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                          <IconX className="h-3 w-3" />
                          {t('pages.import.statusInvalid')}
                        </span>
                        {row.validationError && (
                          <p className="mt-0.5 text-xs text-red-400">{row.validationError}</p>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          variant="primary"
          size="md"
          disabled={!hasValid}
          onClick={onConfirm}
        >
          {t('pages.import.confirmBtn').replace('{count}', String(validCount))}
        </Button>
        <Button variant="ghost" size="md" onClick={onCancel}>
          {t('pages.import.cancelBtn')}
        </Button>
      </div>
    </div>
  );
}

// ── Success view ───────────────────────────────────────────────────────────────

function SuccessView({
  summary,
  onReset,
  t,
}: {
  summary: ImportSummaryResult;
  onReset: () => void;
  t: (k: string) => string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{t('pages.import.title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('pages.import.description')}</p>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-8 py-16 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <IconCheck className="h-7 w-7 text-emerald-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{t('pages.import.successTitle')}</h2>
        <p className="mt-2 text-sm text-gray-600">
          {t('pages.import.successImported').replace('{count}', String(summary.imported))}
        </p>
        {summary.skipped > 0 && (
          <p className="mt-0.5 text-sm text-gray-400">
            {t('pages.import.successSkipped').replace('{skipped}', String(summary.skipped))}
          </p>
        )}

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/dashboard/leads">
            <Button variant="primary" size="md">
              {t('pages.import.viewLeadsBtn')}
            </Button>
          </Link>
          <Button variant="outline" size="md" onClick={onReset}>
            {t('pages.import.importMoreBtn')}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Error view ─────────────────────────────────────────────────────────────────

function ErrorView({
  message,
  onRetry,
  t,
}: {
  message: string;
  onRetry: () => void;
  t: (k: string) => string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{t('pages.import.title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('pages.import.description')}</p>
      </div>

      <div className="rounded-2xl border border-red-200 bg-red-50 px-8 py-16 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <IconX className="h-7 w-7 text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{t('pages.import.errorTitle')}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">{message}</p>
        <div className="mt-6">
          <Button variant="outline" size="md" onClick={onRetry}>
            {t('pages.import.retryBtn')}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Loading view ───────────────────────────────────────────────────────────────

function LoadingView({ label }: { label: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-200 bg-white">
      <div className="flex flex-col items-center gap-3">
        <Spinner />
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ImportPage() {
  const { t, dir } = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<ImportPhase>({ kind: 'idle' });
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File) {
    setPhase({ kind: 'parsing' });
    try {
      const data = await previewCsvImport(file);
      setPhase({ kind: 'preview', data });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setPhase({ kind: 'error', message });
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(true);
  }

  async function handleConfirm(data: ImportPreviewResult) {
    setPhase({ kind: 'importing' });
    try {
      const validRows = data.rows.filter((r) => r.isValid);
      const summary = await confirmCsvImport(validRows);
      setPhase({ kind: 'success', summary });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setPhase({ kind: 'error', message });
    }
  }

  function reset() {
    setPhase({ kind: 'idle' });
  }

  if (phase.kind === 'success') {
    return <SuccessView summary={phase.summary} onReset={reset} t={t} />;
  }

  if (phase.kind === 'error') {
    return <ErrorView message={phase.message} onRetry={reset} t={t} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{t('pages.import.title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('pages.import.description')}</p>
      </div>

      {phase.kind === 'idle' && (
        <UploadZone
          dragging={dragging}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragging(false)}
          onBrowse={() => fileInputRef.current?.click()}
          inputRef={fileInputRef}
          onFileChange={handleFileChange}
          t={t}
        />
      )}

      {phase.kind === 'parsing' && (
        <LoadingView label={t('pages.import.parsing')} />
      )}

      {phase.kind === 'preview' && (
        <PreviewTable
          data={phase.data}
          onConfirm={() => handleConfirm(phase.data)}
          onCancel={reset}
          t={t}
          dir={dir}
        />
      )}

      {phase.kind === 'importing' && (
        <LoadingView label={t('pages.import.importing')} />
      )}
    </div>
  );
}
