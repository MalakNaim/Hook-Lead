"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import en from "@/messages/en.json";
import ar from "@/messages/ar.json";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Locale = "en" | "ar";
export type Dir = "ltr" | "rtl";

const MESSAGES: Record<Locale, Record<string, unknown>> = { en, ar };
const STORAGE_KEY = "hl-locale";
const SUPPORTED: Locale[] = ["en", "ar"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const result = path.split(".").reduce<unknown>((acc, key) => {
    if (acc != null && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof result === "string" ? result : path;
}

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  return SUPPORTED.includes(stored as Locale) ? (stored as Locale) : "en";
}

// ── Context ───────────────────────────────────────────────────────────────────

interface LocaleContextValue {
  locale: Locale;
  dir: Dir;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    setLocaleState(readStoredLocale());
  }, []);

  const dir: Dir = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem(STORAGE_KEY, next);
    setLocaleState(next);
  }, []);

  const t = useCallback(
    (key: string) => getNestedValue(MESSAGES[locale], key),
    [locale],
  );

  return (
    <LocaleContext.Provider value={{ locale, dir, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within <LocaleProvider>");
  return ctx;
}
