# shadcn/ui Components

> **Last Updated**: March 2026

## Philosophy

shadcn/ui is **not a library** — it's a collection of copy-paste components you own. Organize for scale:

```
components/
├── ui/              # Raw shadcn components (minimal modifications)
├── crm/             # CRM-specific compositions
├── portal/          # Portal-specific compositions
├── layout/          # Layout components
└── shared/          # Cross-cutting components
```

## Installation

```bash
bunx shadcn@latest init
```

Choose:
- Style: **New York**
- Base color: **Slate**
- CSS variables: **Yes**

## Adding Components

```bash
# Core components for CRM
bunx shadcn@latest add button card badge tabs accordion
bunx shadcn@latest add table input label select checkbox textarea
bunx shadcn@latest add dialog sheet dropdown-menu
bunx shadcn@latest add navigation-menu command scroll-area
bunx shadcn@latest add avatar tooltip skeleton separator
bunx shadcn@latest add alert alert-dialog progress
```

## Component Organization

### Raw UI Components (`/ui`)

Keep these close to shadcn defaults:

```tsx
// components/ui/button.tsx
// Minimal customization - just add CRM-specific variants if needed
const buttonVariants = cva(
  'inline-flex items-center justify-center...',
  {
    variants: {
      variant: {
        default: '...',
        destructive: '...',
        outline: '...',
        // Add CRM-specific variants
        'calico-primary': 'bg-primary text-white hover:bg-primary/90',
        'calico-accent': 'bg-accent text-primary-foreground hover:bg-accent/90',
      },
    },
  }
)
```

### CRM Compositions (`/crm`)

Build product-level components:

```tsx
// components/crm/status-badge.tsx
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusConfig = {
  active: { label: 'Active', className: 'bg-status-active text-white' },
  pending: { label: 'Pending', className: 'bg-status-pending text-white' },
  at_risk: { label: 'At Risk', className: 'bg-status-at-risk text-white' },
  expired: { label: 'Expired', className: 'bg-status-expired text-white' },
}

export function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status]
  return <Badge className={config.className}>{config.label}</Badge>
}
```

```tsx
// components/crm/metric-card.tsx
import { Card, CardContent } from '@/components/ui/card'

interface MetricCardProps {
  label: string
  value: string | number
  trend?: { value: number; isPositive: boolean }
}

export function MetricCard({ label, value, trend }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <p className={cn('text-sm', trend.isPositive ? 'text-green-600' : 'text-red-600')}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </p>
        )}
      </CardContent>
    </Card>
  )
}
```

### Portal Compositions (`/portal`)

Portal-specific with Calico branding:

```tsx
// components/portal/license-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface LicenseCardProps {
  license: {
    id: string
    planKey: 'base' | 'premium'
    duration: string
    usedSeats: number
    totalSeats: number
    expiresAt: Date
    status: 'active' | 'expiring' | 'at_risk' | 'expired'
  }
}

export function LicenseCard({ license }: LicenseCardProps) {
  const utilization = (license.usedSeats / license.totalSeats) * 100
  const isPremium = license.planKey === 'premium'

  return (
    <Card className={cn(
      'border-l-4',
      isPremium ? 'border-l-level-teal' : 'border-l-level-green'
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {isPremium ? 'Premium' : 'Base'} License
          </CardTitle>
          <Badge variant="outline">{license.duration}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Seat Utilization</span>
              <span>{license.usedSeats}/{license.totalSeats}</span>
            </div>
            <Progress value={utilization} className="h-2" />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Expires</span>
            <span>{formatDate(license.expiresAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

## Design Tokens

Connect shadcn to your Tailwind theme:

```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* shadcn required tokens */
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  --color-card: #ffffff;
  --color-card-foreground: #0f172a;
  --color-popover: #ffffff;
  --color-popover-foreground: #0f172a;
  --color-border: #e2e8f0;
  --color-input: #e2e8f0;
  --color-ring: #4f46e5;

  /* Extend for CRM */
  --color-primary: #482d8b;
  --color-primary-foreground: #ffffff;
  --color-accent: #9fcc3f;
  --color-accent-foreground: #0f172a;
  --color-destructive: #ef4444;
  --color-destructive-foreground: #ffffff;
}
```

## Performance Tips

```tsx
// Use CSS for hover states, not React state
// BAD
const [hovered, setHovered] = useState(false)
<div onMouseEnter={() => setHovered(true)} className={hovered ? 'bg-blue-500' : ''}>

// GOOD
<div className="hover:bg-blue-500">
```

```tsx
// Lazy load heavy components
import dynamic from 'next/dynamic'

const DataTable = dynamic(
  () => import('@/components/crm/tables/data-table'),
  { loading: () => <Skeleton className="h-96" /> }
)
```

## Accessibility

Radix UI (underlying primitives) provides accessibility by default. Preserve it:

- Keep semantic elements
- Preserve keyboard navigation
- Test with screen readers after modifications
- Use `aria-label` where needed

```tsx
// Good - preserves keyboard navigation
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    {/* Focus trapped inside, Escape closes */}
  </DialogContent>
</Dialog>
```

## References

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
