/**
 * Route map for navigation and command palette
 */

export const adminRoutes = [
  { path: '/admin/index.html', label: 'Dashboard', icon: 'home', section: 'Main' },

  { path: '/admin/organizations/index.html', label: 'Organizations', icon: 'building', section: 'CRM' },
  { path: '/admin/organizations/detail.html', label: 'Organization Detail', icon: 'building', section: 'CRM', hidden: true },
  { path: '/admin/organizations/new.html', label: 'New Organization', icon: 'plus', section: 'Actions' },

  { path: '/admin/billing-accounts/index.html', label: 'Billing Accounts', icon: 'credit-card', section: 'CRM' },
  { path: '/admin/billing-accounts/detail.html', label: 'Billing Account Detail', icon: 'credit-card', section: 'CRM', hidden: true },

  { path: '/admin/subscriptions/index.html', label: 'Subscriptions', icon: 'refresh', section: 'CRM' },
  { path: '/admin/subscriptions/detail.html', label: 'Subscription Detail', icon: 'refresh', section: 'CRM', hidden: true },

  { path: '/admin/license-pools/index.html', label: 'License Pools', icon: 'key', section: 'CRM' },
  { path: '/admin/license-pools/detail.html', label: 'License Pool Detail', icon: 'key', section: 'CRM', hidden: true },
  { path: '/admin/license-pools/at-risk.html', label: 'At-Risk Pools', icon: 'alert-triangle', section: 'CRM' },
  { path: '/admin/license-pools/create.html', label: 'Create License Pool', icon: 'plus', section: 'Actions' },

  { path: '/admin/users/index.html', label: 'Users', icon: 'users', section: 'CRM' },
  { path: '/admin/users/detail.html', label: 'User Detail', icon: 'user', section: 'CRM', hidden: true },
  { path: '/admin/users/search.html', label: 'User Search', icon: 'search', section: 'CRM' },

  { path: '/admin/orders/index.html', label: 'Orders', icon: 'shopping-cart', section: 'CRM' },
  { path: '/admin/orders/detail.html', label: 'Order Detail', icon: 'shopping-cart', section: 'CRM', hidden: true },

  { path: '/admin/analytics/index.html', label: 'Analytics', icon: 'bar-chart', section: 'Analytics' },
  { path: '/admin/analytics/revenue.html', label: 'Revenue Analytics', icon: 'dollar-sign', section: 'Analytics' },
  { path: '/admin/analytics/licenses.html', label: 'License Analytics', icon: 'pie-chart', section: 'Analytics' },
  { path: '/admin/analytics/customers.html', label: 'Customer Analytics', icon: 'trending-up', section: 'Analytics' },

  { path: '/admin/support/index.html', label: 'Support Tickets', icon: 'message-circle', section: 'Support' },
  { path: '/admin/support/detail.html', label: 'Ticket Detail', icon: 'message-circle', section: 'Support', hidden: true },

  { path: '/admin/audit-logs/index.html', label: 'Audit Logs', icon: 'file-text', section: 'System' },
  { path: '/admin/audit-logs/detail.html', label: 'Audit Log Detail', icon: 'file-text', section: 'System', hidden: true },

  { path: '/admin/settings/index.html', label: 'Settings', icon: 'settings', section: 'System' },
  { path: '/admin/settings/plans.html', label: 'Plan Configuration', icon: 'layers', section: 'System' },
  { path: '/admin/settings/integrations.html', label: 'Integrations', icon: 'link', section: 'System' },
];

export const portalRoutes = [
  { path: '/portal/index.html', label: 'Dashboard', icon: 'home', section: 'Main' },

  { path: '/portal/licenses/index.html', label: 'Licenses', icon: 'key', section: 'Licenses' },
  { path: '/portal/licenses/detail.html', label: 'License Detail', icon: 'key', section: 'Licenses', hidden: true },
  { path: '/portal/licenses/renew.html', label: 'Renew License', icon: 'refresh', section: 'Actions' },
  { path: '/portal/licenses/upgrade.html', label: 'Upgrade to Premium', icon: 'star', section: 'Actions' },

  { path: '/portal/seats/index.html', label: 'Seat Management', icon: 'users', section: 'Seats' },
  { path: '/portal/seats/assign.html', label: 'Assign Seat', icon: 'user-plus', section: 'Actions' },
  { path: '/portal/seats/bulk-assign.html', label: 'Bulk Assign', icon: 'users', section: 'Actions' },
  { path: '/portal/seats/reassign.html', label: 'Reassign Seat', icon: 'shuffle', section: 'Actions' },

  { path: '/portal/roster/index.html', label: 'Roster', icon: 'list', section: 'People' },
  { path: '/portal/roster/invite.html', label: 'Invite User', icon: 'user-plus', section: 'Actions' },
  { path: '/portal/roster/bulk-import.html', label: 'Bulk Import', icon: 'upload', section: 'Actions' },
  { path: '/portal/roster/pending.html', label: 'Pending Invitations', icon: 'clock', section: 'People' },
  { path: '/portal/roster/user-detail.html', label: 'User Detail', icon: 'user', section: 'People', hidden: true },

  { path: '/portal/requests/index.html', label: 'Seat Requests', icon: 'inbox', section: 'Requests' },
  { path: '/portal/requests/detail.html', label: 'Request Detail', icon: 'inbox', section: 'Requests', hidden: true },

  { path: '/portal/school-to-home/index.html', label: 'School-to-Home', icon: 'home', section: 'School-to-Home' },
  { path: '/portal/school-to-home/portal-detail.html', label: 'Portal Configuration', icon: 'settings', section: 'School-to-Home', hidden: true },
  { path: '/portal/school-to-home/setup.html', label: 'Setup Portal', icon: 'plus', section: 'Actions' },
  { path: '/portal/school-to-home/branding.html', label: 'Branding', icon: 'image', section: 'School-to-Home' },
  { path: '/portal/school-to-home/classrooms/index.html', label: 'Classrooms', icon: 'grid', section: 'School-to-Home' },
  { path: '/portal/school-to-home/classrooms/create.html', label: 'Create Classroom', icon: 'plus', section: 'Actions' },
  { path: '/portal/school-to-home/classrooms/detail.html', label: 'Classroom Detail', icon: 'grid', section: 'School-to-Home', hidden: true },

  { path: '/portal/reports/index.html', label: 'Reports', icon: 'bar-chart', section: 'Reports' },
  { path: '/portal/reports/license-usage.html', label: 'License Usage', icon: 'pie-chart', section: 'Reports' },

  { path: '/portal/help/index.html', label: 'Help Center', icon: 'help-circle', section: 'Help' },
  { path: '/portal/help/contact.html', label: 'Contact Support', icon: 'message-circle', section: 'Help' },

  { path: '/portal/billing/redirect.html', label: 'Billing Portal', icon: 'external-link', section: 'Billing' },

  { path: '/portal/settings/index.html', label: 'Settings', icon: 'settings', section: 'Settings' },
  { path: '/portal/settings/administrators.html', label: 'Administrators', icon: 'users', section: 'Settings' },
  { path: '/portal/settings/profile.html', label: 'Organization Profile', icon: 'edit', section: 'Settings' },
  { path: '/portal/settings/security.html', label: 'Security', icon: 'shield', section: 'Settings' },
];

// Quick actions for command palette
export const adminActions = [
  { id: 'new-org', label: 'Create Organization', shortcut: 'N O', action: () => window.location.href = '/admin/organizations/new.html' },
  { id: 'new-pool', label: 'Create License Pool', shortcut: 'N L', action: () => window.location.href = '/admin/license-pools/create.html' },
  { id: 'search-user', label: 'Search Users', shortcut: 'S U', action: () => window.location.href = '/admin/users/search.html' },
  { id: 'at-risk', label: 'View At-Risk Pools', shortcut: 'A R', action: () => window.location.href = '/admin/license-pools/at-risk.html' },
];

export const portalActions = [
  { id: 'assign-seat', label: 'Assign Seat', shortcut: 'A S', action: () => window.location.href = '/portal/seats/assign.html' },
  { id: 'invite-user', label: 'Invite User', shortcut: 'I U', action: () => window.location.href = '/portal/roster/invite.html' },
  { id: 'bulk-import', label: 'Bulk Import Users', shortcut: 'B I', action: () => window.location.href = '/portal/roster/bulk-import.html' },
  { id: 'create-classroom', label: 'Create Classroom', shortcut: 'C C', action: () => window.location.href = '/portal/school-to-home/classrooms/create.html' },
];

export function getRoutes() {
  const isPortal = window.location.pathname.includes('/portal/');
  return isPortal ? portalRoutes : adminRoutes;
}

export function getActions() {
  const isPortal = window.location.pathname.includes('/portal/');
  return isPortal ? portalActions : adminActions;
}
