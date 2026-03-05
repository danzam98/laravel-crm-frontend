# Forms & Modals — Multi-Step Wizards

> **Last Updated**: March 2026

## Modal Pattern

Use shadcn/ui Dialog for all modals:

```tsx
// components/crm/modals/create-organization-modal.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { OrganizationForm } from './organization-form'

export function CreateOrganizationModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Organization</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
        </DialogHeader>
        <OrganizationForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
```

## Form Pattern with Validation

```tsx
// components/crm/forms/organization-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const organizationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.enum(['school', 'district', 'coop']),
  primaryContactEmail: z.string().email('Invalid email address'),
  primaryContactName: z.string().min(1, 'Contact name is required'),
})

type OrganizationFormValues = z.infer<typeof organizationSchema>

interface OrganizationFormProps {
  onSuccess: () => void
  defaultValues?: Partial<OrganizationFormValues>
}

export function OrganizationForm({ onSuccess, defaultValues }: OrganizationFormProps) {
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: defaultValues ?? {
      name: '',
      type: 'school',
      primaryContactEmail: '',
      primaryContactName: '',
    },
  })

  const onSubmit = async (data: OrganizationFormValues) => {
    try {
      await createOrganization(data)
      toast.success('Organization created')
      onSuccess()
    } catch (error) {
      toast.error('Failed to create organization')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme School District" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="district">District</SelectItem>
                  <SelectItem value="coop">Co-op</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="primaryContactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Contact Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="primaryContactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Contact Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@school.edu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creating...' : 'Create Organization'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

## Multi-Step Wizard Pattern

For complex flows like seat assignment:

```tsx
// components/portal/wizards/assign-seat-wizard.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

type Step = 'select-license' | 'select-user' | 'confirm' | 'success'

const steps: { id: Step; title: string }[] = [
  { id: 'select-license', title: 'Select License' },
  { id: 'select-user', title: 'Select User' },
  { id: 'confirm', title: 'Confirm' },
  { id: 'success', title: 'Complete' },
]

interface AssignSeatWizardProps {
  licenses: License[]
  rosterUsers: User[]
  onComplete: () => void
}

export function AssignSeatWizard({ licenses, rosterUsers, onComplete }: AssignSeatWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('select-license')
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const goNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id)
    }
  }

  const goBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id)
    }
  }

  const handleConfirm = async () => {
    if (!selectedLicense || !selectedUser) return

    try {
      await assignSeat(selectedLicense.id, selectedUser.id)
      setCurrentStep('success')
    } catch (error) {
      toast.error('Failed to assign seat')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Assign Seat</CardTitle>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            {steps.map((step, i) => (
              <span key={step.id} className={i <= currentStepIndex ? 'text-primary' : ''}>
                {step.title}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {currentStep === 'select-license' && (
          <SelectLicenseStep
            licenses={licenses}
            selected={selectedLicense}
            onSelect={setSelectedLicense}
          />
        )}

        {currentStep === 'select-user' && (
          <SelectUserStep
            users={rosterUsers}
            selected={selectedUser}
            onSelect={setSelectedUser}
          />
        )}

        {currentStep === 'confirm' && (
          <ConfirmStep license={selectedLicense!} user={selectedUser!} />
        )}

        {currentStep === 'success' && (
          <SuccessStep license={selectedLicense!} user={selectedUser!} />
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {currentStep !== 'success' && (
          <>
            <Button
              variant="outline"
              onClick={goBack}
              disabled={currentStepIndex === 0}
            >
              Back
            </Button>

            {currentStep === 'confirm' ? (
              <Button onClick={handleConfirm}>Confirm Assignment</Button>
            ) : (
              <Button
                onClick={goNext}
                disabled={
                  (currentStep === 'select-license' && !selectedLicense) ||
                  (currentStep === 'select-user' && !selectedUser)
                }
              >
                Continue
              </Button>
            )}
          </>
        )}

        {currentStep === 'success' && (
          <div className="w-full flex justify-between">
            <Button variant="outline" onClick={() => {
              setSelectedLicense(null)
              setSelectedUser(null)
              setCurrentStep('select-license')
            }}>
              Assign Another
            </Button>
            <Button onClick={onComplete}>Done</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
```

## Step Components

```tsx
// Select License Step
function SelectLicenseStep({ licenses, selected, onSelect }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select a license pool to assign a seat from:
      </p>
      <div className="space-y-2">
        {licenses.map(license => (
          <Card
            key={license.id}
            className={cn(
              'cursor-pointer transition-colors',
              selected?.id === license.id ? 'border-primary' : 'hover:border-muted-foreground'
            )}
            onClick={() => onSelect(license)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{license.planKey} License</p>
                <p className="text-sm text-muted-foreground">
                  {license.availableSeats} seats available
                </p>
              </div>
              <Badge>{license.duration}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Select User Step
function SelectUserStep({ users, selected, onSelect }) {
  const [search, setSearch] = useState('')
  const [showInvite, setShowInvite] = useState(false)

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {filteredUsers.map(user => (
            <Card
              key={user.id}
              className={cn(
                'cursor-pointer transition-colors',
                selected?.id === user.id ? 'border-primary' : 'hover:border-muted-foreground'
              )}
              onClick={() => onSelect(user)}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <Button variant="outline" className="w-full" onClick={() => setShowInvite(true)}>
        Invite New User
      </Button>
    </div>
  )
}

// Confirm Step
function ConfirmStep({ license, user }) {
  return (
    <div className="space-y-4 text-center">
      <div className="p-6 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">Assigning seat to:</p>
        <p className="font-semibold text-lg">{user.name}</p>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <div className="p-6 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">From license:</p>
        <p className="font-semibold text-lg">{license.planKey} License</p>
        <p className="text-muted-foreground">{license.duration}</p>
      </div>
    </div>
  )
}

// Success Step
function SuccessStep({ license, user }) {
  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-status-active/20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-status-active" />
      </div>
      <h3 className="text-lg font-semibold">Seat Assigned Successfully!</h3>
      <p className="text-muted-foreground">
        {user.name} now has access to their {license.planKey} license.
      </p>
    </div>
  )
}
```

## Confirmation Dialogs

```tsx
// components/crm/modals/confirm-dialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive'
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## Inline Edit Pattern

```tsx
// components/crm/detail/inline-edit-field.tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pencil, Check, X } from 'lucide-react'

interface InlineEditFieldProps {
  value: string
  onSave: (value: string) => Promise<void>
  label?: string
}

export function InlineEditField({ value: initialValue, onSave, label }: InlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(value)
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setValue(initialValue)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          className="h-8"
          autoFocus
        />
        <Button size="sm" variant="ghost" onClick={handleSave} disabled={isSaving}>
          <Check className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCancel} disabled={isSaving}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="group flex items-center gap-2">
      <span>{value}</span>
      <Button
        size="sm"
        variant="ghost"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setIsEditing(true)}
      >
        <Pencil className="h-3 w-3" />
      </Button>
    </div>
  )
}
```
