# AGENTS.md — AI Agent Rules for Calico Spanish CRM

## Project Overview

This project implements the **Calico Spanish CRM & Organization Portal** - a Laravel-based Membership & Licensing system with:

1. **Internal Admin CRM** — For Calico employees to manage organizations, billing, license pools, and support
2. **Organization Portal** — For school customers to manage licenses, seats, roster, and School-to-Home access

**Reference Implementation Plan:** `docs/IMPLEMENTATION_PLAN.md`

---

## ⚠️ Current Development Phase: MOCKUPS ONLY

**We are currently building HTML mockups (Phases 0-6).**

Do NOT:
- Create Next.js pages or React components in `src/`
- Use TypeScript, shadcn/ui, or Bun
- Work on production implementation (Phase 7)

All work should be in `laravel-crm-mockups/` using Vite + vanilla HTML/CSS/JS.

Phase 7 (Next.js production app) begins **only after mockup approval**.

---

## Project Structure

This repository contains two distinct development workflows:

### 1. HTML Mockups (`laravel-crm-mockups/`)
Static HTML prototypes for **design approval** before production implementation.

| Package | Version | Notes |
|---------|---------|-------|
| Vite | 5.x | Dev server + build pipeline |
| Tailwind CSS | 4.x | CSS-first `@theme` config |
| Chart.js | 4.x | Analytics charts |
| Flatpickr | 4.x | Date pickers |
| Lucide Icons | Latest | Icon system |

**Purpose:** Visual design approval, stakeholder review, UX validation.

**Not applicable to mockups:** TypeScript, shadcn/ui, Bun (uses npm).

### 2. Production App (`src/`)
Next.js React application (future implementation after mockup approval).

See "Tech Stack Requirements" below for production dependencies.

---

## RULE NUMBER 1 (NEVER EVER EVER FORGET THIS RULE!!!)

**YOU ARE NEVER ALLOWED TO DELETE A FILE WITHOUT EXPRESS PERMISSION FROM ME OR A DIRECT COMMAND FROM ME.**

Even a new file that you yourself created, such as a test code file. You must **ALWAYS** ask and *receive* clear, written permission before deleting any file or folder.

---

## IRREVERSIBLE GIT & FILESYSTEM ACTIONS — DO-NOT-EVER BREAK GLASS

1. **Absolutely forbidden commands:** `git reset --hard`, `git clean -fd`, `rm -rf`, or any command that can delete or overwrite code/data must never be run unless the user explicitly provides the exact command and states they understand the consequences.

2. **No guessing:** If there is any uncertainty about what a command might delete or overwrite, stop immediately and ask.

3. **Safer alternatives first:** Use non-destructive options (`git status`, `git diff`, `git stash`, backups) before considering destructive commands.

4. **Mandatory explicit plan:** Even after authorization, restate the command verbatim, list exactly what will be affected, and wait for confirmation.

---

## Code Editing Discipline

**NEVER** run scripts that auto-process/change multiple code files. No invented code mods, no giant regex `sed` one-liners.

* **Mechanical changes**: Use subagents in parallel, but apply edits **manually** and review diffs.
* **Complex changes**: Do them methodically, file by file.

---

## File Organization — Avoid Sprawl

Do **NOT** create duplicate or versioned files:
* ❌ `componentV2.tsx`, `componentImproved.tsx`, `componentNew.tsx`
* ✅ Revise the **existing** file in place

New files are reserved for **genuinely new domains** that don't fit existing modules.

---

## Tech Stack Requirements (Production App)

| Package | Version | Notes |
|---------|---------|-------|
| Next.js | 16.x | App Router, async APIs mandatory |
| React | 19.x | No React import needed for JSX |
| TypeScript | 5.x | Strict mode enabled |
| Tailwind CSS | 4.x | CSS-first `@theme` config |
| shadcn/ui | Latest | Radix UI primitives |
| Bun | 1.x | Package manager |

> **Note:** These requirements apply to the production `src/` application, not the `laravel-crm-mockups/` prototypes.

---

## Static Analysis — Mandatory Before Commits

```bash
# Type-check
bun run typecheck   # or: npx tsc --noEmit

# Lint
bun run lint
```

If there are errors:
1. Read context around each error to understand the root cause
2. Fix at root cause, don't silence rules
3. Re-run until clean
4. **Do not commit with failing checks**

---

## Git Workflow — CRITICAL

### ALWAYS PUSH YOUR WORK

**NEVER leave commits stranded locally.** After EVERY commit, push immediately:

```bash
git push origin <branch>
```

Unpushed commits are:
- Invisible to the user
- Lost if the session ends or machine crashes
- Not backed up anywhere

**Push is NOT optional. Every commit MUST be followed by a push.**

### Branch Strategy

| Branch | Purpose | Who Can Push |
|--------|---------|--------------|
| `main` | Production-ready code | Via PR only (preferred) |
| `feat/*` | Feature development | Agent directly |
| `fix/*` | Bug fixes | Agent directly |

**Preferred workflow for significant changes:**
```bash
git checkout -b feat/my-feature
# ... make changes ...
git push -u origin feat/my-feature
gh pr create --title "feat: description" --body "Details"
```

**Acceptable for small, safe changes:**
Direct push to main (only for typos, docs, trivial fixes)

### Before Starting Work

```bash
git fetch origin
git status                    # Check for uncommitted changes
git pull --rebase origin main # Get latest changes
```

If there are conflicts, resolve them before proceeding.

### Standard Workflow

1. **Pull latest** from remote
2. **Make changes** (one logical unit at a time)
3. **Run checks**: For mockups: `npm run build` | For production: `bun run typecheck && bun run lint`
4. **Commit** with descriptive message
5. **Push immediately** — do NOT batch multiple commits
6. **Verify CI** passes with `gh run list --limit 3`

### After Every Change Session

Before ending any coding session:

```bash
git status                    # Verify nothing uncommitted
git log origin/main..HEAD     # Check what's unpushed
git push                      # Push everything
```

### Commit Messages

Use conventional commits:
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `refactor:` — Code restructuring
- `test:` — Tests
- `chore:` — Maintenance

Example:
```bash
git commit -m "feat(organizations): add 3-column detail layout

Implements HubSpot-style layout with:
- Left sidebar: About section with key metrics
- Center: Tabbed content (Overview, Licenses, Billing)
- Right sidebar: Associated entities"
```

### NEVER DO THESE

| Forbidden Action | Why | Alternative |
|-----------------|-----|-------------|
| `git push --force` to main | Destroys history others depend on | Create a new commit to fix |
| `git reset --hard` | Loses uncommitted work | `git stash` or commit first |
| Leave work unpushed | Lost on session end | Push after every commit |
| Ignore CI failures | Breaks the build for everyone | Fix immediately |
| Commit secrets | Security breach | Use `.env.local` (gitignored) |
| Amend pushed commits | Rewrites shared history | Create a new fix commit |

### GitHub CLI (gh)

Use `gh` for all GitHub interactions:

```bash
# Pull requests
gh pr create --title "feat: add feature" --body "Description"
gh pr list
gh pr view <number>
gh pr merge <number>

# Check CI status
gh run list --limit 3
gh run view <run-id>
gh run watch

# Issues
gh issue list
gh issue create --title "Bug" --body "Description"
```

---

## CRM-Specific Patterns

### Component Organization

```
src/components/
├── ui/              # Raw shadcn components (don't modify heavily)
├── crm/             # Admin CRM components
│   ├── tables/      # Full-featured data tables
│   ├── detail/      # 3-column HubSpot-style layouts
│   └── modals/      # Create/edit modals
├── portal/          # Organization Portal components
│   ├── licenses/    # License management
│   ├── seats/       # Seat assignment flows
│   └── roster/      # User roster management
├── layout/          # Sidebar, header, navigation
└── shared/          # Command palette, notifications, filters
```

### 3-Column Layout Pattern (HubSpot Style)

For detail pages (`organizations/detail`, `license-pools/detail`):

```tsx
<div className="grid grid-cols-12 gap-6">
  {/* Left Sidebar - About */}
  <aside className="col-span-3">
    <Card>
      <CardHeader>About</CardHeader>
      <CardContent>
        {/* Key info, metrics, tags */}
      </CardContent>
    </Card>
  </aside>

  {/* Center - Tabs Content */}
  <main className="col-span-6">
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="licenses">Licenses</TabsTrigger>
        {/* ... */}
      </TabsList>
      <TabsContent value="overview">{/* ... */}</TabsContent>
    </Tabs>
  </main>

  {/* Right Sidebar - Associations */}
  <aside className="col-span-3">
    <Card>
      <CardHeader>Related</CardHeader>
      <CardContent>
        {/* Associated entities */}
      </CardContent>
    </Card>
  </aside>
</div>
```

### Full-Featured Table Pattern

Tables must support:
- Column sorting (click header)
- Multi-column filtering
- Column visibility toggle
- Bulk selection with checkbox
- Bulk actions menu
- Pagination with page size selector
- Saved views/filters

```tsx
<DataTable
  columns={columns}
  data={data}
  filterableColumns={['status', 'type', 'organization']}
  searchableColumns={['name', 'email']}
  bulkActions={[
    { label: 'Export', action: handleExport },
    { label: 'Archive', action: handleArchive },
  ]}
/>
```

### Multi-Step Flow Pattern

For wizards (`seats/assign`, `school-to-home/setup`):

```tsx
<Wizard
  steps={[
    { id: 'select-license', title: 'Select License' },
    { id: 'select-user', title: 'Select User' },
    { id: 'confirm', title: 'Confirm' },
    { id: 'success', title: 'Complete' },
  ]}
  onComplete={handleComplete}
/>
```

---

## Brand Colors

### Admin CRM (Professional/Neutral)

```css
@theme {
  --color-primary: #482d8b;      /* Calico Purple */
  --color-sidebar: #1e1b4b;      /* Dark Indigo */
  --color-accent: #9fcc3f;       /* Calico Green */
  --color-background: #f8fafc;   /* Slate 50 */
}
```

### Organization Portal (Customer-Facing)

```css
@theme {
  --color-primary: #9fcc3f;      /* Calico Green */
  --color-secondary: #68c9c9;    /* Calico Teal */
  --color-accent: #482d8b;       /* Calico Purple */
  --color-level-green: #9fcc3f;
  --color-level-teal: #68c9c9;
  --color-level-red: #f05759;
  --color-level-yellow: #fad358;
}
```

---

## Route Structure

> **Note:** Routes below show the production Next.js App Router structure (`src/app/`).
> Mockup routes are in `laravel-crm-mockups/src/admin/` and `laravel-crm-mockups/src/portal/` as static HTML files (Vite root is `src/`).

### Admin CRM Routes (`/admin/`)

```
(dashboard)/
├── index                    # Dashboard
├── organizations/
│   ├── index               # List
│   ├── [id]/               # Detail (3-column)
│   └── new/                # Create
├── billing-accounts/
├── license-pools/
├── users/
├── orders/
├── analytics/
├── audit-logs/
└── settings/
```

### Organization Portal Routes (`/portal/`)

```
(dashboard)/
├── index                    # Dashboard with onboarding
├── licenses/
│   ├── index               # License cards
│   ├── [id]/               # License detail
│   ├── renew/
│   └── upgrade/
├── seats/
│   ├── index               # Seat management
│   ├── assign/             # Multi-step assign flow
│   └── bulk-assign/
├── roster/
├── school-to-home/
│   ├── index               # Portal overview
│   ├── [portalId]/         # Portal config
│   └── classrooms/
├── billing/
└── settings/
```

---

## Implementation Phases

### HTML Mockups (`laravel-crm-mockups/`)

**Phase 0: Build Pipeline Setup**
- Initialize package.json with Vite and Tailwind CSS
- Configure vite.config.js for multi-page HTML
- Set up design tokens and brand colors
- Install Chart.js, Flatpickr, Lucide Icons
- Verify dev server and production build work

**Phase 1: Shared Infrastructure**
- Shared CSS with Tailwind `@theme` tokens
- Command palette (stub) and notification components
- Full-featured DataTable component
- Seed data JSON fixtures

**Phase 2: Admin CRM Core**
- Admin layout (sidebar, header)
- Organizations list + detail
- License pools list + detail

**Phase 3: Admin CRM Extended**
- Billing, analytics, orders, audit logs, settings

**Phase 4: Portal Core**
- Portal layout with Calico branding
- Dashboard with onboarding
- Licenses and seat management

**Phase 5: Portal Extended**
- Roster management, invites
- School-to-Home configuration
- Settings

**Phase 6: Polish & Verification**
- All links working (link integrity check)
- All modals interactive
- Loading/empty/error states
- Mobile responsive (breakpoint testing)
- Command palette full route index
- Playwright smoke tests
- Accessibility audit (axe-core)

### Production App (`src/`)

**Phase 7: Production Implementation**
- Convert approved mockups to Next.js React components
- Implement TypeScript types from seed data schemas
- Connect to Laravel backend APIs
- Add authentication and authorization
- Production deployment

---

## Accessibility

- WCAG 2.2 AA baseline
- All interactive elements need visible focus states
- Skip link at top of page
- Meaningful alt text for images
- Respect `prefers-reduced-motion`
- Proper heading hierarchy

---

## Performance Targets

- LCP < 2.0s (p75)
- INP < 200ms (p75)
- CLS < 0.1
- JS bundle < 180KB gzip on dashboard

---

## Best Practices Reference

See `best-practices/` folder:
- `nextjs-16.md` — App Router, async APIs
- `tailwind-v4.md` — CSS-first configuration
- `shadcn-ui.md` — Component patterns
- `data-tables.md` — Table implementation
- `forms-and-modals.md` — Form patterns
- `crm-patterns.md` — CRM-specific layouts
- `accessibility.md` — A11y requirements

---

## Quick Reference

```bash
# Mockups Development (laravel-crm-mockups/)
cd laravel-crm-mockups
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Build to /dist
npm run preview      # Preview built mockups
npx linkinator ./dist --recurse  # Check for broken links

# Production Development (src/)
bun dev              # Start Next.js dev server
bun build            # Build for production
bun lint             # ESLint
bun typecheck        # TypeScript check

# Git
git status           # Check state
git add <files>      # Stage specific files
git commit -m "..."  # Commit
git push             # Push immediately
```
