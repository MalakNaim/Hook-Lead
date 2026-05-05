"use client";

import { useLocale, type Locale } from "@/lib/i18n";

const LANGUAGES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ar", label: "عر" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm"
      role="group"
      aria-label="Language switcher"
    >
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          lang={code}
          className={`min-w-[2rem] rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-1 ${
            locale === code
              ? "bg-gray-900 text-white"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
