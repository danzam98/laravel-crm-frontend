/**
 * Notifications component
 * Dropdown notification panel with real-time updates
 */

import { state } from '../state.js';

let notificationPanel = null;
let isOpen = false;

// Sample notifications data
const sampleNotifications = [
  {
    id: '1',
    type: 'alert',
    title: 'License Expiring Soon',
    description: 'Lincoln Elementary has 3 licenses expiring in 14 days',
    time: '5 minutes ago',
    read: false,
    icon: 'alert',
    iconBg: 'bg-amber-100 text-amber-600',
  },
  {
    id: '2',
    type: 'update',
    title: 'Payment Received',
    description: 'Oak Valley School District - $2,400.00',
    time: '1 hour ago',
    read: false,
    icon: 'check',
    iconBg: 'bg-green-100 text-green-600',
  },
  {
    id: '3',
    type: 'system',
    title: 'New Support Ticket',
    description: 'Ticket #1234 created by Sarah Johnson',
    time: '2 hours ago',
    read: false,
    icon: 'message',
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    id: '4',
    type: 'update',
    title: 'Seat Assignment',
    description: '15 new seats assigned at Riverside Academy',
    time: '3 hours ago',
    read: true,
    icon: 'user',
    iconBg: 'bg-purple-100 text-purple-600',
  },
  {
    id: '5',
    type: 'alert',
    title: 'Failed Payment',
    description: 'Payment failed for Billing Account #BA-2345',
    time: '5 hours ago',
    read: true,
    icon: 'alert',
    iconBg: 'bg-red-100 text-red-600',
  },
];

const icons = {
  alert: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
  check: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
  message: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>`,
  user: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
};

export function initNotifications() {
  // Initialize notification data in state
  const readIds = state.get('notifications.read') || [];
  const notifications = sampleNotifications.map(n => ({
    ...n,
    read: readIds.includes(n.id),
  }));

  updateUnreadCount(notifications);

  // Handle notification button clicks
  document.querySelectorAll('[data-notification-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleNotifications(btn);
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (notificationPanel && !notificationPanel.contains(e.target) && !e.target.closest('[data-notification-trigger]')) {
      closeNotifications();
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeNotifications();
    }
  });
}

function toggleNotifications(trigger) {
  if (isOpen) {
    closeNotifications();
  } else {
    openNotifications(trigger);
  }
}

function openNotifications(trigger) {
  if (notificationPanel) {
    notificationPanel.remove();
  }

  const readIds = state.get('notifications.read') || [];
  const notifications = sampleNotifications.map(n => ({
    ...n,
    read: readIds.includes(n.id),
  }));

  notificationPanel = document.createElement('div');
  notificationPanel.className = 'notification-panel';
  notificationPanel.innerHTML = `
    <div class="notification-header">
      <h3 class="font-semibold text-slate-900">Notifications</h3>
      <button class="text-sm text-purple-600 hover:text-purple-700" data-mark-all-read>
        Mark all read
      </button>
    </div>
    <div class="notification-list">
      ${notifications.map(n => renderNotification(n)).join('')}
    </div>
    <div class="px-4 py-3 border-t border-slate-100">
      <a href="#" class="text-sm text-purple-600 hover:text-purple-700">View all notifications</a>
    </div>
  `;

  // Position relative to trigger
  const triggerRect = trigger.getBoundingClientRect();
  notificationPanel.style.position = 'fixed';
  notificationPanel.style.top = `${triggerRect.bottom + 8}px`;
  notificationPanel.style.right = `${window.innerWidth - triggerRect.right}px`;

  document.body.appendChild(notificationPanel);
  isOpen = true;
  trigger.setAttribute('aria-expanded', 'true');

  // Handle mark all read
  notificationPanel.querySelector('[data-mark-all-read]').addEventListener('click', () => {
    markAllRead();
  });

  // Handle individual notification clicks
  notificationPanel.querySelectorAll('[data-notification-id]').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.notificationId;
      markAsRead(id);
    });
  });
}

function closeNotifications() {
  if (notificationPanel) {
    notificationPanel.remove();
    notificationPanel = null;
  }
  isOpen = false;

  document.querySelectorAll('[data-notification-trigger]').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
  });
}

function renderNotification(notification) {
  return `
    <div class="notification-item ${notification.read ? '' : 'notification-item-unread'}"
         data-notification-id="${notification.id}">
      <div class="notification-item-icon ${notification.iconBg}">
        ${icons[notification.icon]}
      </div>
      <div class="notification-item-content">
        <div class="notification-item-title">${notification.title}</div>
        <div class="notification-item-description">${notification.description}</div>
        <div class="notification-item-time">${notification.time}</div>
      </div>
      ${!notification.read ? '<div class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>' : ''}
    </div>
  `;
}

function markAsRead(id) {
  const readIds = state.get('notifications.read') || [];
  if (!readIds.includes(id)) {
    state.set('notifications.read', [...readIds, id]);
  }

  // Update UI
  const item = notificationPanel?.querySelector(`[data-notification-id="${id}"]`);
  if (item) {
    item.classList.remove('notification-item-unread');
    item.querySelector('.bg-blue-500')?.remove();
  }

  updateUnreadCount();
}

function markAllRead() {
  const allIds = sampleNotifications.map(n => n.id);
  state.set('notifications.read', allIds);

  // Update UI
  notificationPanel?.querySelectorAll('.notification-item').forEach(item => {
    item.classList.remove('notification-item-unread');
    item.querySelector('.bg-blue-500')?.remove();
  });

  updateUnreadCount();
  window.showToast?.('All notifications marked as read');
}

function updateUnreadCount(notifications) {
  const readIds = state.get('notifications.read') || [];
  const unread = (notifications || sampleNotifications).filter(n => !readIds.includes(n.id)).length;

  state.set('notifications.unreadCount', unread);

  // Update badge in UI
  document.querySelectorAll('[data-notification-count]').forEach(badge => {
    if (unread > 0) {
      badge.textContent = unread > 9 ? '9+' : unread;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });
}

// Expose for external use
window.refreshNotifications = () => initNotifications();
