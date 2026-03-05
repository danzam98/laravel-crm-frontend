# Data Tables — Full-Featured CRM Tables

> **Last Updated**: March 2026

## Requirements

All CRM tables must support:
- Column sorting (click header)
- Multi-column filtering
- Column visibility toggle
- Bulk selection with checkbox
- Bulk actions menu
- Pagination with page size selector
- Saved views/filters (optional)

## Base DataTable Component

```tsx
// components/crm/tables/data-table.tsx
'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterableColumns?: { id: string; title: string; options: { label: string; value: string }[] }[]
  searchableColumns?: { id: string; title: string }[]
  bulkActions?: { label: string; action: (rows: TData[]) => void }[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterableColumns = [],
  searchableColumns = [],
  bulkActions = [],
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        bulkActions={bulkActions}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
```

## Column Definitions

### Organizations Table

```tsx
// components/crm/tables/organizations-columns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { Organization } from '@/types'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

export const organizationsColumns: ColumnDef<Organization>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <Link href={`/admin/organizations/${row.original.id}`} className="font-medium hover:underline">
        {row.getValue('name')}
      </Link>
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => <Badge variant="outline">{row.getValue('type')}</Badge>,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'activeSeats',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Active Seats" />,
    cell: ({ row }) => <div className="text-right">{row.getValue('activeSeats')}</div>,
  },
  {
    accessorKey: 'utilization',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Utilization" />,
    cell: ({ row }) => {
      const value = row.getValue('utilization') as number
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm">{value}%</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'primaryContact',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Primary Contact" />,
    cell: ({ row }) => row.getValue('primaryContact') || '—',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => formatDate(row.getValue('createdAt')),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
```

## Toolbar with Filters

```tsx
// components/crm/tables/data-table-toolbar.tsx
'use client'

import { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'
import { X } from 'lucide-react'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterableColumns: { id: string; title: string; options: { label: string; value: string }[] }[]
  searchableColumns: { id: string; title: string }[]
  bulkActions: { label: string; action: (rows: TData[]) => void }[]
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns,
  searchableColumns,
  bulkActions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const selectedRows = table.getFilteredSelectedRowModel().rows

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* Search */}
        {searchableColumns.map(column => (
          <Input
            key={column.id}
            placeholder={`Search ${column.title.toLowerCase()}...`}
            value={(table.getColumn(column.id)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(column.id)?.setFilterValue(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        ))}

        {/* Faceted Filters */}
        {filterableColumns.map(column => (
          table.getColumn(column.id) && (
            <DataTableFacetedFilter
              key={column.id}
              column={table.getColumn(column.id)}
              title={column.title}
              options={column.options}
            />
          )
        ))}

        {/* Reset Filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {selectedRows.length} selected
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {bulkActions.map(action => (
                <DropdownMenuItem
                  key={action.label}
                  onClick={() => action.action(selectedRows.map(r => r.original))}
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Column Visibility */}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
```

## Pagination

```tsx
// components/crm/tables/data-table-pagination.tsx
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

export function DataTablePagination<TData>({ table }: { table: Table<TData> }) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map(pageSize => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
```

## Usage Example

```tsx
// app/(admin)/organizations/page.tsx
import { DataTable } from '@/components/crm/tables/data-table'
import { organizationsColumns } from '@/components/crm/tables/organizations-columns'

export default async function OrganizationsPage() {
  const organizations = await getOrganizations()

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Organizations</h1>
        <Button asChild>
          <Link href="/admin/organizations/new">New Organization</Link>
        </Button>
      </div>

      <DataTable
        columns={organizationsColumns}
        data={organizations}
        filterableColumns={[
          {
            id: 'type',
            title: 'Type',
            options: [
              { label: 'School', value: 'school' },
              { label: 'District', value: 'district' },
              { label: 'Co-op', value: 'coop' },
            ],
          },
          {
            id: 'status',
            title: 'Status',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Pending', value: 'pending' },
              { label: 'At Risk', value: 'at_risk' },
            ],
          },
        ]}
        searchableColumns={[{ id: 'name', title: 'Name' }]}
        bulkActions={[
          { label: 'Export Selected', action: handleExport },
          { label: 'Archive Selected', action: handleArchive },
        ]}
      />
    </div>
  )
}
```
