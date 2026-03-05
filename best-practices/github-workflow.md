# GitHub Workflow — Git Best Practices

> **Last Updated**: March 2026

## Core Principles

1. **Every commit must be pushed** — Unpushed work is invisible and at risk
2. **Never force push to main** — Destroys shared history
3. **Never commit secrets** — Use `.env.local` (gitignored)
4. **Fix CI failures immediately** — Broken builds block everyone

## Before Starting Work

```bash
# Always start fresh
git fetch origin
git status                    # Check for uncommitted changes
git pull --rebase origin main # Get latest changes
```

If you have uncommitted changes:
```bash
git stash                     # Save temporarily
git pull --rebase origin main
git stash pop                 # Restore changes
```

## Standard Workflow

```bash
# 1. Make changes (one logical unit)

# 2. Run checks
bun run typecheck && bun run lint

# 3. Stage specific files
git add src/components/crm/organizations-table.tsx
git add src/app/\(admin\)/organizations/page.tsx

# 4. Commit with descriptive message
git commit -m "feat(organizations): add sortable table with filters

- Add column sorting by name, type, status
- Add filter dropdown for organization type
- Add bulk selection with checkbox column"

# 5. Push immediately
git push origin main

# 6. Verify CI
gh run list --limit 3
```

## Branch Strategy

### Direct to Main (Small Changes)

Acceptable for:
- Typo fixes
- Documentation updates
- Trivial bug fixes
- Single-file changes

```bash
git add .
git commit -m "fix: typo in organization detail header"
git push origin main
```

### Feature Branches (Significant Changes)

Required for:
- New features
- Multi-file changes
- Architectural changes
- Anything that might break

```bash
# Create feature branch
git checkout -b feat/organization-detail-layout

# Work on feature
git add .
git commit -m "feat(organizations): add 3-column detail layout"
git push -u origin feat/organization-detail-layout

# Create PR
gh pr create --title "feat: add organization detail layout" --body "
## Summary
- Implements HubSpot-style 3-column layout
- Left sidebar: About section
- Center: Tabbed content
- Right sidebar: Associated entities

## Test Plan
- [ ] Verify layout renders correctly
- [ ] Test tab switching
- [ ] Verify mobile responsiveness
"

# After PR approval
gh pr merge --squash
git checkout main
git pull
```

## Commit Messages

Use conventional commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code restructuring |
| `test` | Adding tests |
| `chore` | Maintenance |

### Examples

```bash
# Feature
git commit -m "feat(portal): add seat assignment wizard

- Step 1: Select license pool
- Step 2: Select or invite user
- Step 3: Confirm assignment
- Step 4: Success state"

# Bug fix
git commit -m "fix(tables): correct pagination count calculation

Total was including filtered-out rows"

# Refactor
git commit -m "refactor(components): extract StatusBadge component

Reduces duplication across organization and license tables"
```

## GitHub CLI (gh)

### Pull Requests

```bash
# Create PR
gh pr create --title "feat: add feature" --body "Description"

# List PRs
gh pr list

# View PR details
gh pr view 42

# Check out PR locally
gh pr checkout 42

# Merge PR
gh pr merge 42 --squash
```

### CI/CD

```bash
# List recent workflow runs
gh run list --limit 5

# View specific run
gh run view 12345678

# Watch current run
gh run watch

# Re-run failed jobs
gh run rerun 12345678 --failed
```

### Issues

```bash
# List issues
gh issue list

# Create issue
gh issue create --title "Bug: table sorting broken" --body "Details..."

# Close issue
gh issue close 42
```

## End of Session Checklist

Before ending any coding session:

```bash
# 1. Check for uncommitted changes
git status

# 2. Commit any remaining work
git add .
git commit -m "wip: checkpoint before session end"

# 3. Push everything
git push

# 4. Verify nothing unpushed
git log origin/main..HEAD  # Should be empty
```

## NEVER DO THESE

| Action | Why It's Dangerous | Safe Alternative |
|--------|-------------------|------------------|
| `git push --force` to main | Overwrites shared history | Create fix commit |
| `git reset --hard` | Loses uncommitted work | `git stash` first |
| `rm -rf .git` | Destroys repository | Don't do this |
| `git clean -fd` | Deletes untracked files | Be selective |
| Amend pushed commits | Rewrites shared history | Create new commit |
| Leave work unpushed | Lost on session end | Push after every commit |

## Resolving Conflicts

```bash
# 1. Pull with rebase
git pull --rebase origin main

# 2. If conflicts, resolve them
# Edit conflicting files
git add <resolved-files>
git rebase --continue

# 3. If you need to abort
git rebase --abort
```

## Recovery Commands

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# View reflog (find lost commits)
git reflog

# Recover deleted branch
git checkout -b recovered-branch <commit-hash>

# Stash changes temporarily
git stash
git stash pop
git stash list
```

## CI Configuration

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - run: bun install --frozen-lockfile

      - run: bun run typecheck

      - run: bun run lint

      - run: bun run build
```

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub CLI Manual](https://cli.github.com/manual/)
