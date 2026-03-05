/**
 * LocalStorage-backed state management for demo data
 */

const STATE_KEY = 'calico-crm-demo-state';

const defaultState = {
  scenario: 'happy-path',
  notifications: {
    unreadCount: 3,
    read: [],
  },
  impersonation: {
    active: false,
    orgId: null,
    orgName: null,
  },
  seats: {},
  invitations: {},
  tablePreferences: {},
  savedViews: {},
};

class StateManager {
  constructor() {
    this.state = { ...defaultState };
    this.listeners = new Map();
  }

  init() {
    const stored = localStorage.getItem(STATE_KEY);
    if (stored) {
      try {
        this.state = { ...defaultState, ...JSON.parse(stored) };
      } catch (e) {
        console.warn('Failed to parse stored state:', e);
        this.state = { ...defaultState };
      }
    }
  }

  get(key) {
    const keys = key.split('.');
    let value = this.state;
    for (const k of keys) {
      if (value == null) return undefined;
      value = value[k];
    }
    return value;
  }

  set(key, value) {
    const keys = key.split('.');
    let obj = this.state;
    for (let i = 0; i < keys.length - 1; i++) {
      if (obj[keys[i]] == null) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    this.persist();
    this.notify(key, value);
  }

  update(key, updater) {
    const current = this.get(key);
    const updated = updater(current);
    this.set(key, updated);
  }

  persist() {
    localStorage.setItem(STATE_KEY, JSON.stringify(this.state));
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    return () => this.listeners.get(key)?.delete(callback);
  }

  notify(key, value) {
    // Notify exact match
    this.listeners.get(key)?.forEach(cb => cb(value));

    // Notify parent keys
    const parts = key.split('.');
    for (let i = 1; i < parts.length; i++) {
      const parentKey = parts.slice(0, i).join('.');
      this.listeners.get(parentKey)?.forEach(cb => cb(this.get(parentKey)));
    }
  }

  reset() {
    this.state = { ...defaultState };
    this.persist();
    window.location.reload();
  }
}

export const state = new StateManager();

// Expose for debugging
window.demoState = state;
