chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SHOW_CAT") {
    showOverlay();
  } else if (request.action === "HIDE_CAT") {
    hideOverlay();
  }
});

function showOverlay() {
  if (document.getElementById('fat-cat-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'fat-cat-overlay';
  overlay.innerHTML = `
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
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function hideOverlay() {
  const overlay = document.getElementById('fat-cat-overlay');
  if (overlay) {
    overlay.remove();
    document.body.style.overflow = '';
  }
}

// Check if break is already active on load
chrome.storage.local.get(['isBreakActive'], (res) => {
  if (res.isBreakActive) {
    showOverlay();
  }
});
