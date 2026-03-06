# Best Practices — Calico Spanish CRM

Authoritative guides for implementing the CRM & Organization Portal with Next.js 16, Tailwind v4, and shadcn/ui.

## Guides

### Core Stack

| Guide | Description |
|-------|-------------|
| [Next.js 16](nextjs-16.md) | App Router, Server Components, async APIs |
| [Tailwind CSS v4](tailwind-v4.md) | CSS-first `@theme` configuration, brand colors |
| [shadcn/ui](shadcn-ui.md) | Component organization, Radix primitives |

### CRM Implementation

| Guide | Description |
|-------|-------------|
| [CRM Patterns](crm-patterns.md) | 3-column layouts, dashboard design |
| [Data Tables](data-tables.md) | Full-featured tables with sort, filter, pagination |
| [Forms & Modals](forms-and-modals.md) | Multi-step wizards, validation patterns |

### Operations

| Guide | Description |
|-------|-------------|
| [GitHub Workflow](github-workflow.md) | Git commands, PR flow, CI/CD |
| [Accessibility](accessibility.md) | WCAG 2.2 AA compliance |

## Version Requirements

| Package | Version |
|---------|---------|
| Node.js | 20.9+ |
| Bun | 1.x |
| Next.js | 16.x |
| React | 19.x |
| TypeScript | 5.1+ |
| Tailwind CSS | 4.x |

## Quick Reference

### Commands

```bash
bun dev          # Start dev server
bun build        # Build for production
bun lint         # Run ESLint
bun typecheck    # TypeScript check
```

### Key Files

| File | Purpose |
|------|---------|
| `AGENTS.md` | AI agent rules |
| `docs/IMPLEMENTATION_PLAN.md` | Feature specifications |
| `src/app/globals.css` | Tailwind @theme tokens |
| `components.json` | shadcn/ui configuration |

## Implementation Phases

0. **Build Pipeline Setup** — Vite, Tailwind CSS, dependencies
1. **Shared Infrastructure** — Design tokens, DataTable, Command Palette
2. **Admin CRM Core** — Organizations, License Pools
3. **Admin CRM Extended** — Billing, Analytics, Settings
4. **Portal Core** — Licenses, Seats, Dashboard
5. **Portal Extended** — Roster, School-to-Home
6. **Polish** — States, responsive, accessibility
