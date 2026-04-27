const DISTRACTION_SITES = ['reddit.com', 'youtube.com', 'twitter.com', 'x.com', 'instagram.com', 'facebook.com', 'tiktok.com'];
let activeTabId = null;
let startTime = null;

// Default limits
const LIMIT_MINUTES = 1; // 1 minute for testing

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
  const tab = await chrome.tabs.get(activeTabId);
  const url = tab.url;
  
  const isDistraction = DISTRACTION_SITES.some(site => url.includes(site));
  
  if (isDistraction) {
    if (!startTime) {
      startTime = Date.now();
      console.log("[FatCat] Started tracking distraction site:", url);
      setupAlarm(LIMIT_MINUTES);
    }
  } else {
    console.log("[FatCat] Work tab detected. Pausing judgment.");
    startTime = null;
    chrome.alarms.clear('fatCatBreak');
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
