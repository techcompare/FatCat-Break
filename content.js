chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SHOW_CAT") {
    showOverlay();
  } else if (request.action === "HIDE_CAT") {
    hideOverlay();
  }
});

function showOverlay() {
  if (document.getElementById('fat-cat-overlay-root')) return;

  const host = document.createElement('div');
  host.id = 'fat-cat-overlay-root';
  host.style.position = 'fixed';
  host.style.zIndex = '2147483647';
  host.style.top = '0';
  host.style.left = '0';
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'closed' });
  
  // Inject CSS into Shadow DOM
  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.href = chrome.runtime.getURL('overlay.css');
  shadow.appendChild(styleLink);

  const container = document.createElement('div');
  container.id = 'fat-cat-overlay';
  container.innerHTML = `
    <div class="cat-container">
      <div class="cat-message">JUDGING YOUR PRODUCTIVITY...</div>
      <div class="fat-cat">
        <div class="cat-body">
          <div class="cat-ears"></div>
          <div class="cat-eyes">
            <div class="cat-eye"></div>
            <div class="cat-eye"></div>
          </div>
          <div class="cat-nose"></div>
          <div class="cat-mouth"></div>
        </div>
        <div class="cat-tail"></div>
      </div>
      <div class="break-timer">Go away. Touch some grass for 5 minutes.</div>
    </div>
  `;
  shadow.appendChild(container);
  document.body.style.overflow = 'hidden';
}

function hideOverlay() {
  const host = document.getElementById('fat-cat-overlay-root');
  if (host) {
    host.remove();
    document.body.style.overflow = '';
  }
}

// Check if break is already active on load
chrome.storage.local.get(['isBreakActive'], (res) => {
  if (res.isBreakActive) {
    showOverlay();
  }
});
