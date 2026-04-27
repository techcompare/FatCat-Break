const WORK_MINUTES = 1; 
const BREAK_MINUTES = 1;

chrome.runtime.onInstalled.addListener(() => {
  resetSession();
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['isBreakActive'], (res) => {
    if (!res.isBreakActive) {
      setupWorkAlarm(WORK_MINUTES);
    }
  });
});

function setupWorkAlarm(mins) {
  chrome.alarms.clearAll();
  chrome.alarms.create('workTime', { delayInMinutes: parseFloat(mins) });
  console.log(`[FatCat] Work timer set for ${mins} minutes.`);
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'workTime') {
    startBreak();
  } else if (alarm.name === 'breakTime') {
    endBreak();
  }
});

function startBreak() {
  chrome.storage.local.set({ isBreakActive: true });
  notifyAllTabs("SHOW_CAT");
  chrome.alarms.create('breakTime', { delayInMinutes: BREAK_MINUTES });
  console.log("[FatCat] BREAK STARTED. Judgment in progress.");
}

function endBreak() {
  chrome.storage.local.set({ isBreakActive: false });
  notifyAllTabs("HIDE_CAT");
  setupWorkAlarm(WORK_MINUTES);
  console.log("[FatCat] Break over. Get back to work.");
}

async function notifyAllTabs(action) {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.url || tab.url.startsWith('chrome://')) continue;
    try {
      if (action === "SHOW_CAT") {
        // Stage 1: Force load the content script file
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        }).catch(() => {});

        // Stage 2: Trigger the overlay
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            if (typeof showOverlay === 'function') showOverlay();
          }
        }).catch(() => {});
      } else {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            if (typeof hideOverlay === 'function') hideOverlay();
          }
        }).catch(() => {});
      }
    } catch (e) {}
  }
}

function resetSession() {
  chrome.storage.local.set({ isBreakActive: false });
  setupWorkAlarm(WORK_MINUTES);
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "START_BREAK_NOW") startBreak();
  if (request.action === "RESET_TIMER") setupWorkAlarm(request.minutes);
});

// Reinject if user navigates during break
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.local.get(['isBreakActive'], (res) => {
      if (res.isBreakActive) {
        chrome.tabs.sendMessage(tabId, { action: "SHOW_CAT" }).catch(() => {});
      }
    });
  }
});
