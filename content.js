console.log("%c[FatCat] 🐱 System Active & Watching...", "color: #ff4757; font-size: 16px; font-weight: bold;");

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
  
  // Inject CSS directly for maximum reliability
  const style = document.createElement('style');
  style.textContent = `
    #fat-cat-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(3, 7, 18, 0.98) !important;
      backdrop-filter: blur(15px) !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      color: white !important;
      font-family: sans-serif !important;
      z-index: 2147483647 !important;
    }
    .cat-container { text-align: center !important; }
    .cat-message { font-size: 3rem !important; font-weight: 900 !important; color: #ff4757 !important; margin-bottom: 2rem !important; }
    .fat-cat { position: relative !important; width: 300px !important; height: 200px !important; margin: 0 auto !important; }
    .cat-body { width: 250px !important; height: 180px !important; background: #f1f2f6 !important; border-radius: 100px 100px 80px 80px !important; animation: breathe 2s infinite !important; }
    .cat-eyes { display: flex !important; justify-content: space-around !important; padding-top: 50px !important; }
    .cat-eye { width: 15px !important; height: 15px !important; background: #2f3542 !important; border-radius: 50% !important; }
    @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  `;
  shadow.appendChild(style);

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
