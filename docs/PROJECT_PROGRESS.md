# Hook Leads — Project Progress

## Project Info

| Field | Value |
|---|---|
| Project Name | Hook Leads |
| Current Phase | Milestone 4 — Lead Scoring and ICP Matching |
| Current Status | Milestone 3 backend complete and live-verified. All 25 checks passed. Ready for Milestone 4. |
| Last Verified | 2026-04-29 |

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

### Batch 3 — API Endpoints + Auth Middleware ✅
- [x] `AuthController` — `POST /register`, `/login`, `/refresh`, `/logout`, `/forgot-password`, `/reset-password` (all `[AllowAnonymous]`, thin validation + handler dispatch)
- [x] `WorkspaceController` — `GET /workspace`, `GET /workspace/members`, `POST /workspace/invite` (`[Authorize(Roles="Admin")]`), `DELETE /workspace/members/{userId}` (`[Authorize(Roles="Admin")]`)
- [x] `ExceptionHandlingMiddleware` — maps `AppException` (status code from exception), `ValidationException` (400 + error list), unhandled `Exception` (500)
- [x] `CurrentUserService` — resolves `UserId`, `Email`, `Role` from `ClaimTypes` on `HttpContext`
- [x] `CurrentWorkspaceService` — resolves `WorkspaceId` from `"workspaceId"` custom JWT claim
- [x] `JwtService` — `GenerateAccessToken`, `GenerateRefreshToken`, `HashToken` (SHA-256), `GetRefreshTokenExpiry`
- [x] `PasswordHasher` — BCrypt work-factor 12
- [x] `Application/DependencyInjection.cs` — `AddApplication()` registers all handlers + validators via `AddValidatorsFromAssembly`
- [x] `Infrastructure/DependencyInjection.cs` — `AddInfrastructure()` registers DbContext, JwtService, PasswordHasher, Hangfire; `UseInfrastructure()` configures Hangfire dashboard (dev only)
- [x] `Program.cs` — JWT Bearer, Serilog (console + rolling file), Swagger with Bearer security definition, HttpContextAccessor, `AddApplication()`, `AddInfrastructure()`, `ExceptionHandlingMiddleware`, `UseAuthentication`, `UseAuthorization`
- [x] `appsettings.json` — ConnectionStrings + Jwt + Hangfire placeholders
- [x] `appsettings.Development.json` — dev connection string + dev JWT secret
- [x] `Swashbuckle.AspNetCore` pinned to `6.*` (v10 requires `Microsoft.OpenApi 2.x` which reorganises namespaces — incompatible with the project setup)
- [x] Build result: **0 errors, 0 warnings**

### Batch 4 — Frontend Auth Pages ⏸ (deferred — no frontend work per standing rule)
- [ ] `/login` page
- [ ] `/register` page
- [ ] `/forgot-password` page
- [ ] `/reset-password` page
- [ ] Auth API client functions
- [ ] JWT storage + silent refresh on 401
- [ ] Route protection middleware
- [ ] Authenticated layout shell

### Batch 5 — Tests + Documentation Update ✅
- [x] `dotnet build` — **0 errors, 0 warnings**
- [x] `npm run build` — **compiled successfully** on bare Next.js scaffold (re-verify after Batch 4)
- [x] Manual test: `POST /register` → workspace + JWT pair returned ✅
- [x] Manual test: `POST /login` → correct credentials return JWT pair ✅
- [x] Manual test: `POST /login` wrong password → 401 `{"error":"Invalid email or password."}` ✅
- [x] Manual test: `GET /workspace` with JWT → 200; without token → 401 ✅
- [x] Manual test: `POST /refresh` → new token issued, old token revoked ✅
- [x] Manual test: replay rotated-away token → 401 `{"error":"Invalid or expired refresh token."}` ✅
- [x] Manual test: `POST /logout` → 200; revoked token rejected at `/refresh` → 401 ✅
- [x] Manual test: FluentValidation error envelope → `{"error":"Validation failed.","errors":[...],"statusCode":400}` ✅
- [x] Cross-workspace isolation: Workspace B token returns only Workspace B's workspace + members; Alice (Workspace A) is invisible to Bob (Workspace B) and vice versa ✅
- [x] `PROJECT_PROGRESS.md` updated
- [x] `CLAUDE_COMMANDS_LOG.md` updated
- [ ] Milestone 1 commit — pending user approval

---

## Milestone 2 — ICP Management

### Batch 1 — Domain + Infrastructure ✅
- [x] `CriterionType` enum created (`Industry`, `CompanySize`, `JobTitle`, `Geography`, `RevenueRange`)
- [x] `IcpProfile` entity created (`Id`, `WorkspaceId`, `Name`, `IsActive`, `UpdatedAt`, nav props)
- [x] `IcpCriterion` entity created (`Id`, `IcpProfileId`, `CriterionType`, `Value`, `Weight`, nav prop)
- [x] `Workspace` entity updated — added `IcpProfiles` navigation collection
- [x] `IcpProfileConfiguration` — Name required max 200; cascade delete on WorkspaceId FK
- [x] `IcpCriterionConfiguration` — table "IcpCriteria"; CriterionType stored as string max 50; Value max 500; cascade delete on IcpProfileId FK
- [x] `AppDbContext` — added `IcpProfiles` and `IcpCriteria` DbSets + global query filters (IcpCriterion scoped through IcpProfile.WorkspaceId)
- [x] `IApplicationDbContext` — added `IcpProfiles` and `IcpCriteria` properties
- [x] `IcpCriterionResult` DTO created (`Guid Id`, `string CriterionType`, `string Value`, `int Weight`)
- [x] `IcpProfileResult` DTO created (`Guid Id`, `string Name`, `bool IsActive`, `DateTime UpdatedAt`, `List<IcpCriterionResult> Criteria`)
- [x] `AddIcpManagement` EF Core migration generated
- [x] Build result: **0 errors, 0 warnings**

### Batch 2 — Application Use Cases ✅
- [x] `CreateIcpProfileCommand` + handler + validator (one-active-per-workspace rule enforced; deactivates others on activate)
- [x] `UpdateIcpProfileCommand` + handler + validator (deactivates others if activating; updates UpdatedAt)
- [x] `GetActiveIcpProfileQuery` + handler (includes Criteria; returns null if no active profile; scoped via global filter)
- [x] `AddIcpCriterionCommand` + handler + validator (CriterionType must be valid enum; Weight 1–10; Value max 500)
- [x] `UpdateIcpCriterionCommand` + handler + validator (loads criterion via profile; validates same rules as Add)
- [x] `DeleteIcpCriterionCommandHandler` (loads criterion via profile; removes; updates profile.UpdatedAt)
- [x] `Application/DependencyInjection.cs` — all 6 ICP handlers registered as Scoped
- [x] Build result: **0 errors, 0 warnings**

### Batch 3 — API Endpoints ✅
- [x] `IcpController` — 6 endpoints:
  - `POST /icp` → CreateIcpProfile `[Authorize(Roles="Admin")]` → 201
  - `PUT /icp/{id}` → UpdateIcpProfile `[Authorize(Roles="Admin")]` → 200
  - `GET /icp/active` → GetActiveIcpProfile `[Authorize]` → 200 / 404
  - `POST /icp/{id}/criteria` → AddIcpCriterion `[Authorize(Roles="Admin")]` → 200
  - `PUT /icp/{id}/criteria/{criterionId}` → UpdateIcpCriterion `[Authorize(Roles="Admin")]` → 200
  - `DELETE /icp/{id}/criteria/{criterionId}` → DeleteIcpCriterion `[Authorize(Roles="Admin")]` → 204
- [x] Build result: **0 errors, 0 warnings**

### Batch 4 — Frontend ICP Pages ⏸ (deferred — no frontend work per standing rule)
- [ ] ICP profile management UI
- [ ] Add/edit/delete criteria UI

---

## Milestone 3 — Lead Import and Lead Management

### Batch 1 — Domain + Infrastructure ✅
- [x] `LeadStatus` enum created (`New`, `Qualified`, `Disqualified`, `Unsubscribed`)
- [x] `LeadSource` enum created (`CSV`, `LinkedInUrl`, `Manual`)
- [x] `Lead` entity created — all fields per spec (`Id`, `WorkspaceId`, `FirstName`, `LastName`, `Email`, `JobTitle`, `Company`, `Industry`, `CompanySize`, `Geography`, `RevenueRange`, `LinkedInUrl`, `Source`, `Status`, `Notes`, `ImportedAt`)
- [x] `LeadConfiguration` — Email/FirstName/LastName required; Source/Status stored as string; unique index on `(WorkspaceId, Email)`; cascade delete on WorkspaceId FK
- [x] `AppDbContext` — added `Leads` DbSet + global query filter (scoped by `WorkspaceId`)
- [x] `IApplicationDbContext` — added `Leads` property
- [x] `AddLeadManagement` EF Core migration generated
- [x] Build result: **0 errors, 0 warnings**

### Batch 2 — Application Use Cases ✅
- [x] `LeadSummaryResult` DTO (for paginated list)
- [x] `LeadResult` DTO (full detail)
- [x] `ImportPreviewRow` + `ImportPreviewResult` DTOs
- [x] `ImportSummaryResult` DTO
- [x] `PagedResult<T>` generic DTO
- [x] `GetLeadsQuery` + handler — paginated, filters: status, industry, date range; score range params accepted (deferred to Milestone 4)
- [x] `GetLeadByIdQuery` + handler — full detail, 404 if not found
- [x] `UpdateLeadCommand` + handler + validator — editable fields; duplicate email check on change; 409 on conflict
- [x] `DeleteLeadCommandHandler` — 404 if not found
- [x] `UpdateLeadStatusCommand` + handler + validator — parses enum; 400 on invalid
- [x] `AddLeadNoteCommand` + handler + validator — appends `[timestamp | email] note` to Notes field; injects `ICurrentUserService`
- [x] `ImportLeadsCsvCommand` + handler + validator — parses CSV; maps headers case-insensitively; marks duplicates and invalid emails as invalid in preview
- [x] `ConfirmCsvImportCommand` + handler — re-checks duplicates at persist time; returns `ImportSummaryResult`
- [x] `ImportLinkedInLeadCommand` + handler + validator — validates LinkedIn URL; extracts name from handle; returns `ImportPreviewRow`
- [x] `ConfirmLinkedInImportCommand` + handler + validator — duplicate check; persists with `Source = LinkedInUrl`; 409 on conflict
- [x] `Application/DependencyInjection.cs` — all 10 new handlers registered as Scoped
- [x] Build result: **0 errors, 0 warnings**

### Batch 3 — API Endpoints ✅
- [x] `LeadsController` — 6 endpoints:
  - `GET /leads` → GetLeads `[Authorize]` → 200 (paginated)
  - `GET /leads/{id}` → GetLeadById `[Authorize]` → 200 / 404
  - `PUT /leads/{id}` → UpdateLead `[Authorize(Roles="Admin")]` → 200 / 404 / 409
  - `DELETE /leads/{id}` → DeleteLead `[Authorize(Roles="Admin")]` → 204 / 404
  - `PATCH /leads/{id}/status` → UpdateLeadStatus `[Authorize(Roles="Admin")]` → 200 / 400 / 404
  - `POST /leads/{id}/notes` → AddNote `[Authorize]` → 200 / 404
- [x] `ImportController` — 4 endpoints (all `[Authorize(Roles="Admin")]`):
  - `POST /import/csv/preview` → ImportLeadsCsv (multipart file upload) → 200
  - `POST /import/csv/confirm` → ConfirmCsvImport (JSON rows) → 200
  - `POST /import/linkedin/preview` → ImportLinkedInLead (URL) → 200
  - `POST /import/linkedin/confirm` → ConfirmLinkedInImport (full lead fields) → 200 / 409
- [x] Build result: **0 errors, 0 warnings**

### Batch 5 — Live Verification ✅
- [x] Docker SQL Server started; migration `AddLeadManagement` applied
- [x] `Leads` table schema verified: 16 columns, unique index `IX_Leads_WorkspaceId_Email`, FK to `Workspaces`
- [x] 401 on all unauthenticated requests to `/leads`, `/import/*` ✅
- [x] `POST /import/csv/preview` — 2 valid rows, validCount/invalidCount correct ✅
- [x] `POST /import/csv/preview` — missing email row flagged with `"Email is required."` ✅
- [x] `POST /import/csv/confirm` — imports 2 leads; summary `{imported:2, skipped:0, total:2}` ✅
- [x] `GET /leads` — paginated list with status/source ✅
- [x] `GET /leads/{id}` — full detail ✅
- [x] `PUT /leads/{id}` — field update ✅
- [x] `PATCH /leads/{id}/status` — valid value updates; invalid value returns 400 with enum message ✅
- [x] `POST /leads/{id}/notes` — timestamped note appended ✅
- [x] `DELETE /leads/{id}` — 204; subsequent GET returns 404 ✅
- [x] `GET /leads?status=New` / `?pageSize=1` — filter and pagination ✅
- [x] `POST /import/linkedin/preview` → parses handle from URL ✅
- [x] `POST /import/linkedin/confirm` → creates lead with `source=LinkedInUrl` ✅
- [x] Workspace isolation — User2 (WorkspaceB) sees empty leads list ✅
- [x] Cross-workspace 404 — User2 cannot GET a WorkspaceA lead by ID ✅
- [x] Same email in different workspace is allowed (imported:1) ✅
- [x] Duplicate email in same workspace is silently skipped (skipped:1) ✅
- [x] All 25 verification checks: **PASS**

### Batch 4 — Frontend Lead Pages ⏸ (deferred — no frontend work per standing rule)
- [ ] `/leads` paginated list page
- [ ] `/leads/[id]` detail page
- [ ] `/leads/import/csv` page
- [ ] `/leads/import/linkedin` page

---

## Milestone History

| Milestone | Description | Status |
|---|---|---|
| Milestone 0 | Project Foundation | Complete |
| Milestone 1 | Authentication and Workspace | Complete ✅ |
| Milestone 2 | ICP Management | Backend Complete ✅ (frontend deferred) |
| Milestone 3 | Lead Import and Lead Management | Backend Complete ✅ (frontend deferred) |
| Milestone 4 | Lead Scoring and ICP Matching | Not Started |
| Milestone 5 | AI-Assisted Outreach | Not Started |
| Milestone 6 | Email Integration and Send Logs | Not Started |
| Milestone 7 | Export and Notifications | Not Started |
| Milestone 8 | Dashboard and Polish | Not Started |
