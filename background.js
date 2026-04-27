const DISTRACTION_SITES = ['reddit.com', 'youtube.com', 'twitter.com', 'x.com', 'instagram.com', 'facebook.com', 'tiktok.com'];
let activeTabId = null;
let startTime = null;

// Initialize active tab on load
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) {
    activeTabId = tabs[0].id;
    checkTab();
  }
});

chrome.tabs.onActivated.addListener(activeInfo => {
  activeTabId = activeInfo.tabId;
  checkTab();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.status === 'complete') {
    checkTab();
  }
});

async function checkTab() {
  try {
    const tab = await chrome.tabs.get(activeTabId);
    if (!tab || !tab.url) return;

    const url = tab.url.toLowerCase();
    const isDistraction = DISTRACTION_SITES.some(site => url.includes(site));
    
    if (isDistraction) {
      chrome.storage.local.get(['isBreakActive'], (res) => {
        if (!res.isBreakActive && !startTime) {
          startTime = Date.now();
          console.log("[FatCat] Distraction detected! Judgment starts in 1 minute.");
          setupAlarm(1); // Force 1 minute for your test
        }
      });
    } else {
      console.log("[FatCat] Safe site. Pausing judgment.");
      startTime = null;
      chrome.alarms.clear('fatCatBreak');
    }
  } catch (e) {
    console.error("[FatCat] Error checking tab:", e);
  }
}

function setupAlarm(minutes) {
  chrome.alarms.clear('fatCatBreak');
  chrome.alarms.create('fatCatBreak', { delayInMinutes: parseFloat(minutes) });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'fatCatBreak') {
    triggerHijack();
  }
});

async function triggerHijack() {
  chrome.storage.local.set({ isBreakActive: true });
  const tabs = await chrome.tabs.query({});
  tabs.forEach(tab => {
    if (DISTRACTION_SITES.some(site => tab.url.includes(site))) {
      chrome.tabs.sendMessage(tab.id, { action: "SHOW_CAT" }).catch(() => {});
    }
  });
}
