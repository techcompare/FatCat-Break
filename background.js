// Default settings for testing
const DEFAULT_BREAK_INTERVAL = 1; // minutes
const BREAK_DURATION = 1; // minutes

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 
    breakInterval: DEFAULT_BREAK_INTERVAL,
    isBreakActive: false,
    lastBreakTime: Date.now()
  });
  
  setupAlarm(DEFAULT_BREAK_INTERVAL);
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['breakInterval', 'isBreakActive'], (res) => {
    if (!res.isBreakActive) {
      setupAlarm(res.breakInterval || DEFAULT_BREAK_INTERVAL);
    }
  });
});

function setupAlarm(minutes) {
  chrome.alarms.clear('fatCatBreak');
  chrome.alarms.create('fatCatBreak', { delayInMinutes: parseFloat(minutes) });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'fatCatBreak') {
    startBreak();
  }
});

async function startBreak() {
  chrome.storage.local.set({ isBreakActive: true });
  
  // Notify all tabs to show the cat
  const tabs = await chrome.tabs.query({});
  tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, { action: "SHOW_CAT" }).catch(() => {
      // Ignore tabs where content script isn't loaded (e.g. chrome://)
    });
  });

  // Set alarm for end of break
  chrome.alarms.create('endBreak', { delayInMinutes: BREAK_DURATION });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'endBreak') {
    endBreak();
  }
});

async function endBreak() {
  chrome.storage.local.set({ isBreakActive: false, lastBreakTime: Date.now() });
  
  // Notify all tabs to hide the cat
  const tabs = await chrome.tabs.query({});
  tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, { action: "HIDE_CAT" }).catch(() => {});
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "RESET_TIMER") {
    setupAlarm(request.minutes);
  } else if (request.action === "START_BREAK_NOW") {
    startBreak();
  }
});
