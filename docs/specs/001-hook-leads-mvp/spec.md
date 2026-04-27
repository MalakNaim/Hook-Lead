# Spec 001 — Hook Leads MVP

| Field | Value |
|---|---|
| Spec ID | 001 |
| Title | Hook Leads MVP |
| Status | Draft |
| Created | 2026-04-27 |
| Milestone | Milestone 1–6 |

---

## 1. Goal

Deliver a working end-to-end B2B lead pipeline for a single workspace. The MVP enables a team to define their Ideal Customer Profile, import leads via CSV or LinkedIn URL, score those leads against their ICP, generate AI-assisted outreach emails, send them via Gmail, and track replies and send history — all within a secure, multi-tenant SaaS platform.

The MVP is considered complete when a workspace admin can onboard, configure an ICP, import leads, generate and send a personalised outreach email, and view send and reply status — without requiring engineering involvement.

---

## 2. Target Users

| Role | Description |
|---|---|
| **Workspace Admin** | Creates and configures the workspace, connects Gmail, defines the ICP, manages team members, and oversees the full pipeline. |
| **Sales Rep** | Imports leads, reviews scored leads, edits and approves AI-drafted outreach messages, tracks replies, and qualifies or disqualifies leads. |

---

## 3. User Stories

### Authentication & Workspace
- As a new user, I want to register with my email and password so that I can create a workspace.
- As a registered user, I want to log in with my email and password so that I can access my workspace.
- As a logged-in user, I want my session to persist via a refresh token so that I am not logged out frequently.
- As a user, I want to reset my password via email so that I can recover access to my account.
- As a workspace admin, I want to invite team members by email so that my sales reps can access the platform.

### ICP Management
- As a workspace admin, I want to define my Ideal Customer Profile by setting industry, company size, job title, geography, and revenue range so that the system can match and score leads against it.
- As a workspace admin, I want to update my ICP so that lead scores are recalculated to reflect the new criteria.
- As a workspace admin, I want to view the current ICP configuration so that I can confirm it is correct.

### Lead Ingestion
- As a sales rep, I want to import leads via CSV upload so that I can bring in bulk prospect lists.
- As a sales rep, I want to input a LinkedIn profile URL so that the system can parse and create a lead record from publicly available fields.
- As a sales rep, I want to see a preview of imported leads before they are saved so that I can catch errors before committing.
- As a sales rep, I want to see a summary of how many leads were imported and how many were skipped so that I know the result of each import.

### Lead Management
- As a sales rep, I want to view a paginated list of all leads in my workspace so that I can browse and manage prospects.
- As a sales rep, I want to filter leads by status, score, industry, and date so that I can find the right prospects quickly.
- As a sales rep, I want to view the full detail of a single lead so that I can review their profile, score, outreach history, and reply status.
- As a sales rep, I want to manually qualify or disqualify a lead so that I can reflect my judgment in the system.
- As a sales rep, I want to add notes to a lead so that I can record context that is not captured in structured fields.

### Lead Scoring & ICP Matching
- As a sales rep, I want each lead to be automatically scored against the active ICP so that I can prioritise high-fit prospects.
- As a sales rep, I want to see a numeric score and a match breakdown per ICP criterion so that I understand why a lead ranked the way it did.
- As a workspace admin, I want scores to be recalculated automatically when the ICP is updated so that the list always reflects the current criteria.

### AI Outreach Message Generation
- As a sales rep, I want to generate a personalised outreach email draft for a lead using AI so that I can save time writing cold emails.
- As a sales rep, I want to review and edit the AI-generated draft before sending so that I retain control over what is sent.
- As a sales rep, I want to regenerate a draft if I am not satisfied with the first version so that I have options before sending.

### Gmail / SMTP Connection
- As a workspace admin, I want to connect a Gmail account to the workspace via OAuth so that the team can send outreach emails from a real mailbox.
- As a workspace admin, I want to disconnect a Gmail account so that it is no longer used for sending.
- As a sales rep, I want outreach emails to be sent from the connected Gmail account so that replies land in a real inbox.

### Send Logs
- As a sales rep, I want to see a log of all emails sent from my workspace including recipient, subject, timestamp, and status so that I can track outreach activity.
- As a sales rep, I want to filter send logs by lead, date range, and status so that I can find specific sends quickly.

### Reply Status Tracking
- As a sales rep, I want to manually mark a lead's reply status as Replied, No Reply, Bounced, or Interested so that I can track outreach outcomes.
- As a sales rep, I want the reply status to be visible on the lead detail page and in the leads list so that I have full pipeline visibility.

### Export
- As a sales rep, I want to export my lead list to CSV so that I can share data with external tools or stakeholders.
- As a workspace admin, I want the export to respect current filters so that I can export a specific segment rather than all leads.

### Email Notifications
- As a user, I want to receive an email notification when a lead is marked as Interested so that I can follow up quickly.
- As a user, I want to receive a welcome email when I register so that I know my account was created successfully.
- As a user, I want to receive a password reset email with a secure link when I request it.

### Unsubscribe
- As a lead recipient, I want every outreach email to include an unsubscribe link so that I can opt out of future emails.
- As a sales rep, I want the system to automatically block future outreach to unsubscribed leads so that I do not accidentally re-contact them.

---

## 4. MVP Scope

### Included

- Email and password registration and login
- JWT access tokens and HTTP-only refresh tokens
- Password reset via email link
- Workspace creation on registration
- Team member invitation by email
- ICP definition with weighted criteria
- Lead scoring and ICP match breakdown
- CSV lead import with preview and summary
- LinkedIn profile URL input with field parsing
- Lead list with filters, pagination, and sorting
- Lead detail page with score, outreach history, reply status, and notes
- Manual lead qualification and disqualification
- AI-assisted outreach email generation via Claude API
- Draft review and editing before send
- Gmail connection via OAuth 2.0
- Email sending via connected Gmail account
- Send logs with status tracking
- Manual reply status tracking
- CSV export with filter support
- Email notifications (welcome, password reset, interested lead alert)
- Unsubscribe link in every outreach email
- Unsubscribed lead blocking

### Excluded from MVP

- Payment integration and billing
- Full LinkedIn scraping
- Advanced analytics dashboards
- Automated reply classification
- Multiple Gmail accounts per workspace
- SMTP provider switching UI (architecture supports it; UI deferred)
- Google login (architecture must not block it; deferred)
- Public API or webhooks
- Mobile application

---

## 5. Core Modules

| Module | Responsibility |
|---|---|
| **Authentication & Workspace** | User registration, login, JWT issuance, refresh token rotation, password reset, workspace creation, and member invitation. |
| **ICP Management** | Create, update, and view the workspace ICP with configurable criteria and weights. Trigger score recalculation on ICP change. |
| **Lead Ingestion** | Accept CSV uploads and LinkedIn profile URLs. Parse, validate, preview, and persist lead records. |
| **Lead Management** | CRUD for lead records, filtering, pagination, sorting, manual qualification, and notes. |
| **Lead Scoring & ICP Matching** | Score each lead against the active ICP, produce a numeric score and per-criterion breakdown, recalculate on ICP update. |
| **AI Outreach Generation** | Call Claude API with lead context and ICP to generate a personalised cold email draft. Support regeneration. |
| **Gmail / SMTP Connection** | OAuth 2.0 Gmail connection per workspace, token storage, send via Gmail API, and disconnection. |
| **Send Logs** | Record every outreach send with recipient, subject, timestamp, and delivery status. Support filtering. |
| **Reply Status Tracking** | Manual reply status updates (Replied, No Reply, Bounced, Interested) per lead. |
| **CSV Export** | Export filtered lead list to CSV. |
| **Email Notifications** | Send transactional emails for welcome, password reset, and interested lead alerts via SMTP. |
| **Unsubscribe Support** | Generate unique unsubscribe tokens per lead, embed links in outreach emails, process opt-outs, block future sends. |

---

## 6. Data Model Draft

### Workspace
| Field | Type | Notes |
|---|---|---|
| Id | Guid | PK |
| Name | string | Tenant workspace name |
| CreatedAt | DateTime | |

### User
| Field | Type | Notes |
|---|---|---|
| Id | Guid | PK |
| WorkspaceId | Guid | FK → Workspace |
| Email | string | Unique |
| PasswordHash | string | BCrypt |
| Role | enum | Admin, Rep |
| IsActive | bool | |
| CreatedAt | DateTime | |

### RefreshToken
| Field | Type | Notes |
|---|---|---|
| Id | Guid | PK |
| UserId | Guid | FK → User |
| Token | string | Hashed |
| ExpiresAt | DateTime | |
| RevokedAt | DateTime? | Null = active |
| CreatedAt | DateTime | |

### IcpProfile
| Field | Type | Notes |
|---|---|---|
| Id | Guid | PK |
| WorkspaceId | Guid | FK → Workspace |
| Name | string | |
| IsActive | bool | One active per workspace |
| UpdatedAt | DateTime | Triggers rescore |

### IcpCriteria
| Field | Type | Notes |
|---|---|---|
| Id | Guid | PK |
| IcpProfileId | Guid | FK → IcpProfile |
| CriterionType | enum | Industry, CompanySize, JobTitle, Geography, RevenueRange |
| Value | string | Target value |
| Weight | int | Relative importance 1–10 |

### Lead
| Field | Type | Notes |
|---|---|---|
| Id | Guid | PK |
| WorkspaceId | Guid | FK → Workspace |
| FirstName | string | |
| LastName | string | |
| Email | string | |
| JobTitle | string | |
| Company | string | |
| Industry | string | |
| CompanySize | string | |
| Geography | string | |
| RevenueRange | string | |
| LinkedInUrl | string? | |
| Source | enum | CSV, LinkedInUrl, Manual |
| Status | enum | New, Qualified, Disqualified, Unsubscribed |
| Notes | string? | |
| ImportedAt | DateTime | |

### LeadScore
| Field | Type | Notes |
|---|---|---|
| Id | Guid | PK |
| LeadId | Guid | FK → Lead |
| IcpProfileId | Guid | FK → IcpProfile |
| TotalScore | int | Aggregate score |
| Breakdown | JSON | Per-criterion scores |
| ScoredAt | DateTime | |

### OutreachMessage
| Field | Type | Notes |
|---|---|---|
| Id | Guid | PK |
| LeadId | Guid | FK → Lead |
| WorkspaceId | Guid | FK → Workspace |
| GeneratedBy | Guid | FK → User |
| Subject | string | |
| Body | string | Full email body |
| Status | enum | Draft, Sent, Cancelled |
| CreatedAt | DateTime | |

### EmailSendLog
| Field | Type | Notes |
|---|---|---|
| Id | Guid | PK |
| WorkspaceId | Guid | FK → Workspace |
| OutreachMessageId | Guid | FK → OutreachMessage |
| LeadId | Guid | FK → Lead |
| SentAt | DateTime | |
| DeliveryStatus | enum | Sent, Bounced, Failed |
| GmailMessageId | string? | Gmail API message ID |

### ReplyStatus
| Field | Type | Notes |
|---|---|---|
| Id | Guid | PK |
| LeadId | Guid | FK → Lead |
| Status | enum | NoReply, Replied, Bounced, Interested |
| UpdatedBy | Guid | FK → User |
| UpdatedAt | DateTime | |

### GmailConnection
| Field | Type | Notes |
|---|---|---|
| Id | Guid | PK |
| WorkspaceId | Guid | FK → Workspace |
| GmailAddress | string | |
| AccessToken | string | Encrypted |
| RefreshToken | string | Encrypted |
| TokenExpiresAt | DateTime | |
| ConnectedAt | DateTime | |

### UnsubscribeToken
| Field | Type | Notes |
|---|---|---|
| Id | Guid | PK |
| LeadId | Guid | FK → Lead |
| Token | string | Unique, URL-safe |
| UsedAt | DateTime? | Null = not yet used |
| CreatedAt | DateTime | |

---

## 7. API Contract Draft

### Authentication
| Method | Route | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register a new user and create a workspace |
| POST | `/api/v1/auth/login` | Login and receive JWT + refresh token |
| POST | `/api/v1/auth/refresh` | Exchange refresh token for new JWT |
| POST | `/api/v1/auth/logout` | Revoke refresh token |
| POST | `/api/v1/auth/forgot-password` | Request password reset email |
| POST | `/api/v1/auth/reset-password` | Submit new password with reset token |

### Workspace & Users
| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/workspace` | Get current workspace details |
| GET | `/api/v1/workspace/members` | List workspace members |
| POST | `/api/v1/workspace/invite` | Invite a new team member by email |
| DELETE | `/api/v1/workspace/members/{userId}` | Remove a team member |

### ICP Management
| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/icp` | Get active ICP profile |
| POST | `/api/v1/icp` | Create ICP profile |
| PUT | `/api/v1/icp/{id}` | Update ICP profile and trigger rescore |
| GET | `/api/v1/icp/{id}/criteria` | List ICP criteria |
| POST | `/api/v1/icp/{id}/criteria` | Add a criterion |
| PUT | `/api/v1/icp/{id}/criteria/{criteriaId}` | Update a criterion |
| DELETE | `/api/v1/icp/{id}/criteria/{criteriaId}` | Remove a criterion |

### Lead Ingestion
| Method | Route | Description |
|---|---|---|
| POST | `/api/v1/leads/import/csv` | Upload CSV file, return preview |
| POST | `/api/v1/leads/import/csv/confirm` | Confirm and persist CSV import |
| POST | `/api/v1/leads/import/linkedin` | Submit LinkedIn URL, return parsed lead preview |
| POST | `/api/v1/leads/import/linkedin/confirm` | Confirm and persist LinkedIn lead |

### Lead Management
| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/leads` | List leads with filters, pagination, sorting |
| GET | `/api/v1/leads/{id}` | Get lead detail |
| PUT | `/api/v1/leads/{id}` | Update lead fields |
| DELETE | `/api/v1/leads/{id}` | Delete a lead |
| PATCH | `/api/v1/leads/{id}/status` | Qualify, disqualify, or update status |
| POST | `/api/v1/leads/{id}/notes` | Add a note to a lead |

### Lead Scoring
| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/leads/{id}/score` | Get current score and breakdown for a lead |
| POST | `/api/v1/scoring/recalculate` | Trigger score recalculation for all leads (admin) |

### AI Outreach
| Method | Route | Description |
|---|---|---|
| POST | `/api/v1/leads/{id}/outreach/generate` | Generate AI email draft for a lead |
| GET | `/api/v1/leads/{id}/outreach` | List outreach messages for a lead |
| PUT | `/api/v1/outreach/{messageId}` | Edit an outreach draft |
| POST | `/api/v1/outreach/{messageId}/send` | Send approved outreach message via Gmail |

### Gmail Connection
| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/gmail/connect` | Initiate Gmail OAuth flow |
| GET | `/api/v1/gmail/callback` | Handle Gmail OAuth callback |
| GET | `/api/v1/gmail/status` | Get current Gmail connection status |
| DELETE | `/api/v1/gmail/disconnect` | Disconnect Gmail account |

### Send Logs
| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/send-logs` | List send logs with filters |
| GET | `/api/v1/send-logs/{id}` | Get single send log detail |

### Reply Status
| Method | Route | Description |
|---|---|---|
| PATCH | `/api/v1/leads/{id}/reply-status` | Update reply status for a lead |

### Export
| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/leads/export/csv` | Export filtered leads to CSV |

### Unsubscribe
| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/unsubscribe/{token}` | Process unsubscribe request (public, no auth) |

---

## 8. UI / Pages Draft

| Page | Route | Description |
|---|---|---|
| **Login** | `/login` | Email/password login form |
| **Register** | `/register` | Registration form; creates workspace on submit |
| **Forgot Password** | `/forgot-password` | Email input to trigger reset |
| **Reset Password** | `/reset-password` | New password form using reset token |
| **Dashboard** | `/dashboard` | Summary stats: total leads, avg score, emails sent, replies |
| **ICP Builder** | `/icp` | Create and edit ICP criteria with weights |
| **Leads List** | `/leads` | Paginated, filterable, sortable lead table with score badges and status |
| **Lead Detail** | `/leads/[id]` | Full lead profile, score breakdown, outreach history, reply status, notes |
| **Import — CSV** | `/leads/import/csv` | CSV upload, preview table, confirm import |
| **Import — LinkedIn URL** | `/leads/import/linkedin` | URL input, parsed preview, confirm |
| **Outreach Composer** | `/leads/[id]/outreach` | AI-generated draft, edit area, send button |
| **Send Logs** | `/send-logs` | Filterable table of sent emails with status |
| **Gmail Settings** | `/settings/gmail` | Connect / disconnect Gmail, show connected address |
| **Team Settings** | `/settings/team` | List members, invite by email, remove members |
| **Unsubscribe Confirmation** | `/unsubscribe/[token]` | Public page confirming opt-out (no login required) |

---

## 9. Acceptance Criteria

### Authentication & Workspace
- A user can register with a valid email and password and is assigned a new workspace.
- A registered user can log in and receive a JWT and refresh token.
- A refresh token can be used to obtain a new JWT without re-logging in.
- A used or revoked refresh token is rejected.
- A user who requests a password reset receives an email with a time-limited link.
- A workspace admin can invite a new user and that user can complete registration.

### Multi-Tenancy & Data Isolation
- A user cannot view, modify, or delete any resource belonging to a different workspace.
- All API responses for tenant-owned resources are filtered by the authenticated user's workspace.
- WorkspaceId is present on every tenant-owned entity in the database.

### ICP Management
- A workspace admin can create an ICP with at least one criterion.
- Updating an ICP triggers an automatic rescore of all leads in that workspace.
- Only one ICP profile can be active per workspace at a time.

### Lead Ingestion
- A valid CSV file with mapped columns produces a preview before committing.
- Rows with missing required fields are skipped and counted in the import summary.
- A LinkedIn profile URL produces a parsed lead record with available fields pre-filled.
- Duplicate email detection prevents importing the same lead twice in the same workspace.

### Lead Management
- Leads can be filtered by status, score range, industry, and date imported.
- A lead can be manually qualified, disqualified, or marked as unsubscribed.
- Notes can be added to a lead and are displayed in order on the lead detail page.

### Lead Scoring
- Every lead in a workspace has a score calculated against the active ICP.
- The score detail shows a per-criterion breakdown.
- Scores are recalculated within a reasonable time after an ICP update.

### AI Outreach
- An outreach draft is generated for a lead using that lead's profile and the workspace ICP.
- The draft can be edited before sending.
- A new draft can be generated if the first is rejected.
- A draft cannot be sent if the lead is unsubscribed, disqualified, or has status Invalid.

### Gmail Connection
- A workspace admin can connect a Gmail account via OAuth and the connection is confirmed in settings.
- Outreach emails are sent from the connected Gmail address.
- Disconnecting Gmail prevents further sends until a new account is connected.

### Send Logs
- Every sent outreach email creates a send log entry.
- Send logs include the recipient email, subject, timestamp, and delivery status.

### Reply Status
- A sales rep can update a lead's reply status from the lead detail page.
- Reply status is visible in the leads list and lead detail.

### Export
- A CSV export file is produced containing all leads matching the current active filters.
- The export includes all key lead fields: name, email, company, title, industry, score, status, and reply status.

### Unsubscribe
- Every outreach email contains a unique unsubscribe link.
- Clicking the unsubscribe link sets the lead's status to Unsubscribed and marks the token as used.
- The system blocks future outreach sends to unsubscribed leads.

---

## 10. Risks & Assumptions

| # | Risk / Assumption | Mitigation |
|---|---|---|
| R-01 | **Gmail OAuth token expiry** — Gmail access tokens expire after 1 hour; background jobs may attempt sends with expired tokens. | Store and rotate refresh tokens on each use; handle 401 responses from Gmail API gracefully and surface errors in send logs. |
| R-02 | **Claude API latency** — AI draft generation may take several seconds, blocking the UI if handled synchronously. | Run generation as a Hangfire background job; poll or use a loading state in the frontend until the draft is ready. |
| R-03 | **LinkedIn URL parsing reliability** — LinkedIn profile pages vary in structure; parsed field coverage will be partial. | Parse only reliably consistent fields (name, headline, company); allow the user to fill in missing fields manually before confirming. |
| R-04 | **CSV column mapping** — Imported CSVs will have inconsistent column headers across sources. | Provide a column mapping step in the import preview UI; reject files that cannot be mapped to required fields. |
| R-05 | **Multi-tenant data leakage** — Missing WorkspaceId filter on a query would expose cross-tenant data. | Apply a global query filter at the EF Core DbContext level to automatically scope all tenant entity queries by WorkspaceId. |
| R-06 | **Unsubscribe compliance** — Failing to honour unsubscribes exposes the product to spam complaints and legal risk. | Block sends at the Application layer before calling Gmail; enforce at the domain level, not just the UI. |
| R-07 | **Refresh token theft** — Stolen refresh tokens allow persistent unauthorised access. | Use rotation (issue new token on each refresh, revoke old one); store only a hashed version server-side; bind to user agent and IP where feasible. |
| R-08 | **Gmail sending limits** — Gmail imposes daily sending limits (~500/day for standard accounts, 2000/day for Workspace accounts). | Display a warning in settings when approaching limits; surface Gmail API quota errors in send logs; do not retry sends silently. |
| R-09 | **Score staleness** — If rescore on ICP update is slow or fails, the displayed scores may not reflect the current ICP. | Run rescore as a Hangfire background job with retry; surface rescore status (Pending, Complete) on the leads list. |
| R-10 | **SMTP compatibility** — Gmail-specific OAuth makes future provider switching non-trivial if not abstracted early. | Define an `IEmailSender` interface in the Application layer; the Gmail implementation is one concrete provider behind that interface. |
