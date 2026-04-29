# Hook Leads — Project Progress

## Project Info

| Field | Value |
|---|---|
| Project Name | Hook Leads |
| Current Phase | Milestone 6 — Frontend Foundation |
| Current Status | Milestone 5 backend complete (Batches 1–4). Frontend foundation + E2E verification complete (Batches 1–2). UI/UX improvements complete (Batch 3). All 13 E2E checks pass. |
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

---

## Milestone 4 — Lead Scoring and ICP Matching

### Batch 1 — Domain + Migration ✅
- [x] `Lead` entity updated — added `IcpScore` (`int?`) and `ScoreBreakdown` (`string?`) fields
- [x] `LeadConfiguration` updated — `ScoreBreakdown` mapped as `nvarchar(max)` nullable
- [x] EF Core migration `AddLeadScoring` generated — adds `IcpScore` (int, nullable) and `ScoreBreakdown` (nvarchar(max), nullable) to `Leads` table
- [x] Migration applied to SQL Server — `Leads` table has 18 columns (16 original + 2 scoring)
- [x] Build result: **0 errors, 0 warnings**

### Batch 2 — Application Scoring Service ✅
- [x] `ILeadScoringService` interface created — two methods:
  - `CalculateScore(Lead, IcpProfile)` → `(int score, string breakdown)` — pure, no DB
  - `RescoreWorkspaceLeadsAsync(CancellationToken)` — queries active ICP, rescores all workspace leads, saves
- [x] `LeadScoringService` implementation created in `Application/Services/`
  - **Scoring formula:** `round(matchedWeight / totalWeight × 100)` → 0–100 integer
  - **Matching:** case-insensitive string equality after trim on lead field vs criterion value
  - **CriterionType → Lead field mapping:** `Industry`, `CompanySize`, `JobTitle`, `Geography`, `RevenueRange`
  - **ScoreBreakdown JSON:** camelCase array of `{criterionType, targetValue, leadValue, weight, matched}` per criterion
  - **No active ICP or no criteria:** `IcpScore = null`, `ScoreBreakdown = null`
- [x] `ConfirmCsvImportCommandHandler` updated — queries active ICP before loop; scores each new lead before `SaveChanges`
- [x] `ConfirmLinkedInImportCommandHandler` updated — same; scores the single new lead
- [x] `AddIcpCriterionCommandHandler` updated — calls `RescoreWorkspaceLeadsAsync` after save if profile `IsActive`
- [x] `UpdateIcpCriterionCommandHandler` updated — same
- [x] `DeleteIcpCriterionCommandHandler` updated — same
- [x] `UpdateIcpProfileCommandHandler` updated — replaces Milestone 4 placeholder log; calls `RescoreWorkspaceLeadsAsync` whenever `IsActive` changes direction
- [x] `Application/DependencyInjection.cs` — `ILeadScoringService` registered as scoped
- [x] Build result: **0 errors, 0 warnings**

### Batch 3 — API Endpoints ✅
- [x] `LeadScoreResult` DTO created — `(Guid LeadId, int? Score, object? Breakdown)`
- [x] `GetLeadScoreQuery` + `GetLeadScoreQueryHandler` created — fetches lead via workspace-scoped context; throws 404 if absent; deserializes `ScoreBreakdown` string into `JsonElement` for native JSON response
- [x] `ScoringController` created — two endpoints:
  - `GET /leads/{id}/score` — `[Authorize]` → 200 with `LeadScoreResult` / 401 unauth / 404 not found
  - `POST /scoring/recalculate` — `[Authorize(Roles="Admin")]` → 202 Accepted / 401 unauth / 403 non-Admin
- [x] `GetLeadScoreQueryHandler` registered in `Application/DependencyInjection.cs`
- [x] Build result: **0 errors, 0 warnings**

### Batch 4 — Verification + Commit ✅
- [x] `dotnet build` — **0 errors, 0 warnings**
- [x] SQL Server reachable; all 4 migrations applied (`InitialCreate`, `AddIcpManagement`, `AddLeadManagement`, `AddLeadScoring`)
- [x] `Leads` table has `IcpScore` (int, nullable) and `ScoreBreakdown` (nvarchar(max), nullable) — verified via `sys.columns`
- [x] `GET /leads/{id}/score` unauthenticated → 401 ✅
- [x] `GET /leads/{id}/score` admin (known lead) → 200 `{leadId, score:null, breakdown:null}` ✅ (null correct — no active ICP yet)
- [x] `GET /leads/{id}/score` admin (unknown lead) → 404 ✅
- [x] `POST /scoring/recalculate` unauthenticated → 401 ✅
- [x] `POST /scoring/recalculate` Rep (non-Admin) → 403 ✅
- [x] `POST /scoring/recalculate` Admin → 202 ✅
- [x] Security cleanup: `appsettings.json` reverted to `Password=CHANGE_ME` placeholder; real development credentials stay only in `appsettings.Development.json` (already tracked — credentials mirror docker-compose.yml default, no new exposure)
- [x] Milestone 4 committed

### Batch 4 Supplement — Score surfaced on lead list + detail ✅
- [x] `LeadSummaryResult` updated — added `IcpScore` (`int?`) field
- [x] `LeadResult` updated — added `IcpScore` (`int?`) and `ScoreBreakdown` (`string?`) fields
- [x] `GetLeadsQueryHandler` — `IcpScore` projected in Select; `MinScore`/`MaxScore` filters implemented (previously commented as "deferred to Milestone 4")
- [x] `GetLeadByIdQueryHandler` — `IcpScore` and `ScoreBreakdown` mapped from entity
- [x] All other `LeadResult` constructors updated: `ConfirmLinkedInImportCommandHandler`, `UpdateLeadCommandHandler`, `UpdateLeadStatusCommandHandler`, `AddLeadNoteCommandHandler`
- [x] Build result: **0 errors, 0 warnings**
- [x] Live API: `GET /leads` → `icpScore: 100` present in list item ✅
- [x] Live API: `GET /leads?minScore=90` → returns scored lead (100 ≥ 90) ✅
- [x] Live API: `GET /leads?maxScore=50` → returns empty (100 > 50) ✅
- [x] Live API: `GET /leads/{id}` → `icpScore: 100`, `scoreBreakdown` JSON array present in detail ✅

---

---

## Milestone 5 — AI-Assisted Outreach

### Batch 1 — Domain + Infrastructure + Generate Endpoint ✅
- [x] `OutreachStatus` enum created (`Draft`, `Sent`, `Cancelled`)
- [x] `OutreachMessage` entity created — `Id`, `LeadId`, `WorkspaceId`, `GeneratedBy`, `Subject`, `Body`, `Status`, `CreatedAt` + nav props to `Lead`, `Workspace`, `User`
- [x] `OutreachMessageConfiguration` — Subject max 500; Body `nvarchar(max)`; Status stored as string; cascade delete on LeadId FK; NoAction on WorkspaceId and GeneratedBy FKs
- [x] `AppDbContext` — added `OutreachMessages` DbSet + workspace-scoped global query filter
- [x] `IApplicationDbContext` — added `OutreachMessages` property
- [x] `AddOutreachMessages` EF Core migration generated and applied — `OutreachMessages` table has 8 columns, all non-nullable
- [x] `IOutreachDraftService` interface — `GenerateDraft(Lead)` → `(subject, body)`
- [x] `OutreachDraftService` placeholder implementation — template fills `FirstName`, `Company`, `JobTitle`, `Industry`, `IcpScore` (score note branch on score presence)
- [x] `OutreachMessageResult` DTO — `Id`, `LeadId`, `Subject`, `Body`, `Status`, `CreatedAt`
- [x] `GenerateOutreachMessageCommand` + `GenerateOutreachMessageCommandHandler` — loads lead via workspace-scoped context; blocks `Disqualified` and `Unsubscribed`; persists `Draft` message; returns DTO
- [x] `OutreachController` — `POST /leads/{leadId}/outreach/generate` `[Authorize]` → 201
- [x] `IOutreachDraftService` and `GenerateOutreachMessageCommandHandler` registered in `DependencyInjection.cs`
- [x] Build result: **0 errors, 0 warnings**
- [x] `POST /leads/{id}/outreach/generate` unauthenticated → 401 ✅
- [x] `POST /leads/{id}/outreach/generate` valid `New` lead (score=100) → 201 with subject, body, `status:"Draft"` ✅
- [x] `POST /leads/{id}/outreach/generate` unknown lead → 404 ✅
- [x] `POST /leads/{id}/outreach/generate` `Disqualified` lead → 400 ✅
- [x] `POST /leads/{id}/outreach/generate` `Unsubscribed` lead → 400 ✅

### Batch 2 — Query Messages + Update Status ✅
- [x] `OutreachMessage` entity updated — added `SentAt` (`DateTime?`) field
- [x] `AddOutreachSentAt` EF Core migration generated and applied — adds nullable `SentAt` column to `OutreachMessages` table
- [x] `OutreachMessageResult` DTO updated — added `SentAt` (`DateTime?`) parameter; `GenerateOutreachMessageCommandHandler` updated to pass `message.SentAt`
- [x] `GetOutreachMessagesQuery` + `GetOutreachMessagesQueryHandler` — checks lead exists (404 if not), returns all messages scoped to current workspace sorted newest first
- [x] `UpdateOutreachMessageStatusCommand` + `UpdateOutreachMessageStatusCommandHandler` — parses `OutreachStatus` enum (400 on invalid); sets `SentAt = UtcNow` on first transition to `Sent`; does not overwrite `SentAt` on subsequent status changes; 404 if message not in workspace
- [x] `OutreachController` updated — two new endpoints:
  - `GET /leads/{leadId}/outreach/messages` `[Authorize]` → 200 list / 404
  - `PATCH /outreach/messages/{messageId}/status` `[Authorize]` → 200 / 400 / 404
- [x] `GetOutreachMessagesQueryHandler` and `UpdateOutreachMessageStatusCommandHandler` registered in `DependencyInjection.cs`
- [x] Build result: **0 errors, 0 warnings**
- [x] `GET /leads/{id}/outreach/messages` unauthenticated → 401 ✅
- [x] `GET /leads/{unknownId}/outreach/messages` → 404 ✅
- [x] `GET /leads/{id}/outreach/messages` valid lead, no messages → 200 `[]` ✅
- [x] `GET /leads/{id}/outreach/messages` after generate → 200 with 1 Draft, `sentAt: null` ✅
- [x] `PATCH /outreach/messages/{id}/status` unauthenticated → 401 ✅
- [x] `PATCH /outreach/messages/{unknownId}/status` → 404 ✅
- [x] `PATCH /outreach/messages/{id}/status` invalid value → 400 with enum hint ✅
- [x] `PATCH /outreach/messages/{id}/status` `Sent` → 200, `sentAt` populated with UTC timestamp ✅
- [x] `PATCH /outreach/messages/{id}/status` `Cancelled` → 200, `sentAt` unchanged ✅
- [x] `GET /leads/{id}/outreach/messages` reflects final status with `sentAt` preserved ✅
- [x] Workspace isolation — WS2 user cannot see WS1 lead messages (404) ✅
- [x] Workspace isolation — WS2 user cannot update WS1 message status (404) ✅
- [x] Newest-first sort order verified with multiple messages ✅

### Batch 3 — Click-to-Send Email Draft Endpoint ✅
- [x] `GetOutreachEmailDraftQuery` + `GetOutreachEmailDraftQueryHandler` — loads message with `Lead` navigation included; 404 if not in workspace; 400 if message is Cancelled; 400 if lead email is missing/empty; falls back to default subject if `OutreachMessage.Subject` is empty
- [x] `OutreachEmailDraftResult` DTO — `To`, `Subject`, `Body`, `MailtoUrl`
- [x] mailto URL built with `Uri.EscapeDataString` on subject and body; email address placed unencoded per RFC; newlines encoded as `%0A`; round-trip verified (decode → original body)
- [x] `OutreachController` updated — `GET /outreach/messages/{messageId}/email-draft` `[Authorize]` → 200 / 400 / 404
- [x] `GetOutreachEmailDraftQueryHandler` registered in `DependencyInjection.cs`
- [x] Build result: **0 errors, 0 warnings**
- [x] `GET /outreach/messages/{id}/email-draft` unauthenticated → 401 ✅
- [x] Unknown message → 404 ✅
- [x] Cancelled message → 400 `"Cannot generate email draft for a cancelled message."` ✅
- [x] Valid Draft message → 200 with `to`, `subject`, `body`, `mailtoUrl` all present ✅
- [x] Workspace isolation — WS2 token cannot access WS1 message → 404 ✅
- [x] Lead with blank email → 400 `"Lead does not have an email address."` ✅
- [x] `mailtoUrl` encodes and decodes correctly — subject and body round-trip clean ✅
- [x] No SMTP/real email sending — backend returns only the mailto-ready link ✅

### Batch 4 — Frontend Workflow Contract + Documentation ✅

#### Outreach Frontend Workflow (manual mailto-based, no SMTP)

```
Lead Detail Page
│
├─ Load outreach messages
│    GET /leads/{leadId}/outreach/messages
│    → [] or list of { id, status, subject, sentAt, ... }
│
├─ [Generate Draft] button
│    POST /leads/{leadId}/outreach/generate
│    → 201 { id, subject, body, status:"Draft", sentAt:null }
│    (blocked with 400 if lead is Disqualified or Unsubscribed)
│
├─ [Open Email Draft] button (per message, status=Draft only)
│    GET /outreach/messages/{messageId}/email-draft
│    → 200 { to, subject, body, mailtoUrl }
│    Frontend: window.open(mailtoUrl)  ← opens user's email client
│    User reviews/edits and sends manually from their email client
│
├─ [Mark as Sent] button (user returns after sending)
│    PATCH /outreach/messages/{messageId}/status  { "status": "Sent" }
│    → 200 { id, status:"Sent", sentAt:"<UTC timestamp>", ... }
│    sentAt is set server-side on first Sent transition; not overwritten after.
│
└─ [Cancel] button
     PATCH /outreach/messages/{messageId}/status  { "status": "Cancelled" }
     → 200 { id, status:"Cancelled", sentAt:<preserved if previously Sent> }
     Cancelled messages cannot have an email-draft fetched (400).
```

#### API Contract for Frontend

| Method | Path | Auth | Success | Notes |
|--------|------|------|---------|-------|
| `POST` | `/leads/{leadId}/outreach/generate` | Required | 201 `OutreachMessageResult` | 400 if lead is Disqualified/Unsubscribed; 404 if lead not in workspace |
| `GET` | `/leads/{leadId}/outreach/messages` | Required | 200 `OutreachMessageResult[]` sorted newest-first | 404 if lead not in workspace |
| `GET` | `/outreach/messages/{messageId}/email-draft` | Required | 200 `OutreachEmailDraftResult` | 400 if Cancelled or lead email missing; 404 if not in workspace |
| `PATCH` | `/outreach/messages/{messageId}/status` | Required | 200 `OutreachMessageResult` | Body: `{ "status": "Draft"\|"Sent"\|"Cancelled" }`; 400 on invalid value; 404 if not in workspace |

**`OutreachMessageResult` shape:**
```json
{
  "id": "uuid",
  "leadId": "uuid",
  "subject": "string",
  "body": "string",
  "status": "Draft | Sent | Cancelled",
  "createdAt": "2026-04-29T12:00:00Z",
  "sentAt": "2026-04-29T12:05:00Z | null"
}
```

**`OutreachEmailDraftResult` shape:**
```json
{
  "to": "lead@example.com",
  "subject": "Jane, quick note about Acme Corp",
  "body": "Hi Jane,\n\nI came across...",
  "mailtoUrl": "mailto:lead@example.com?subject=Jane%2C%20quick%20note...&body=Hi%20Jane%2C%0A%0A..."
}
```

**Frontend notes:**
- `mailtoUrl` is fully encoded and safe to pass directly to `window.open()`.
- Newlines in body are encoded as `%0A` and render correctly in most email clients.
- The backend never sends email — all sending is manual via the user's email client.
- `sentAt` is set server-side only on the first transition to `Sent`; subsequent status changes do not overwrite it.

#### Verification
- [x] Build result: **0 errors, 0 warnings** ✅
- [x] Auth guard — all 4 outreach endpoints return 401 without token ✅
- [x] Workspace isolation — WS2 token returns 404 for WS1 messages and leads ✅
- [x] `GET /outreach/messages/{id}/email-draft` Draft message → 200 ✅
- [x] `GET /outreach/messages/{id}/email-draft` Cancelled message → 400 ✅
- [x] `PATCH /outreach/messages/{id}/status` `Sent` → 200 with `sentAt` set ✅

---

---

## Milestone 6 — Frontend Foundation

### Batch 1 — Routing, Auth, Types, Services, Placeholder Pages ✅

**Stack confirmed:** Next.js 14 App Router · TypeScript · Tailwind CSS · `@/*` path alias

**Folder structure added:**
```
frontend/
├── app/
│   ├── (auth)/login/page.tsx       ← login page with form + JWT storage
│   ├── (protected)/
│   │   ├── layout.tsx              ← client-side auth guard + nav header
│   │   ├── leads/page.tsx          ← leads list with table
│   │   └── leads/[leadId]/page.tsx ← lead detail + full outreach section
│   ├── layout.tsx                  ← root layout (title updated)
│   └── page.tsx                    ← redirects to /leads
├── lib/
│   ├── api.ts                      ← apiFetch helper + ApiError class
│   └── auth.ts                     ← saveTokens / getAccessToken / clearTokens / isAuthenticated
├── middleware.ts                    ← cookie-based route guard → redirects to /login
├── services/
│   ├── leadsService.ts             ← getLeads, getLeadById
│   └── outreachService.ts          ← getOutreachMessages, generateOutreachMessage,
│                                      getOutreachEmailDraft, updateOutreachMessageStatus
└── types/index.ts                  ← Lead, LeadSummary, OutreachMessage, OutreachEmailDraftResult,
                                       OutreachStatus, PagedResult<T>
```

**Key decisions:**
- Auth token stored in `localStorage` under `hl_access_token`; a `hl_token` presence cookie is set simultaneously so `middleware.ts` can redirect unauthenticated requests server-side.
- Protected routes also do a client-side `isAuthenticated()` check in `useEffect` as a second-pass guard.
- `apiFetch` reads the token from `localStorage` and attaches `Authorization: Bearer …` header; throws `ApiError` with status code on non-OK responses.
- `useSearchParams()` in login page is wrapped in `<Suspense>` as required by Next.js 14.
- `.env.example` updated: `NEXT_PUBLIC_API_URL=http://localhost:5057` (was 5000).

**Lead detail outreach section implements full workflow UI:**
- Generate Draft button → `POST /leads/{leadId}/outreach/generate`
- Open Email Draft button → `GET /outreach/messages/{messageId}/email-draft` → `window.open(mailtoUrl)`
- Mark as Sent button → `PATCH /outreach/messages/{messageId}/status` `{ status: "Sent" }`
- Cancel button → `PATCH /outreach/messages/{messageId}/status` `{ status: "Cancelled" }`

**Build result:** `npm run build` → **compiled successfully**, 0 TypeScript errors, 0 lint errors
- Routes: `/` (static redirect), `/login` (static), `/leads` (static), `/leads/[leadId]` (dynamic), `/_not-found`
- Middleware compiled: 26.6 kB

### Batch 2 — End-to-End Local Verification ✅

**Issue found and fixed:** Backend had no CORS policy — every browser `fetch` from `http://localhost:3000` was blocked at preflight.

**Fix:** Added `AddCors` + `UseCors("Frontend")` to `backend/src/HookLeads.Api/Program.cs` allowing `http://localhost:3000`. CORS is placed before `UseAuthentication` in the middleware pipeline.

**Launch commands:**
```bash
# 1. SQL Server
docker compose up -d

# 2. Backend  (from /backend)
dotnet run --project src/HookLeads.Api

# 3. Frontend  (from /frontend)
npm run dev
```
URLs: backend `http://localhost:5057` · frontend `http://localhost:3000`

**E2E verification checklist (13/13 passed):**

| # | Check | Result |
|---|---|---|
| 1 | `GET /` (no cookie) → 307 redirect to `/login` | ✅ |
| 2 | `GET /login` → 200 renders | ✅ |
| 3 | `GET /leads` (no cookie) → 307 redirect to `/login` | ✅ |
| 4 | `POST /login` with CORS Origin header → 200 + JWT | ✅ |
| 5 | `GET /leads` with token + CORS Origin → 200 list | ✅ |
| 6 | `GET /leads/{id}` → 200 lead detail | ✅ |
| 7 | `GET /leads/{id}/outreach/messages` → 200 message list | ✅ |
| 8 | `POST /leads/{id}/outreach/generate` → 201 Draft created | ✅ |
| 9 | `GET /outreach/messages/{id}/email-draft` → 200 mailtoUrl | ✅ |
| 10 | `PATCH /outreach/messages/{id}/status` `Sent` → 200 + sentAt set | ✅ |
| 11 | `PATCH /outreach/messages/{id}/status` `Cancelled` → 200 | ✅ |
| 12 | Next.js `/leads` page renders (with cookie) → 200 | ✅ |
| 13 | Next.js `/leads/{id}` page renders (with cookie) → 200 | ✅ |

**Remaining for full browser manual testing:**
- Open `http://localhost:3000/login` in browser, sign in with `outreach2@test.com` / `Test1234!`
- Verify leads table loads and shows Jane Smith
- Verify lead detail shows outreach messages
- Click "Generate Draft" and verify new Draft appears
- Click "Open Email Draft" — browser opens `mailto:` in email client
- Click "Mark as Sent" — message status updates to Sent with sentAt
- Click "Cancel" — message status updates to Cancelled

**Backend build:** `dotnet build` → **0 errors, 0 warnings** ✅
**Frontend build:** `npm run build` → **compiled successfully** ✅

### Batch 3 — Improve Lead Details and Outreach UI/UX ✅

**Changed files:**
- `frontend/app/(protected)/leads/page.tsx` — Leads list page
- `frontend/app/(protected)/leads/[leadId]/page.tsx` — Lead detail + outreach page

**Leads list page improvements:**
- Loading spinner (SVG animate-spin) replaces plain "Loading…" text
- Error displayed in bordered red box with border-red-200 styling
- Status badges are now color-coded: New=blue, Contacted=amber, Qualified=green, Disqualified=red, fallback=gray
- ICP score column is color-coded: ≥71=green, 41–70=amber, <41=red; null displays as "—"
- Company column now shows job title as a secondary line (`block text-xs text-gray-400`)
- Entire table row is clickable (`cursor-pointer` + `router.push`) — removed `<Link>` wrapper on name cell
- Better empty state: two-line message with "No leads yet" + "Import leads to get started."
- Table header has `bg-gray-50` tint for visual separation

**Lead detail page improvements:**
- Loading state uses same spinner component
- Lead profile card has initials avatar (circle with `bg-gray-100`)
- Job title + company shown as subtitle under name
- Lead status badge is color-coded (same mapping as list page)
- ICP score shown as large bold number with color + horizontal progress bar (0–100%)
- Profile fields rendered conditionally — only non-null fields appear (industry, geography, companySize, revenueRange)
- LinkedIn URL rendered as a clickable `<a>` link with `target="_blank"`
- Notes field spans full grid width (`col-span-2 sm:col-span-3`)
- Outreach messages count shown in section header ("Outreach (3)")
- Generate Outreach button shows inline spinner while loading
- Per-message `actionLoading: Record<string, boolean>` — each message's buttons disable independently
- `Mark as Sent` button label changes to "Saving…" while the action is in flight
- Auto-dismissing success notification (green box, 3-second timeout) after generate or status update
- Outreach status badges color-coded: Draft=amber, Sent=green, Cancelled=gray
- Empty state replaced with dashed-border card + descriptive copy
- `sentAt` date displayed in green ("Sent …") when present

**No backend changes. No new dependencies. No API contract changes.**

**Build result:** `npm run build` → **compiled successfully**, 0 TypeScript errors, 0 lint errors ✅
- `/leads` — 2.03 kB (was 1.78 kB)
- `/leads/[leadId]` — 12.1 kB (was 4.32 kB)

---

## Milestone History

| Milestone | Description | Status |
|---|---|---|
| Milestone 0 | Project Foundation | Complete ✅ |
| Milestone 1 | Authentication and Workspace | Complete ✅ |
| Milestone 2 | ICP Management | Backend Complete ✅ (frontend deferred) |
| Milestone 3 | Lead Import and Lead Management | Backend Complete ✅ (frontend deferred) |
| Milestone 4 | Lead Scoring and ICP Matching | Backend Complete ✅ (frontend deferred) |
| Milestone 5 | AI-Assisted Outreach | Batch 1–4 Complete ✅ (backend + workflow contract) |
| Milestone 6 | Frontend Foundation | Batch 1 + Batch 2 + Batch 3 Complete ✅ |
| Milestone 7 | Export and Notifications | Not Started |
| Milestone 8 | Dashboard and Polish | Not Started |
