/**
 * Tabs component
 * Handles tab switching with proper accessibility
 */

export function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll('[data-tab]');
    const panels = tabGroup.querySelectorAll('[data-tab-panel]');

    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = tab.dataset.tab;

        // Update tab states
        tabs.forEach(t => {
          t.classList.remove('tab-active');
          t.setAttribute('aria-selected', 'false');
          t.setAttribute('tabindex', '-1');
        });

        tab.classList.add('tab-active');
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');

        // Update panel states
        panels.forEach(panel => {
          if (panel.dataset.tabPanel === targetId) {
            panel.classList.remove('hidden');
            panel.setAttribute('aria-hidden', 'false');
          } else {
            panel.classList.add('hidden');
            panel.setAttribute('aria-hidden', 'true');
          }
        });
      });

      // Keyboard navigation
      tab.addEventListener('keydown', (e) => {
        const tabList = Array.from(tabs);
        const currentIndex = tabList.indexOf(tab);
        let nextIndex;

        switch (e.key) {
          case 'ArrowLeft':
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) nextIndex = tabList.length - 1;
            break;
          case 'ArrowRight':
            nextIndex = currentIndex + 1;
            if (nextIndex >= tabList.length) nextIndex = 0;
            break;
          case 'Home':
            nextIndex = 0;
            break;
          case 'End':
            nextIndex = tabList.length - 1;
            break;
          default:
            return;
        }

        e.preventDefault();
        tabList[nextIndex].click();
        tabList[nextIndex].focus();
      });
    });
  });
}
