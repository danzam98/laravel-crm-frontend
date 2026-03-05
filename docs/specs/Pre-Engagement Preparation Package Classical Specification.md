# Calico Spanish Laravel CRM/eCommerce System

## Classical Specification & Design Wireframes

**Version:** 1.0 **Date:** January 22, 2026 **Based on:** Pre-Engagement Preparation Package v1.4

---

## 1\. Executive Summary

This specification defines the Laravel-based Membership & Licensing CRM system that will replace WooCommerce as the authority for access decisions, while integrating with Stripe for billing and WordPress for content delivery.

### **1.1 System Boundaries**

| System | Responsibility |
| :---- | :---- |
| **Laravel (This System)** | BillingAccounts, LicensePools, SeatAssignments, Organizations, Access Decisions, Admin Portal, Org Owner Portal |
| **Stripe** | Customer billing, Subscriptions, Invoices, Payment state, Prices |
| **WordPress** | Content authoring and delivery only (no access decisions) |

### **1.2 Key Architectural Principles**

- Billing, access, and content are separate concerns  
- Access is plan-based, not resource-based  
- BillingAccounts fund LicensePools; SeatAssignments grant access  
- Stripe is authoritative for billing; Laravel is authoritative for access

---

## 2\. User Roles & Portals

### **2.1 Role Taxonomy**

| Role | Description | Access Type |
| :---- | :---- | :---- |
| **Calico Admin** | Internal staff with full system access | Internal Admin Portal |
| **Org Owner** | Primary organization administrator, billing contact | Org Admin Portal |
| **Org Admin** | Delegated administrator (no billing authority) | Org Admin Portal |
| **Member** | End user with curriculum access | Curriculum (WordPress) |

### **2.2 Portal Structure**

```
┌─────────────────────────────────────────────────────────────┐
│                    Laravel Application                       │
├─────────────────────────┬───────────────────────────────────┤
│   Internal Admin Portal │      Org Admin Portal             │
│   (Filament v3)         │      (Customer-facing)            │
│                         │                                   │
│   • BillingAccounts     │   • Organization Dashboard        │
│   • Organizations       │   • Seat Management               │
│   • LicensePools        │   • Roster/User Invitations       │
│   • SeatAssignments     │   • Utilization Reports           │
│   • Audit Logs          │   • → Stripe Portal (billing)     │
│   • Support Workflows   │                                   │
└─────────────────────────┴───────────────────────────────────┘
```

---

## 3\. Core Domain Models

### **3.1 Entity Relationship Overview**

```
┌──────────────────┐       ┌──────────────────┐
│   Organization   │      			│ BillingAccount   │
│                  │		◄──────	│                  │
│  • name          │   		  1:1 		│  • billing_system│
│  • type          │       			│  • funding_source│
│  • metadata      │       			│  • stripe_id     │
└────────┬─────────┘       └────────┬─────────┘
         │                          │
         │ has many                 │ funds
         ▼                          ▼
┌──────────────────┐       ┌──────────────────┐
│      User        │       			│   LicensePool    │
│                  │       			│                  │
│  • email         │       			│  • plan_key      │
│  • name          │       			│  • seat_capacity │
│  • org_role      │       			│  • funding_type  │
└────────┬─────────┘       	│  • start_at      │
         │                 			│  • end_at        │
         │                 			│  • status        │
         │                 		└────────┬─────────┘
         │                        			  │
         │         assigned to      			  │
         │◄─────────────────────────┘
         │
         ▼
┌──────────────────┐
│  SeatAssignment  │
│                  │
│  • user_id       │
│  • pool_id       │
│  • status        │
│  • assigned_at   │
└──────────────────┘
```

### **3.2 Model Specifications**

#### BillingAccount

The canonical paying entity that funds LicensePools.

| Field | Type | Description |
| :---- | :---- | :---- |
| id | bigint | Primary key |
| organization\_id | bigint | FK to Organization |
| billing\_system | enum | `stripe`, `qbo_offline`, `none` |
| funding\_source | enum | `stripe_subscription`, `stripe_invoicing`, `external_paid_offline`, `promotional_trial`, `comped` |
| stripe\_customer\_id | string | Stripe Customer ID (nullable) |
| name | string | Display name |
| email | string | Billing contact email |
| created\_at | timestamp |  |
| updated\_at | timestamp |  |

#### LicensePool

A pool of seats funded by a BillingAccount.

| Field | Type | Description |
| :---- | :---- | :---- |
| id | bigint | Primary key |
| billing\_account\_id | bigint | FK to BillingAccount |
| plan\_key | string | Access tier identifier |
| pool\_funding\_type | enum | `stripe_subscription`, `stripe_invoicing`, `external_paid_offline`, `promotional_trial`, `comped` |
| seat\_capacity | int | Total seats available |
| status | enum | `active`, `at_risk`, `canceled`, `expired` |
| start\_at | datetime | License term start |
| end\_at | datetime | License term end (nullable for subscriptions) |
| source\_ref\_type | string | `woo_order_id`, `qbo_invoice_number`, `stripe_invoice_id`, etc. |
| source\_ref\_id | string | External reference ID |
| stripe\_subscription\_id | string | Stripe Subscription ID (if applicable) |
| created\_at | timestamp |  |
| updated\_at | timestamp |  |

#### SeatAssignment

Links a User to a LicensePool for curriculum access.

| Field | Type | Description |
| :---- | :---- | :---- |
| id | bigint | Primary key |
| user\_id | bigint | FK to User |
| license\_pool\_id | bigint | FK to LicensePool |
| status | enum | `active`, `suspended`, `revoked` |
| assigned\_at | datetime | When seat was assigned |
| assigned\_by | bigint | FK to User (admin who assigned) |
| revoked\_at | datetime | When seat was revoked (nullable) |
| created\_at | timestamp |  |
| updated\_at | timestamp |  |

#### Organization

Administrative and reporting construct for institutions.

| Field | Type | Description |
| :---- | :---- | :---- |
| id | bigint | Primary key |
| name | string | Organization name |
| type | enum | `district`, `school`, `charter`, `coop`, `homeschool`, `individual` |
| metadata | json | Additional attributes |
| created\_at | timestamp |  |
| updated\_at | timestamp |  |

---

## 4\. Module Specifications

### **4.1 Dashboard Module**

**Purpose:** Provide at-a-glance system health and key metrics

**Internal Admin Dashboard Elements:**

- Total active subscriptions / licenses  
- Revenue metrics (MRR, ARR)  
- At-risk pools (payment failures)  
- Recent orders / activity feed  
- Pending support requests  
- Utilization rates

**Org Admin Dashboard Elements:**

- Seat utilization (assigned vs available)  
- License expiration dates  
- Recent roster changes  
- Quick actions (assign seat, invite user)

### **4.2 Orders Module**

**Purpose:** View and manage order history (mirrors WooCommerce Orders)

**Features:**

- List view with filtering: status, date range, payment method, origin  
- Order detail view with customer info, line items, payment status  
- Order actions: view invoice, resend receipt, add note  
- Related orders display (renewals, subscription history)  
- Search by order number, customer name, email

**Status Types:**

- Processing  
- Pending Payment  
- On Hold  
- Completed  
- Cancelled  
- Refunded  
- Failed

**Data Sources:**

- Stripe Subscriptions → processed orders  
- Stripe Invoices → invoice-based orders  
- Legacy WooCommerce imports → historical orders

### **4.3 Subscriptions Module**

**Purpose:** Manage recurring billing relationships

**Features:**

- List view with status filters: Active, Pending, On Hold, Cancelled, Expired  
- Subscription detail view: customer, items, billing cycle, next payment  
- Trial tracking (trial end dates, conversion status)  
- Related orders (renewal history)  
- Link to Stripe Customer Portal for billing changes

**Key Fields:**

- Subscription ID (\#312257 format)  
- Customer name  
- Items / Plan  
- Total / Billing frequency  
- Start date  
- Trial end (if applicable)  
- Next payment date  
- End date  
- Status

### **4.4 Memberships Module**

**Purpose:** Manage LicensePools and access entitlements

**Features:**

- Member list with search and filters  
- Membership detail view: plan, status, dates, billing link  
- Add/transfer/cancel membership actions  
- Membership notes / activity log  
- Profile fields (custom data collection)

**Membership Plans:**

- Full Access  
- Curriculum Only  
- Trial Access  
- Custom plans (configurable)

### **4.5 Customers Module**

**Purpose:** CRM contact management

**Features:**

- Customer list with search, sort, filters  
- Customer detail view: contact info, order history, lifetime value  
- Activity timeline (orders, support, communications)  
- Organization association  
- Download/export functionality

**Key Metrics per Customer:**

- Total orders  
- Total spend  
- Average order value (AOV)  
- Last active date  
- Country/Region

### **4.6 Analytics Module**

**Purpose:** Business intelligence and reporting

**Features:**

- Date range selector with comparison periods  
- Performance KPIs: Total sales, Net sales, Orders, Products sold  
- Charts: Sales over time, Orders over time  
- Breakdown views: By product, By category, By coupon  
- Export capabilities

### **4.7 Settings Module**

**Purpose:** System configuration

**Sections:**

- General (store info, currency, timezone)  
- Products (inventory, measurements)  
- Shipping (zones, methods, classes)  
- Payments (gateways, Stripe config)  
- Accounts & Privacy  
- Emails (notification templates)  
- Integrations (API keys, webhooks)  
- Memberships (plans, access rules)  
- Subscriptions (renewal settings)

---

## 5\. Internal Admin Portal Specifications

### **5.1 Navigation Structure**

```
├── Dashboard
├── Orders
│   ├── All Orders
│   └── Add Order
├── Subscriptions
│   ├── All Subscriptions
│   └── Add Subscription
├── Memberships
│   ├── Members
│   ├── Membership Plans
│   ├── Import/Export
│   └── Profile Fields
├── Customers
├── License Pools
│   ├── All Pools
│   ├── At Risk
│   └── Expired
├── Organizations
│   ├── All Organizations
│   └── Pending Associations
├── Analytics
│   ├── Overview
│   ├── Products
│   ├── Revenue
│   ├── Orders
│   └── Customers
├── Reports
├── Coupons
├── Audit Logs
└── Settings
```

### **5.2 Key Admin Workflows**

#### A) Resolve User Access Issue

1. Search user by email  
2. View SeatAssignments and underlying LicensePools  
3. Identify issue (expired pool, missing assignment, plan mismatch)  
4. Take corrective action with audit note

#### B) Create Manual LicensePool (Legacy/Offline)

1. Select BillingAccount  
2. Choose pool\_funding\_type  
3. Enter required fields: plan\_key, seat\_capacity, dates  
4. Enter provenance: source\_ref\_type, source\_ref\_id  
5. Add audit note (required)  
6. Save with validation

#### C) Process Stripe Invoice Seat Increase

1. Receive webhook: invoice.payment\_succeeded  
2. Check metadata for adjustment\_type \= seat\_increase  
3. Update LicensePool.seat\_capacity  
4. Auto-create audit log

---

## 6\. Org Admin Portal Specifications

### **6.1 Navigation Structure**

```
├── Dashboard
├── Licenses
│   ├── Active Licenses
│   └── License History
├── Roster
│   ├── All Users
│   ├── Invite Users
│   └── Pending Invitations
├── Seat Management
│   ├── Assign Seats
│   └── Utilization
├── Billing (→ Stripe Portal)
└── Settings
    ├── Organization Info
    └── Administrators
```

### **6.2 Key Org Admin Workflows**

#### A) Assign Seat to User

1. Navigate to Seat Management  
2. View available seats by pool  
3. Select user from roster (or invite new)  
4. Assign seat  
5. User receives email notification

#### B) Request Additional Seats (Invoicing)

1. Click "Request Additional Seats"  
2. Enter quantity needed  
3. Submit request to Calico support  
4. Await invoice → Pay → Seats available

#### C) View License Status

1. Dashboard shows utilization  
2. License cards show: plan, seats used/total, expiration  
3. Expired/at-risk badges visible  
4. Renewal request button available

---

## 7\. Stripe Integration Specifications

### **7.1 Webhook Events**

| Event | Action |
| :---- | :---- |
| customer.subscription.created | Create LicensePool (pool\_funding\_type \= stripe\_subscription) |
| customer.subscription.updated | Update seat capacity, status |
| customer.subscription.deleted | Deactivate LicensePool |
| invoice.payment\_failed | Mark pool as at\_risk |
| invoice.payment\_succeeded | Restore pool OR create/update pool (invoicing) |

### **7.2 Metadata Requirements**

**Stripe Product Metadata:**

- plan\_key (required)

**Stripe Subscription Metadata:**

- billing\_account\_type (required)  
- organization\_id (optional)

**Stripe Invoice Metadata (for adjustments):**

- billing\_account\_id  
- license\_pool\_id  
- adjustment\_type: `seat_increase`, `renewal`  
- additional\_seats (if applicable)

---

## 8\. Email Notifications

| Trigger | Recipient | Template |
| :---- | :---- | :---- |
| New order | Admin | new\_order |
| Order cancelled | Admin, Customer | cancelled\_order |
| Order failed | Admin, Customer | failed\_order |
| Order on-hold | Customer | order\_on\_hold |
| Order processing | Customer | processing\_order |
| Order completed | Customer | completed\_order |
| Seat assigned | User | seat\_assigned |
| Seat revoked | User | seat\_revoked |
| License expiring (60d) | Org Owner | license\_expiring |
| License expired | Org Owner | license\_expired |
| Payment failed | Org Owner | payment\_failed |

---

## 9\. Data Migration Requirements

### **9.1 WooCommerce → Laravel Migration**

**In Scope:**

- Active WooCommerce Memberships → LicensePools  
- Active WooCommerce Subscriptions → LicensePools (with Stripe link)  
- Customer records → BillingAccounts \+ Users  
- Order history → Historical reference

**Out of Scope:**

- Expired/cancelled memberships  
- WooCommerce roles and capabilities  
- WordPress user metadata (non-essential)

### **9.2 Migration Mapping**

| WooCommerce | Laravel |
| :---- | :---- |
| wc\_memberships | LicensePools (pool\_funding\_type varies) |
| wc\_subscriptions | LicensePools (stripe\_subscription) |
| wc\_customers | BillingAccounts |
| wp\_users | Users |
| wc\_orders | Historical reference (source\_ref\_id) |

---

## 10\. Technical Stack

### **10.1 Required Packages**

```shell
# Billing
composer require laravel/cashier

# Audit & Permissions
composer require spatie/laravel-activitylog
composer require spatie/laravel-permission

# Admin Panel
composer require filament/filament:"^3.0"

# Observability
composer require laravel/telescope --dev
composer require sentry/sentry-laravel
composer require laravel/horizon

# Utilities
composer require maatwebsite/excel
```

### **10.2 Key Implementation Notes**

- **Billable Entity:** BillingAccount (not User)  
- **Team Permissions:** spatie/laravel-permission with teams enabled  
- **Admin Panel:** Filament v3 for internal admin  
- **Customer Portal:** Custom Blade/Livewire for Org Admin Portal  
- **Queues:** Laravel Horizon for webhook processing

---

## Appendix A: Wireframe Reference

See accompanying HTML wireframe files:

- `wireframes/01-dashboard.html`  
- `wireframes/02-orders-list.html`  
- `wireframes/03-order-detail.html`  
- `wireframes/04-subscriptions.html`  
- `wireframes/05-memberships.html`  
- `wireframes/06-customers.html`  
- `wireframes/07-analytics.html`  
- `wireframes/08-org-portal-dashboard.html`  
- `wireframes/09-org-portal-seats.html`

---

## Appendix B: Glossary

| Term | Definition |
| :---- | :---- |
| BillingAccount | Canonical paying entity that funds LicensePools |
| LicensePool | Pool of seats funded by a BillingAccount |
| SeatAssignment | Links User to LicensePool for access |
| plan\_key | Stable identifier for access tier |
| pool\_funding\_type | How the pool is funded (stripe\_subscription, invoicing, etc.) |
| Org Owner | Primary org administrator with billing authority |
| Org Admin | Delegated administrator without billing authority |

