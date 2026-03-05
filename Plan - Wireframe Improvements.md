# Wireframe Improvements Plan

## Context
Marisela Jimenez and Daniel Fischer reviewed the CRM and Portal interfaces and identified improvements to simplify navigation, consolidate data views, and increase portal utility. This plan implements those changes across the existing HTML wireframes.

---

## CRM Changes

### 1. Simplify Dashboard (`CRM/01-admin-dashboard.html`)
- **Remove** stat cards (Total Sales, Net Sales, Orders, etc.) and charts (Net Sales, License Utilization) — these move to Analytics
- **Replace with** a simplified operational dashboard: quick action links, alert/attention items (at-risk pools, pending orders), and a welcome/summary area
- **Add** a global search bar in the header

### 2. Enhance Analytics (`CRM/07-analytics.html`)
- **Absorb** the dashboard's stat cards and charts into Analytics as a richer overview
- Add additional KPI cards: Active Licenses, At-Risk Pools, License Utilization gauge
- Keep existing date-range selector, charts grid, and sub-nav (Products, Revenue, Orders, etc.)

### 3. Restructure CRM Sidebar (all CRM files)
**Current sidebar:**
- Dashboard
- Commerce: Orders, Subscriptions, Memberships, Customers
- Licensing: Organizations, Billing Accounts, License Pools, Seat Assignments
- Reports: Analytics, Audit Logs
- System: Coupons, Settings

**New sidebar:**
- Dashboard
- **Customers** (consolidated — replaces Subscriptions, Memberships, Customers)
- **Orders** (kept as-is)
- **Coupons** (promoted to own top-level nav item)
- **Invoices** (new item)
- Licensing: Organizations, Billing Accounts, License Pools, Seat Assignments
- Analytics (promoted from Reports, absorbs informational content)
- Audit Logs
- Settings

### 4. Consolidate Customer View (`CRM/06-customers.html`)
- **Rename/redesign** into a unified "Customers" page
- Keep the existing customer list table
- Update nav to show it as the primary customer entry point
- **Remove** separate Subscriptions nav item (04) and Memberships nav item (05) from sidebar — their data is accessible via Customer detail view
- Note: Files 04/05 remain as-is for now (legacy reference) but are no longer linked from sidebar

### 5. Add Invoices Nav Item
- Add an "Invoices" link in the sidebar (placeholder `#` link for now, no new wireframe file needed)

### 6. Create Licensing Wireframe (`CRM/14-licensing-organizations.html`) — NEW FILE
- New wireframe for the Organizations list view under Licensing
- Follow CRM patterns: dark sidebar, filter bar, data table
- Show: Org name, type (School/Co-op/District), active licenses, total seats, utilization %, billing status, primary contact
- Include search/filter and pagination

### 7. Update Sidebar on All Existing CRM Files
Files to update sidebar nav: `01`, `02`, `03`, `04`, `05`, `06`, `07`
- Apply the new sidebar structure consistently
- Update active states appropriately per page

---

## Portal Changes

### 8. Add Tutorial/Onboarding to Portal Dashboard (`Org Portal/10-org-portal-dashboard-v2.html`)
- Add a "Getting Started" tutorial card at the top of the dashboard (above stats)
- Collapsible/dismissible design
- Steps: 1) Review your licenses, 2) Assign seats to teachers, 3) Set up School-to-Home Access, 4) Invite roster members
- Each step links to the relevant page
- Add a progress indicator (e.g., "2 of 4 complete")

### 9. Add Search Bar to Portal Dashboard (`Org Portal/10-org-portal-dashboard-v2.html`)
- Add a search input in the topbar, to the left of the action buttons
- Placeholder: "Search licenses, users, seats..."

### 10. Clean Up Portal Licenses View (`Org Portal/11-org-portal-licenses.html`)
- Simplify the license cards: reduce visual noise, consolidate detail items
- Move the license ID into a tooltip or secondary info line (instead of a full detail row)
- Make the progress bars more prominent
- Simplify the summary bar: fewer stats, clearer hierarchy
- Remove the table view toggle (cards-only for cleaner experience)

### 11. Enhance School-to-Home for Classroom Management (`Org Portal/12-org-portal-school-to-home.html`)
- Add a "Classrooms" section below the existing portal settings
- Allow teachers to create classroom groups (e.g., "3rd Grade - Room 201")
- Each classroom has: teacher name, grade level, student count, unique access code
- Add a classrooms management table showing existing classrooms
- This enables teachers to organize students and track usage per classroom

---

## Files Modified
| File | Change |
|------|--------|
| `CRM/01-admin-dashboard.html` | Simplify content, add search bar, update sidebar |
| `CRM/02-orders-list.html` | Update sidebar |
| `CRM/03-order-detail.html` | Update sidebar |
| `CRM/04-subscriptions.html` | Update sidebar (no longer linked from nav) |
| `CRM/05-memberships.html` | Update sidebar (no longer linked from nav) |
| `CRM/06-customers.html` | Update sidebar, update as primary customer view |
| `CRM/07-analytics.html` | Add dashboard KPIs/charts, update sidebar |
| `CRM/14-licensing-organizations.html` | **NEW** — Licensing Organizations list |
| `Org Portal/10-org-portal-dashboard-v2.html` | Add tutorial, add search bar |
| `Org Portal/11-org-portal-licenses.html` | Simplify/clean up display |
| `Org Portal/12-org-portal-school-to-home.html` | Add classroom management section |

## Verification
- Open each modified HTML file in a browser to verify layout and visual consistency
- Check all sidebar navigation links point to correct files
- Confirm new sidebar structure is consistent across all CRM pages
- Verify Portal pages render correctly with new additions
