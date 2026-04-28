# Hook Leads — Project Progress

## Project Info

| Field | Value |
|---|---|
| Project Name | Hook Leads |
| Current Phase | Milestone 1 — Authentication and Workspace |
| Current Status | Milestone 1 in progress. Batch 2 complete. |
| Last Verified | 2026-04-28 |

---

## Milestone 0 — Project Foundation

### Completed

- [x] `README.md` created with project overview, MVP scope, core features, tech stack, architecture, and Spec Kit workflow
- [x] `backend/` folder created — ASP.NET Core .NET 8 Web API with Clean Architecture (Domain, Application, Infrastructure, Api layers)
- [x] `frontend/` folder created — Next.js 14 App Router with TypeScript and Tailwind CSS
- [x] `docs/specs/` folder created for feature spec files
- [x] `.gitignore` created covering .NET, Node, env files, OS, and IDE artifacts
- [x] `backend/.env.example` created with all required environment variable placeholders
- [x] `frontend/.env.example` created with API URL placeholder
- [x] `docker-compose.yml` created for SQL Server 2022 development database
- [x] Backend solution builds successfully with 0 errors and 0 warnings
- [x] Spec Kit constitution created at `docs/specs/constitution.md`
- [x] MVP specification created at `docs/specs/001-hook-leads-mvp/spec.md`
- [x] MVP implementation tasks created at `docs/specs/001-hook-leads-mvp/tasks.md`
- [x] Milestone 0 committed and pushed to `origin/main`

---

## Milestone 1 — Authentication and Workspace

### Batch 1 — Database + Domain Entities ✅
- [x] `UserRole` enum created (`Admin`, `Rep`)
- [x] `Workspace` entity created
- [x] `User` entity created with `WorkspaceId`, `PasswordHash`, `Role`, `IsActive`
- [x] `RefreshToken` entity created with `IsActive` computed property
- [x] `ICurrentWorkspaceService` interface created in Application layer
- [x] `AppDbContext` created with global tenant query filters on `User` and `RefreshToken`
- [x] `AppDbContextFactory` created for `dotnet ef` design-time support
- [x] EF Core entity configurations created for all three entities
- [x] `InitialCreate` migration generated — creates `Workspaces`, `Users`, `RefreshTokens` tables
- [x] `BCrypt.Net-Next` package added to Infrastructure
- [x] Build result: **0 errors, 0 warnings**

### Batch 2 — Application Use Cases + Validation ✅
- [x] `ICurrentUserService` interface
- [x] `IPasswordHasher` interface
- [x] `IJwtService` interface
- [x] `IApplicationDbContext` interface
- [x] `AppException` (400/401/403/404/409/501 status codes)
- [x] `AuthResult`, `UserProfileResult`, `WorkspaceResult`, `WorkspaceMemberResult` DTOs
- [x] `RegisterCommand` + handler + validator
- [x] `LoginCommand` + handler + validator
- [x] `RefreshTokenCommand` + handler + validator (token rotation)
- [x] `LogoutCommand` + handler + validator
- [x] `ForgotPasswordCommand` + handler + validator (email stub — delivery in Milestone 7)
- [x] `ResetPasswordCommand` + handler + validator (stub — full impl in Milestone 7)
- [x] `InviteMemberCommand` + handler + validator (creates inactive user, email stub — Milestone 7)
- [x] `GetWorkspaceQuery` + handler
- [x] `GetWorkspaceMembersQuery` + handler
- [x] `RemoveMemberCommand` + handler + validator (soft-deactivate, self-removal guard)
- [x] Namespace collision fixes: `RefreshTokenEntity` and `WorkspaceEntity` aliases in auth handlers
- [x] Build result: **0 errors, 0 warnings**

### Batch 3 — API Endpoints + Auth Middleware ⬜
- [ ] `AuthController` (6 endpoints)
- [ ] `WorkspaceController` (4 endpoints)
- [ ] `ExceptionHandlingMiddleware`
- [ ] `CurrentUserService` implementation (resolves from `HttpContext`)
- [ ] `Program.cs` — JWT Bearer, Serilog, FluentValidation, Hangfire, Swagger, DbContext, DI wiring
- [ ] `appsettings.Development.json` — connection string placeholder

### Batch 4 — Frontend Auth Pages ⬜
- [ ] `/login` page
- [ ] `/register` page
- [ ] `/forgot-password` page
- [ ] `/reset-password` page
- [ ] Auth API client functions
- [ ] JWT storage + silent refresh on 401
- [ ] Route protection middleware
- [ ] Authenticated layout shell

### Batch 5 — Tests + Documentation Update ⬜
- [ ] `dotnet build` — 0 errors
- [ ] `npm run build` — 0 errors
- [ ] Manual test: register → login → refresh → logout
- [ ] Cross-workspace isolation verified
- [ ] `PROJECT_PROGRESS.md` updated
- [ ] `CLAUDE_COMMANDS_LOG.md` updated
- [ ] Milestone 1 commit

---

## Milestone History

| Milestone | Description | Status |
|---|---|---|
| Milestone 0 | Project Foundation | Complete |
| Milestone 1 | Authentication and Workspace | In Progress |
| Milestone 2 | ICP Management | Not Started |
| Milestone 3 | Lead Import and Lead Management | Not Started |
| Milestone 4 | Lead Scoring and ICP Matching | Not Started |
| Milestone 5 | AI-Assisted Outreach | Not Started |
| Milestone 6 | Email Integration and Send Logs | Not Started |
| Milestone 7 | Export and Notifications | Not Started |
| Milestone 8 | Dashboard and Polish | Not Started |
