# Tailwind CSS v4 — Calico Spanish CRM

> **Last Updated**: March 2026

## CSS-First Configuration

Tailwind v4 uses CSS `@theme` directives instead of `tailwind.config.js`:

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* =====================
     ADMIN CRM COLORS
     ===================== */
  --color-primary: #482d8b;        /* Calico Purple */
  --color-sidebar: #1e1b4b;        /* Dark Indigo */
  --color-accent: #9fcc3f;         /* Calico Green */
  --color-background: #f8fafc;     /* Slate 50 */
  --color-foreground: #0f172a;     /* Slate 900 */

  /* =====================
     PORTAL COLORS
     ===================== */
  --color-portal-primary: #9fcc3f;   /* Calico Green */
  --color-portal-secondary: #68c9c9; /* Calico Teal */
  --color-portal-accent: #482d8b;    /* Calico Purple */

  /* Level Colors (for licenses, badges) */
  --color-level-green: #9fcc3f;
  --color-level-teal: #68c9c9;
  --color-level-red: #f05759;
  --color-level-yellow: #fad358;

  /* =====================
     SEMANTIC COLORS
     ===================== */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* Status colors for CRM entities */
  --color-status-active: #22c55e;
  --color-status-pending: #f59e0b;
  --color-status-at-risk: #ef4444;
  --color-status-expired: #94a3b8;

  /* =====================
     TYPOGRAPHY
     ===================== */
  --font-sans: "Geist", system-ui, sans-serif;
  --font-mono: "Geist Mono", monospace;

  /* =====================
     SPACING
     ===================== */
  --spacing-sidebar: 280px;
  --spacing-header: 64px;

  /* =====================
     BORDER RADIUS
     ===================== */
  --radius-lg: 0.75rem;
  --radius-md: 0.5rem;
  --radius-sm: 0.25rem;

  /* =====================
     SHADOWS
     ===================== */
  --shadow-subtle: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-dropdown: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Dark mode (optional) */
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: #0f172a;
    --color-foreground: #f8fafc;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Usage in Components

```tsx
// Using theme colors
<div className="bg-primary text-white">Admin Header</div>
<div className="bg-portal-primary text-white">Portal Header</div>

// Status badges
<Badge className="bg-status-active text-white">Active</Badge>
<Badge className="bg-status-at-risk text-white">At Risk</Badge>

// Level colors for licenses
<span className="text-level-green">Base License</span>
<span className="text-level-teal">Premium License</span>
```

## Key Changes from v3

| v3 | v4 |
|----|-----|
| `tailwind.config.js` | `@theme` in CSS |
| `content` array | Auto-detection |
| `darkMode: 'class'` | `darkMode: 'selector'` |
| JavaScript plugins | CSS-native |

## Performance

- Full builds: **5x faster** (under 100ms)
- Incremental builds: **100x faster** (single-digit ms)
- Uses Lightning CSS under the hood

## References

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Migration Guide](https://tailwindcss.com/docs/upgrade-guide)
