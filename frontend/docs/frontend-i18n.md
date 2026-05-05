# Frontend Internationalization (i18n)

## Overview

Hook Leads supports two languages:

| Language | Code | Direction |
|----------|------|-----------|
| English  | `en` | LTR       |
| Arabic   | `ar` | RTL       |

The i18n system is **custom-built** — no external library. It uses React Context + localStorage for locale persistence. No URL-based locale routing is used, keeping the existing route structure intact.

---

## Architecture

### Files

```
frontend/
├── messages/
│   ├── en.json          # English translations
│   └── ar.json          # Arabic translations
├── lib/
│   └── i18n.tsx         # LocaleProvider, useLocale hook
└── components/
    └── LanguageSwitcher.tsx  # EN / AR toggle button
```

### How it works

1. **`LocaleProvider`** (in `lib/i18n.tsx`) wraps the entire app in `app/layout.tsx`.
2. On mount it reads the stored locale from `localStorage` (key: `hl-locale`), defaulting to `"en"`.
3. When the locale changes, it sets `document.documentElement.lang` and `document.documentElement.dir` — this applies RTL/LTR to the entire page via the browser's cascade.
4. The `t(key)` function resolves dot-notation keys against the active language's JSON file.
5. **`LanguageSwitcher`** renders an EN / AR toggle and calls `setLocale`.

---

## Usage

### Reading a translation

```tsx
import { useLocale } from "@/lib/i18n";

export function MyComponent() {
  const { t } = useLocale();
  return <h1>{t("auth.login.title")}</h1>;
}
```

The `t` function accepts dot-notation paths that match the structure of the JSON files:

```
"auth.login.title"   → messages/en.json → auth → login → title
```

If a key is missing, `t` returns the key string itself (fail-safe).

### Accessing locale and direction

```tsx
const { locale, dir } = useLocale();
// locale: "en" | "ar"
// dir:    "ltr" | "rtl"
```

### Switching locale

```tsx
const { setLocale } = useLocale();
setLocale("ar"); // persists to localStorage, updates html[dir] and html[lang]
```

---

## Adding a new translation key

1. Add the key to `messages/en.json` and `messages/ar.json` at the same path.
2. Use `t("your.new.key")` in the component.

Example — adding a dashboard greeting:

```json
// en.json
{
  "dashboard": {
    "greeting": "Good morning"
  }
}

// ar.json
{
  "dashboard": {
    "greeting": "صباح الخير"
  }
}
```

---

## RTL / LTR details

- `dir="rtl"` is applied to `<html>` automatically when locale is `ar`.
- Tailwind logical properties are used for RTL-sensitive layout:
  - `ps-*` / `pe-*` instead of `pl-*` / `pr-*` (padding-start / padding-end)
  - `start-*` / `end-*` instead of `left-*` / `right-*` (for absolute positioning)
  - `end-4` in `AuthLayout` places the `LanguageSwitcher` at the trailing edge (right in LTR, left in RTL).

---

## Hydration note

`suppressHydrationWarning` is set on `<html>` in `app/layout.tsx`. This is intentional: the server renders `lang="en"` as default, and the client updates it to the stored locale on mount. The warning is suppressed to avoid noise from this expected mismatch.

---

## Extending to more languages

1. Add a new entry to `MESSAGES` in `lib/i18n.tsx`.
2. Add the language code to the `Locale` type and `SUPPORTED` array.
3. Create `messages/<code>.json`.
4. Add a button to `LanguageSwitcher.tsx`.
