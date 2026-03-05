/**
 * Command Palette (Cmd+K)
 * Quick search and navigation across the application
 */

import { getRoutes, getActions } from '../routes.js';
import { state } from '../state.js';

let paletteElement = null;
let isOpen = false;
let selectedIndex = 0;
let results = [];

export function initCommandPalette() {
  // Create palette element
  createPaletteElement();

  // Handle keyboard shortcut
  document.addEventListener('keydown', (e) => {
    // Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      togglePalette();
    }

    // ESC to close
    if (e.key === 'Escape' && isOpen) {
      closePalette();
    }

    // Navigation
    if (isOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectPrev();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeSelected();
      }
    }
  });

  // Handle search button clicks
  document.querySelectorAll('[data-command-palette-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPalette();
    });
  });
}

function createPaletteElement() {
  paletteElement = document.createElement('div');
  paletteElement.className = 'command-palette hidden';
  paletteElement.innerHTML = `
    <div class="command-palette-content">
      <div class="relative">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          type="text"
          class="command-palette-input pl-12"
          placeholder="Search or type a command..."
          aria-label="Search"
          autocomplete="off"
        >
        <kbd class="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded">ESC</kbd>
      </div>
      <div class="command-palette-results"></div>
    </div>
  `;

  document.body.appendChild(paletteElement);

  // Handle input
  const input = paletteElement.querySelector('input');
  input.addEventListener('input', (e) => {
    search(e.target.value);
  });

  // Close on overlay click
  paletteElement.addEventListener('click', (e) => {
    if (e.target === paletteElement) {
      closePalette();
    }
  });
}

function openPalette() {
  if (isOpen) return;

  isOpen = true;
  paletteElement.classList.remove('hidden');

  const input = paletteElement.querySelector('input');
  input.value = '';
  input.focus();

  // Show recent searches and quick actions
  showInitialResults();

  document.body.style.overflow = 'hidden';
}

function closePalette() {
  isOpen = false;
  paletteElement.classList.add('hidden');
  document.body.style.overflow = '';
}

function togglePalette() {
  isOpen ? closePalette() : openPalette();
}

function showInitialResults() {
  const recentSearches = state.get('recentSearches') || [];
  const actions = getActions();

  results = [];

  // Recent searches
  if (recentSearches.length > 0) {
    results.push({ type: 'section', label: 'Recent' });
    recentSearches.slice(0, 3).forEach(search => {
      results.push({ type: 'recent', label: search, action: () => navigateTo(search) });
    });
  }

  // Quick actions
  results.push({ type: 'section', label: 'Actions' });
  actions.forEach(action => {
    results.push({
      type: 'action',
      label: action.label,
      shortcut: action.shortcut,
      action: action.action,
    });
  });

  renderResults();
}

function search(query) {
  if (!query.trim()) {
    showInitialResults();
    return;
  }

  const q = query.toLowerCase();
  const routes = getRoutes().filter(r => !r.hidden);
  const actions = getActions();

  results = [];

  // Search routes
  const matchedRoutes = routes.filter(r =>
    r.label.toLowerCase().includes(q) ||
    r.section.toLowerCase().includes(q)
  );

  if (matchedRoutes.length > 0) {
    results.push({ type: 'section', label: 'Pages' });
    matchedRoutes.slice(0, 5).forEach(route => {
      results.push({
        type: 'page',
        label: route.label,
        section: route.section,
        action: () => {
          saveRecentSearch(route.label);
          window.location.href = route.path;
        },
      });
    });
  }

  // Search actions
  const matchedActions = actions.filter(a =>
    a.label.toLowerCase().includes(q)
  );

  if (matchedActions.length > 0) {
    results.push({ type: 'section', label: 'Actions' });
    matchedActions.forEach(action => {
      results.push({
        type: 'action',
        label: action.label,
        shortcut: action.shortcut,
        action: action.action,
      });
    });
  }

  selectedIndex = results.findIndex(r => r.type !== 'section');
  if (selectedIndex === -1) selectedIndex = 0;

  renderResults();
}

function renderResults() {
  const container = paletteElement.querySelector('.command-palette-results');

  if (results.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-500">
        No results found
      </div>
    `;
    return;
  }

  let html = '';
  let itemIndex = 0;

  results.forEach(result => {
    if (result.type === 'section') {
      html += `<div class="command-palette-group-title">${result.label}</div>`;
    } else {
      const isSelected = itemIndex === selectedIndex;
      html += `
        <div class="command-palette-item ${isSelected ? 'command-palette-item-active' : ''}"
             data-index="${itemIndex}">
          <span class="command-palette-item-text">${result.label}</span>
          ${result.section ? `<span class="text-xs text-slate-400">${result.section}</span>` : ''}
          ${result.shortcut ? `<span class="command-palette-item-shortcut">${result.shortcut}</span>` : ''}
        </div>
      `;
      itemIndex++;
    }
  });

  container.innerHTML = `<div class="command-palette-group">${html}</div>`;

  // Handle item clicks
  container.querySelectorAll('.command-palette-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index);
      selectedIndex = index;
      executeSelected();
    });

    item.addEventListener('mouseenter', () => {
      const index = parseInt(item.dataset.index);
      selectedIndex = index;
      renderResults();
    });
  });
}

function selectNext() {
  const selectableItems = results.filter(r => r.type !== 'section');
  selectedIndex = (selectedIndex + 1) % selectableItems.length;
  renderResults();
}

function selectPrev() {
  const selectableItems = results.filter(r => r.type !== 'section');
  selectedIndex = selectedIndex - 1;
  if (selectedIndex < 0) selectedIndex = selectableItems.length - 1;
  renderResults();
}

function executeSelected() {
  const selectableItems = results.filter(r => r.type !== 'section');
  const selected = selectableItems[selectedIndex];

  if (selected?.action) {
    closePalette();
    selected.action();
  }
}

function saveRecentSearch(label) {
  const recent = state.get('recentSearches') || [];
  const updated = [label, ...recent.filter(r => r !== label)].slice(0, 5);
  state.set('recentSearches', updated);
}

function navigateTo(label) {
  const routes = getRoutes();
  const route = routes.find(r => r.label === label);
  if (route) {
    window.location.href = route.path;
  }
}

// Expose globally
window.openCommandPalette = openPalette;
window.closeCommandPalette = closePalette;
