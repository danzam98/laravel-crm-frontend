# Laravel CRM Frontend Mockups

High-fidelity HTML mockups for a full-featured Laravel CRM with eCommerce capabilities.

## Pages

### CRM Features
- **Dashboard** (`index.html`) - Overview with stats, revenue charts, pipeline, activity feed, and tasks
- **Contacts** (`contacts.html`) - Contact management with table view, filters, and status badges
- **Deals** (`deals.html`) - Kanban board pipeline for deal management

### eCommerce Features
- **Products** (`products.html`) - Product catalog with grid view and categories
- **Orders** (`orders.html`) - Order management with status tracking

## Tech Stack

- HTML5 with Tailwind CSS (via CDN)
- Font Awesome icons
- No build process required

## Viewing the Mockups

Simply open any HTML file in a browser:

```bash
# Using Python
python -m http.server 8000

# Using PHP
php -S localhost:8000

# Or just open index.html directly in your browser
```

## Design System

- **Primary Color**: Indigo (#4f46e5)
- **Sidebar**: Dark indigo (#1e1b4b)
- **Font**: System fonts via Tailwind defaults
- **Border Radius**: Rounded corners (rounded-lg, rounded-xl)
- **Shadows**: Subtle shadows (shadow-sm)

## Planned Pages

- [ ] Companies
- [ ] Tasks
- [ ] Calendar
- [ ] Emails
- [ ] Inventory
- [ ] Customers
- [ ] Analytics/Reports
- [ ] Settings
