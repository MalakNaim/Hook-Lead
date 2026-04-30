# Hook Leads — Backend Verification Guide

| Field | Value |
|---|---|
| Backend framework | ASP.NET Core Web API · .NET 8 |
| Base URL | `http://localhost:5057` |
| Swagger UI | `http://localhost:5057/swagger` |
| Hangfire Dashboard | `http://localhost:5057/hangfire` |
| Last verified | 2026-04-30 |
| Build status | 0 errors · 0 warnings |
| **API verification** | **PASSED** |

---

## Verification Status

**Backend API Verification: PASSED**

All API groups were tested manually in Postman. Every tested endpoint returned the expected HTTP status and response shape.

### Confirmed working

- Backend runs on `http://localhost:5057`
- Swagger UI loads at `http://localhost:5057/swagger`
- SQL Server Docker container connects successfully
- EF Core migrations applied; database schema is current
- JWT register and login return valid token pairs
- Postman collection imported and all requests executed successfully

### Tested API groups

| Group | Result |
|---|---|
| Auth | PASSED |
| Workspace | PASSED |
| ICP | PASSED |
| Import | PASSED |
| Leads | PASSED |
| Scoring | PASSED |
| Outreach | PASSED |
| Swagger / Hangfire | PASSED |

---

## Postman Files

| File | Path |
|---|---|
| Collection | `docs/postman/HookLeads.postman_collection.json` |
| Environment | `docs/postman/HookLeads.local.postman_environment.json` |

Import both files into Postman, select the **Hook Leads Local** environment, then run the checklist below in order.

---

## Prerequisites

Start the SQL Server container before running the backend.

```bash
docker compose up -d
```

The container exposes SQL Server on `localhost,1433`. The backend reads the
connection string from `backend/src/HookLeads.Api/appsettings.Development.json`.

---

## Build

```bash
cd backend
dotnet build src/HookLeads.Api/HookLeads.Api.csproj
```

Expected output:

```
Build succeeded.
    0 Warning(s)
    0 Error(s)
```

All four projects compile in one pass:

```
HookLeads.Domain        → bin/Debug/net8.0/HookLeads.Domain.dll
HookLeads.Application   → bin/Debug/net8.0/HookLeads.Application.dll
HookLeads.Infrastructure→ bin/Debug/net8.0/HookLeads.Infrastructure.dll
HookLeads.Api           → bin/Debug/net8.0/HookLeads.Api.dll
```

---

## Run

```bash
cd backend
dotnet run --project src/HookLeads.Api/HookLeads.Api.csproj
```

Expected startup output:

```
Now listening on: http://localhost:5057
Application started. Press Ctrl+C to shut down.
Hosting environment: Development
Content root path: .../backend/src/HookLeads.Api
```

The process stays running in the foreground. Press `Ctrl+C` to stop.

---

## Swagger

Open a browser and go to:

```
http://localhost:5057/swagger
```

The Swagger UI lists all 29 routes across 7 controller groups:

| Group | Prefix |
|---|---|
| Auth | `/api/Auth` |
| ICP | `/api/icp` |
| Import | `/api/import` |
| Leads | `/api/leads` |
| Outreach | `/api/outreach` |
| Scoring | `/api/scoring` |
| Workspace | `/api/workspace` |

To call a protected endpoint from Swagger, click **Authorize** (top right),
enter `Bearer <your_access_token>`, then click **Authorize**.

---

## Full Route Reference

### AuthController — no token required

| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/register` | Creates workspace + admin user, returns JWT pair |
| POST | `/api/auth/login` | Returns JWT pair |
| POST | `/api/auth/refresh` | Rotates refresh token |
| POST | `/api/auth/logout` | Revokes refresh token |
| POST | `/api/auth/forgot-password` | Queues reset email (stub) |
| POST | `/api/auth/reset-password` | Applies new password |

### WorkspaceController — `[Authorize]`

| Method | Path | Notes |
|---|---|---|
| GET | `/api/workspace` | Current workspace details |
| GET | `/api/workspace/members` | Member list |
| POST | `/api/workspace/invite` | Admin only |
| DELETE | `/api/workspace/members/{userId}` | Admin only |

### IcpController — `[Authorize]`

| Method | Path | Notes |
|---|---|---|
| POST | `/api/icp` | Admin only — creates profile |
| PUT | `/api/icp/{id}` | Admin only — update / activate |
| GET | `/api/icp/active` | Returns active profile; 404 if none |
| POST | `/api/icp/{id}/criteria` | Admin only |
| PUT | `/api/icp/{id}/criteria/{criterionId}` | Admin only |
| DELETE | `/api/icp/{id}/criteria/{criterionId}` | Admin only — 204 |

### ImportController — `[Authorize(Roles="Admin")]`

| Method | Path | Notes |
|---|---|---|
| POST | `/api/import/csv/preview` | `multipart/form-data`, key `file` |
| POST | `/api/import/csv/confirm` | JSON body from preview response |
| POST | `/api/import/linkedin/preview` | Body: `{ "url": "..." }` |
| POST | `/api/import/linkedin/confirm` | JSON body from preview response |

### LeadsController — `[Authorize]`

| Method | Path | Notes |
|---|---|---|
| GET | `/api/leads` | Paginated; accepts query filters |
| GET | `/api/leads/{id}` | Full detail; 404 if not found |
| PUT | `/api/leads/{id}` | Admin only |
| DELETE | `/api/leads/{id}` | Admin only — 204 |
| PATCH | `/api/leads/{id}/status` | Admin only |
| POST | `/api/leads/{id}/notes` | Appends timestamped note |

Query parameters for `GET /api/leads`:

| Parameter | Type | Example |
|---|---|---|
| `status` | string | `New`, `Qualified`, `Disqualified`, `Unsubscribed` |
| `industry` | string | `SaaS` |
| `dateFrom` | ISO 8601 | `2026-01-01` |
| `dateTo` | ISO 8601 | `2026-12-31` |
| `minScore` | int | `50` |
| `maxScore` | int | `100` |
| `pageNumber` | int | `1` (default) |
| `pageSize` | int | `20` (default) |

### ScoringController — `[Authorize]`

| Method | Path | Notes |
|---|---|---|
| GET | `/api/scoring/leads/{id}/score` | 404 if lead not found |
| POST | `/api/scoring/recalculate` | Admin only — 202 Accepted |

### OutreachController — `[Authorize]`

| Method | Path | Notes |
|---|---|---|
| POST | `/api/outreach/leads/{leadId}/generate` | 400 if lead Disqualified/Unsubscribed |
| GET | `/api/outreach/leads/{leadId}/messages` | Newest first |
| GET | `/api/outreach/messages/{messageId}/email-draft` | 400 if Cancelled |
| PATCH | `/api/outreach/messages/{messageId}/status` | Body: `{ "status": "Draft\|Sent\|Cancelled" }` |

---

## Postman Setup

### Environment variables

Create a Postman environment named **Hook Leads Local** with these variables:

| Variable | Initial value | Notes |
|---|---|---|
| `base` | `http://localhost:5057` | |
| `token` | *(empty)* | Set from register/login response |
| `refresh_token` | *(empty)* | Set from register/login response |
| `workspace_id` | *(empty)* | Set from register/login response |
| `lead_id` | *(empty)* | Set after importing a lead |
| `icp_id` | *(empty)* | Set after creating an ICP profile |
| `criterion_id` | *(empty)* | Set after adding a criterion |
| `message_id` | *(empty)* | Set after generating outreach |

### Default headers

Add these to every request:

```
Content-Type: application/json
```

For protected endpoints also add:

```
Authorization: Bearer {{token}}
```

---

## Postman Testing Checklist

Work through the requests in order. Each step builds on the previous one.

---

### Step 1 — Register

```
POST {{base}}/api/auth/register
Content-Type: application/json

{
  "workspaceName": "Test Workspace",
  "email": "test@example.com",
  "password": "Test12345"
}
```

Expected: **200**

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "...",
  "userId": "uuid",
  "email": "test@example.com",
  "role": "Admin",
  "workspaceId": "uuid",
  "workspaceName": "Test Workspace"
}
```

Save `accessToken` → `{{token}}`, `refreshToken` → `{{refresh_token}}`,
`workspaceId` → `{{workspace_id}}`.

---

### Step 2 — Login

```
POST {{base}}/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test12345"
}
```

Expected: **200** — same response shape as register.
Refresh `{{token}}` and `{{refresh_token}}`.

---

### Step 3 — Refresh Token

```
POST {{base}}/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "{{refresh_token}}"
}
```

Expected: **200** — new token pair. The old refresh token is revoked.

---

### Step 4 — Forgot Password

```
POST {{base}}/api/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```

Expected: **200** — email delivery is a stub (Milestone 7).

---

### Step 5 — Logout

```
POST {{base}}/api/auth/logout
Content-Type: application/json

{
  "refreshToken": "{{refresh_token}}"
}
```

Expected: **200**. After this the refresh token is invalid.

---

### Step 6 — Get Workspace

```
GET {{base}}/api/workspace
Authorization: Bearer {{token}}
```

Expected: **200**

```json
{ "id": "uuid", "name": "Test Workspace", "createdAt": "..." }
```

---

### Step 7 — Get Members

```
GET {{base}}/api/workspace/members
Authorization: Bearer {{token}}
```

Expected: **200** — array containing your admin user.

---

### Step 8 — Invite Member

```
POST {{base}}/api/workspace/invite
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "email": "rep@example.com"
}
```

Expected: **200** — creates inactive user record.

---

### Step 9 — Create ICP Profile

```
POST {{base}}/api/icp
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "SaaS Mid-Market"
}
```

Expected: **201**. Save the returned `id` → `{{icp_id}}`.

---

### Step 10 — Add ICP Criterion

```
POST {{base}}/api/icp/{{icp_id}}/criteria
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "criterionType": "Industry",
  "value": "SaaS",
  "weight": 8
}
```

Expected: **200**. Save the returned `id` → `{{criterion_id}}`.

Valid `criterionType` values: `Industry`, `CompanySize`, `JobTitle`,
`Geography`, `RevenueRange`. Weight must be 1–10.

---

### Step 11 — Activate ICP Profile

```
PUT {{base}}/api/icp/{{icp_id}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "SaaS Mid-Market",
  "isActive": true
}
```

Expected: **200**. Only one profile can be active per workspace.

---

### Step 12 — Get Active ICP

```
GET {{base}}/api/icp/active
Authorization: Bearer {{token}}
```

Expected: **200** — profile with criteria.
Returns **404** `{"message":"No active ICP profile found."}` if no profile is
active; this is expected business logic, not a routing error.

---

### Step 13 — CSV Preview

```
POST {{base}}/api/import/csv/preview
Authorization: Bearer {{token}}
Body: form-data → key: file, type: File, value: <your .csv file>
```

Sample CSV content:

```
FirstName,LastName,Email,Company,JobTitle,Industry
Jane,Doe,jane@acme.com,Acme Corp,VP Sales,SaaS
John,Smith,john@beta.com,Beta Ltd,CTO,SaaS
```

Expected: **200** — preview rows with `isValid` and `validationError` per row.

---

### Step 14 — CSV Confirm

```
POST {{base}}/api/import/csv/confirm
Authorization: Bearer {{token}}
Content-Type: application/json

<body = response from step 13>
```

Expected: **200** `{"imported": 2, "skipped": 0, "total": 2}`

---

### Step 15 — LinkedIn Preview

```
POST {{base}}/api/import/linkedin/preview
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "url": "https://www.linkedin.com/in/jane-doe"
}
```

Expected: **200** — parsed lead fields from the URL.

---

### Step 16 — LinkedIn Confirm

```
POST {{base}}/api/import/linkedin/confirm
Authorization: Bearer {{token}}
Content-Type: application/json

<body = response from step 15>
```

Expected: **200** — lead created with `source: "LinkedInUrl"`.

---

### Step 17 — List Leads

```
GET {{base}}/api/leads?pageNumber=1&pageSize=20
Authorization: Bearer {{token}}
```

Expected: **200** — paginated list. Save a lead `id` → `{{lead_id}}`.

---

### Step 18 — Get Lead Detail

```
GET {{base}}/api/leads/{{lead_id}}
Authorization: Bearer {{token}}
```

Expected: **200** — full lead with `icpScore`, `scoreBreakdown`, `status`.

---

### Step 19 — Update Lead

```
PUT {{base}}/api/leads/{{lead_id}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "jobTitle": "VP Sales",
  "company": "Acme Corp",
  "industry": "SaaS"
}
```

Expected: **200**

---

### Step 20 — Update Lead Status

```
PATCH {{base}}/api/leads/{{lead_id}}/status
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "status": "Qualified"
}
```

Expected: **200**. Valid values: `New`, `Qualified`, `Disqualified`,
`Unsubscribed`. Invalid value returns **400** with the allowed list.

---

### Step 21 — Add Lead Note

```
POST {{base}}/api/leads/{{lead_id}}/notes
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "note": "Called on Thursday — very interested in Q3."
}
```

Expected: **200** — note prepended with `[timestamp | email]`.

---

### Step 22 — Get Lead Score

```
GET {{base}}/api/scoring/leads/{{lead_id}}/score
Authorization: Bearer {{token}}
```

Expected: **200** `{"leadId":"...","score":100,"breakdown":[...]}`
Returns `score: null` if no active ICP; returns **404** if lead does not exist.

---

### Step 23 — Recalculate All Scores

```
POST {{base}}/api/scoring/recalculate
Authorization: Bearer {{token}}
```

Expected: **202** `{"message":"Score recalculation completed for all workspace leads."}`
Returns **403** if the token belongs to a `Rep` (not `Admin`).

---

### Step 24 — Generate Outreach Draft

```
POST {{base}}/api/outreach/leads/{{lead_id}}/generate
Authorization: Bearer {{token}}
```

Expected: **201** — outreach draft with `subject`, `body`, `status: "Draft"`.
Returns **400** if lead status is `Disqualified` or `Unsubscribed`.
Save the returned `id` → `{{message_id}}`.

---

### Step 25 — List Outreach Messages

```
GET {{base}}/api/outreach/leads/{{lead_id}}/messages
Authorization: Bearer {{token}}
```

Expected: **200** — array sorted newest first.

---

### Step 26 — Get Email Draft

```
GET {{base}}/api/outreach/messages/{{message_id}}/email-draft
Authorization: Bearer {{token}}
```

Expected: **200**

```json
{
  "to": "jane@acme.com",
  "subject": "Jane, quick note about Acme Corp",
  "body": "Hi Jane,\n\n...",
  "mailtoUrl": "mailto:jane@acme.com?subject=...&body=..."
}
```

Returns **400** if message status is `Cancelled`.
Open `mailtoUrl` in a browser to trigger the user's email client.

---

### Step 27 — Mark as Sent

```
PATCH {{base}}/api/outreach/messages/{{message_id}}/status
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "status": "Sent"
}
```

Expected: **200** — `sentAt` is set to the current UTC timestamp.
Subsequent status changes do not overwrite `sentAt`.

---

### Step 28 — Delete Lead

```
DELETE {{base}}/api/leads/{{lead_id}}
Authorization: Bearer {{token}}
```

Expected: **204**. A subsequent `GET /api/leads/{{lead_id}}` returns **404**.

---

## Spec-Kit Cross-Checks

Run these after the main checklist to verify security and isolation guarantees.

| Check | How |
|---|---|
| Wrong password rejected | `POST /api/auth/login` with bad password → expect **401** |
| Revoked token rejected | After logout (step 5), `POST /api/auth/refresh` with old token → expect **401** |
| Unauthenticated request blocked | `GET /api/leads` without `Authorization` header → expect **401** |
| Rep cannot recalculate | Register a second user with `role: Rep`, use that token on step 23 → expect **403** |
| Cross-workspace isolation | Register a second account; `GET /api/leads` with that token → expect empty list |
| Cross-workspace 404 | Use second account's token on `GET /api/leads/{{lead_id}}` (first workspace lead) → expect **404** |
| Duplicate email skipped | Import the same CSV twice → second run: `imported: 0, skipped: 2` |
| Blocked outreach | Set lead status to `Unsubscribed`, then step 24 → expect **400** |

---

## Common Errors and Fixes

### `Address already in use: 5057`

Another process is bound to the port. Find and kill it:

```bash
lsof -i :5057
kill -9 <PID>
```

Then restart with `dotnet run`.

---

### `404 Not Found` on `/api/auth/login`

**Cause:** The controller route is missing the `api/` prefix, or Postman is
using the wrong path (`/auth/login` instead of `/api/auth/login`).

**Fix:** Verify the `[Route]` attribute on `AuthController` reads
`api/[controller]` and that Postman uses the full path
`http://localhost:5057/api/auth/login`.

---

### `415 Unsupported Media Type`

**Cause:** Postman is sending the request body without the
`Content-Type: application/json` header, so ASP.NET Core cannot deserialize it.

**Fix:** In Postman set the request body type to **raw → JSON**. This
automatically adds `Content-Type: application/json`. Do not use
`form-data` or `x-www-form-urlencoded` for JSON endpoints.

---

### SQL Server connection error on startup

Typical message:

```
A network-related or instance-specific error occurred while establishing
a connection to SQL Server
```

**Cause:** The SQL Server Docker container is not running or is still starting.

**Fix:**

```bash
# Check container status
docker compose ps

# Start if stopped
docker compose up -d

# Wait for healthy, then retry dotnet run
```

If the container is running but the connection still fails, confirm the
password in `appsettings.Development.json` matches `docker-compose.yml`.

---

### `401 Unauthorized` on a protected endpoint

**Cause:** The `Authorization` header is missing or the token has expired
(default expiry: 60 minutes).

**Fix:** Re-run step 2 (Login) to get a fresh token, update `{{token}}` in the
Postman environment, and retry.

---

### `403 Forbidden` on an Admin-only endpoint

**Cause:** The JWT belongs to a `Rep` user, not an `Admin`.

**Fix:** Use the token from the account that was created via `register` — the
first user in a workspace is always assigned the `Admin` role.

---

## Known Solved Issues

| Issue | Cause | Fix applied |
|---|---|---|
| Port 5057 already in use | Previous process still bound to the port | `lsof -i :5057` → `kill -9 <PID>` |
| 404 on API routes | Controller `[Route]` attribute missing `api/` prefix | Added `[Route("api/[controller]")]` to all controllers |
| 415 Unsupported Media Type | Postman body sent without `Content-Type: application/json` | Switched Postman body to raw → JSON |
| SQL Server connection failure | Container not running or password mismatch between `appsettings.Development.json` and `docker-compose.yml` | Aligned passwords; ensured `docker compose up -d` runs first |
| Frontend login URL mismatch | Frontend pointed to a different auth URL | Noted; frontend work is paused — backend unaffected |

---

## Next Backend Phase

1. Backend refactoring (clean up controllers, services, and data access as needed)
2. Re-run the full Postman collection after refactoring to confirm no regressions
3. Commit and push once the re-run passes
