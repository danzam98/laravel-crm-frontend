/**
 * Main application bootstrap
 * Initializes all components on page load
 */

import { initModal } from './components/modal.js';
import { initDropdown } from './components/dropdown.js';
import { initTabs } from './components/tabs.js';
import { initTable } from './components/table.js';
import { initToast } from './components/toast.js';
import { initCommandPalette } from './components/commandPalette.js';
import { initNotifications } from './components/notifications.js';
import { state } from './state.js';

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize state from localStorage
  state.init();

  // Initialize UI components
  initModal();
  initDropdown();
  initTabs();
  initTable();
  initToast();
  initCommandPalette();
  initNotifications();

  // Initialize inline edit fields
  initInlineEdit();

  // Handle navigation active states
  highlightActiveNav();

  // Demo scenario switcher
  handleScenarioSwitch();
});

/**
 * Inline edit functionality
 */
function initInlineEdit() {
  document.querySelectorAll('[data-inline-edit]').forEach(el => {
    el.addEventListener('click', () => {
      const field = el.dataset.inlineEdit;
      const currentValue = el.textContent.trim();

      // Create input
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentValue;
      input.className = 'input inline-edit-input';
      input.style.width = `${Math.max(el.offsetWidth, 100)}px`;

      // Replace element with input
      el.style.display = 'none';
      el.parentNode.insertBefore(input, el.nextSibling);
      input.focus();
      input.select();

      // Handle save on blur or enter
      const save = () => {
        const newValue = input.value.trim();
        if (newValue && newValue !== currentValue) {
          el.textContent = newValue;
          state.set(`inline.${field}`, newValue);
          window.showToast?.('Changes saved', 'success');
        }
        input.remove();
        el.style.display = '';
      };

      input.addEventListener('blur', save);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') save();
        if (e.key === 'Escape') {
          input.remove();
          el.style.display = '';
        }
      });
    });
  });
}

/**
 * Highlight active navigation item
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href.replace(/\.html$/, ''))) {
      link.classList.add('sidebar-link-active');
    }
  });
}

/**
 * Handle demo scenario switching via URL param
 */
function handleScenarioSwitch() {
  const params = new URLSearchParams(window.location.search);
  const scenario = params.get('scenario');

  if (scenario) {
    state.set('scenario', scenario);
    document.body.dataset.scenario = scenario;
  }

  // Apply scenario-specific modifications
  const currentScenario = state.get('scenario') || 'happy-path';
  applyScenario(currentScenario);
}

function applyScenario(scenario) {
  switch (scenario) {
    case 'at-risk':
      // Show at-risk indicators
      document.querySelectorAll('[data-at-risk]').forEach(el => {
        el.style.display = '';
      });
      break;
    case 'new-org':
      // Show empty states and onboarding
      document.querySelectorAll('[data-empty-state]').forEach(el => {
        el.style.display = '';
      });
      document.querySelectorAll('[data-has-data]').forEach(el => {
        el.style.display = 'none';
      });
      break;
    case 'large-data':
      // Virtual scrolling would be enabled here
      break;
    default:
      // happy-path: default state
      break;
  }
}

// Export for use in templates
window.app = {
  state,
  initInlineEdit,
};
