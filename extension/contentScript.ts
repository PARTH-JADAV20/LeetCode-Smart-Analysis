// Access Chrome API in a module-safe way
const chromeApi = (globalThis as any).chrome;
console.log('LeetCode Smart Analysis content script loaded.');

// Ensures modal and root exist; returns the modal element
function ensureModal(): HTMLDivElement {
  let modal = document.getElementById('smart-analysis-modal') as HTMLDivElement | null;
  if (modal) return modal;

  modal = document.createElement('div');
  modal.id = 'smart-analysis-modal';
  modal.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 99999;
  `;

  const modalContent = document.createElement('div');
  modalContent.id = 'smart-analysis-modal-content';
  modalContent.style.cssText = `
    background: #1a1a1a;
    margin: 40px auto;
    width: 90%;
    max-width: 1000px;
    height: 80vh;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `;

  const modalHeader = document.createElement('div');
  modalHeader.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #333;
    background: #1a1a1a;
    flex-shrink: 0;
  `;

  const title = document.createElement('h2');
  title.textContent = '🧠 Smart Analysis';
  title.style.cssText = `
    margin: 0;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
  `;

  const closeButton = document.createElement('button');
  closeButton.innerHTML = '✕';
  closeButton.style.cssText = `
    background: transparent;
    border: none;
    color: #888;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
  `;
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    modal!.style.display = 'none';
    console.log('[Smart Analysis] Modal closed');
  });

  modalHeader.appendChild(title);
  modalHeader.appendChild(closeButton);

  const reactRootDiv = document.createElement('div');
  reactRootDiv.id = 'smart-analysis-react-root';
  reactRootDiv.style.cssText = `
    flex: 1;
    overflow: auto;
    background: #1a1a1a;
    -webkit-overflow-scrolling: touch;
  `;

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(reactRootDiv);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      console.log('[Smart Analysis] Modal closed by background click');
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal!.style.display === 'block') {
      modal!.style.display = 'none';
      console.log('[Smart Analysis] Modal closed by Escape');
    }
  });

  // Load React UI bundle once
  if (!document.querySelector('script[data-smart-analysis="1"]')) {
    const script = document.createElement('script');
    script.src = chromeApi.runtime.getURL('smartAnalysisUI.js');
    script.type = 'module';
    script.setAttribute('data-smart-analysis', '1');
    document.head.appendChild(script);
    console.log('[Smart Analysis] React UI script loaded');
  }

  console.log('[Smart Analysis] Modal ensured');
  return modal;
}

// Ensures and shows the modal, forcing display in case upstream styles interfere
function openModal() {
  const modal = ensureModal();
  console.log('[Smart Analysis] openModal invoked');
  modal.style.display = 'block';
  modal.style.removeProperty('visibility');
  modal.style.removeProperty('opacity');
  console.log('[Smart Analysis] Modal opened (display=block set)');
}

function injectSmartAnalysisButton() {
  console.log('[Smart Analysis] injectSmartAnalysisButton start');
  if (document.getElementById('smart-analysis-button')) return; // Already injected

  // Try multiple selectors to find a home for the button
  const tabContainer =
    document.querySelector('.flexlayout__tabset_tabbar_inner_tab_container') ||
    document.querySelector('.flexlayout__tabbar_inner') ||
    document.querySelector('[role="tablist"]') ||
    document.querySelector('.ant-tabs-nav') ||
    null;

  // If still not found, fall back to a floating button so the user can open the popup
  if (!tabContainer) {
    console.warn('LeetCode tab container not found. Falling back to floating Smart Analysis button.');
    createFloatingButton();
    return;
  }

   console.log('[Smart Analysis] Tab container found, injecting button');

  // Create button for Smart Analysis
  const smartAnalysisButton = document.createElement('button');
  smartAnalysisButton.id = 'smart-analysis-button';
  smartAnalysisButton.innerHTML = `🧠 Smart Analysis`;
  smartAnalysisButton.style.cssText = `
    background: transparent;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text-primary, #888);
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: 8px;
    border-radius: 4px;
    transition: all 0.2s;
    white-space: nowrap;
    pointer-events: auto;
    position: relative;
    z-index: 2;
  `;
  
  smartAnalysisButton.addEventListener('mouseover', () => {
    smartAnalysisButton.style.color = '#fff';
    smartAnalysisButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  });
  smartAnalysisButton.addEventListener('mouseout', () => {
    smartAnalysisButton.style.color = 'var(--text-primary, #888)';
    smartAnalysisButton.style.backgroundColor = 'transparent';
  });

  tabContainer.appendChild(smartAnalysisButton);
  const rect = smartAnalysisButton.getBoundingClientRect();
  console.log('[Smart Analysis] Button added to tab container', {
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  });

  // Button click handler uses capture to avoid tab bar listeners blocking it
  smartAnalysisButton.addEventListener(
    'click',
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('[Smart Analysis] Tab button click handler fired');
      openModal();
    },
    true
  );

  // Additional early listeners in case click is swallowed by upstream handlers
  ['pointerdown', 'mousedown', 'mouseup'].forEach((evt) => {
    smartAnalysisButton.addEventListener(
      evt,
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`[Smart Analysis] Tab button ${evt} handler fired`);
        openModal();
      },
      true
    );
  });

  console.log('[Smart Analysis] Tab button listener attached (capture)');
}

// Floating button fallback if tab container not found
function createFloatingButton() {
  if (document.getElementById('smart-analysis-button')) return;

  const smartAnalysisButton = document.createElement('button');
  smartAnalysisButton.id = 'smart-analysis-button';
  smartAnalysisButton.innerHTML = '🧠 Smart Analysis';
  smartAnalysisButton.style.cssText = `
    position: fixed;
    bottom: 16px;
    right: 16px;
    background: #1a1a1a;
    color: #fff;
    border: 1px solid #333;
    padding: 10px 14px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.35);
    cursor: pointer;
    z-index: 99999;
    font-size: 14px;
    pointer-events: auto;
  `;

  document.body.appendChild(smartAnalysisButton);
  console.log('[Smart Analysis] Floating button added');

  smartAnalysisButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('[Smart Analysis] Floating button click handler fired');
    openModal();
  });

  console.log('[Smart Analysis] Floating button listener attached');
}

// Global capture logger to see if clicks reach the Smart Analysis button
document.addEventListener(
  'click',
  (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    if (target.id === 'smart-analysis-button' || target.closest('#smart-analysis-button')) {
      console.log('[Smart Analysis] Document capture saw click on Smart Analysis button');
    }
  },
  true
);

// Use a MutationObserver to wait for DOM changes; always attempt injection
const observer = new MutationObserver(() => {
  if (!document.getElementById('smart-analysis-button')) {
    injectSmartAnalysisButton();
  }
});
observer.observe(document.body, { childList: true, subtree: true });

// Attempt injection immediately and on DOM ready
const tryInject = () => {
  if (!document.getElementById('smart-analysis-button')) {
    injectSmartAnalysisButton();
  }
};

tryInject();

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(tryInject, 500);
  setTimeout(tryInject, 1500);
} else {
  window.addEventListener('DOMContentLoaded', () => {
    tryInject();
    setTimeout(tryInject, 500);
    setTimeout(tryInject, 1500);
  });
}

export {};
