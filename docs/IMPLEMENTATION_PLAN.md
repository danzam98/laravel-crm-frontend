# Calico Spanish CRM & Organization Portal - Comprehensive Mockup Plan

## Context

Calico Spanish needs high-fidelity, Figma-level interactive HTML mockups for their Laravel-based Membership & Licensing CRM system. The mockups must support full navigation between all screens, clickable forms, modals, and demonstrate the complete user experience for:

1. **Internal Admin CRM** - For Calico Spanish employees to manage organizations, billing accounts, license pools, and support
2. **Organization Portal** - For school customers (org owners, admins, teachers) to manage their licenses, seats, roster, and School-to-Home access

The mockups will follow HubSpot-style 3-column layouts for detail views, include command palette search, notification center, full-featured tables, inline editing, and interactive charts.

> **Important:** This plan covers the `laravel-crm-mockups/` folder — static HTML prototypes for design approval. The production Next.js React app (described in `AGENTS.md`) will be implemented in Phase 7 after mockup approval.

---

## Tech Stack (Mockups)

| Package | Version | Purpose |
|---------|---------|---------|
| Vite | 5.x | Dev server + build pipeline |
| Tailwind CSS | 4.x | CSS-first styling |
| Chart.js | 4.x | Analytics dashboard charts |
| Flatpickr | 4.x | Date pickers for filters/forms |
| Lucide Icons | Latest | Icon system (consistent with shadcn/ui) |

**Font:** Inter (Google Fonts) with `font-display: swap`

**Browser Support:**
- Chrome 100+
- Firefox 100+
- Safari 15+
- Edge 100+

---

## Brand Colors

### Internal Admin CRM (Neutral/Professional)
- **Primary**: `#482d8b` (Calico Purple - from brand)
- **Sidebar**: `#1e1b4b` (Dark Indigo)
- **Accent**: `#9fcc3f` (Calico Green)
- **Background**: `#f8fafc` (Slate 50)

### Organization Portal (Customer-Facing Calico Brand)
- **Primary**: `#9fcc3f` (Calico Green)
- **Secondary**: `#68c9c9` (Calico Teal)
- **Accent**: `#482d8b` (Calico Purple)
- **Level Colors**: Green (#9fcc3f), Teal (#68c9c9), Red (#f05759), Yellow (#fad358)

---

## File Structure

```
laravel-crm-mockups/
├── package.json
├── vite.config.js
├── postcss.config.js
├── README.md
├── src/                              # Vite root directory
│   ├── shared/
│   │   ├── styles/
│   │   │   ├── base.css              # Tailwind imports
│   │   │   └── tokens.css            # Design tokens via @theme
│   │   ├── js/
│   │   │   ├── app.js                # Main initialization
│   │   │   ├── state.js              # LocalStorage state management
│   │   │   └── components/           # Modal, dropdown, tabs, toast, table
│   │   ├── data/                     # Seed JSON fixtures
│   │   └── templates/                # Partials (header, sidebar)
│   │
│   ├── admin/                        # Internal Admin CRM
│   ├── index.html                    # Dashboard
│   ├── command-palette.html          # Global search overlay (included via JS)
│   ├── notifications.html            # Notification dropdown
│   │
│   ├── organizations/
│   │   ├── index.html                # Organizations list (full-featured table)
│   │   ├── detail.html               # Organization detail (3-column HubSpot style)
│   │   ├── new.html                  # Create organization modal/page
│   │   └── edit.html                 # Edit organization
│   │
│   ├── billing-accounts/
│   │   ├── index.html                # Billing accounts list
│   │   ├── detail.html               # Billing account detail (3-column)
│   │   └── invoices.html             # Invoice history for account
│   │
│   ├── license-pools/
│   │   ├── index.html                # License pools list (filter by status, type)
│   │   ├── detail.html               # Pool detail with seat assignments
│   │   ├── at-risk.html              # At-risk pools view
│   │   └── create.html               # Manual pool creation form
│   │
│   ├── users/
│   │   ├── index.html                # Users/contacts list
│   │   ├── detail.html               # User detail with assignments
│   │   └── search.html               # User lookup
│   │
│   ├── orders/
│   │   ├── index.html                # Orders list
│   │   └── detail.html               # Order detail
│   │
│   ├── analytics/
│   │   ├── index.html                # Analytics dashboard with charts
│   │   ├── revenue.html              # Revenue analytics
│   │   ├── licenses.html             # License utilization analytics
│   │   └── customers.html            # Customer analytics
│   │
│   ├── audit-logs/
│   │   └── index.html                # Audit log viewer
│   │
│   └── settings/
│       ├── index.html                # Settings overview
│       ├── plans.html                # Plan configuration
│       └── integrations.html         # Stripe/integrations settings
│
└── portal/                           # Organization Portal (Customer-Facing)
    ├── index.html                    # Dashboard
    ├── command-palette.html          # Portal search
    ├── notifications.html            # Portal notifications
    │
    ├── licenses/
    │   ├── index.html                # Licenses list with filters
    │   ├── detail.html               # License detail view
    │   ├── renew.html                # Renewal request flow
    │   └── upgrade.html              # Upgrade to Premium flow
    │
    ├── seats/
    │   ├── index.html                # Seat management overview
    │   ├── assign.html               # Assign seat flow (with user selection)
    │   ├── bulk-assign.html          # Bulk seat assignment
    │   └── reassign.html             # Reassign seat between users
    │
    ├── roster/
    │   ├── index.html                # Roster list (all org users)
    │   ├── invite.html               # Invite user modal/flow
    │   ├── bulk-import.html          # Bulk CSV import flow
    │   ├── pending.html              # Pending invitations
    │   └── user-detail.html          # User detail within org context
    │
    ├── school-to-home/
    │   ├── index.html                # School-to-Home overview (all portals)
    │   ├── portal-detail.html        # Single portal configuration
    │   ├── setup.html                # New portal setup wizard
    │   ├── classrooms/
    │   │   ├── index.html            # Classrooms list
    │   │   ├── create.html           # Create classroom modal
    │   │   └── detail.html           # Classroom detail with students
    │   └── branding.html             # Logo/branding configuration
    │
    ├── billing/
    │   └── redirect.html             # Stripe portal redirect page
    │
    └── settings/
        ├── index.html                # Org settings
        ├── administrators.html       # Manage org admins
        └── profile.html              # Org profile
│
└── dist/                             # Build output (generated by `npm run build`)
```

> **Note:** All source files under `src/` — Vite serves from `src/` in development and outputs to `dist/` on build.

---

## Mock Data & Demo State

### Seed Data Schemas

#### organizations.json
```json
{
  "id": "org_001",
  "name": "Springfield Elementary",
  "type": "school|district|co-op",
  "status": "active|inactive|suspended",
  "primaryContact": {
    "name": "Lisa Simpson",
    "email": "lisa@springfield.edu",
    "phone": "(555) 123-4567"
  },
  "metrics": {
    "totalSeats": 150,
    "usedSeats": 120,
    "utilizationPercent": 80,
    "mrr": 450.00
  },
  "tags": ["premium", "at-risk"],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### licensePools.json
```json
{
  "id": "pool_001",
  "organizationId": "org_001",
  "planKey": "base|premium",
  "duration": "1-year|3-year|5-year|custom",
  "status": "active|expiring|at-risk|expired",
  "seats": { "total": 50, "used": 42, "available": 8 },
  "dates": {
    "start": "2024-01-01",
    "end": "2024-12-31",
    "daysRemaining": 120
  },
  "fundingType": "subscription|grant|purchase",
  "stripeSubscriptionId": "sub_xxx|null"
}
```

#### users.json
```json
{
  "id": "user_001",
  "organizationId": "org_001",
  "email": "teacher@school.edu",
  "name": { "first": "Jane", "last": "Doe" },
  "role": "owner|admin|member",
  "status": "active|pending|inactive",
  "seats": [{ "poolId": "pool_001", "assignedAt": "2024-02-01" }],
  "lastActiveAt": "2024-03-01T14:30:00Z"
}
```

#### notifications.json
```json
{
  "id": "notif_001",
  "type": "alert|update|system",
  "title": "License expiring soon",
  "message": "Springfield Elementary Base license expires in 30 days",
  "read": false,
  "createdAt": "2024-03-01T09:00:00Z",
  "link": "/admin/license-pools/pool_001"
}
```

### LocalStorage State Management

```javascript
// state.js - Demo state with fallback
const memoryStore = {};

const storage = {
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(`crm_${key}`));
    } catch {
      return memoryStore[key]; // Fallback for private browsing
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(`crm_${key}`, JSON.stringify(value));
    } catch {
      memoryStore[key] = value;
    }
  }
};

// Impersonation state
const impersonation = {
  active: false,
  orgId: null,
  orgName: null,
  startedAt: null
};
```

### Demo Scenarios

Access via URL param: `?scenario=<name>`
- `happy-path` — Normal usage, healthy metrics (default)
- `at-risk` — Expiring licenses, failed payments, low utilization
- `new-org` — Empty states, onboarding prompts visible
- `large-data` — 500+ rows for table performance testing

---

## Page Specifications

### Global Components (Both Portals)

#### Command Palette (Cmd+K)
- Quick search across all entities
- Recent searches
- Action shortcuts (New Organization, Assign Seat, etc.)
- Keyboard navigation

#### Notification Center
- Dropdown from bell icon
- Categories: Alerts, Updates, System
- Mark as read, mark all read
- Link to full notification settings

#### Full-Featured Tables
- Column sorting (click header)
- Multi-column filtering (dropdown filters)
- Column visibility toggle
- Bulk selection with checkbox
- Bulk actions menu
- Pagination with page size selector
- Saved views/filters

---

### Internal Admin CRM Pages

#### 1. Dashboard (`admin/index.html`)
**Content:**
- Welcome banner with quick actions
- Attention items (at-risk pools, failed payments, expiring licenses)
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

*Right Sidebar (Associations):*
- Billing Account card (link to detail)
- License Pools summary cards
- Recent Orders
- Support Tickets (if applicable)

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

#### 5. Analytics Dashboard (`admin/analytics/index.html`)
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

#### 7. Invite User Flow (`portal/roster/invite.html`)
**Form:**
- Email address (required)
- First/Last name (optional)
- Role selection (Admin, Member)
- Assign seat immediately? (checkbox, shows license selector)
- Personal message (optional)
**States:**
- Form, Sending, Success, Error (email exists)

#### 8. School-to-Home Overview (`portal/school-to-home/index.html`)
**Per-License Portals:**
- List of all School-to-Home portals (one per Premium license)
- Portal URL, status, last updated
- Quick stats (classrooms, students)

**Upgrade prompt for Base licenses**

#### 9. Portal Configuration (`portal/school-to-home/portal-detail.html`)
**Settings:**
- Custom URL slug configuration
- Preview of full URL
- Access password (show/hide, copy, change)
- Logo upload with preview
- Portal status toggle

**Classrooms Section:**
- Classrooms table (name, teacher, grade, students, access code)
- Add classroom button → modal
- Edit/delete actions

#### 10. Create Classroom Modal (`portal/school-to-home/classrooms/create.html`)
**Form:**
- Classroom name
- Teacher (select from roster or enter name)
- Grade level
- Generate access code (auto or custom)

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

### Dropdown Menus
- [ ] User profile menu
- [ ] Notification dropdown
- [ ] Table actions menu
- [ ] Filter dropdowns
- [ ] Bulk actions menu

### Forms
- [ ] Inline edit fields (click to edit)
- [ ] Full forms in modals
- [ ] Multi-step wizards (School-to-Home setup)
- [ ] File upload (logo)
- [ ] Search/autocomplete inputs

### States
- [ ] Loading states (skeleton screens)
- [ ] Empty states (no data)
- [ ] Error states (form validation)
- [ ] Success states (toast notifications)

---

## Responsive Design

### Breakpoints (Tailwind Defaults)
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet portrait */
lg: 1024px  /* Tablet landscape / small desktop */
xl: 1280px  /* Desktop */
```

### 3-Column Layout Collapse
| Viewport | Layout | Behavior |
|----------|--------|----------|
| Desktop (xl+) | 3-6-3 columns | Full layout |
| Tablet (lg) | 0-8-4 columns | Left sidebar hidden, toggle button |
| Mobile (md-) | Single column | Stacked, tabs become accordion |

### Mobile Navigation
- Sidebar becomes slide-out drawer
- Command palette: full-screen on mobile
- Tables: horizontal scroll with sticky first column

---

## UI State Patterns

### Error States
| Context | Message | CTA |
|---------|---------|-----|
| Network failure | "Unable to load data. Check your connection." | Retry button |
| Empty search | "No results for '{query}'" | Clear search link |
| No permissions | "You don't have access to this resource" | Contact admin link |
| Form validation | Inline field errors + summary at top | Focus first error |
| 404 page | "Page not found" | Return to dashboard |

### Loading States
- Use skeleton screens matching content shape
- Minimum display time: 300ms (prevent flash)
- Announce to screen readers: `aria-busy="true"` on container
- Table loading: Show skeleton rows (5 rows default)

### Empty States
| Context | Message | CTA |
|---------|---------|-----|
| No organizations | "No organizations yet" | Create first organization |
| No search results | "No results for '{query}'" | Clear filters |
| No license pools | "No licenses for this organization" | Add license |
| No seat assignments | "No seats assigned yet" | Assign first seat |

### Success States
- Toast notification (bottom-right, auto-dismiss 5s)
- Inline success message for forms
- Activity feed entry added (real-time feel)

---

## Bulk Import Specification

### Validation Rules
- **Required fields:** email (all others optional)
- **Email format:** RFC 5322 compliant
- **Duplicate detection:** By email within same organization
- **Row limit:** 500 per import

### Import Flow
1. **Upload:** Drag-drop or file picker (CSV only)
2. **Preview:** Show first 10 rows, detect columns
3. **Map columns:** Auto-map common headers, manual override
4. **Validate:** Preflight check, highlight errors
5. **Import:** Progress bar with row count
6. **Summary:** "42 created, 3 updated, 5 failed"

### Error Handling
- Downloadable CSV of failed rows with error reasons
- Row-level error messages (line number + issue)
- Partial success allowed (continue on non-fatal errors)

---

## Implementation Approach

### Phase 0: Build Pipeline Setup
1. Initialize `package.json` with Vite, Tailwind CSS 4.x
2. Configure `vite.config.js` for multi-page HTML
3. Set up `tailwind.config.js` with design tokens
4. Install dependencies: Chart.js, Flatpickr, Lucide Icons
5. Verify `npm run dev` and `npm run build` work

### Phase 1: Shared Infrastructure
1. Create `shared/styles.css` with Tailwind `@theme` tokens
2. Create `shared/components.js` (modals, dropdowns, tabs, toast)
3. Create seed data JSON fixtures (organizations, pools, users, notifications)
4. Build command palette (stub version - basic actions only)
5. Build notification dropdown component
6. Set up LocalStorage state management with fallback

### Phase 2: Admin CRM Core
1. Admin layout template (sidebar, header, command palette)
2. Dashboard page with attention items
3. Organizations list with full table features
4. Organization detail (3-column with all tabs)
5. License pools list and detail
6. Users list and detail
7. Impersonation banner and state management

### Phase 3: Admin CRM Extended
1. Billing accounts pages with invoices
2. Analytics dashboard with Chart.js charts
3. Orders pages
4. Audit logs with detail view
5. Settings pages

### Phase 4: Organization Portal Core
1. Portal layout template (Calico branding)
2. Dashboard with onboarding tutorial
3. Licenses list with filters
4. License detail with utilization visualization
5. Seat management and assign flow (with edge states)

### Phase 5: Organization Portal Extended
1. Roster management with bulk import flow
2. School-to-Home overview and configuration
3. Classroom management
4. Settings pages
5. Help/contact pages

### Phase 6: Polish & Verification
1. Command palette full route index (all pages now exist)
2. Link integrity check (fix all broken links)
3. All modal interactions complete
4. Form validation + error states
5. Empty/loading states for all entities
6. Mobile responsive testing (375px - 1280px)
7. Playwright smoke tests passing
8. Accessibility audit (axe-core, 0 critical violations)

### Phase 7: Production Implementation (Future)
Convert approved mockups to Next.js React application:
1. Set up Next.js 16 with TypeScript
2. Convert HTML templates to React components
3. Implement shadcn/ui components
4. Connect to Laravel backend APIs
5. Add authentication/authorization
6. Deploy to production

---

## Verification

### Automated Tests (Playwright)

```javascript
// tests/smoke.spec.js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Admin: Dashboard loads and shows stats', async ({ page }) => {
  await page.goto('/dist/admin/index.html');
  await expect(page.locator('[data-testid="stat-active-orgs"]')).toBeVisible();
});

test('Admin: Command palette opens with Cmd+K', async ({ page }) => {
  await page.goto('/dist/admin/index.html');
  await page.keyboard.press('Meta+k');
  await expect(page.locator('[data-testid="command-palette"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-testid="command-palette"]')).not.toBeVisible();
});

test('Admin: Organization table sorting works', async ({ page }) => {
  await page.goto('/dist/admin/organizations/index.html');
  await page.click('th[data-sort="name"]');
  // Verify sort indicator appears
  await expect(page.locator('th[data-sort="name"] .sort-asc')).toBeVisible();
});

test('Portal: Assign seat flow completes', async ({ page }) => {
  await page.goto('/dist/portal/seats/assign.html');
  await page.click('[data-testid="select-license"]');
  await page.click('[data-testid="license-option"]:first-child');
  await page.click('[data-testid="select-user"]');
  await page.click('[data-testid="user-option"]:first-child');
  await page.click('[data-testid="confirm-assign"]');
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});

test('Accessibility: No critical violations on dashboard', async ({ page }) => {
  await page.goto('/dist/admin/index.html');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(v => v.impact === 'critical')).toHaveLength(0);
});
```

### Link Integrity Check
```bash
# Run after build
npx linkinator ./dist --recurse --skip "^(?!file:)"
```

### Manual Verification Checklist

**Phase 1 Complete When:**
- [ ] `npm run dev` starts Vite server
- [ ] `npm run build` outputs to `/dist`
- [ ] Tokens render correctly (check purple/green in browser)
- [ ] Command palette opens (Cmd+K) and closes (Esc)
- [ ] Notification dropdown toggles

**Phase 2 Complete When:**
- [ ] Navigate: Dashboard → Orgs List → Org Detail
- [ ] Table sorting works (click Name header)
- [ ] Table filtering works (select Type filter)
- [ ] Bulk selection checkbox works
- [ ] All tabs in Org Detail render content

**Phase 3 Complete When:**
- [ ] Billing account detail renders with invoices tab
- [ ] Analytics charts render (revenue, utilization)
- [ ] Audit log entries display with timestamps

**Phase 4 Complete When:**
- [ ] Portal dashboard shows onboarding checklist
- [ ] License cards display utilization bars
- [ ] Seat assign flow completes all steps

**Phase 5 Complete When:**
- [ ] Roster bulk import shows preview
- [ ] School-to-Home portal config saves state
- [ ] Classroom creation modal works

**Phase 6 Complete When:**
- [ ] Link integrity check passes (0 broken links)
- [ ] All modals open/close with focus management
- [ ] Empty states display for each entity type
- [ ] Mobile responsive at 375px width
- [ ] axe-core reports 0 critical violations

---

## QA Handoff Process

Before production implementation:
1. Share `/dist` folder with stakeholders
2. Review critical paths together (listed below)
3. Collect feedback on visual design, flow, missing elements
4. Iterate on mockups until approved
5. Sign-off recorded (email/Slack/ticket)

---

## Files to Create

Total estimated pages: **45-50 HTML files**

Critical paths to build first:
1. `admin/index.html` → `admin/organizations/index.html` → `admin/organizations/detail.html`
2. `portal/index.html` → `portal/licenses/index.html` → `portal/seats/assign.html`
3. `portal/school-to-home/index.html` → `portal/school-to-home/portal-detail.html`
