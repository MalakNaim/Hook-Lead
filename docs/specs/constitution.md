# Hook Leads — Spec Kit Constitution

This document defines the non-negotiable rules for building Hook Leads. Every feature spec, implementation decision, and code review must be consistent with this constitution.

---

## 1. Product Principles

- Hook Leads is a multi-tenant SaaS platform for B2B lead generation, ICP matching, lead scoring, AI-assisted outreach, and manual lead qualification.
- The system must be multi-tenant from day one.
- Every tenant-owned business entity must include a `WorkspaceId` field.
- Data isolation between workspaces is mandatory — no query may return data across workspace boundaries.
- Users must only access data belonging to their own workspace.

---

## 2. MVP Scope Rules

### Included in MVP

- Email/password authentication, JWT access tokens, refresh tokens, and password reset flow.
- Google login (post-MVP, but architecture must not block it).
- CSV import and LinkedIn profile URL input and parsing.
- ICP definition and configuration per workspace.
- Lead scoring against ICP criteria.
- AI-assisted outreach message generation via Claude API.
- Gmail connection per workspace user.
- Send logs for all outreach emails.
- Manual or semi-automatic reply status tracking.
- CSV export of leads.
- Email notifications for key events.

### Excluded from MVP

- Payment integration.
- Full LinkedIn scraping.
- Advanced analytics dashboards.
- Fully automated reply classification (unless explicitly specified in a future spec).

---

## 3. Tech Stack Rules

| Layer | Rule |
|---|---|
| Backend framework | Must use ASP.NET Core Web API with .NET 8 LTS |
| Database | Must use SQL Server |
| ORM | Must use Entity Framework Core |
| Validation | Must use FluentValidation |
| Background jobs | Must use Hangfire |
| Logging | Must use Serilog |
| API documentation | Must use Swagger / OpenAPI |
| Frontend framework | Must use Next.js 14 App Router with TypeScript |
| Frontend styling | Must use Tailwind CSS and shadcn/ui |
| AI provider | Must use Claude API (Anthropic) |
| Email integration | Must start with Gmail; structure must be SMTP-compatible for future providers |

---

## 4. Architecture Rules

- Use a Modular Monolith with Clean Architecture style.
- Maintain strict separation between Domain, Application, Infrastructure, and Api layers.
- Business logic must not be placed directly inside controllers.
- Controllers must be thin — they receive requests, delegate to the Application layer, and return responses.
- The **Application layer** contains: use cases, commands, queries, validators, DTOs, and application-level interfaces.
- The **Domain layer** contains: core entities, value objects, enums, domain events, and domain rules.
- The **Infrastructure layer** contains: EF Core DbContext and migrations, external integrations (Gmail, Claude API), email services, and background jobs.
- Shared cross-cutting concerns (e.g. tenant resolution, error handling, response envelopes) must be explicit and reusable, not duplicated per feature.

---

## 5. Security Rules

- Never store raw passwords. Use hashed passwords only (e.g. BCrypt or ASP.NET Core Identity password hasher).
- Authenticate users with JWT access tokens and refresh tokens.
- Refresh tokens must be revocable — store them server-side and invalidate on logout or rotation.
- All sensitive configuration (connection strings, API keys, secrets) must be stored in environment variables. Never hardcode secrets.
- Do not commit `.env` files or secrets to version control.
- Gmail and SMTP credentials must be encrypted at rest or stored via a secure secret store in production.
- All outreach emails must include an unsubscribe link.
- Do not send outreach emails to leads marked as rejected, unsubscribed, or invalid.

---

## 6. Development Workflow Rules

- Every feature must begin with a spec written in `docs/specs/`.
- No feature may be implemented without an approved spec.
- Each spec must include all of the following sections:
  1. **Goal** — what problem this solves and for whom
  2. **User Stories** — written from the perspective of the target user role
  3. **Acceptance Criteria** — explicit pass/fail conditions
  4. **Data Model** — new or modified entities and fields
  5. **API Contract** — endpoints, request/response shapes, error codes
  6. **UI Notes** — layout, interactions, and key screens
  7. **Out of Scope** — explicit exclusions to prevent scope creep
- Implement one milestone at a time. Do not begin the next milestone until the current one is stable.
- After each milestone:
  - Update `docs/PROJECT_PROGRESS.md` with completed work.
  - Add an entry to `docs/CLAUDE_COMMANDS_LOG.md`.
  - Run `dotnet build` on the backend and `npm run build` on the frontend where applicable.
  - Create a git commit marking the milestone as complete.
