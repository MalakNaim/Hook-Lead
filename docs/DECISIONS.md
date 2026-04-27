# Hook Leads — Decision Log

Decisions made before and during development. Add new entries as decisions are made.

---

## Product Decisions

| # | Decision | Rationale |
|---|---|---|
| P-01 | Product name is **Hook Leads** | — |
| P-02 | Multi-tenant architecture from day one | Avoids costly migration later; each tenant has fully isolated data via `TenantId` |
| P-03 | MVP excludes payment integration | Reduces scope; billing can be added post-launch via Stripe |
| P-04 | MVP excludes full LinkedIn scraping | Legal and technical risk; descoped to post-MVP |
| P-05 | MVP uses CSV import and LinkedIn URL input | Fastest path to a working lead pipeline without scraping infrastructure |

---

## Technical Decisions

| # | Area | Decision | Rationale |
|---|---|---|---|
| T-01 | Backend framework | ASP.NET Core Web API, .NET 8 LTS | Long-term support, strong typing, mature ecosystem |
| T-02 | Database | SQL Server | Relational integrity required for multi-tenant data; familiar tooling |
| T-03 | ORM | Entity Framework Core | First-class .NET integration; migrations, LINQ, and change tracking |
| T-04 | Frontend framework | Next.js 14 App Router | Server components, file-based routing, strong TypeScript support |
| T-05 | Frontend language | TypeScript | Type safety across the frontend; required for large codebases |
| T-06 | Frontend styling | Tailwind CSS | Utility-first; fast UI iteration without custom CSS files |
| T-07 | UI component library | shadcn/ui (added post-foundation) | Accessible, unstyled-first components that compose well with Tailwind |
| T-08 | Authentication | JWT + Refresh Tokens | Stateless, scalable; refresh tokens handle session extension |
| T-09 | Social login | Google Login (post-MVP) | Reduces friction for B2B users; deferred to avoid MVP scope creep |
| T-10 | AI provider | Claude API (Anthropic) | Best-in-class for long-form email generation and reasoning tasks |
| T-11 | Email sending | Gmail integration | Most common mailbox for target users; OAuth-based; avoids cold domain issues |
| T-12 | Background jobs | Hangfire | Simple .NET-native job scheduling; SQL Server-backed persistence |
| T-13 | Logging | Serilog | Structured logging with sink flexibility (console, file, future: cloud) |
| T-14 | API documentation | Swagger / OpenAPI | Auto-generated from controllers; standard for .NET APIs |
| T-15 | Validation | FluentValidation | Declarative, testable validation rules in the Application layer |
| T-16 | Architecture | Modular Monolith with Clean Architecture style | Single deployable unit for MVP; Clean Architecture enforces layer boundaries and testability |
