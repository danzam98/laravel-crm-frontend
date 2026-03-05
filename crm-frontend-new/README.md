# CRM Frontend

A modern CRM and eCommerce management frontend built with Next.js 16, React 19, and Tailwind CSS 4.

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4 with tw-animate-css
- **Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Package Manager**: Bun

## Features

### CRM Modules
- **Contacts** - Customer and lead contact management
- **Companies** - Organization and account tracking
- **Deals** - Sales pipeline with kanban board
- **Tasks** - Task and activity management
- **Calendar** - Scheduling and appointments
- **Emails** - Email integration and tracking
- **Analytics** - Reports and dashboards

### eCommerce Modules
- **Products** - Product catalog management
- **Orders** - Order processing and fulfillment
- **Inventory** - Stock level tracking
- **Customers** - Customer account management

### Settings
- User preferences and configuration

## Getting Started

### Prerequisites

- Node.js 20+ or Bun 1.0+
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd crm-frontend-new

# Install dependencies
bun install
# or
npm install
```

### Development

```bash
# Start the development server
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Create production build
bun run build
# or
npm run build

# Start production server
bun start
# or
npm start
```

### Linting

```bash
bun lint
# or
npm run lint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Dashboard route group
│   │   ├── analytics/     # Analytics page
│   │   ├── calendar/      # Calendar page
│   │   ├── companies/     # Companies page
│   │   ├── contacts/      # Contacts page
│   │   ├── customers/     # Customers page
│   │   ├── deals/         # Deals pipeline page
│   │   ├── emails/        # Email management page
│   │   ├── inventory/     # Inventory page
│   │   ├── orders/        # Orders page
│   │   ├── products/      # Products page
│   │   ├── settings/      # Settings page
│   │   └── tasks/         # Tasks page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/
│   ├── crm/               # CRM-specific components
│   ├── ecommerce/         # eCommerce components
│   ├── layout/            # Layout components
│   ├── shared/            # Shared components
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
└── lib/                   # Utility functions
```

## UI Components

The project includes a complete shadcn/ui component library:

| Component | Description |
|-----------|-------------|
| Alert | Contextual feedback messages |
| Avatar | User profile images |
| Badge | Status and category labels |
| Button | Action buttons with variants |
| Card | Content containers |
| Checkbox | Selection inputs |
| Command | Command palette / search |
| Dialog | Modal dialogs |
| Dropdown Menu | Contextual menus |
| Input | Text input fields |
| Label | Form labels |
| Navigation Menu | Top navigation |
| Scroll Area | Custom scrollbars |
| Select | Dropdown selection |
| Separator | Visual dividers |
| Sheet | Slide-out panels |
| Sidebar | Navigation sidebar |
| Skeleton | Loading placeholders |
| Table | Data tables |
| Tabs | Tabbed interfaces |
| Textarea | Multi-line inputs |
| Tooltip | Hover hints |

## Design System

- **Primary Color**: Indigo (#4f46e5)
- **Dark Theme**: Supported via CSS variables
- **Typography**: System fonts via Tailwind defaults
- **Border Radius**: Rounded corners (rounded-lg, rounded-xl)
- **Shadows**: Subtle shadows for depth

## Configuration

### ESLint

ESLint is configured in `eslint.config.mjs` with Next.js recommended rules.

### TypeScript

TypeScript configuration is in `tsconfig.json` with strict mode enabled.

### Tailwind CSS

Tailwind v4 configuration uses the new CSS-first approach in `globals.css`.

## Related

- Design mockups are available in `../laravel-crm-mockups/`

## License

Private
