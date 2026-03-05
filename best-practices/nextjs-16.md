# Next.js 16 & React 19

> **Last Updated**: March 2026

## Breaking Changes from Next.js 15

1. **Async Request APIs are mandatory** — `cookies()`, `headers()`, `params`, `searchParams` must be awaited
2. **Turbopack is default** — no `--turbopack` flag needed
3. **React Compiler is stable** — enable in config
4. **`next lint` removed** — use ESLint CLI directly

## Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,        // Stable in Next.js 16

  experimental: {
    typedRoutes: true,        // Type-safe <Link>
  },
}

export default nextConfig
```

## Async Dynamic APIs

```typescript
// Next.js 16 - MUST await params and searchParams
export default async function OrganizationPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params
  const org = await getOrganization(id)
  return <OrganizationDetail organization={org} />
}
```

## Server Components (Default)

```typescript
// Server Component - fetches data directly
export default async function OrganizationsPage() {
  const orgs = await getOrganizations()
  return <OrganizationsList organizations={orgs} />
}
```

## Client Components

```typescript
'use client'

import { useState } from 'react'
import { DataTable } from '@/components/ui/data-table'

export function OrganizationsTable({ initialData }) {
  const [data, setData] = useState(initialData)
  // Client-side filtering, sorting, etc.
  return <DataTable data={data} />
}
```

## Route Groups for CRM

Use route groups to separate admin and portal layouts:

```
src/app/
├── (admin)/                  # Admin CRM layout
│   ├── layout.tsx           # Admin sidebar, header
│   ├── organizations/
│   ├── license-pools/
│   └── analytics/
├── (portal)/                 # Organization Portal layout
│   ├── layout.tsx           # Portal sidebar, branding
│   ├── licenses/
│   ├── seats/
│   └── roster/
└── layout.tsx               # Root layout
```

## React 19 Features

- **No React import needed** for JSX
- **`use()` hook** to unwrap promises in components
- **`useActionState`** replaces `useFormState`
- **View Transitions** for navigation animations

## Type Generation

```bash
# Generate typed route helpers
npx next typegen
```

Creates `PageProps`, `LayoutProps`, `RouteContext` helpers.

## References

- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [React 19 Features](https://react.dev/blog/2024/12/05/react-19)
