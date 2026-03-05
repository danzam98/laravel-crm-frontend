/**
 * Modal component
 * Handles modal open/close, focus trapping, and accessibility
 */

let activeModal = null;
let previousFocus = null;

export function initModal() {
  // Handle modal triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal-trigger]');
    if (trigger) {
      e.preventDefault();
      const modalId = trigger.dataset.modalTrigger;
      openModal(modalId);
    }

    // Handle close button
    const closeBtn = e.target.closest('[data-modal-close]');
    if (closeBtn) {
      closeModal();
    }

    // Handle overlay click
    if (e.target.classList.contains('modal-overlay')) {
      closeModal();
    }
  });

  // Handle ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeModal) {
      closeModal();
    }
  });
}

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  // Store previous focus
  previousFocus = document.activeElement;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = `${modalId}-overlay`;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', `${modalId}-title`);

  // Clone modal content into overlay
  const content = modal.cloneNode(true);
  content.style.display = '';
  content.classList.add('modal');
  overlay.appendChild(content);

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  activeModal = overlay;

  // Focus first focusable element
  requestAnimationFrame(() => {
    const focusable = content.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) {
      focusable[0].focus();
    }
  });

  // Setup focus trap
  overlay.addEventListener('keydown', trapFocus);
}

export function closeModal() {
  if (!activeModal) return;

  activeModal.removeEventListener('keydown', trapFocus);
  activeModal.remove();
  document.body.style.overflow = '';

  activeModal = null;

  // Restore focus
  if (previousFocus) {
    previousFocus.focus();
    previousFocus = null;
  }
}

function trapFocus(e) {
  if (e.key !== 'Tab') return;

  const focusable = activeModal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusable.length === 0) return;

  const firstFocusable = focusable[0];
  const lastFocusable = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    }
  } else {
    if (document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }
}

// Expose globally
window.openModal = openModal;
window.closeModal = closeModal;
