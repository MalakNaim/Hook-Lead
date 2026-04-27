# Hook Leads MVP — Implementation Tasks

| Field | Value |
|---|---|
| Spec | 001 — Hook Leads MVP |
| Created | 2026-04-27 |
| Status | Not Started |

Tasks are ordered by milestone. Complete one milestone fully before starting the next. Tick each box as work is completed. After each milestone: run builds, update `PROJECT_PROGRESS.md`, log in `CLAUDE_COMMANDS_LOG.md`, and commit.

---

## Milestone 1 — Authentication and Workspace

### Database Tasks
- [ ] Create `Workspaces` table (`Id`, `Name`, `CreatedAt`)
- [ ] Create `Users` table (`Id`, `WorkspaceId`, `Email`, `PasswordHash`, `Role`, `IsActive`, `CreatedAt`)
- [ ] Create `RefreshTokens` table (`Id`, `UserId`, `Token`, `ExpiresAt`, `RevokedAt`, `CreatedAt`)
- [ ] Add FK: `Users.WorkspaceId → Workspaces.Id`
- [ ] Add FK: `RefreshTokens.UserId → Users.Id`
- [ ] Add EF Core global query filter on all tenant entities scoped by `WorkspaceId`
- [ ] Create and apply initial EF Core migration

### Backend Tasks
- [ ] Define `Workspace` entity in `HookLeads.Domain/Entities`
- [ ] Define `User` entity with `Role` enum (`Admin`, `Rep`) in `HookLeads.Domain/Entities`
- [ ] Define `RefreshToken` entity in `HookLeads.Domain/Entities`
- [ ] Add `AppDbContext` to `HookLeads.Infrastructure/Persistence` with all entity configurations
- [ ] Implement `ICurrentUserService` interface in Application; resolve from `HttpContext` in Api
- [ ] Implement `ICurrentWorkspaceService` to resolve `WorkspaceId` from JWT claims
- [ ] Implement password hashing service (`IPasswordHasher`) using BCrypt
- [ ] Implement JWT generation service (`IJwtService`) — access token + claims
- [ ] Implement refresh token generation, storage, rotation, and revocation
- [ ] Create `RegisterCommand` + handler: create workspace + user, hash password, return JWT pair
- [ ] Create `LoginCommand` + handler: validate credentials, return JWT + refresh token
- [ ] Create `RefreshTokenCommand` + handler: validate, rotate, return new JWT pair
- [ ] Create `LogoutCommand` + handler: revoke refresh token
- [ ] Create `ForgotPasswordCommand` + handler: generate reset token, queue email (placeholder — no email send yet)
- [ ] Create `ResetPasswordCommand` + handler: validate token, update password hash
- [ ] Create `InviteMemberCommand` + handler: create inactive user record, queue invite email (placeholder)
- [ ] Add `AuthController` with endpoints: `POST /register`, `POST /login`, `POST /refresh`, `POST /logout`, `POST /forgot-password`, `POST /reset-password`
- [ ] Add `WorkspaceController` with endpoints: `GET /workspace`, `GET /workspace/members`, `POST /workspace/invite`, `DELETE /workspace/members/{userId}`
- [ ] Add FluentValidation validators for all commands
- [ ] Add JWT Bearer authentication middleware to `Program.cs`
- [ ] Add global exception handling middleware returning consistent error envelopes
- [ ] Configure Serilog in `Program.cs` with console and file sinks

### Frontend Tasks
- [ ] Create `/login` page with email/password form and submit handler
- [ ] Create `/register` page with name, email, password, workspace name fields
- [ ] Create `/forgot-password` page with email input
- [ ] Create `/reset-password` page with new password and confirm fields
- [ ] Implement auth API client functions (`login`, `register`, `refresh`, `logout`)
- [ ] Implement JWT storage strategy (memory or HTTP-only cookie via API route)
- [ ] Implement refresh token silent renewal on 401 responses
- [ ] Add route protection: redirect unauthenticated users to `/login`
- [ ] Add basic authenticated layout shell with sidebar placeholder and user menu

### Tests / Checks
- [ ] Verify `dotnet build` passes with 0 errors
- [ ] Manually test: register → login → access protected endpoint → refresh → logout
- [ ] Verify a request with a token from Workspace A cannot access data from Workspace B
- [ ] Verify revoked refresh token is rejected on next use
- [ ] Verify `npm run build` passes on frontend

### Acceptance Criteria
- A new user can register, which creates a workspace and returns a valid JWT pair.
- Login with correct credentials returns a JWT and refresh token.
- Login with incorrect credentials returns 401.
- Refresh token rotation issues a new token and revokes the old one.
- A revoked or expired refresh token is rejected with 401.
- All protected endpoints return 403 when accessed without a valid JWT.
- All tenant data queries are automatically scoped to the authenticated user's workspace.

### Out of Scope
- Google login
- Email sending (password reset and invite emails are placeholder stubs only)
- Two-factor authentication
- Session management UI

---

## Milestone 2 — ICP Management

### Database Tasks
- [ ] Create `IcpProfiles` table (`Id`, `WorkspaceId`, `Name`, `IsActive`, `UpdatedAt`)
- [ ] Create `IcpCriteria` table (`Id`, `IcpProfileId`, `CriterionType`, `Value`, `Weight`)
- [ ] Add FK: `IcpProfiles.WorkspaceId → Workspaces.Id`
- [ ] Add FK: `IcpCriteria.IcpProfileId → IcpProfiles.Id`
- [ ] Add `CriterionType` enum (`Industry`, `CompanySize`, `JobTitle`, `Geography`, `RevenueRange`)
- [ ] Create and apply EF Core migration

### Backend Tasks
- [ ] Define `IcpProfile` and `IcpCriteria` entities in `HookLeads.Domain/Entities`
- [ ] Create `CreateIcpProfileCommand` + handler
- [ ] Create `UpdateIcpProfileCommand` + handler (set `UpdatedAt`, trigger rescore job placeholder)
- [ ] Create `GetActiveIcpProfileQuery` + handler
- [ ] Create `AddIcpCriterionCommand` + handler
- [ ] Create `UpdateIcpCriterionCommand` + handler
- [ ] Create `DeleteIcpCriterionCommand` + handler
- [ ] Enforce one active ICP per workspace — deactivate previous on new activation
- [ ] Add FluentValidation validators for all ICP commands (weight range 1–10, required fields)
- [ ] Add `IcpController` with all CRUD endpoints

### Frontend Tasks
- [ ] Create `/icp` page with active ICP display
- [ ] Add ICP criteria form: criterion type dropdown, value input, weight slider (1–10)
- [ ] Add ability to add, edit, and delete individual criteria
- [ ] Show save confirmation and updated timestamp after changes
- [ ] Show empty state when no ICP is configured

### Tests / Checks
- [ ] Verify `dotnet build` passes with 0 errors
- [ ] Manually test: create ICP → add criteria → update criterion → delete criterion
- [ ] Verify only one ICP is active per workspace at a time
- [ ] Verify ICP from another workspace is not accessible

### Acceptance Criteria
- A workspace admin can create an ICP profile with at least one criterion.
- Criteria can be added, edited, and deleted individually.
- Only one ICP profile can be active per workspace at a time.
- Updating the ICP sets `UpdatedAt` and enqueues a rescore job (rescore job implemented in Milestone 4).
- ICP data is workspace-scoped — no cross-workspace access.

### Out of Scope
- Score recalculation (implemented in Milestone 4)
- Multiple simultaneous ICP profiles
- ICP versioning or history

---

## Milestone 3 — Lead Import and Lead Management

### Database Tasks
- [ ] Create `Leads` table with all fields: `Id`, `WorkspaceId`, `FirstName`, `LastName`, `Email`, `JobTitle`, `Company`, `Industry`, `CompanySize`, `Geography`, `RevenueRange`, `LinkedInUrl`, `Source`, `Status`, `Notes`, `ImportedAt`
- [ ] Add `Source` enum (`CSV`, `LinkedInUrl`, `Manual`)
- [ ] Add `LeadStatus` enum (`New`, `Qualified`, `Disqualified`, `Unsubscribed`)
- [ ] Add FK: `Leads.WorkspaceId → Workspaces.Id`
- [ ] Add unique index on (`WorkspaceId`, `Email`) for duplicate detection
- [ ] Create and apply EF Core migration

### Backend Tasks
- [ ] Define `Lead` entity in `HookLeads.Domain/Entities`
- [ ] Create `ImportLeadsCsvCommand` + handler: parse CSV, validate rows, return preview DTO
- [ ] Create `ConfirmCsvImportCommand` + handler: persist valid rows, return import summary (imported count, skipped count)
- [ ] Create `ImportLinkedInLeadCommand` + handler: accept URL, extract fields via basic parsing, return preview DTO
- [ ] Create `ConfirmLinkedInImportCommand` + handler: persist parsed lead
- [ ] Implement duplicate detection: skip rows where `(WorkspaceId, Email)` already exists
- [ ] Create `GetLeadsQuery` + handler: paginated list with filters (status, score range, industry, date)
- [ ] Create `GetLeadByIdQuery` + handler: full lead detail
- [ ] Create `UpdateLeadCommand` + handler: update editable fields
- [ ] Create `DeleteLeadCommand` + handler
- [ ] Create `UpdateLeadStatusCommand` + handler: qualify, disqualify, or set status
- [ ] Create `AddLeadNoteCommand` + handler: append note with timestamp and user
- [ ] Add FluentValidation validators for all lead commands
- [ ] Add `LeadsController` with all endpoints
- [ ] Add `ImportController` with CSV and LinkedIn endpoints

### Frontend Tasks
- [ ] Create `/leads` page: paginated table with columns (name, company, title, score badge, status, reply status)
- [ ] Add filter bar: status dropdown, industry input, date range picker, score range slider
- [ ] Create `/leads/[id]` lead detail page: profile fields, score section (placeholder), outreach history (placeholder), reply status, notes list
- [ ] Add qualify / disqualify action buttons on lead detail page
- [ ] Add notes input and notes history section on lead detail page
- [ ] Create `/leads/import/csv` page: file upload, column mapping step, preview table, confirm button, import summary
- [ ] Create `/leads/import/linkedin` page: URL input, parsed field preview, confirm button
- [ ] Show empty state on leads list when no leads exist

### Tests / Checks
- [ ] Verify `dotnet build` passes with 0 errors
- [ ] Manually test: upload CSV → preview → confirm → verify leads appear in list
- [ ] Manually test: input LinkedIn URL → preview → confirm → verify lead appears
- [ ] Verify duplicate email in same workspace is skipped during import
- [ ] Verify leads from another workspace are not returned
- [ ] Verify `npm run build` passes on frontend

### Acceptance Criteria
- A valid CSV upload produces a preview before committing.
- Rows with missing required fields are skipped and counted in the import summary.
- A LinkedIn URL produces a parsed lead preview with available fields pre-filled.
- Duplicate email in the same workspace is detected and skipped.
- Leads list supports pagination, filtering by status, industry, and date.
- A lead can be manually qualified, disqualified, or marked as unsubscribed.
- Notes can be added to a lead and displayed in order.

### Out of Scope
- Lead scoring (Milestone 4)
- AI outreach generation (Milestone 5)
- Full LinkedIn scraping
- Bulk lead editing

---

## Milestone 4 — Lead Scoring and ICP Matching

### Database Tasks
- [ ] Create `LeadScores` table (`Id`, `LeadId`, `IcpProfileId`, `TotalScore`, `Breakdown`, `ScoredAt`)
- [ ] Store `Breakdown` as JSON column
- [ ] Add FK: `LeadScores.LeadId → Leads.Id`
- [ ] Add FK: `LeadScores.IcpProfileId → IcpProfiles.Id`
- [ ] Create and apply EF Core migration

### Backend Tasks
- [ ] Define `LeadScore` entity in `HookLeads.Domain/Entities`
- [ ] Implement scoring engine in `HookLeads.Application`: match lead fields against each `IcpCriteria`, compute weighted score, produce per-criterion breakdown
- [ ] Create `ScoreLeadCommand` + handler: score a single lead against the active ICP
- [ ] Create `RecalculateWorkspaceScoresCommand` + handler: enqueue scoring job for all leads in workspace (used after ICP update)
- [ ] Register Hangfire job to execute `RecalculateWorkspaceScoresCommand` in background
- [ ] Wire ICP `UpdatedAt` trigger to enqueue the Hangfire recalculation job
- [ ] Create `GetLeadScoreQuery` + handler: return total score and breakdown for a lead
- [ ] Add `ScoringController` with `GET /leads/{id}/score` and `POST /scoring/recalculate`
- [ ] Surface score on `GetLeadsQuery` response DTO

### Frontend Tasks
- [ ] Add score badge to leads list (colour-coded: green/amber/red by range)
- [ ] Add score breakdown section on lead detail page (criterion, target value, actual value, points awarded)
- [ ] Show "Score Pending" state when score has not yet been calculated
- [ ] Show "Rescoring in Progress" indicator after ICP update

### Tests / Checks
- [ ] Verify `dotnet build` passes with 0 errors
- [ ] Manually test: create ICP with criteria → import leads → verify scores are calculated
- [ ] Verify score breakdown lists each criterion and its contribution
- [ ] Verify updating the ICP triggers a rescore and updated scores appear
- [ ] Verify leads with no matching criteria receive a score of 0

### Acceptance Criteria
- Every lead in a workspace has a score calculated against the active ICP.
- The score detail shows a per-criterion breakdown with points awarded.
- Updating the ICP enqueues a background rescore for all workspace leads.
- Leads list displays the current score for each lead.
- A lead with no ICP match scores 0 and shows an empty breakdown.

### Out of Scope
- Machine learning or AI-based scoring
- Score history over time
- Manual score overrides

---

## Milestone 5 — AI-Assisted Outreach

### Database Tasks
- [ ] Create `OutreachMessages` table (`Id`, `LeadId`, `WorkspaceId`, `GeneratedBy`, `Subject`, `Body`, `Status`, `CreatedAt`)
- [ ] Add `OutreachStatus` enum (`Draft`, `Sent`, `Cancelled`)
- [ ] Add FK: `OutreachMessages.LeadId → Leads.Id`
- [ ] Add FK: `OutreachMessages.WorkspaceId → Workspaces.Id`
- [ ] Create and apply EF Core migration

### Backend Tasks
- [ ] Define `OutreachMessage` entity in `HookLeads.Domain/Entities`
- [ ] Define `IAiService` interface in `HookLeads.Application/Common/Interfaces`
- [ ] Implement `ClaudeAiService` in `HookLeads.Infrastructure/Services` using Claude API (Anthropic SDK)
- [ ] Build prompt template: combine lead profile fields + ICP context → structured prompt for cold email generation
- [ ] Create `GenerateOutreachMessageCommand` + handler: call `IAiService`, persist draft, return message DTO
- [ ] Create `GetOutreachMessagesQuery` + handler: list outreach messages for a lead
- [ ] Create `UpdateOutreachMessageCommand` + handler: allow editing subject and body of a draft
- [ ] Block send if lead status is `Unsubscribed`, `Disqualified`, or `Invalid`
- [ ] Add `OutreachController` with endpoints: `POST /leads/{id}/outreach/generate`, `GET /leads/{id}/outreach`, `PUT /outreach/{messageId}`
- [ ] Add FluentValidation for outreach commands
- [ ] Store Claude API key from environment variable (`Claude__ApiKey`)

### Frontend Tasks
- [ ] Create `/leads/[id]/outreach` page: generate button, loading state, draft display
- [ ] Add subject and body edit fields on the outreach page
- [ ] Add "Regenerate" button to request a new draft
- [ ] Disable generate and send buttons for unsubscribed or disqualified leads with explanatory message
- [ ] Show outreach message history list below the composer

### Tests / Checks
- [ ] Verify `dotnet build` passes with 0 errors
- [ ] Manually test: generate draft for a lead → review output → edit → verify saved
- [ ] Verify generation is blocked for unsubscribed and disqualified leads
- [ ] Verify regeneration produces a new draft without overwriting the previous one
- [ ] Verify Claude API key is read from environment and not hardcoded

### Acceptance Criteria
- An outreach draft is generated for a lead using that lead's profile and the workspace ICP.
- The draft can be edited before sending.
- A new draft can be generated without overwriting the previous draft.
- Generation and sending are blocked for leads with status `Unsubscribed` or `Disqualified`.
- The Claude API key is sourced from environment variables only.

### Out of Scope
- Sending emails (Milestone 6)
- Sequence or follow-up scheduling
- A/B testing of message variants
- Tone or style configuration UI

---

## Milestone 6 — Email Integration and Send Logs

### Database Tasks
- [ ] Create `GmailConnections` table (`Id`, `WorkspaceId`, `GmailAddress`, `AccessToken`, `RefreshToken`, `TokenExpiresAt`, `ConnectedAt`)
- [ ] Create `EmailSendLogs` table (`Id`, `WorkspaceId`, `OutreachMessageId`, `LeadId`, `SentAt`, `DeliveryStatus`, `GmailMessageId`)
- [ ] Create `ReplyStatuses` table (`Id`, `LeadId`, `Status`, `UpdatedBy`, `UpdatedAt`)
- [ ] Create `UnsubscribeTokens` table (`Id`, `LeadId`, `Token`, `UsedAt`, `CreatedAt`)
- [ ] Add `DeliveryStatus` enum (`Sent`, `Bounced`, `Failed`)
- [ ] Add `ReplyStatusType` enum (`NoReply`, `Replied`, `Bounced`, `Interested`)
- [ ] Add all FKs and create and apply EF Core migration

### Backend Tasks
- [ ] Define all new entities in `HookLeads.Domain/Entities`
- [ ] Define `IEmailSender` interface in `HookLeads.Application/Common/Interfaces` (SMTP-compatible abstraction)
- [ ] Implement `GmailEmailSender` in `HookLeads.Infrastructure/Services` using Gmail API
- [ ] Implement Gmail OAuth flow: `GET /gmail/connect` initiates, `GET /gmail/callback` exchanges code for tokens
- [ ] Encrypt and store Gmail OAuth tokens in `GmailConnections`
- [ ] Implement token refresh logic for Gmail access tokens before each send
- [ ] Create `SendOutreachEmailCommand` + handler: validate lead not unsubscribed, generate unsubscribe token, append unsubscribe link to body, send via `IEmailSender`, write `EmailSendLog`, update `OutreachMessage` status to `Sent`
- [ ] Create `DisconnectGmailCommand` + handler: remove `GmailConnection` record
- [ ] Create `GetGmailStatusQuery` + handler: return connection status and address
- [ ] Create `GetSendLogsQuery` + handler: paginated logs with filters (lead, date range, status)
- [ ] Create `UpdateReplyStatusCommand` + handler: update `ReplyStatus` for a lead
- [ ] Create `ProcessUnsubscribeCommand` + handler: mark token used, set lead status to `Unsubscribed`
- [ ] Add `GmailController`: `GET /gmail/connect`, `GET /gmail/callback`, `GET /gmail/status`, `DELETE /gmail/disconnect`
- [ ] Add `SendLogsController`: `GET /send-logs`, `GET /send-logs/{id}`
- [ ] Add `PATCH /leads/{id}/reply-status` to `LeadsController`
- [ ] Add public `GET /unsubscribe/{token}` endpoint (no auth required)
- [ ] Surface Gmail sending errors in `EmailSendLog` with `DeliveryStatus = Failed`

### Frontend Tasks
- [ ] Create `/settings/gmail` page: connect button, connected address display, disconnect button
- [ ] Add "Send" button to outreach composer — disabled until Gmail is connected
- [ ] Create `/send-logs` page: filterable table (lead, date, status)
- [ ] Add reply status dropdown to lead detail page (`No Reply`, `Replied`, `Bounced`, `Interested`)
- [ ] Show reply status badge in leads list
- [ ] Create public `/unsubscribe/[token]` page: confirmation message, no login required

### Tests / Checks
- [ ] Verify `dotnet build` passes with 0 errors
- [ ] Manually test: connect Gmail → generate outreach draft → send → verify send log entry created
- [ ] Verify unsubscribe link is present in sent email body
- [ ] Verify clicking unsubscribe link sets lead status to `Unsubscribed`
- [ ] Verify send is blocked for `Unsubscribed` leads after opt-out
- [ ] Verify Gmail token refresh is attempted automatically on expiry
- [ ] Verify `npm run build` passes on frontend

### Acceptance Criteria
- A workspace admin can connect a Gmail account via OAuth.
- Outreach emails are sent from the connected Gmail account and include an unsubscribe link.
- Every sent email creates an `EmailSendLog` entry with delivery status.
- Clicking the unsubscribe link sets lead status to `Unsubscribed` and blocks future sends.
- A sales rep can manually update reply status from the lead detail page.
- Reply status is visible in the leads list and lead detail.
- Gmail OAuth tokens are stored encrypted; access tokens are refreshed before each send.

### Out of Scope
- Multiple Gmail accounts per workspace
- SMTP provider switching UI (interface is ready; UI deferred)
- Automated reply detection
- Email open and click tracking

---

## Milestone 7 — Export and Notifications

### Database Tasks
- No new tables required.

### Backend Tasks
- [ ] Create `ExportLeadsCsvQuery` + handler: stream filtered leads as CSV response with correct `Content-Disposition` header
- [ ] Define `INotificationService` interface in `HookLeads.Application/Common/Interfaces`
- [ ] Implement `SmtpNotificationService` in `HookLeads.Infrastructure/Services`
- [ ] Create and send welcome email on user registration (triggered from `RegisterCommand` handler)
- [ ] Create and send password reset email (triggered from `ForgotPasswordCommand` handler — replaces placeholder from Milestone 1)
- [ ] Create and send "lead marked as Interested" notification email (triggered from `UpdateReplyStatusCommand` handler)
- [ ] Create and send workspace invite email (triggered from `InviteMemberCommand` handler — replaces placeholder from Milestone 1)
- [ ] Add `GET /leads/export/csv` to `LeadsController`

### Frontend Tasks
- [ ] Add "Export CSV" button to leads list page — respects active filters
- [ ] Trigger file download on export button click
- [ ] Show export loading state while file is being generated

### Tests / Checks
- [ ] Verify `dotnet build` passes with 0 errors
- [ ] Manually test: apply filters → export → verify CSV contains only filtered leads with all expected columns
- [ ] Verify welcome email is received on registration
- [ ] Verify password reset email is received and link works
- [ ] Verify "Interested" notification email is sent when reply status is updated to Interested

### Acceptance Criteria
- A CSV export is produced containing all leads matching the current active filters.
- The export includes: name, email, company, title, industry, score, status, reply status.
- Welcome email is sent to new users on registration.
- Password reset email is sent with a time-limited link.
- Workspace invite email is sent to invited members.
- An alert email is sent to the workspace admin when a lead is marked as Interested.

### Out of Scope
- Scheduled or recurring exports
- Export formats other than CSV
- In-app notification centre
- Push notifications

---

## Milestone 8 — Dashboard and Polish

### Database Tasks
- No new tables required.

### Backend Tasks
- [ ] Create `GetDashboardSummaryQuery` + handler: return total leads, average score, emails sent (last 30 days), leads marked Interested
- [ ] Add `GET /dashboard/summary` to a new `DashboardController`

### Frontend Tasks
- [ ] Create `/dashboard` page with four summary cards: Total Leads, Average Score, Emails Sent (30 days), Interested Leads
- [ ] Add leads-by-status breakdown table or bar chart on dashboard
- [ ] Add empty states to all list pages: leads, send logs, ICP criteria
- [ ] Add error states for failed API calls on all key pages (generic error message + retry button)
- [ ] Add loading skeletons to leads list, lead detail, and dashboard cards
- [ ] Audit all pages for consistent spacing, typography, and component usage with shadcn/ui
- [ ] Verify all text strings are extracted to a constants file (bilingual readiness — no hardcoded UI strings)
- [ ] Add `next-env.d.ts` type checks and resolve any TypeScript warnings

### Tests / Checks
- [ ] Verify `dotnet build` passes with 0 errors and 0 warnings
- [ ] Verify `npm run build` passes with 0 errors and 0 TypeScript errors
- [ ] Walk through full end-to-end flow: register → define ICP → import leads → review scores → generate outreach → send → log reply → export
- [ ] Verify all empty states display correctly with no leads, no ICP, no send logs
- [ ] Verify all error states display correctly when API is unreachable

### Acceptance Criteria
- Dashboard displays accurate summary stats for the authenticated workspace.
- All list pages show a meaningful empty state when no data exists.
- All pages handle API errors gracefully without crashing.
- No hardcoded UI strings — all text is sourced from a constants file.
- Full end-to-end flow completes without errors from a fresh workspace.
- Both `dotnet build` and `npm run build` pass cleanly.

### Out of Scope
- Advanced analytics or charts beyond summary cards
- Activity feed or audit log UI
- Multi-language translation (bilingual readiness only — structure prepared, not implemented)
- Performance optimisation and caching
