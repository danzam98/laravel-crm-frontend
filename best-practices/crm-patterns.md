# CRM Patterns — HubSpot-Style Layouts

> **Last Updated**: March 2026

## 3-Column Detail Layout

The core pattern for detail pages (Organizations, License Pools, Users).

```tsx
// components/crm/detail/three-column-layout.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ThreeColumnLayoutProps {
  leftSidebar: React.ReactNode    // About section
  centerContent: React.ReactNode   // Tabs
  rightSidebar: React.ReactNode    // Associations
}

export function ThreeColumnLayout({
  leftSidebar,
  centerContent,
  rightSidebar,
}: ThreeColumnLayoutProps) {
  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Left Sidebar - About */}
      <aside className="col-span-3 space-y-4">
        {leftSidebar}
      </aside>

      {/* Center - Main Content */}
      <main className="col-span-6">
        {centerContent}
      </main>

      {/* Right Sidebar - Associations */}
      <aside className="col-span-3 space-y-4">
        {rightSidebar}
      </aside>
    </div>
  )
}
```

### Organization Detail Example

```tsx
// app/(admin)/organizations/[id]/page.tsx
export default async function OrganizationDetailPage({ params }) {
  const { id } = await params
  const org = await getOrganization(id)

  return (
    <ThreeColumnLayout
      leftSidebar={
        <Card>
          <CardHeader>About</CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted">Name</dt>
                <dd className="font-medium">{org.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Type</dt>
                <dd><Badge>{org.type}</Badge></dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Status</dt>
                <dd><StatusBadge status={org.status} /></dd>
              </div>
              {/* Key metrics */}
              <MetricCard label="Active Seats" value={org.activeSeats} />
              <MetricCard label="Utilization" value={`${org.utilization}%`} />
              <MetricCard label="MRR" value={formatCurrency(org.mrr)} />
            </dl>
          </CardContent>
        </Card>
      }

      centerContent={
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="licenses">License Pools</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <OverviewTab organization={org} />
          </TabsContent>
          <TabsContent value="licenses">
            <LicensePoolsTab organizationId={org.id} />
          </TabsContent>
          {/* ... other tabs */}
        </Tabs>
      }

      rightSidebar={
        <>
          <AssociationCard
            title="Billing Account"
            href={`/admin/billing-accounts/${org.billingAccountId}`}
            data={org.billingAccount}
          />
          <AssociationCard
            title="Recent Orders"
            items={org.recentOrders}
            viewAllHref={`/admin/orders?org=${org.id}`}
          />
          <AssociationCard
            title="License Pools"
            count={org.licensePools.length}
            viewAllHref={`/admin/license-pools?org=${org.id}`}
          />
        </>
      }
    />
  )
}
```

## Dashboard Layout

### Admin Dashboard

```tsx
// app/(admin)/page.tsx
export default async function AdminDashboard() {
  const [attentionItems, recentActivity, stats] = await Promise.all([
    getAttentionItems(),
    getRecentActivity(),
    getDashboardStats(),
  ])

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner + Quick Actions */}
      <WelcomeBanner
        actions={[
          { label: 'New Organization', href: '/admin/organizations/new' },
          { label: 'View At-Risk', href: '/admin/license-pools/at-risk' },
        ]}
      />

      {/* Attention Items */}
      <AttentionSection items={attentionItems} />

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Active Orgs" value={stats.activeOrgs} />
        <StatCard label="Total Seats" value={stats.totalSeats} />
        <StatCard label="Utilization" value={`${stats.utilization}%`} />
        <StatCard label="MRR" value={formatCurrency(stats.mrr)} />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>Recent Activity</CardHeader>
        <CardContent>
          <ActivityFeed items={recentActivity} />
        </CardContent>
      </Card>
    </div>
  )
}
```

### Portal Dashboard (with Onboarding)

```tsx
// app/(portal)/page.tsx
export default async function PortalDashboard() {
  const [org, licenses, onboarding] = await Promise.all([
    getCurrentOrganization(),
    getLicenses(),
    getOnboardingProgress(),
  ])

  return (
    <div className="p-6 space-y-6">
      {/* Onboarding Progress (collapsible) */}
      {!onboarding.completed && (
        <OnboardingTutorial progress={onboarding} />
      )}

      {/* License Summary Cards */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Your Licenses</h2>
        <div className="grid grid-cols-3 gap-4">
          {licenses.map(license => (
            <LicenseCard key={license.id} license={license} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <QuickActionsGrid
        actions={[
          { icon: UserPlus, label: 'Assign Seats', href: '/portal/seats/assign' },
          { icon: Users, label: 'Manage Roster', href: '/portal/roster' },
          { icon: Home, label: 'School-to-Home', href: '/portal/school-to-home' },
          { icon: Settings, label: 'Settings', href: '/portal/settings' },
        ]}
      />

      {/* Alerts */}
      <AlertsSection
        expiringLicenses={licenses.filter(l => l.isExpiring)}
        pendingInvitations={org.pendingInvitations}
      />
    </div>
  )
}
```

## Sidebar Navigation

### Admin Sidebar

```tsx
const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Building2, label: 'Organizations', href: '/admin/organizations' },
  { icon: CreditCard, label: 'Billing', href: '/admin/billing-accounts' },
  { icon: Key, label: 'License Pools', href: '/admin/license-pools' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: FileText, label: 'Audit Logs', href: '/admin/audit-logs' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]
```

### Portal Sidebar

```tsx
const portalNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/portal' },
  { icon: Key, label: 'Licenses', href: '/portal/licenses' },
  { icon: UserCheck, label: 'Seats', href: '/portal/seats' },
  { icon: Users, label: 'Roster', href: '/portal/roster' },
  { icon: Home, label: 'School-to-Home', href: '/portal/school-to-home' },
  { icon: CreditCard, label: 'Billing', href: '/portal/billing' },
  { icon: Settings, label: 'Settings', href: '/portal/settings' },
]
```

## Command Palette (Cmd+K)

```tsx
'use client'

import { Command } from '@/components/ui/command'
import { useRouter } from 'next/navigation'

export function CommandPalette() {
  const router = useRouter()

  const actions = [
    { label: 'Go to Organizations', action: () => router.push('/admin/organizations') },
    { label: 'New Organization', action: () => router.push('/admin/organizations/new') },
    { label: 'Search Users', action: () => router.push('/admin/users/search') },
    { label: 'At-Risk Licenses', action: () => router.push('/admin/license-pools/at-risk') },
  ]

  return (
    <Command>
      <Command.Input placeholder="Search or jump to..." />
      <Command.List>
        <Command.Group heading="Quick Actions">
          {actions.map(action => (
            <Command.Item key={action.label} onSelect={action.action}>
              {action.label}
            </Command.Item>
          ))}
        </Command.Group>
        <Command.Group heading="Recent">
          {/* Recent searches */}
        </Command.Group>
      </Command.List>
    </Command>
  )
}
```

## Status Badges

```tsx
const statusConfig = {
  active: { label: 'Active', className: 'bg-status-active text-white' },
  pending: { label: 'Pending', className: 'bg-status-pending text-white' },
  at_risk: { label: 'At Risk', className: 'bg-status-at-risk text-white' },
  expired: { label: 'Expired', className: 'bg-status-expired text-white' },
}

export function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status]
  return <Badge className={config.className}>{config.label}</Badge>
}
```
