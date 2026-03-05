# Calico Spanish CRM & Organization Portal - Comprehensive Mockup Plan

## Context

Calico Spanish needs high-fidelity, Figma-level interactive HTML mockups for their Laravel-based Membership & Licensing CRM system. The mockups must support full navigation between all screens, clickable forms, modals, and demonstrate the complete user experience for:

1. **Internal Admin CRM** - For Calico Spanish employees to manage organizations, billing accounts, license pools, and support
2. **Organization Portal** - For school customers (org owners, admins, teachers) to manage their licenses, seats, roster, and School-to-Home access

The mockups will follow HubSpot-style 3-column layouts for detail views, include command palette search, notification center, full-featured tables, inline editing, and interactive charts.

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
├── README.md
├── shared/
│   ├── styles.css                    # Shared Tailwind config & custom CSS
│   └── components.js                 # Shared JS for modals, dropdowns, search
│
├── admin/                            # Internal Admin CRM
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
```

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

## Implementation Approach

### Phase 1: Shared Infrastructure
1. Create `shared/styles.css` with Tailwind config and custom component styles
2. Create `shared/components.js` with reusable JS for modals, dropdowns, tabs, search
3. Build command palette and notification components

### Phase 2: Admin CRM Core
1. Admin layout template (sidebar, header, command palette)
2. Dashboard page
3. Organizations list with full table features
4. Organization detail (3-column with tabs)
5. License pools list and detail
6. Users list and detail

### Phase 3: Admin CRM Extended
1. Billing accounts pages
2. Analytics dashboard with charts
3. Orders pages
4. Audit logs
5. Settings pages

### Phase 4: Organization Portal Core
1. Portal layout template (different sidebar, Calico branding)
2. Dashboard with onboarding
3. Licenses list with filters
4. License detail
5. Seat management and assign flow

### Phase 5: Organization Portal Extended
1. Roster management and invite flow
2. School-to-Home overview and configuration
3. Classroom management
4. Settings pages

### Phase 6: Polish & Connect
1. Ensure all links work between pages
2. Add all modal interactions
3. Add form validation states
4. Add empty/loading states
5. Final visual polish

---

## Verification

- Open `admin/index.html` and navigate through all admin pages
- Open `portal/index.html` and navigate through all portal pages
- Test command palette (Cmd+K)
- Test all modal triggers
- Test all dropdown menus
- Verify all table filters work
- Verify form submissions show success states
- Check responsive behavior at tablet/mobile widths

---

## Files to Create

Total estimated pages: **45-50 HTML files**

Critical paths to build first:
1. `admin/index.html` → `admin/organizations/index.html` → `admin/organizations/detail.html`
2. `portal/index.html` → `portal/licenses/index.html` → `portal/seats/assign.html`
3. `portal/school-to-home/index.html` → `portal/school-to-home/portal-detail.html`
