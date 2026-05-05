# Hook Leads — Frontend Progress

## Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Data:** Mock/dummy data only — no backend connection

---

## Routing Structure

All authenticated pages live under the `(protected)` route group with a shared dashboard layout.

```
frontend/app/
├── (auth)/
│   ├── login/
│   └── register/
├── (protected)/
│   ├── layout.tsx          ← Dashboard shell (sidebar + header)
│   ├── dashboard/          ← Dashboard home
│   ├── icp/                ← ICP Management
│   ├── leads/
│   │   ├── page.tsx        ← Leads list
│   │   └── [leadId]/       ← Lead details
│   ├── outreach/           ← Outreach page
│   ├── scoring/            ← Scoring page
│   ├── import/             ← Import page
│   └── settings/           ← Settings (in progress)
└── page.tsx                ← Root redirect
```

---

## Completed Pages

| Page | Route | Status |
|---|---|---|
| Dashboard Home | `/dashboard` | Done |
| ICP Management | `/icp` | Done |
| Leads List | `/leads` | Done |
| Lead Details | `/leads/[leadId]` | Done |
| Outreach | `/outreach` | Done |
| Settings | `/settings` | In Progress |

---

## Layout & Infrastructure

- **Dashboard layout** (`(protected)/layout.tsx`) — sidebar navigation, header, responsive shell
- **Auth layout** (`(auth)/layout.tsx`) — centered card layout for login/register
- **Root layout** (`app/layout.tsx`) — global font, metadata, providers
- **Shared types** (`frontend/types/index.ts`) — TypeScript interfaces for Lead, ICP, Workspace, User, etc.
- **Mock data** (`frontend/lib/dummy-data.ts`) — sample leads, ICPs, and workspace data used across all pages
- **i18n setup** (`frontend/lib/i18n.tsx`) — internationalization scaffold in place

---

## Component Library

Reusable UI components live under `frontend/components/`. Built on top of shadcn/ui primitives.

---

## Current Limitations

- All data is mock/static — no API calls are made
- Auth protection on routes is not enforced yet
- Settings page is partially built
- No end-to-end user flow has been tested

---

## TypeScript

`tsc --noEmit` passes with zero errors.
