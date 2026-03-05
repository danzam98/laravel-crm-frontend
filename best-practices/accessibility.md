# Accessibility — WCAG 2.2 AA Compliance

> **Last Updated**: March 2026

## Baseline Requirements

This CRM must meet **WCAG 2.2 AA** standards. Key requirements:

| Category | Requirement |
|----------|-------------|
| Focus | All interactive elements have visible focus states |
| Keyboard | Full keyboard navigation support |
| Screen Readers | Semantic HTML, ARIA labels where needed |
| Motion | Respect `prefers-reduced-motion` |
| Color | 4.5:1 contrast ratio for text |
| Forms | Clear labels, error messages |

## Focus States

Every interactive element needs a visible focus indicator:

```css
/* globals.css */
@theme {
  --color-ring: #4f46e5;  /* Focus ring color */
}

/* Applied automatically by Tailwind */
/* focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 */
```

```tsx
// Example button with proper focus
<Button className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  Click me
</Button>
```

## Skip Link

Add a skip link at the top of every page:

```tsx
// components/layout/skip-link.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:ring-2 focus:ring-ring"
    >
      Skip to main content
    </a>
  )
}

// Usage in layout.tsx
export default function Layout({ children }) {
  return (
    <html>
      <body>
        <SkipLink />
        <Sidebar />
        <main id="main-content">{children}</main>
      </body>
    </html>
  )
}
```

## Keyboard Navigation

### Tables

```tsx
// Ensure table cells are focusable for actions
<TableCell>
  <Button variant="ghost" size="sm" tabIndex={0}>
    Edit
  </Button>
</TableCell>
```

### Command Palette

```tsx
// Command palette should be keyboard-navigable
<Command>
  <Command.Input placeholder="Search..." />
  <Command.List>
    {/* Items navigable with arrow keys, Enter to select */}
    <Command.Item onSelect={handleSelect}>
      Organizations
    </Command.Item>
  </Command.List>
</Command>
```

### Modals

```tsx
// Modals should trap focus and close on Escape
<Dialog>
  <DialogContent>
    {/* Focus trapped inside */}
    {/* First focusable element receives focus on open */}
    {/* Escape key closes the dialog */}
  </DialogContent>
</Dialog>
```

## Screen Reader Support

### Semantic HTML

```tsx
// Use proper heading hierarchy
<main>
  <h1>Organizations</h1>           {/* Page title */}
  <section>
    <h2>Active Organizations</h2>  {/* Section title */}
    <article>
      <h3>Acme School</h3>         {/* Item title */}
    </article>
  </section>
</main>
```

### ARIA Labels

```tsx
// Add labels where visual context is insufficient
<Button aria-label="Edit organization Acme School">
  <Pencil className="h-4 w-4" />
</Button>

// Announce status changes
<div role="status" aria-live="polite">
  Organization saved successfully
</div>

// Label icon-only buttons
<IconButton aria-label="Close dialog">
  <X />
</IconButton>
```

### Tables

```tsx
<Table>
  <TableCaption className="sr-only">
    List of organizations with their status and seat utilization
  </TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead scope="col">Name</TableHead>
      <TableHead scope="col">Status</TableHead>
      <TableHead scope="col">Seats</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {/* ... */}
  </TableBody>
</Table>
```

## Reduced Motion

```css
/* globals.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```tsx
// Check user preference in code
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Use in animations
<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
/>
```

## Color Contrast

Minimum contrast ratios:
- Normal text (< 18pt): **4.5:1**
- Large text (>= 18pt or >= 14pt bold): **3:1**
- UI components: **3:1**

```css
/* Good - high contrast */
@theme {
  --color-foreground: #0f172a;  /* Slate 900 on white = 12.6:1 */
  --color-muted-foreground: #64748b;  /* Slate 500 on white = 4.6:1 */
}

/* Check your colors at: https://webaim.org/resources/contrastchecker/ */
```

### Status Colors

```css
/* Ensure status colors meet contrast */
@theme {
  --color-status-active: #15803d;     /* Green 700 - 5.9:1 on white */
  --color-status-pending: #b45309;    /* Amber 700 - 4.5:1 on white */
  --color-status-at-risk: #b91c1c;    /* Red 700 - 5.7:1 on white */
  --color-status-expired: #475569;    /* Slate 600 - 5.5:1 on white */
}
```

## Forms

### Labels

```tsx
// Always associate labels with inputs
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email Address</FormLabel>
      <FormControl>
        <Input type="email" {...field} />
      </FormControl>
      <FormDescription>
        We'll never share your email.
      </FormDescription>
      <FormMessage />  {/* Error messages */}
    </FormItem>
  )}
/>
```

### Error Messages

```tsx
// Connect errors to inputs
<Input
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <p id="email-error" role="alert" className="text-sm text-destructive">
    {errors.email.message}
  </p>
)}
```

### Required Fields

```tsx
// Mark required fields
<FormLabel>
  Email Address <span aria-hidden="true">*</span>
  <span className="sr-only">(required)</span>
</FormLabel>
```

## Images

```tsx
// Meaningful images need alt text
<img src="/org-logo.png" alt="Acme School District logo" />

// Decorative images should have empty alt
<img src="/decorative-pattern.svg" alt="" aria-hidden="true" />

// Icons in buttons don't need alt if button has label
<Button aria-label="Edit">
  <Pencil aria-hidden="true" />
</Button>
```

## Testing

### Automated

```bash
# Install axe-core for automated testing
bun add -D @axe-core/playwright

# Run accessibility tests
bun test:a11y
```

### Manual

1. **Keyboard navigation**: Tab through entire page
2. **Screen reader**: Test with VoiceOver (Mac) or NVDA (Windows)
3. **Zoom**: Test at 200% zoom
4. **Color**: Test with color blindness simulators

## References

- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Radix UI Accessibility](https://www.radix-ui.com/docs/primitives/overview/accessibility)
