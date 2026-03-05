# Calico Spanish CRM & Organization Portal - Comprehensive Mockup Plan

> **⚠️ This file has been superseded.** The canonical implementation plan is at [`docs/IMPLEMENTATION_PLAN.md`](./docs/IMPLEMENTATION_PLAN.md).
>
> This file is kept for reference but may be outdated. All updates should be made to the docs version.

---

## Context

Calico Spanish needs high-fidelity, Figma-level interactive HTML mockups for their Laravel-based Membership & Licensing CRM system. The mockups must support full navigation between all screens, clickable forms, modals, and demonstrate the complete user experience for:

1. **Internal Admin CRM** - For Calico Spanish employees to manage organizations, billing accounts, license pools, and support
2. **Organization Portal** - For school customers (org owners, admins, teachers) to manage their licenses, seats, roster, and School-to-Home access

The mockups will follow HubSpot-style 3-column layouts for detail views, include command palette search, notification center, full-featured tables, inline editing, and interactive charts.

---

## Design Tokens & Themes (CSS Variables)

Define colors as **semantic tokens** (not raw hex usage) to keep the UI consistent and themeable.

### Core Brand Tokens
```css
:root {
  --brand-purple: #482d8b;   /* Calico Purple */
  --brand-green: #9fcc3f;    /* Calico Green */
  --brand-teal: #68c9c9;     /* Calico Teal */
  --brand-red: #f05759;      /* Level C / Alerts */
  --brand-yellow: #fad358;   /* Level D / Warnings */
}
```

### Semantic UI Tokens (used everywhere)
```css
:root {
  /* Core UI */
  --color-primary: var(--brand-purple);
  --color-accent: var(--brand-green);
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-border: #e2e8f0;
  --color-text: #1e293b;
  --color-muted: #64748b;

  /* Feedback */
  --color-success: #16a34a;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #0ea5e9;
}
```

### Status Tokens (Licenses / Pools)
```css
:root {
  --status-active: var(--color-success);
  --status-expiring: var(--color-warning);
  --status-at-risk: #f97316;
  --status-expired: #94a3b8;
  --status-pending: var(--color-info);
}
```

### Theme: Internal Admin CRM (Neutral/Professional)
```css
[data-theme="admin"] {
  --color-primary: var(--brand-purple);
  --color-accent: var(--brand-green);
  --color-bg: #f8fafc;
  --sidebar-bg: #1e1b4b;
  --sidebar-text: #e0e7ff;
}
```

### Theme: Organization Portal (Customer-Facing Calico Brand)
```css
[data-theme="portal"] {
  --color-primary: var(--brand-green);
  --color-accent: var(--brand-purple);
  --portal-secondary: var(--brand-teal);
}
```

### Charts Palette
Use a fixed palette mapped to semantic meaning (Plan Type, Status, Cohorts) so charts are visually consistent across dashboards:
- Base licenses: `--brand-purple`
- Premium licenses: `--brand-green`
- At-risk: `--brand-red`
- Healthy: `--brand-teal`

---

## File Structure

```
laravel-crm-mockups/
├── README.md
├── package.json                      # Build scripts (dev, build, preview)
├── vite.config.js                    # Bundling + HTML template pipeline
├── tailwind.config.js                # Tailwind config (design tokens + themes)
├── postcss.config.js
│
├── src/                              # Source templates (do not review in-browser)
│   ├── shared/
│   │   ├── styles/
│   │   │   ├── tokens.css            # CSS variables for themes + semantic colors
│   │   │   └── base.css              # Tailwind layers + base components
│   │   │
│   │   ├── js/
│   │   │   ├── app.js                # Bootstraps components on each page
│   │   │   ├── routes.js             # Route map (nav + command palette index)
│   │   │   ├── state.js              # LocalStorage-backed demo state
│   │   │   └── components/           # Modular UI primitives
│   │   │       ├── modal.js
│   │   │       ├── dropdown.js
│   │   │       ├── tabs.js
│   │   │       ├── table.js
│   │   │       ├── toast.js
│   │   │       ├── commandPalette.js
│   │   │       └── notifications.js
│   │   │
│   │   ├── data/                     # Seed JSON fixtures for realistic demo
│   │   │   ├── organizations.json
│   │   │   ├── billingAccounts.json
│   │   │   ├── licensePools.json
│   │   │   ├── users.json
│   │   │   └── notifications.json
│   │   │
│   │   └── templates/
│   │       ├── layouts/
│   │       │   ├── admin.layout.html
│   │       │   └── portal.layout.html
│   │       ├── partials/
│   │       │   ├── header.html
│   │       │   ├── sidebar.admin.html
│   │       │   ├── sidebar.portal.html
│   │       │   ├── command-palette.html
│   │       │   ├── notifications.html
│   │       │   └── impersonation-banner.html
│   │       └── ui-kit.html           # Visual regression / component catalog
│   │
│   ├── admin/                        # Admin pages (templates)
│   │   ├── index.html                # Dashboard
│   │   │
│   │   ├── organizations/
│   │   │   ├── index.html            # Organizations list (full-featured table)
│   │   │   ├── detail.html           # Organization detail (3-column HubSpot style)
│   │   │   ├── new.html              # Create organization modal/page
│   │   │   └── edit.html             # Edit organization
│   │   │
│   │   ├── billing-accounts/
│   │   │   ├── index.html            # Billing accounts list
│   │   │   ├── detail.html           # Billing account detail (3-column)
│   │   │   ├── invoices.html         # Invoice history for account
│   │   │   └── adjustments.html      # Credits/refunds/adjustments timeline
│   │   │
│   │   ├── subscriptions/
│   │   │   ├── index.html            # Subscriptions list (Stripe-backed)
│   │   │   └── detail.html           # Subscription lifecycle controls
│   │   │
│   │   ├── license-pools/
│   │   │   ├── index.html            # License pools list (filter by status, type)
│   │   │   ├── detail.html           # Pool detail with seat assignments
│   │   │   ├── at-risk.html          # At-risk pools view
│   │   │   └── create.html           # Manual pool creation form
│   │   │
│   │   ├── users/
│   │   │   ├── index.html            # Users/contacts list
│   │   │   ├── detail.html           # User detail with assignments
│   │   │   └── search.html           # User lookup
│   │   │
│   │   ├── orders/
│   │   │   ├── index.html            # Orders list
│   │   │   └── detail.html           # Order detail
│   │   │
│   │   ├── analytics/
│   │   │   ├── index.html            # Analytics dashboard with charts
│   │   │   ├── revenue.html          # Revenue analytics
│   │   │   ├── licenses.html         # License utilization analytics
│   │   │   └── customers.html        # Customer analytics
│   │   │
│   │   ├── support/
│   │   │   ├── index.html            # Support tickets/cases list
│   │   │   └── detail.html           # Ticket detail (timeline, notes, linked org/pool)
│   │   │
│   │   ├── audit-logs/
│   │   │   ├── index.html            # Audit log viewer
│   │   │   └── detail.html           # Audit log event detail (diff-style view)
│   │   │
│   │   └── settings/
│   │       ├── index.html            # Settings overview
│   │       ├── plans.html            # Plan configuration
│   │       └── integrations.html     # Stripe/integrations settings
│   │
│   └── portal/                       # Portal pages (templates)
│       ├── index.html                # Dashboard
│       │
│       ├── licenses/
│       │   ├── index.html            # Licenses list with filters
│       │   ├── detail.html           # License detail view
│       │   ├── renew.html            # Renewal request flow
│       │   └── upgrade.html          # Upgrade to Premium flow
│       │
│       ├── seats/
│       │   ├── index.html            # Seat management overview
│       │   ├── assign.html           # Assign seat flow (with user selection)
│       │   ├── bulk-assign.html      # Bulk seat assignment
│       │   └── reassign.html         # Reassign seat between users
│       │
│       ├── roster/
│       │   ├── index.html            # Roster list (all org users)
│       │   ├── invite.html           # Invite user modal/flow
│       │   ├── bulk-import.html      # Bulk CSV import flow
│       │   ├── pending.html          # Pending invitations
│       │   └── user-detail.html      # User detail within org context
│       │
│       ├── requests/
│       │   ├── index.html            # Seat requests (teachers → admins)
│       │   └── detail.html           # Request detail + approve/deny flow
│       │
│       ├── school-to-home/
│       │   ├── index.html            # School-to-Home overview (all portals)
│       │   ├── portal-detail.html    # Single portal configuration
│       │   ├── setup.html            # New portal setup wizard
│       │   ├── branding.html         # Logo/branding configuration
│       │   └── classrooms/
│       │       ├── index.html        # Classrooms list
│       │       ├── create.html       # Create classroom modal
│       │       └── detail.html       # Classroom detail with students
│       │
│       ├── reports/
│       │   ├── index.html            # Usage & adoption overview
│       │   └── license-usage.html    # License utilization + seat activity
│       │
│       ├── help/
│       │   ├── index.html            # Help center (links + contact support)
│       │   └── contact.html          # Contact support form
│       │
│       ├── billing/
│       │   └── redirect.html         # Stripe portal redirect page
│       │
│       └── settings/
│           ├── index.html            # Org settings
│           ├── administrators.html   # Manage org admins
│           ├── profile.html          # Org profile
│           └── security.html         # Security settings (sessions, 2FA placeholder)
│
└── dist/                             # Build output (review this in browser)
    ├── admin/                        # Final static HTML/CSS/JS
    └── portal/
```

---

## Mock Data & Demo State Layer

To make the mockups feel like a working product (not static pages), implement a lightweight demo data layer:

### Seed Fixtures (JSON)
- Organizations with varying sizes/types
- Billing accounts with different payment statuses
- License pools (Base/Premium, various durations, different statuses)
- Users with different roles and seat assignments
- Notifications (unread counts, various types)

### LocalStorage-Backed State Store
Track mutable state across pages:
- Seat assignments (per pool + per user)
- Invitation status (pending/accepted/expired)
- Notification read/unread state
- Saved table views + column visibility
- Impersonation context (admin → org)

### Demo Scenario Switcher
A hidden toggle (e.g., `?scenario=at-risk` or developer menu) that loads different seeds:
- `happy-path` - Normal usage, healthy metrics
- `at-risk` - Expiring licenses, failed payments, low utilization
- `new-org` - Empty states, onboarding prompts visible
- `large-data` - 500+ rows for table performance testing

### UX Rule
Every primary action should produce at least one visible UI change:
- Counts, badges, timeline entries, status chips, utilization bars, or toast + activity entry

---

## Page Specifications

### Global Components (Both Portals)

#### Accessibility & Keyboard Standards (Required)
- All interactive controls must be reachable via keyboard (Tab/Shift+Tab)
- Visible focus ring for all focusable elements (no `outline: none` without replacement)
- **Modals:**
  - Use `role="dialog"` and `aria-modal="true"`
  - Trap focus inside the modal while open
  - ESC closes modal
  - On close, restore focus to the original trigger element
- **Command Palette:**
  - Opens with Cmd+K / Ctrl+K
  - Arrow keys navigate results
  - Enter activates selection
  - ESC closes and restores focus to previous element
- **Notifications dropdown:**
  - Proper button semantics + `aria-expanded`
  - Close on outside click and ESC
- **Reduced motion:**
  - Respect `prefers-reduced-motion` by reducing/avoiding animations

#### Command Palette (Cmd+K)
- Quick search across all entities
- Recent searches (persisted in LocalStorage)
- Action shortcuts (New Organization, Assign Seat, etc.)
- Keyboard navigation (up/down arrows, enter to select)
- Categorized results (Organizations, Users, Licenses, Actions)

#### Notification Center
- Dropdown from bell icon
- Badge with unread count (updates when marked read)
- Categories: Alerts, Updates, System
- Mark as read, mark all read
- Link to full notification settings
- Proper `aria-expanded` state

#### Full-Featured Tables
- Column sorting (click header, visual indicator for sort direction)
- Multi-column filtering (dropdown filters with applied filter chips)
- Column visibility toggle (checkbox menu)
- Bulk selection with checkbox (select all, select page, clear)
- Bulk actions menu (appears when rows selected)
- Pagination with page size selector (10, 25, 50, 100)
- Saved views/filters (persisted in LocalStorage)
- **Sticky header** + **sticky bulk actions bar** when rows selected
- **Row density toggle** (Comfortable / Compact)
- **Export CSV:**
  - Current filtered view
  - Selected rows only
- **Persist table preferences** (saved views, columns, density) in LocalStorage
- **Virtualized rendering** for large datasets (enable in `large-data` scenario)
- Optional: Column resize / reorder for high-fidelity CRM feel

---

### Internal Admin CRM Pages

#### 1. Dashboard (`admin/index.html`)
**Content:**
- Welcome banner with quick actions
- Attention items (at-risk pools, failed payments, expiring licenses)
- Support queue snapshot (open tickets, SLA risk)
- Recent activity feed
- Quick stats (Active Orgs, Total Seats, Revenue MRR)
- No complex charts (moved to Analytics)

#### 2. Organizations List (`admin/organizations/index.html`)
**Table Columns:**
- Checkbox, Name, Type (School/District/Co-op), Status, Active Licenses, Total Seats, Utilization %, Primary Contact, Created, Actions

**Filters:**
- Type, Status, Utilization range, Has Premium, Created date range

**Actions:**
- View detail, Quick edit, Impersonate (view as org)

**Impersonation Requirements:**
- Persistent "Impersonating {Org}" banner with exit button
- Clear visual distinction (border/background color change)
- Audit log entry created for start/stop impersonation (mocked)

#### 3. Organization Detail (`admin/organizations/detail.html`)
**3-Column Layout:**

*Left Sidebar (About):*
- Org name, type, status
- Primary contact info
- Key metrics (seats, utilization, MRR)
- Tags/labels
- Internal notes field

*Center Column (Tabs):*
- **Overview**: Summary cards, recent activity
- **License Pools**: Table of all pools with status
- **Billing**: Billing account info, payment status, invoices
- **Users**: Roster with seat assignments
- **Activity**: Full activity timeline
- **Notes**: Internal support notes
- **Support**: Linked tickets/cases, SLA status, create ticket action
- **Health**: Billing risk + adoption signals + utilization anomalies

*Right Sidebar (Associations):*
- Billing Account card (link to detail)
- License Pools summary cards
- Recent Orders
- Support Tickets

#### 4. License Pool Detail (`admin/license-pools/detail.html`)
**3-Column Layout:**

*Left Sidebar:*
- Pool ID, Plan key (Base/Premium)
- Duration, Start/End dates
- Seat capacity, Status
- Funding type, Source reference
- Stripe subscription ID (if applicable)

*Center Column (Tabs):*
- **Seats**: Table of all seat assignments (user, status, assigned date, assigned by)
- **Activity**: Pool activity log
- **Billing**: Related invoices, payment history

*Right Sidebar:*
- Organization card
- Billing Account card
- Related pools (same org)

#### 5. Billing Account Detail (`admin/billing-accounts/detail.html`)
**3-Column Layout:**

*Left Sidebar:*
- Account name, Stripe customer ID
- Payment method on file
- Current balance/credits
- Status (active, past due, etc.)

*Center Column (Tabs):*
- **Overview**: Payment summary, next invoice
- **Invoices**: Invoice history table
- **Adjustments**: Credits/refunds timeline
- **Activity**: Account activity log

*Right Sidebar:*
- Organization card
- License Pools funded by this account

#### 6. Subscription Detail (`admin/subscriptions/detail.html`)
**Subscription Lifecycle Controls:**
- Current status with visual indicator
- Actions: Pause, Resume, Cancel, Change Plan
- Proration preview when changing
- Billing history

#### 7. Support Ticket Detail (`admin/support/detail.html`)
**Sections:**
- Ticket header (status, priority, SLA countdown)
- Conversation timeline
- Internal notes (staff-only)
- Linked organization/pool/user
- Quick actions (escalate, reassign, close)

#### 8. Analytics Dashboard (`admin/analytics/index.html`)
**Charts:**
- Revenue over time (line chart with MRR/ARR toggle)
- License utilization gauge
- New vs Renewed licenses (bar chart)
- Seats by plan type (donut chart)
- At-risk pools trend

**KPI Cards:**
- Total MRR, ARR
- Active Licenses, At-Risk count
- Total Seats Assigned, Utilization %
- New Orgs this month

---

### Organization Portal Pages

#### 1. Dashboard (`portal/index.html`)
**Content:**
- Onboarding tutorial (collapsible, progress tracker)
- License summary cards (all active licenses with key stats)
- Seat utilization overview
- Quick actions grid
- Recent activity feed
- Notifications/alerts (expiring licenses, pending invitations)
- Pending requests (seat requests awaiting approval)
- "Help" entry point (contact support / docs)

#### 2. Licenses List (`portal/licenses/index.html`)
**Filters:**
- Type: All, Base, Premium
- Duration: All, 1-Year, 3-Year, 5-Year, Custom
- Status: All, Active, Expiring Soon, At Risk, Expired
- Sort: Expiration (soonest/latest), Seats, Type

**License Cards:**
- Type badge (Base/Premium), Duration badge
- Seat utilization bar
- Expiration date with countdown
- Status indicator (color-coded)
- Actions: View detail, Manage seats, Renew, Upgrade

#### 3. License Detail (`portal/licenses/detail.html`)
**Sections:**
- Header: License info, status, key dates
- Seat utilization visualization
- Assigned users table with actions
- School-to-Home status (if Premium)
- Renewal/upgrade options

#### 4. Seat Management (`portal/seats/index.html`)
**Overview:**
- Total seats by license
- Utilization percentage
- Available seats count

**Seat Table:**
- User name, email, role
- License assigned to
- Assigned date
- Status
- Actions: Reassign, Revoke

**Actions:**
- Assign seat button → opens assign flow
- Bulk assign button → opens bulk flow

#### 5. Assign Seat Flow (`portal/seats/assign.html`)
**Step 1:** Select license pool (if multiple)
**Step 2:** Select or invite user
- Search existing roster
- Or enter email to invite new user
**Step 3:** Confirm assignment
**Step 4:** Success state with next actions

**Edge States (Required):**
- No available seats → show upgrade/renew CTA + contact admin messaging
- User already assigned → show "view seat" + "reassign" actions
- Invite pending → show "resend invite" + "assign on acceptance" option

#### 6. Roster Management (`portal/roster/index.html`)
**Table:**
- Name, Email, Role (Owner/Admin/Member)
- Seats assigned (count, list on hover)
- Status (Active, Pending Invitation, Inactive)
- Last active
- Actions: Edit, Assign seat, Resend invite, Remove

**Actions:**
- Invite user modal
- Bulk import CSV

**Bulk Import States (Required):**
- Preflight validation (preview rows, detect duplicates)
- Row-level error report (downloadable CSV of failures)
- Partial success summary (X created, Y updated, Z failed)

#### 7. Invite User Flow (`portal/roster/invite.html`)
**Form:**
- Email address (required)
- First/Last name (optional)
- Role selection (Admin, Member)
- Assign seat immediately? (checkbox, shows license selector)
- Personal message (optional)

**States:**
- Form (initial)
- Validating (checking email)
- Sending (spinner)
- Success (confirmation + next actions)
- Error: email exists (show "view user" link)
- Error: invalid email format

#### 8. Seat Requests (`portal/requests/index.html`)
**For Org Admins:**
- List of pending seat requests from teachers
- Request details (who, which license, when)
- Approve/Deny actions
- Bulk approve capability

**For Teachers (if applicable):**
- Request seat button on license they don't have access to
- View pending request status

#### 9. School-to-Home Overview (`portal/school-to-home/index.html`)
**Per-License Portals:**
- List of all School-to-Home portals (one per Premium license)
- Portal URL, status, last updated
- Quick stats (classrooms, students)

**Upgrade prompt for Base licenses**

#### 10. Portal Configuration (`portal/school-to-home/portal-detail.html`)
**Settings:**
- Custom URL slug configuration with validation
- Preview of full URL (clickable link)
- Access password (show/hide, copy, change)
- Logo upload with preview
- Portal status toggle (enabled/disabled)

**Classrooms Section:**
- Classrooms table (name, teacher, grade, students, access code)
- Add classroom button → modal
- Edit/delete actions

#### 11. Create Classroom Modal (`portal/school-to-home/classrooms/create.html`)
**Form:**
- Classroom name
- Teacher (select from roster or enter name)
- Grade level
- Generate access code (auto or custom)

**States:**
- Form, Creating, Success (show access code prominently), Error

#### 12. Usage Reports (`portal/reports/index.html`)
**Content:**
- Seat utilization over time
- Active vs inactive users
- Last login dates
- Curriculum engagement (mock data)

#### 13. Help & Contact (`portal/help/index.html`)
**Content:**
- Knowledge base links
- FAQ sections
- Contact support form
- Support hours/response time expectations

#### 14. Security Settings (`portal/settings/security.html`)
**Content:**
- Active sessions list (mock)
- 2FA status (placeholder)
- Password change link

---

## Interactive Elements Checklist

### Modals
- [ ] Create Organization
- [ ] Edit Organization
- [ ] Create License Pool (manual)
- [ ] Invite User
- [ ] Assign Seat
- [ ] Create Classroom
- [ ] Confirm actions (delete, revoke, etc.)
- [ ] Command Palette
- [ ] Bulk import preview
- [ ] Export options

### Dropdown Menus
- [ ] User profile menu
- [ ] Notification dropdown
- [ ] Table actions menu (per-row)
- [ ] Filter dropdowns
- [ ] Bulk actions menu
- [ ] Column visibility menu
- [ ] Row density toggle

### Forms
- [ ] Inline edit fields (click to edit)
- [ ] Full forms in modals
- [ ] Multi-step wizards (School-to-Home setup, bulk import)
- [ ] File upload (logo)
- [ ] Search/autocomplete inputs
- [ ] Date pickers

### States
- [ ] Loading states (skeleton screens)
- [ ] Empty states (no data, with helpful CTAs)
- [ ] Error states (form validation, API errors)
- [ ] Success states (toast notifications)
- [ ] Accessibility states (focus rings, aria-live for toasts, disabled buttons)
- [ ] Impersonation mode (visual banner)

---

## Implementation Approach

### Phase 0: Tooling & Build Pipeline
1. Set up Vite build pipeline (dev server + build to `/dist`)
2. Configure Tailwind with design tokens
3. Create template layouts/partials so global UI is defined once
4. Ensure `/dist` is fully static and reviewable without a backend

### Phase 1: Shared Infrastructure
1. Create `src/shared/styles/tokens.css` for themes + semantic tokens
2. Create `src/shared/styles/base.css` with Tailwind layers + component primitives
3. Create modular JS components in `src/shared/js/components/*`
4. Build command palette + notification center as shared partials/components
5. Set up LocalStorage state management for demo data

### Phase 2: Admin CRM Core
1. Admin layout template (sidebar, header, command palette)
2. Dashboard page with attention items
3. Organizations list with full table features
4. Organization detail (3-column with all tabs)
5. License pools list and detail
6. Users list and detail

### Phase 3: Admin CRM Extended
1. Billing accounts pages with adjustments
2. Subscriptions list and lifecycle controls
3. Analytics dashboard with charts
4. Support tickets list and detail
5. Audit logs with detail view
6. Settings pages

### Phase 4: Organization Portal Core
1. Portal layout template (different sidebar, Calico branding)
2. Dashboard with onboarding tutorial
3. Licenses list with filters
4. License detail
5. Seat management and assign flow (with edge states)

### Phase 5: Organization Portal Extended
1. Roster management with bulk import flow
2. Seat requests workflow
3. School-to-Home overview and configuration
4. Classroom management
5. Usage reports
6. Help/Contact pages
7. Settings pages

### Phase 6: Polish & Connect
1. Ensure all links work between pages (automated check)
2. Add all modal interactions
3. Add form validation states and edge cases
4. Add empty/loading states
5. Impersonation flow complete
6. Final visual polish

---

## Verification

### Manual Verification
- Run `npm run dev` for local development (hot reload)
- Run `npm run build` and review `/dist/admin/index.html` + `/dist/portal/index.html`
- Test command palette (Cmd+K) - open, search, navigate, select
- Test all modal triggers - open, interact, close, focus returns
- Test all dropdown menus
- Verify all table filters work and persist
- Verify form submissions show success/error states
- Check responsive behavior at tablet/mobile widths
- Test impersonation flow end-to-end

### Automated Verification (Recommended)
- **Link integrity check** over `/dist` (no broken internal links)
- **Playwright smoke tests:**
  - Load admin dashboard, open org detail, open/close modal, run table filter
  - Load portal dashboard, run assign seat flow, verify state changes (LocalStorage)
  - Command palette open/close and keyboard navigation
- **Accessibility smoke checks** (axe-core) on:
  - Dashboards
  - Detail pages with 3-column layout
  - Modal-heavy flows (invite, assign seat)

---

## Files to Create

**Total estimated pages: ~55-60 HTML templates**

**Build output: Compiled static HTML/CSS/JS in `/dist`**

Critical paths to build first:
1. `admin/index.html` → `admin/organizations/index.html` → `admin/organizations/detail.html`
2. `portal/index.html` → `portal/licenses/index.html` → `portal/seats/assign.html`
3. `portal/school-to-home/index.html` → `portal/school-to-home/portal-detail.html`
