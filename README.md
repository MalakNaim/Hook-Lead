# Hook Leads

**Hook Leads** is a multi-tenant B2B SaaS platform that combines lead generation, ICP matching, lead scoring, AI-assisted email outreach, and manual lead qualification into a single, cohesive workflow — purpose-built for sales teams, marketing agencies, and founders who need pipeline, fast.

---

## MVP Scope

The MVP delivers a working end-to-end lead pipeline for a single tenant:

- Tenant onboarding with ICP definition
- Lead ingestion and enrichment
- ICP matching and AI-powered lead scoring
- AI-drafted outreach emails via Gmail
- Manual lead review and qualification queue
- Basic reporting dashboard

Multi-tenant isolation, billing, and advanced analytics are post-MVP.

---

## Core Features

- **ICP Builder** — Define your Ideal Customer Profile (industry, company size, title, geography, revenue range) to filter and rank incoming leads.
- **Lead Ingestion** — Import leads via CSV upload or manual entry; future integrations with data providers planned.
- **Lead Scoring** — Automated scoring engine matches leads against ICP criteria and surfaces the highest-priority prospects.
- **AI-Assisted Outreach** — Claude API generates personalized cold email drafts based on lead context and ICP, ready for human review before sending.
- **Gmail Integration** — Send approved emails directly from connected Gmail accounts without leaving the platform.
- **Qualification Queue** — Sales reps review, edit, approve, or disqualify leads and email drafts in a structured workflow.
- **Multi-Tenancy** — Each tenant has fully isolated data, configuration, and users.
- **Role-Based Access** — Admin, Manager, and Rep roles with scoped permissions per tenant.
- **Background Jobs** — Async processing for scoring, email generation, and sending via Hangfire.
- **Audit Logging** — Structured logging with Serilog for observability and debugging.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core Web API, .NET 8 LTS |
| Database | SQL Server, Entity Framework Core |
| Auth | JWT + Refresh Tokens |
| Validation | FluentValidation |
| Background Jobs | Hangfire |
| Logging | Serilog |
| API Docs | Swagger / OpenAPI |
| Frontend | Next.js 14 (App Router), TypeScript |
| UI | Tailwind CSS, shadcn/ui |
| AI | Claude API (Anthropic) |
| Email | Gmail API |

---

## Architecture

Hook Leads is built as a **Modular Monolith** following **Clean Architecture** principles.

```
Hook-Lead/
├── src/
│   ├── HookLeads.Api/              # ASP.NET Core entry point, controllers, middleware
│   ├── HookLeads.Application/      # Use cases, commands, queries, DTOs, interfaces
│   ├── HookLeads.Domain/           # Entities, value objects, domain events, enums
│   ├── HookLeads.Infrastructure/   # EF Core, external services (Gmail, Claude), Hangfire
│   └── HookLeads.Web/             # Next.js 14 frontend
├── tests/
│   ├── HookLeads.UnitTests/
│   └── HookLeads.IntegrationTests/
└── docs/                          # Specs, architecture decision records
```

**Key design decisions:**
- Domain and Application layers have zero infrastructure dependencies.
- Each tenant's data is isolated at the database row level via a `TenantId` on all entities.
- AI generation and email sending are handled as background jobs to keep API responses fast.
- The frontend communicates exclusively via the versioned REST API.

---

## Getting Started

> Setup instructions will be added once the initial scaffold is committed.

Prerequisites (planned):
- .NET 8 SDK
- Node.js 20+
- SQL Server (local or Docker)
- Claude API key
- Gmail OAuth credentials

---

## Development Workflow

1. Branch from `main` using the convention `feature/<short-description>` or `fix/<short-description>`.
2. Keep PRs focused — one feature or fix per PR.
3. All backend changes require passing unit tests before merge.
4. Use the Swagger UI (`/swagger`) to verify API changes locally before opening a PR.
5. Frontend changes should be tested in the browser on the happy path and key edge cases.

---

## Spec Kit Workflow

Features in Hook Leads are designed spec-first using a structured **Spec Kit** format before any code is written.

Each feature spec includes:
- **Goal** — what problem this solves and for whom
- **User stories** — written from the perspective of the target user role
- **Acceptance criteria** — explicit pass/fail conditions
- **Data model changes** — new or modified entities and fields
- **API contract** — endpoints, request/response shapes, error codes
- **UI wireframe or description** — layout and interaction notes
- **Out of scope** — explicit exclusions to prevent scope creep

Specs live in `docs/specs/` and are reviewed before implementation begins. No feature moves to code without an approved spec.

---

## License

License TBD.
