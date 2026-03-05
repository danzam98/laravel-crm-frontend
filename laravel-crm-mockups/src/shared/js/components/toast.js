/**
 * Toast notification component
 * Shows temporary messages to the user
 */

const TOAST_DURATION = 4000;
let toastContainer = null;
let toastQueue = [];

export function initToast() {
  // Create toast container if it doesn't exist
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'fixed bottom-4 right-4 z-[100] flex flex-col gap-2';
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toastContainer);
  }
}

export function showToast(message, type = 'info', duration = TOAST_DURATION) {
  if (!toastContainer) initToast();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type} transform translate-x-0 transition-all duration-300`;
  toast.setAttribute('role', 'alert');

  // Icon based on type
  const icons = {
    success: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
    error: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
    warning: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
    info: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  };

  toast.innerHTML = `
    ${icons[type] || icons.info}
    <span class="flex-1">${message}</span>
    <button class="ml-2 text-white/80 hover:text-white" aria-label="Dismiss">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  `;

  // Handle dismiss button
  toast.querySelector('button').addEventListener('click', () => {
    dismissToast(toast);
  });

  // Add to container
  toastContainer.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add('translate-x-0', 'opacity-100');
  });

  // Auto dismiss
  if (duration > 0) {
    setTimeout(() => {
      dismissToast(toast);
    }, duration);
  }

  return toast;
}

function dismissToast(toast) {
  toast.classList.add('opacity-0', 'translate-x-full');
  setTimeout(() => {
    toast.remove();
  }, 300);
}

// Expose globally
window.showToast = showToast;
