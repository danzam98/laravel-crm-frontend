/**
 * Table component
 * Handles sorting, filtering, pagination, bulk selection, and saved views
 */

import { state } from '../state.js';

export function initTable() {
  document.querySelectorAll('[data-table]').forEach(table => {
    const tableId = table.dataset.table;
    initTableSorting(table, tableId);
    initTableFilters(table, tableId);
    initBulkSelection(table, tableId);
    initPagination(table, tableId);
    initColumnVisibility(table, tableId);
    initRowDensity(table, tableId);
    loadSavedPreferences(table, tableId);
  });
}

function initTableSorting(table, tableId) {
  const headers = table.querySelectorAll('th[data-sortable]');

  headers.forEach(header => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      const column = header.dataset.sortable;
      const currentDir = header.dataset.sortDir || 'none';
      const newDir = currentDir === 'asc' ? 'desc' : currentDir === 'desc' ? 'none' : 'asc';

      // Reset other headers
      headers.forEach(h => {
        h.dataset.sortDir = 'none';
        h.querySelector('.sort-icon')?.remove();
      });

      // Set new sort
      header.dataset.sortDir = newDir;

      // Add sort icon
      if (newDir !== 'none') {
        const icon = document.createElement('span');
        icon.className = 'sort-icon ml-1 text-slate-400';
        icon.textContent = newDir === 'asc' ? '↑' : '↓';
        header.appendChild(icon);
      }

      // Sort table rows
      sortTableRows(table, column, newDir);

      // Save preference
      state.set(`tablePreferences.${tableId}.sort`, { column, dir: newDir });
    });
  });
}

function sortTableRows(table, column, direction) {
  const tbody = table.querySelector('tbody');
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll('tr'));
  const headers = Array.from(table.querySelectorAll('th'));
  const columnIndex = headers.findIndex(h => h.dataset.sortable === column);

  if (columnIndex === -1 || direction === 'none') return;

  rows.sort((a, b) => {
    const aCell = a.cells[columnIndex];
    const bCell = b.cells[columnIndex];
    const aValue = aCell?.textContent.trim() || '';
    const bValue = bCell?.textContent.trim() || '';

    // Try numeric comparison
    const aNum = parseFloat(aValue.replace(/[^0-9.-]/g, ''));
    const bNum = parseFloat(bValue.replace(/[^0-9.-]/g, ''));

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return direction === 'asc' ? aNum - bNum : bNum - aNum;
    }

    // String comparison
    return direction === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  rows.forEach(row => tbody.appendChild(row));
}

function initTableFilters(table, tableId) {
  const filters = table.closest('[data-table-container]')?.querySelectorAll('[data-filter]');
  if (!filters) return;

  filters.forEach(filter => {
    filter.addEventListener('change', () => {
      applyFilters(table, tableId);
    });
  });
}

function applyFilters(table, tableId) {
  const container = table.closest('[data-table-container]');
  if (!container) return;

  const filters = container.querySelectorAll('[data-filter]');
  const tbody = table.querySelector('tbody');
  const rows = tbody?.querySelectorAll('tr');

  if (!rows) return;

  // Collect active filters
  const activeFilters = {};
  filters.forEach(filter => {
    const column = filter.dataset.filter;
    const value = filter.value;
    if (value) {
      activeFilters[column] = value.toLowerCase();
    }
  });

  // Update filter chips display
  updateFilterChips(container, activeFilters);

  // Apply filters to rows
  rows.forEach(row => {
    let visible = true;

    for (const [column, filterValue] of Object.entries(activeFilters)) {
      const cell = row.querySelector(`[data-column="${column}"]`);
      const cellValue = cell?.textContent.trim().toLowerCase() || '';

      if (!cellValue.includes(filterValue)) {
        visible = false;
        break;
      }
    }

    row.style.display = visible ? '' : 'none';
  });

  // Save filters
  state.set(`tablePreferences.${tableId}.filters`, activeFilters);
}

function updateFilterChips(container, activeFilters) {
  let chipsContainer = container.querySelector('.filter-chips');
  if (!chipsContainer) {
    chipsContainer = document.createElement('div');
    chipsContainer.className = 'filter-chips flex flex-wrap gap-2 mb-4';
    container.insertBefore(chipsContainer, container.firstChild);
  }

  chipsContainer.innerHTML = '';

  for (const [column, value] of Object.entries(activeFilters)) {
    const chip = document.createElement('span');
    chip.className = 'inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-sm rounded-full';
    chip.innerHTML = `
      <span class="text-slate-500">${column}:</span>
      <span class="font-medium">${value}</span>
      <button class="ml-1 text-slate-400 hover:text-slate-600" data-remove-filter="${column}">×</button>
    `;
    chipsContainer.appendChild(chip);
  }

  // Handle chip removal
  chipsContainer.querySelectorAll('[data-remove-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const column = btn.dataset.removeFilter;
      const filter = container.querySelector(`[data-filter="${column}"]`);
      if (filter) {
        filter.value = '';
        filter.dispatchEvent(new Event('change'));
      }
    });
  });
}

function initBulkSelection(table, tableId) {
  const selectAll = table.querySelector('[data-select-all]');
  const rowCheckboxes = table.querySelectorAll('[data-row-select]');

  if (!selectAll) return;

  selectAll.addEventListener('change', () => {
    const checked = selectAll.checked;
    rowCheckboxes.forEach(cb => {
      cb.checked = checked;
    });
    updateBulkActionsBar(table, tableId);
  });

  rowCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      updateBulkActionsBar(table, tableId);

      // Update select all state
      const allChecked = Array.from(rowCheckboxes).every(c => c.checked);
      const someChecked = Array.from(rowCheckboxes).some(c => c.checked);
      selectAll.checked = allChecked;
      selectAll.indeterminate = someChecked && !allChecked;
    });
  });
}

function updateBulkActionsBar(table, tableId) {
  const container = table.closest('[data-table-container]');
  const selectedCount = table.querySelectorAll('[data-row-select]:checked').length;

  let bulkBar = container?.querySelector('.bulk-actions-bar');

  if (selectedCount > 0) {
    if (!bulkBar) {
      bulkBar = document.createElement('div');
      bulkBar.className = 'bulk-actions-bar sticky top-16 z-10 bg-slate-800 text-white px-4 py-2 rounded-lg mb-4 flex items-center justify-between';
      bulkBar.innerHTML = `
        <span class="text-sm"><span class="selected-count font-medium">${selectedCount}</span> selected</span>
        <div class="flex items-center gap-2">
          <button class="btn btn-sm bg-white/10 hover:bg-white/20 text-white" data-bulk-action="export">Export</button>
          <button class="btn btn-sm bg-white/10 hover:bg-white/20 text-white" data-bulk-action="archive">Archive</button>
          <button class="btn btn-sm text-white" data-bulk-action="clear">Clear selection</button>
        </div>
      `;
      container?.insertBefore(bulkBar, table.parentElement);

      // Handle clear selection
      bulkBar.querySelector('[data-bulk-action="clear"]').addEventListener('click', () => {
        table.querySelectorAll('[data-row-select]').forEach(cb => cb.checked = false);
        table.querySelector('[data-select-all]').checked = false;
        updateBulkActionsBar(table, tableId);
      });
    } else {
      bulkBar.querySelector('.selected-count').textContent = selectedCount;
    }
  } else if (bulkBar) {
    bulkBar.remove();
  }
}

function initPagination(table, tableId) {
  const container = table.closest('[data-table-container]');
  const pagination = container?.querySelector('[data-pagination]');
  if (!pagination) return;

  const pageSizeSelect = pagination.querySelector('[data-page-size]');
  const pageButtons = pagination.querySelectorAll('[data-page]');

  if (pageSizeSelect) {
    pageSizeSelect.addEventListener('change', () => {
      state.set(`tablePreferences.${tableId}.pageSize`, pageSizeSelect.value);
      // In a real implementation, this would trigger data re-fetch
      window.showToast?.(`Showing ${pageSizeSelect.value} items per page`);
    });
  }

  pageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      pageButtons.forEach(b => b.classList.remove('bg-slate-200'));
      btn.classList.add('bg-slate-200');
    });
  });
}

function initColumnVisibility(table, tableId) {
  const container = table.closest('[data-table-container]');
  const toggle = container?.querySelector('[data-column-toggle]');
  if (!toggle) return;

  const headers = table.querySelectorAll('th[data-column]');
  const menu = document.createElement('div');
  menu.className = 'dropdown-menu hidden';
  menu.id = `${tableId}-columns`;

  headers.forEach((header, index) => {
    const column = header.dataset.column;
    const label = header.textContent.trim();
    const item = document.createElement('label');
    item.className = 'dropdown-item cursor-pointer';
    item.innerHTML = `
      <input type="checkbox" checked class="checkbox mr-2" data-toggle-column="${index}">
      ${label}
    `;
    menu.appendChild(item);
  });

  toggle.parentElement.appendChild(menu);
  toggle.dataset.dropdownTrigger = `${tableId}-columns`;

  // Handle column visibility toggle
  menu.querySelectorAll('[data-toggle-column]').forEach(cb => {
    cb.addEventListener('change', () => {
      const columnIndex = parseInt(cb.dataset.toggleColumn);
      const visible = cb.checked;

      table.querySelectorAll(`tr`).forEach(row => {
        const cell = row.cells[columnIndex];
        if (cell) {
          cell.style.display = visible ? '' : 'none';
        }
      });
    });
  });
}

function initRowDensity(table, tableId) {
  const container = table.closest('[data-table-container]');
  const densityToggle = container?.querySelector('[data-density-toggle]');
  if (!densityToggle) return;

  densityToggle.addEventListener('click', () => {
    table.classList.toggle('table-compact');
    const isCompact = table.classList.contains('table-compact');
    state.set(`tablePreferences.${tableId}.density`, isCompact ? 'compact' : 'comfortable');
  });
}

function loadSavedPreferences(table, tableId) {
  const prefs = state.get(`tablePreferences.${tableId}`);
  if (!prefs) return;

  // Apply saved sort
  if (prefs.sort) {
    const header = table.querySelector(`th[data-sortable="${prefs.sort.column}"]`);
    if (header) {
      header.click();
      if (prefs.sort.dir === 'desc') header.click();
    }
  }

  // Apply saved density
  if (prefs.density === 'compact') {
    table.classList.add('table-compact');
  }
}

// Export for external use
window.refreshTable = (tableId) => {
  const table = document.querySelector(`[data-table="${tableId}"]`);
  if (table) initTable.call(null, table, tableId);
};
