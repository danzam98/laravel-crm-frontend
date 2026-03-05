/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{html,js}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        'brand-purple': '#482d8b',
        'brand-green': '#9fcc3f',
        'brand-teal': '#68c9c9',
        'brand-red': '#f05759',
        'brand-yellow': '#fad358',

        // Semantic UI
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        muted: 'var(--color-muted)',

        // Sidebar
        'sidebar-bg': 'var(--sidebar-bg)',
        'sidebar-text': 'var(--sidebar-text)',

        // Status
        'status-active': 'var(--status-active)',
        'status-expiring': 'var(--status-expiring)',
        'status-at-risk': 'var(--status-at-risk)',
        'status-expired': 'var(--status-expired)',
        'status-pending': 'var(--status-pending)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1)',
        'dropdown': '0 4px 24px rgba(0,0,0,0.12)',
        'modal': '0 20px 40px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}
