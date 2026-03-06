# Calico Spanish CRM & Organization Portal Mockups

High-fidelity HTML mockups for a Laravel-based Membership & Licensing CRM system with Organization Portal.

## Architecture Overview

This system manages curriculum licenses for educational organizations (schools, districts, co-ops). Key concepts:

- **Organizations** - Schools, districts, co-ops that purchase licenses
- **BillingAccounts** - The paying entity that funds license pools
- **LicensePools** - Pools of seats with plan type, capacity, and term dates
- **SeatAssignments** - Links users to license pools for curriculum access

### License Types
- **Base** - Standard curriculum access
- **Premium** - Includes School-to-Home Access feature

### License Durations
- 1-Year, 3-Year, 5-Year, Custom

## Pages

### Internal Admin CRM
- **Dashboard** (`index.html`) - Overview with stats, revenue charts, pipeline, activity feed
- **Contacts** (`contacts.html`) - Contact management with table view, filters, status badges
- **Deals** (`deals.html`) - Kanban board pipeline for deal management
- **Products** (`products.html`) - Product catalog with grid view and categories
- **Orders** (`orders.html`) - Order management with status tracking

### Organization Portal (Customer-Facing)
- **Dashboard** (`org-portal-dashboard.html`) - Org overview with license cards, seat stats, onboarding tutorial
- **Licenses** (`org-portal-licenses.html`) - License list with filtering by type (Base/Premium), duration (1yr/3yr/5yr), expiration sorting
- **School-to-Home** (`org-portal-school-to-home.html`) - Premium feature for configuring student home access:
  - Custom URL (e.g., calicospanish.com/acme-academy/)
  - Access password management
  - School logo upload
  - Classroom management with teacher assignments and access codes

## Tech Stack

- HTML5 with Tailwind CSS (via CDN)
- Font Awesome icons
- No build process required

## Viewing the Mockups

```bash
# Using Python
python -m http.server 8000

# Using PHP
php -S localhost:8000

# Or just open any HTML file directly in your browser
```

## Design System

- **Primary Color**: Calico Purple (#482d8b)
- **Sidebar**: Dark Indigo (#1e1b4b)
- **Accent**: Calico Green (#9fcc3f)
- **Calico Teal** (Premium): #68c9c9
- **Font**: Inter (Google Fonts)

## Planned Pages

### Admin CRM
- [ ] Companies/Organizations list
- [ ] License Pools management
- [ ] Billing Accounts
- [ ] Analytics/Reports
- [ ] Audit Logs
- [ ] Settings

### Organization Portal
- [ ] Seat Management
- [ ] Roster / User Invitations
- [ ] Settings
