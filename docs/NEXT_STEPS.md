# Hook Leads — Next Steps

Ordered upcoming work following frontend MVP scaffold completion.

---

## Frontend Remaining Work

- [ ] **1. Complete Settings page**
  Finish the settings UI — workspace details, user profile, and notification preferences.

- [ ] **2. Improve Leads List page**
  Add filtering, sorting, pagination, and search. Polish empty states and loading skeletons.

- [ ] **3. Improve Lead Details page**
  Expand the lead profile view — activity timeline, scoring breakdown, outreach history, and status controls.

- [ ] **4. Improve Outreach page**
  Add outreach sequence builder, template management, and send status tracking.

---

## Integration Work

- [ ] **5. Add frontend API service layer**
  Create a typed API client under `frontend/lib/api/` that wraps all backend endpoints. Replace mock data imports with real service calls.

- [ ] **6. Connect frontend to backend APIs**
  Wire each page to its corresponding backend API: leads, ICP, outreach, workspace, and auth endpoints.

- [ ] **7. Add auth protection checks**
  Enforce route protection in `(protected)/layout.tsx`. Redirect unauthenticated users to `/login`. Validate JWT on page load.

---

## Validation & Demo Prep

- [ ] **8. Test full user flow**
  Run through the complete flow end-to-end: register → create ICP → import leads → score → outreach → dashboard.

- [ ] **9. Prepare MVP demo**
  Record or run a live walkthrough of the full user journey. Verify all pages render correctly with real backend data.
