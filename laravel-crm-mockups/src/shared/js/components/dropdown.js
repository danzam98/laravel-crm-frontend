/**
 * Dropdown component
 * Handles dropdown menus with proper accessibility
 */

let activeDropdown = null;

export function initDropdown() {
  // Handle dropdown triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-dropdown-trigger]');

    if (trigger) {
      e.preventDefault();
      e.stopPropagation();

      const dropdownId = trigger.dataset.dropdownTrigger;
      const dropdown = document.getElementById(dropdownId);

      if (dropdown) {
        if (dropdown.classList.contains('hidden')) {
          closeAllDropdowns();
          openDropdown(trigger, dropdown);
        } else {
          closeDropdown(dropdown);
        }
      }
      return;
    }

    // Handle dropdown item click
    const item = e.target.closest('.dropdown-item');
    if (item) {
      closeAllDropdowns();
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown') && !e.target.closest('[data-dropdown-trigger]')) {
      closeAllDropdowns();
    }
  });

  // Handle ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeDropdown) {
      closeAllDropdowns();
    }

    // Arrow key navigation
    if (activeDropdown && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      navigateDropdown(e.key === 'ArrowDown' ? 1 : -1);
    }
  });
}

function openDropdown(trigger, dropdown) {
  dropdown.classList.remove('hidden');
  trigger.setAttribute('aria-expanded', 'true');
  activeDropdown = { trigger, dropdown };

  // Position dropdown
  positionDropdown(trigger, dropdown);

  // Focus first item
  const firstItem = dropdown.querySelector('.dropdown-item');
  if (firstItem) {
    firstItem.focus();
  }
}

function closeDropdown(dropdown) {
  dropdown.classList.add('hidden');
  const trigger = document.querySelector(`[data-dropdown-trigger="${dropdown.id}"]`);
  if (trigger) {
    trigger.setAttribute('aria-expanded', 'false');
  }
  activeDropdown = null;
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu:not(.hidden)').forEach(dropdown => {
    closeDropdown(dropdown);
  });
}

function positionDropdown(trigger, dropdown) {
  const triggerRect = trigger.getBoundingClientRect();
  const dropdownRect = dropdown.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Reset positioning
  dropdown.style.top = '';
  dropdown.style.bottom = '';
  dropdown.style.left = '';
  dropdown.style.right = '';

  // Check if dropdown would go off-screen to the right
  if (triggerRect.right + dropdownRect.width > viewportWidth) {
    dropdown.style.right = '0';
    dropdown.style.left = 'auto';
  }

  // Check if dropdown would go off-screen to the bottom
  if (triggerRect.bottom + dropdownRect.height > viewportHeight) {
    dropdown.style.bottom = '100%';
    dropdown.style.top = 'auto';
    dropdown.style.marginBottom = '0.5rem';
    dropdown.style.marginTop = '0';
  }
}

function navigateDropdown(direction) {
  if (!activeDropdown) return;

  const items = Array.from(activeDropdown.dropdown.querySelectorAll('.dropdown-item'));
  const currentIndex = items.indexOf(document.activeElement);
  let nextIndex = currentIndex + direction;

  if (nextIndex < 0) nextIndex = items.length - 1;
  if (nextIndex >= items.length) nextIndex = 0;

  items[nextIndex]?.focus();
}

// Expose globally
window.closeAllDropdowns = closeAllDropdowns;
