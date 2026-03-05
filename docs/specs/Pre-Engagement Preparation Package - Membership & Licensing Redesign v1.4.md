# Pre-Engagement Preparation Package – Membership & Licensing Redesign v1.4

This document is the **authoritative v1.4 specification** for the Membership, Licensing, and Billing architecture.

It supersedes v1.3 by adding implementation guidance that maps architectural requirements to existing Laravel packages and solutions, reducing custom development effort.

---

## Changelog: v1.3 → v1.4

| Section | Change |
| :---- | :---- |
| 1.2 Systems of Record | Added Laravel Cashier implementation note for BillingAccount as Billable entity |
| 3.3 Stripe Billing | Added Cashier webhook handling guidance |
| 3.5 Customer Portal | Added Cashier portal URL method |
| 6.4 Audit & Compliance | Added spatie/laravel-activitylog implementation |
| 6.5 Observability | Added Telescope/Sentry/Horizon stack |
| 8 Organization Roles | Added spatie/laravel-permission with teams |
| 9.5 Admin Capabilities | Added Filament v3 recommendation |
| NEW: Section 10 | Package installation summary |

---

# Pre-Engagement Preparation Package

Membership, Licensing, and Billing System Redesign

## 1\. Executive Architecture Brief (Authoritative)

### **1.1 Purpose**

This document establishes the canonical architecture, decision authority, and execution constraints for the Membership & Licensing System redesign. It is intended to eliminate ambiguity and prevent architectural drift during implementation.

### **1.2 Systems of Record**

**📦 Implementation: Laravel Cashier v15+**

Cashier handles Stripe Customer/Subscription sync. **Critical decision:** Implement `Billable` trait on `BillingAccount` model (not `User`) to properly decouple billing from access per this architecture.

**Custom dev required:** None for Stripe sync; domain models (LicensePool, SeatAssignment) are custom.

The following assignments are authoritative:

**Stripe** System of record for:

- Customers (when billing\_system \= stripe)  
- Subscriptions (Stripe Billing)  
- Invoices (Stripe Invoicing)  
- Payment state  
- Prices and price configuration  
- Invoices and invoice status

**Laravel Membership & Licensing Service** System of record for:

- BillingAccounts (canonical customer identity)  
- LicensePools (all pool\_funding\_type variants)  
- SeatAssignments  
- Access decisions  
- Organizations and rosters (administrative context)

**WordPress**

- Content authoring and delivery only  
- Hosts curriculum content  
- Does not authenticate users  
- Does not make access decisions  
- Content may be tagged with plan\_key metadata; Laravel enforces access

### **1.3 Core Architectural Principles**

- Billing, access, and content are separate concerns  
- Access is plan-based, not resource-based

---

## Glossary of Canonical Terms (Authoritative)

This glossary defines all domain terms used in this document. Unless explicitly stated otherwise, these definitions are authoritative and must be used consistently.

### **Access**

The ability for an authenticated user to view or use gated curriculum content. Access is granted only via an active SeatAssignment.

### **BillingAccount**

The canonical paying entity that funds one or more LicensePools. A BillingAccount represents the customer record in the Membership Service and remains stable across billing rails. BillingAccounts fund LicensePools but never grant access directly.

### **Comped Pool (Complimentary LicensePool)**

A LicensePool created for complimentary (free) access issued by Calico Spanish. Comped pools are never paid, require manual creation, and require audit notes.

### **LicensePool**

A pool of seats funded by a BillingAccount. LicensePools represent a block of interchangeable seats purchased together. When backed by Stripe Billing, a LicensePool maps 1:1 to a single Stripe subscription line item, and the subscription item quantity defines the seat capacity.

Stripe is the source of truth for seat quantity. The Membership Service is the source of truth for seat assignment.

LicensePools define seat capacity and plan compatibility but do not grant curriculum access.

### **Organization**

An administrative and reporting construct representing an institution (district, school, charter, co-op). Organizations provide context and management scope.

### **Org Owner**

The single authoritative administrator for an Organization and its BillingAccount. The Org Owner controls billing and license management and must always exist exactly once per Organization.

### **Org Admin**

A delegated organization administrator who may manage seats and rosters but has no billing authority.

### **Member**

A User associated with an Organization with no explicit administrative permissions.

### **Plan**

A purchasable access tier identified by a stable plan\_key shared across Stripe, the Membership Service, and WordPress. Plans determine access compatibility and may be used for content segmentation and reporting metadata.

### **plan\_key**

A stable identifier for a Plan, stored in Stripe product metadata and used across systems for access checks and classification. Encodes plan scope for content segmentation and reporting.

### **Seat**

A single unit of access capacity within a LicensePool.

### **SeatAssignment**

Links a User to a LicensePool. An active SeatAssignment indicates curriculum access.

### **Stripe Customer**

The Stripe object representing a payer. Mapped 1:1 to a BillingAccount when billing\_system \= stripe.

### **Stripe Subscription**

The Stripe object representing a recurring purchase. Subscription item quantity defines seat capacity for the associated LicensePool.

### **Survey (First-Login Survey)**

A user-facing questionnaire used for CRM enrichment and organization suggestions. Survey data never grants access.

---

## 2\. Explicit Non-Goals

The following are intentionally out of scope for Phase 1 and should not be designed for implicitly:

- Per-lesson or per-course entitlements  
- WordPress-side membership logic  
- WooCommerce or legacy membership engines post-cutover  
- Perfect historical reconstruction of legacy billing data  
- Automatic access for users without an active SeatAssignment  
- Role-based access for content authorization (i.e., roles granting curriculum access)  
- Student-level access logic

If a requirement appears to contradict this list, assume the requirement is invalid unless escalated.

---

## 3\. Stripe Integration Contract

This section governs behavior **only when billing\_system \= stripe**.

### **3.1 Stripe Customer Creation**

- A Stripe Customer may be created for any BillingAccount at any time.  
- Creating a Stripe Customer does **not** bill the customer and does not create subscriptions or invoices by default.  
- Stripe Customers may exist for BillingAccounts whose current funding\_source is non-stripe (e.g., QBO offline) to support future migration.

### **3.2 Metadata Canon (Mandatory)**

**Stripe Product Metadata**

- plan\_key (required)

**Stripe Subscription Metadata**

- billing\_account\_type (required)  
- organization\_id (optional, advisory)

### **3.3 Stripe Billing (Subscriptions)**

**📦 Implementation: Laravel Cashier \+ Event Listeners**

Cashier handles all webhooks listed below natively.

**Custom dev required:** Event listeners to create/update LicensePools when Cashier fires `WebhookReceived` events. Approximately 5 listener classes.

```php
// EventServiceProvider.php
WebhookReceived::class => [
    CreateLicensePoolOnSubscription::class,
    SyncCapacityOnSubscriptionUpdate::class,
    DeactivatePoolOnSubscriptionDelete::class,
    MarkPoolAtRiskOnPaymentFailed::class,
    RestorePoolOnPaymentSucceeded::class,
]
```

- Stripe subscriptions are authoritative for:  
    
  - Billing lifecycle  
  - Seat capacity (subscription quantity)


- Webhook events in scope:  
    
  - `customer.subscription.created` → Create LicensePool (pool\_funding\_type \= stripe\_subscription)  
  - `customer.subscription.updated` → Update seat capacity / status  
  - `customer.subscription.deleted` → Deactivate LicensePool  
  - `invoice.payment_failed` → Mark pool as at-risk (grace period rules apply)  
  - `invoice.payment_succeeded` → Restore pool if previously at-risk

### **3.4 Stripe Invoicing**

**📦 Implementation: Laravel Cashier (read-only)**

All invoice creation, quote conversion, and out-of-band payment marking is performed directly in Stripe by Calico finance. Laravel only reads invoice state and reacts to webhooks.

Cashier provides: `invoices()`, `findInvoice()`, webhook handling. For quote retrieval (if needed): use `$billingAccount->stripe()->quotes->retrieve()`.

**Custom dev required:** Webhook listener to create/update LicensePool on `invoice.payment_succeeded` with invoicing metadata.

* Stripe Invoicing may be used for annual or non-recurring renewals.  
* Invoice payment is authoritative for billing state; entitlement terms are instantiated in the Membership Service as LicensePools with pool\_funding\_type \= stripe\_invoicing.  
* Invoices may be paid via card, ACH, or **offline methods (e.g., check)** and manually marked as paid out-of-band by Calico Spanish admins.

### **3.5 Stripe Subscription Quantity Change Policy (Customer Self‑Serve)**

**📦 Implementation: Laravel Cashier (built-in)**

Portal URL generation is one line:

```php
$url = $billingAccount->billingPortalUrl(route('dashboard'));
```

Portal configuration (which actions are allowed) is done in Stripe Dashboard, not code.

**Custom dev required:** None.

Applies only when funding\_source \= stripe\_subscription.

- Org Owners cannot change subscription quantity through Calico (Laravel) workflows.  
- Changing subscription quantity is possible only in Stripe Customer Portal.  
- Decreases to quantity take effect at the **next billing cycle**.  
- Increases may take effect immediately (with proration) or at the next billing cycle, depending on Stripe portal configuration.

---

## 4\. Edge Case Decision Log

This section enumerates authoritative edge‑case decisions and lifecycle rules that must be supported by the system.

### **4.7 Legacy Paid Access (Non-Stripe)**

Paid access originating outside Stripe (e.g., WooCommerce legacy memberships, QBO invoice/PO) is supported via manually created or imported **fixed-term LicensePools**.

Authoritative rules:

- Pools must use pool\_funding\_type \= external\_paid\_offline (paid) or promotional\_trial (free trial).  
- Each pool must include source\_ref\_type and source\_ref\_id (e.g., woo\_order\_id, qbo\_invoice\_number, qbo\_po\_number).  
- These pools are not comped.

### **4.8 Renewal and Cutover to Stripe**

When a legacy fixed-term pool approaches expiration:

- Renewal must be executed via **Stripe Billing** (for recurring subscriptions) or **Stripe Invoicing** (for annual/non-recurring purchases).

**QBO → Stripe Invoicing Migration Path:**

- Customers currently billed via QuickBooks Online (QBO) will migrate to Stripe Invoicing  
- Payment methods remain unchanged from customer perspective:  
  - ACH (bank transfer)  
  - Wire transfer  
  - Check (offline payment marked paid out-of-band)  
- Stripe Invoicing configuration restricts credit card payments  
- Functional purchasing workflow for customers is identical to legacy QBO flow

The resulting Stripe object (subscription or invoice) creates a new Stripe-backed LicensePool under the same BillingAccount.

Organization, users, and roster context remain unchanged.

SeatAssignments must preserve continuity semantics when transitioning between pools.

**Renewal Workflow by Current Funding Source:**

| Current `funding_source` | Renewal Path | Payment Methods | Notes |
| :---- | :---- | :---- | :---- |
| `stripe_subscription` | Auto-renews in Stripe Billing | Card, ACH (auto-debit) | Customer manages via Stripe Customer Portal |
| `stripe_invoicing` | Calico issues new Stripe Invoice | ACH, wire, check | Sales-assisted, no change to customer experience |
| `external_paid_offline` (QBO) | **Migrate to** `stripe_invoicing` | ACH, wire, check | One-time migration; subsequent renewals via Stripe Invoicing |
| `promotional_trial` | Customer chooses Stripe Billing or Invoicing | Depends on chosen plan | Trial → paid conversion |

**QBO to Stripe Invoicing Migration (One-Time Per Customer):**

When a QBO-backed pool (`funding_source = external_paid_offline`, `source_ref_type = qbo_invoice_number`) expires:

1. Calico finance generates renewal quote in Stripe (Quote → Invoice conversion)  
2. Stripe Invoice issued with payment methods limited to: ACH, wire transfer, check  
3. Customer pays via same method used previously (typically check or ACH)  
4. Upon payment (marked paid in Stripe or paid out-of-band): a. Update BillingAccount: `funding_source = stripe_invoicing` b. Create new LicensePool: `pool_funding_type = stripe_invoicing`, `source_ref_type = stripe_invoice_id`  
5. Preserve all seat assignments under new pool (migration semantics per Section 4.8)

**End-User Experience:**

- Customer receives invoice from Calico (now Stripe-hosted instead of QBO PDF)  
- Payment instructions identical (ACH routing details, check mailing address)  
- Access continuity maintained throughout transition

### **4.9 Promotional Free Trial (Woo)**

- Free trials are modeled as pool\_funding\_type \= promotional\_trial.  
- Trials are fixed-term and limited in plan scope.  
- Trials are not comped and must not stack with paid access for the same scope.

### **4.10 Provenance Requirements (Non-Stripe Pools)**

To make non-Stripe pools explicit and auditable:

- Provenance must be anchored on LicensePools (pool\_funding\_type \+ source\_ref\_type/source\_ref\_id).  
- SeatAssignments must not store third‑party payment provenance; they inherit provenance from their LicensePool.

---

## 5\. Migration Strategy (Intentional Constraints)

**📦 Implementation: Laravel Migrations \+ Seeders**

Use standard Laravel infrastructure for one-time migration scripts.

**Custom dev required:** Migration seeder classes connecting to WordPress/WooCommerce database and mapping to new schema. Consider `maatwebsite/excel` for bulk validation exports.

This section defines which legacy data and behaviors must be migrated into the Membership Service and which are intentionally excluded.

Migration rules:

- Active entitlements must be represented as LicensePools and SeatAssignments.  
- Legacy WooCommerce and manual memberships are imported as fixed‑term LicensePools with explicit provenance.  
- Expired or abandoned legacy memberships must not grant access post‑cutover.  
- Stripe Customers may be pre‑created for all BillingAccounts to support future billing migration.

### **5.1 WordPress / WooCommerce → Membership Service Migration (Authoritative)**

This subsection defines the one‑time migration from WordPress/WooCommerce membership logic to the Membership & Licensing Service as the sole access authority. **No dual‑run behavior is supported or required.**

#### Migration Scope

The following legacy artifacts are in scope for migration:

- Active WooCommerce Memberships and Subscriptions that currently grant curriculum access  
- Manually granted WooCommerce memberships that represent paid or trial access  
- Associated users who currently hold access

The following artifacts are explicitly out of scope:

- Expired or canceled WooCommerce memberships  
- Historical billing records beyond what is required for provenance  
- WooCommerce roles, capabilities, or access rules

#### Migration Mapping Rules (Authoritative)

Each active WooCommerce membership must be migrated as follows:

- Create (or identify) a BillingAccount corresponding to the customer  
- Create a LicensePool with:  
  - pool\_funding\_type \= external\_paid\_offline (paid memberships) **or** promotional\_trial (free trials)  
  - plan\_key mapped from the WooCommerce product / membership  
  - seat\_capacity derived from the Woo membership quantity (or 1 for individual memberships)  
  - start\_at \= original membership start date  
  - end\_at \= original membership end date  
  - source\_ref\_type \= woo\_order\_id  
  - source\_ref\_id \= Woo order or membership identifier  
- Create SeatAssignments for each user currently holding access under that membership

#### Free Trial Handling

WooCommerce free trials are migrated as:

- pool\_funding\_type \= promotional\_trial  
- Fixed‑term LicensePools with limited plan\_key scope  
- No stacking with paid access for the same plan scope

#### Cutover Semantics (Authoritative)

- At cutover, **all curriculum access checks switch immediately** to the Membership Service.  
- There is no period during which WooCommerce and the Membership Service both grant access.

#### Post‑Migration State

After migration:

- Existing migrated LicensePools remain valid until their end\_at date.  
- Upon renewal, all customers must renew via Stripe Billing or Stripe Invoicing under the same BillingAccount.

---

## 6\. Admin & Operational Expectations

This section defines operational expectations for internal teams and administrative workflows. It complements Section 9 (portal boundaries, customer capabilities) and applies across all billing rails.

### **6.1 Operational Principles (Authoritative)**

- **billing\_system \= stripe**: payment failures, invoice status, and subscription lifecycle are resolved in Stripe.  
- **Paid vs complimentary is non-negotiable**: paid access must never be represented as comped pools.  
- **Provenance is mandatory for manual work**: every manual pool or transition must be traceable to an external source (Woo, QBO, Stripe invoice/subscription) and an internal actor.

### **6.2 Support Workflows (Minimum)**

Internal support must be able to execute the following workflows end-to-end:

**A) User access issues**

- Identify User by email.  
- Inspect SeatAssignments and underlying LicensePools.  
- Determine whether denial is due to missing/expired pool vs unassigned seat vs plan mismatch.  
- Correct by (as policy allows): updating assignments, correcting pool dates/provenance, or guiding the Org Owner/admin.

**B) Organization onboarding / roster management**

- Create or correct Organization records.  
- Assign Org Owner and Org Admin roles.  
- Assist Org Owners with invitations and seat assignment procedures.

**C) Stripe Billing subscription customers**

- Route subscription quantity changes to Stripe Customer Portal only.  
- Enforce deterministic capacity vs assignment reconciliation.

**D) Stripe Invoicing customers (sales-assisted)**

- Receive "Request quote / Add seats / Renewal via invoice" requests.  
- Issue a new invoice (or a quote that generates a new invoice) for any billing change.  
- Mark invoices paid out-of-band for checks when applicable.  
- Create/extend LicensePools upon invoice payment.

**E) Legacy/offline customers (QBO/Woo/manual)**

- Create/import fixed-term LicensePools with required provenance.  
- Communicate renewal/cutover path to Stripe at expiration.

### **6.3 Financial Operations Expectations (Authoritative)**

- **Stripe Billing**: billing state is managed in Stripe; the Membership Service mirrors entitlement consequences.  
- **Stripe Invoicing**:  
  - Invoices may be paid by card/ACH via hosted invoice links or by check.  
  - Checks are processed outside Stripe; finance marks invoices paid out-of-band.  
  - Any seat increase requires a new invoice artifact (no in-place capacity changes without invoicing).

### **6.4 Audit & Compliance (Mandatory)**

**📦 Implementation: spatie/laravel-activitylog**

This package handles all audit requirements natively:

- Actor tracking via `causedBy()`  
- Timestamp (automatic)  
- Prior/new state via `withProperties()`  
- Immutable logs (append-only by design)

**Custom dev required:** Configuration only. Add `LogsActivity` trait to models.

```php
class LicensePool extends Model {
    use LogsActivity;
    protected static $logAttributes = ['seat_capacity', 'status', 'end_at'];
    protected static $logOnlyDirty = true;
}
```

All of the following must be auditable with actor, reason, timestamp, and prior/new state:

- BillingAccount transitions (billing\_system and funding\_source changes).  
- LicensePool manual creation or edits (including provenance corrections).  
- SeatAssignment create/revoke/suspend/reactivate actions.  
- Org Owner transfers and org-role changes.

Audit records must be immutable once written.

### **6.5 Observability & Alerting (Minimum)**

**📦 Implementation: Laravel Telescope \+ Sentry \+ Horizon**

| Requirement | Solution |
| :---- | :---- |
| Webhook logging | Telescope requests tab \+ custom log channel |
| Stripe sync errors | Sentry exception tracking |
| Access check logging | Custom middleware \+ Telescope |
| Queue monitoring | Laravel Horizon dashboard |
| Notifications | Laravel Notifications → Slack |

**Custom dev required:** Slack notification classes for alerts (\~50 LOC each).

- Log all Stripe webhook deliveries and idempotency keys.  
- Surface Stripe sync errors and out-of-sync conditions in the internal admin UI.  
- Record access checks at the decision level (user, required plan\_keys, result).  
- Notify internal support when:  
  - payment failures place pools at-risk,  
  - capacity drops below active assignments,  
  - a manual pool attempt is rejected due to missing provenance (hard reject).

### **6.6 Data Quality Guardrails (Authoritative)**

- Prevent creation of ambiguous pools:  
  - Non-stripe\_subscription pools require source\_ref\_type/source\_ref\_id.  
  - Fixed-term pools require start\_at/end\_at.  
- Prevent customers from self-serving billing actions in Laravel.  
- Ensure UI labeling distinguishes:  
  - Admin (no curriculum access)  
  - User with active SeatAssignment  
  - Funding rail (subscription vs invoicing vs offline vs trial vs comped)

---

## 7\. Internal Operations & CRM Association Policy (Authoritative)

This section governs how Calico Spanish employees and internal systems manage Organization associations for CRM and account intelligence. These policies are intentionally decoupled from billing and access.

### **7.1 Core Principles**

- Organization association is informational and administrative, not an entitlement.  
- Billing ownership and seat control are never inferred from organization membership.  
- Automation may suggest, but only humans may apply organization associations.

### **7.2 Manual Organization Assignment (Internal Only)**

Calico Spanish employees may manually associate a User with an Organization.

**Purpose:**

- Improve CRM accuracy  
- Support reporting, outreach, and account intelligence

**Explicit constraints:**

- Manual assignment does not change billing accounts.  
- Manual assignment does not assign or revoke seats.  
- Manual assignment does not affect access.

**Audit requirements:**

- Actor (employee)  
- Reason (required)  
- Timestamp

### **7.3 Automated Organization Suggestions (Human-in-the-Loop)**

**📦 Implementation: Custom (domain-specific logic)**

No off-the-shelf package. Queue jobs for async suggestion generation.

**Custom dev required:** Suggestion service class \+ admin review UI.

The system may generate organization association suggestions for internal review based on non-authoritative signals such as:

- Email domain matches  
- Survey responses  
- Existing organization rosters  
- Advisory Stripe metadata

**Rules:**

- Suggestions are never auto-applied.  
- Each suggestion must include an explanation and confidence indicator.  
- A Calico employee must explicitly approve, ignore, or defer each suggestion.

---

## 8\. Organization Roles & Permissions (Authoritative)

**📦 Implementation: spatie/laravel-permission with Teams**

Enable team-based permissions in config for org-scoped roles:

```php
// config/permission.php
'teams' => true,
```

This maps directly to your role taxonomy without custom pivot tables.

**Custom dev required:**

- Guardrail validation (exactly one Org Owner) via Observer  
- Policy classes for authorization (\~10 methods)

This section defines Organization-scoped roles used in the Org Admin Portal. These roles govern administrative capabilities and do not grant curriculum access unless the user separately holds an active SeatAssignment.

### **8.1 Separation of Concerns**

- Org roles control administrative actions within an Organization.  
- Curriculum access is granted only by SeatAssignments.  
- A user may hold an Org role with or without holding a curriculum seat.

### **8.2 Role Taxonomy**

**Org Owner**

- Definition: Primary organization administrator and default billing contact.  
- Cardinality: Exactly one per Organization.  
- Responsibilities:  
  - Manage billing (via Stripe when applicable)  
  - Manage LicensePools funded by the Organization's BillingAccount  
  - Assign and revoke Org roles

**Org Admin**

- Definition: Delegated organization administrator.  
- Cardinality: Many allowed.  
- Responsibilities:  
  - Manage seat assignments within available capacity  
  - View roster and utilization reporting  
- Constraint: No billing authority.

**Member**

- Definition: User associated with the Organization.  
- Permissions: No explicit administrative permissions.  
- May hold a SeatAssignment for curriculum access.

### **8.3 Seatless Admin Policy**

- Org Owners and Org Admins may exist without holding a SeatAssignment.  
- This allows district or administrative personnel to manage licenses without consuming seats.

### **8.4 Guardrails**

- The system must prevent an Organization from having zero Org Owners.  
- Any attempt to remove the last Org Owner must be rejected unless part of an atomic ownership transfer.  
- Org roles must never imply curriculum access.

---

## 9\. Admin Portal and Stripe Customer Portal Responsibilities

This section defines the boundary between the Calico Spanish (Laravel) Org/Admin Portal and Stripe's Customer Portal.

### **9.1 Laravel Portal — Authoritative for Licensing**

The Laravel portal is the only interface that may mutate or display the authoritative state for:

- Organizations and org roles  
- BillingAccounts (canonical customer identity)  
- LicensePools (all pool\_funding\_type variants)  
- Seat inventory and utilization  
- SeatAssignments (assign/revoke/suspend/reactivate)  
- User identity, role assignments, and SeatAssignments  
- Audit logs for licensing and access changes

### **9.2 Stripe Customer Portal — Billing Self‑Service Only**

Stripe Customer Portal is used only for billing self‑service when billing\_system \= stripe and the customer is on an active Stripe rail:

- funding\_source \= stripe\_subscription (Stripe Billing)  
- funding\_source \= stripe\_invoicing (Stripe Invoicing)

**Permitted Stripe-portal capabilities (configurable):**

- Update payment method(s)  
- Update billing details  
- View and download invoices/receipts  
- Manage subscription status and plan (Stripe Billing)  
- Change subscription quantity (Stripe Billing only)

If billing\_system ≠ stripe (e.g., qbo\_offline), the customer may still have a stripe\_customer\_id for future migration, but the Stripe portal must be hidden or presented only as a limited "set up billing for migration" flow.

### **9.3 Customer-Facing Org Portal Capabilities (Org Owner / Org Admin)**

Regardless of billing\_system/funding\_source, Org Owner and Org Admin may:

- View organization roster and utilization  
- Invite users and manage roster membership  
- Assign and revoke seats (SeatAssignments) within available seat capacity  
- View plan scope / plan\_key coverage and current entitlement term dates (where applicable)  
- View LicensePools and seat capacity, including pool\_funding\_type badges and source references

### **9.4 Stripe Invoicing Customers — Billing Changes, Seat Additions, and Quotes**

Stripe Invoicing serves as the **direct replacement for QuickBooks Online invoicing** with pre-paid, fixed-term licensing.

**Core Principle:**

- Invoices are **pre-paid for the entire license term**  
- Invoice specifies seat count and term dates (e.g., 50 seats, Aug 1 2026 \- Jul 31 2027\)  
- Payment creates a LicensePool with seat\_capacity matching invoice, start\_at and end\_at matching term

#### 9.4.1 Seat Increases (Mid-Term)

**Customer Request Flow:**

1. Org Owner/Admin clicks **"Request Additional Seats"** in Org Portal  
2. Request routed to Calico support with context:  
   - Current seat count  
   - Requested additional seats  
   - Remaining term duration  
   - Current license\_pool\_id and invoice reference  
3. **Calico admin issues prorated invoice:**  
   - Calculate prorated amount: (additional\_seats × annual\_price × remaining\_months) / 12  
   - Create Stripe Invoice for the prorated amount  
   - Invoice metadata:

```json
{
  "billing_account_id": "12345",
  "license_pool_id": "67890",
  "adjustment_type": "seat_increase",
  "additional_seats": 10,
  "original_invoice_id": "in_abc123"
}
```

4. **Upon payment** (invoice.payment\_succeeded webhook):  
   - Laravel identifies this as a seat adjustment (via adjustment\_type metadata)  
   - Updates existing LicensePool.seat\_capacity: 50 → 60  
   - Preserves start\_at and end\_at dates (no term change)  
   - Creates audit log: actor=stripe\_webhook, action=capacity\_increase, reason=invoice\_in\_xyz789\_paid  
5. **New seats immediately available** for assignment in Org Portal

**No Customer Portal Self-Service:**

- Stripe Invoicing customers cannot modify seat count themselves  
- All changes are sales/support-assisted via new invoice issuance

#### 9.4.2 Seat Decreases (Mid-Term) — Refund Workflow

**Customer Request Flow:**

1. Org Owner/Admin contacts Calico support: *"We need to reduce from 50 to 40 seats"*  
2. **Calico admin reviews request:**  
   - Verify current active\_seat\_count \<= 40 (customer must have already removed assignments)  
   - If active\_seat\_count \> 40: Instruct Org Owner to remove seats first, then re-request refund  
   - Calculate prorated refund: (removed\_seats × annual\_price × remaining\_months) / 12  
3. **Admin issues refund in Stripe:**  
   - Navigate to original invoice in Stripe Dashboard  
   - Click "Refund" → Enter prorated amount  
   - Add refund reason: *"Seat reduction: 50 → 40 seats, X months remaining"*  
   - Process refund (ACH reversal or check mailed to customer)  
4. **Manual Laravel adjustment** (Stripe does NOT fire webhook for refunds that decrease seats):  
   - Internal admin UI: Locate LicensePool for this BillingAccount  
   - Click "Adjust Capacity" → Enter new seat count: 40  
   - Required fields:  
     - reason: "Refund processed: Stripe refund re\_abc123"  
     - stripe\_refund\_id: "re\_abc123"  
     - actor: (logged-in admin user)  
   - System validates: new\_capacity \>= active\_seat\_count  
   - Update LicensePool.seat\_capacity: 50 → 40  
   - Create audit log: actor=admin\_user\_id, action=capacity\_decrease, reason=refund\_re\_abc123  
5. **Confirmation:**  
   - Email Org Owner: *"Seat count reduced to 40\. Prorated refund of $XXX processed."*  
   - Refund appears on customer's bank statement within 5-10 business days

**Guardrails:**

- Refund capacity decrease blocked if new\_capacity \< active\_seat\_count  
- Error message: *"Cannot reduce to 40 seats. You have 45 seats currently assigned. Remove 5 seat assignments first."*  
- Admin must provide stripe\_refund\_id (links action to financial transaction)

#### 9.4.3 Full Cancellation (Mid-Term)

**Customer Request Flow:**

1. Org Owner contacts Calico support: *"Cancel our subscription and refund remaining term"*  
2. **Calico admin processes cancellation:**  
   - Calculate prorated refund for entire remaining term  
   - Issue refund in Stripe (same process as seat decrease)  
   - In Laravel internal admin UI:  
     - Locate LicensePool  
     - Click "Deactivate Pool"  
     - Enter reason: *"Full cancellation, refund re\_abc123"*  
     - Update LicensePool.status: active → canceled  
     - Set end\_at: (current date, terminates access immediately)  
   - All SeatAssignments under this pool automatically denied access (pool no longer valid)  
3. **Audit trail:**  
   - audit\_logs entry: action=pool\_canceled, reason=refund\_re\_abc123, actor=admin\_user\_id  
   - Refund record in Stripe linked to original invoice

#### 9.4.4 Renewals (End of Term)

**Automated Renewal Reminder:**

When LicensePool.end\_at is within 60 days:

- Email Org Owner: *"Your annual license expires on \[date\]. Renew now to avoid interruption."*  
- Include link: "Request Renewal Quote"

**Renewal Flow:**

1. Org Owner clicks "Request Renewal Quote" or contacts support  
2. Calico admin creates Stripe Invoice for renewal term  
3. Invoice may include seat count changes:  
   - Same seat count: Standard renewal  
   - Increased seats: Higher annual price  
   - Decreased seats: Lower annual price (customer must remove assignments before renewal)  
4. Upon payment:  
   - Extend existing LicensePool:  
   - Update end\_at: \+12 months  
   - Update seat\_capacity if changed  
   - Update source\_ref\_id: new invoice ID  
5. Existing users maintain access with zero interruption

**Expiration Without Renewal:**

If LicensePool.end\_at passes without renewal payment:

- **Pool status remains active** (no status change)  
- **Access checks fail** because isValid() returns false (date-based check: now() \> end\_at)  
- **SeatAssignments remain in database** pointing to expired pool:  
  - SeatAssignment.status stays active (assignment wasn't revoked, pool just expired)  
  - Access denied due to pool expiration, not assignment status  
- **Org Portal displays:**

```
⚠️ Your license expired on [date].
Contact support to renew and restore access.

Expired License Details:
- Seats: 50
- Term: Aug 1, 2025 - Jul 31, 2026
- Status: Expired

[Request Renewal Quote]
```

**Late Renewal (After Expiration):**

Customer can renew any time after expiration:

1. Calico issues new invoice for new term starting from current date (or future date)  
2. Upon payment, create new LicensePool (same as regular renewal)  
3. Auto-migrate all SeatAssignments from expired pool  
   - Assumption: Same users should regain access  
   - Audit log: action=seat\_assignment\_migrated, reason=late\_renewal\_from\_pool\_X

**Expired Pool Retention:**

- **Pools NEVER archived or deleted** (unless GDPR request or manual admin purge)  
- Expired pools remain queryable forever for:  
  - CRM reporting (churn analysis, renewal forecasting)  
  - Customer support (historical access verification)  
  - Financial audit (revenue recognition, dispute resolution)  
- UI filtering:  
  - Org Portal: Hide expired pools by default, show with "Include Expired" toggle  
  - Admin UI: Default view shows active \+ at-risk, "All Pools" view includes expired

#### 9.4.5 Audit Requirements (Invoicing-Specific)

All manual adjustments require audit trail:

**Seat Increase (Invoice-Driven):**

- Audit log auto-created by webhook handler  
- Includes: stripe\_invoice\_id, adjustment\_type=seat\_increase, additional\_seats

**Seat Decrease (Refund-Driven):**

- Audit log created by admin UI action  
- Required fields: stripe\_refund\_id, reason, actor  
- Validates: new\_capacity \>= active\_seat\_count before committing

**Pool Cancellation:**

- Audit log: action=pool\_canceled, stripe\_refund\_id, reason, actor

**Reconciliation:**

- Daily job compares Stripe Invoice state to LicensePool state  
- Flags mismatches: Invoice paid but pool capacity not updated, refund issued but pool capacity not decreased

### **9.5 Calico Spanish Internal Admin Capabilities (Laravel)**

**📦 Implementation: Filament v3 (recommended)**

Filament handles all admin panel requirements:

- CRUD for all models (Organizations, BillingAccounts, LicensePools, etc.)  
- Custom actions (suspend seat, transfer ownership, adjust capacity)  
- Audit log viewing via relationship managers  
- Role-based access to admin features  
- Dashboard widgets (utilization, at-risk pools)

**Alternative:** Laravel Nova (paid, more mature ecosystem)

**Custom dev required:** Filament Resource classes for each model (\~100 LOC each), custom Action classes for workflows.

Internal admins must be able to view:

- BillingAccount summary (billing\_system, funding\_source, stripe\_customer\_id if present)  
- Organization details, org roles, roster, and utilization  
- LicensePools (all types) including pool\_funding\_type, plan\_key scope, seat\_capacity, start/end, and source references  
- SeatAssignments and status with full audit history

Internal admins may:

- Create and update Organizations (administrative metadata only)  
- Create or correct BillingAccounts (including setting stripe\_customer\_id)  
- Change BillingAccount.billing\_system and funding\_source only as part of an explicit, auditable transition workflow  
- Create LicensePools manually for backward compatibility (external\_paid\_offline, promotional\_trial, comped)  
- Assign/revoke seats (SeatAssignments)  
- Suspend/reactivate SeatAssignments in exceptional cases (audited)  
- Correct provenance fields (source\_ref\_type/source\_ref\_id) when data entry errors occur (audited)

**Guardrails:**

- Paid access must not be represented by comped pools.  
- Manual pool creation requires pool\_funding\_type, source\_ref\_type/source\_ref\_id, and mandatory audit notes.  
- Any funding\_source change must be logged with actor, reason, timestamp, and linked external IDs.

---

## 10\. Implementation Summary: Packages & Custom Development

**NEW SECTION IN v1.4**

### **Package Installation**

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

# Utilities (migration validation)
composer require maatwebsite/excel
```

### **Custom Development Summary**

| Component | Effort | Notes |
| :---- | :---- | :---- |
| Domain Models (BillingAccount, LicensePool, SeatAssignment, Organization) | Medium | Core business logic, \~4 models |
| Webhook Listeners | Low | 5 listener classes connecting Cashier events to domain |
| Access Gates/Policies | Low | \~10 policy methods |
| StripeInvoicingService | Medium | SDK wrapper for non-Cashier features (\~200 LOC) |
| Filament Resources | Medium | Resource class per model (\~100 LOC each) |
| Migration Scripts | Medium | One-time WooCommerce data mapping |
| Org Portal (customer-facing) | High | Full UI for seat management |
| Email Notifications | Low | Laravel notifications for alerts |
| Org Owner Guardrails | Low | Observer \+ validation (\~50 LOC) |

### **Architecture Decision Records**

**ADR-1: BillingAccount as Billable Entity**

- Decision: Implement Cashier's `Billable` trait on `BillingAccount`, not `User`  
- Rationale: Decouples payment responsibility from curriculum access per Section 1.2

**ADR-2: Filament for Admin Panel**

- Decision: Use Filament v3 over Nova  
- Rationale: Open source, sufficient features, lower cost, active development

**ADR-3: spatie/laravel-permission with Teams**

- Decision: Enable team-based permissions for org-scoped roles  
- Rationale: Built-in feature avoids custom pivot table management

**ADR-4: Separate Service for Stripe Invoicing**

- Decision: Create `StripeInvoicingService` wrapping Stripe SDK  
- Rationale: Cashier doesn't cover standalone invoice creation or out-of-band payment marking

