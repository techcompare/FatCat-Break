const intervalInput = document.getElementById('interval');
const saveBtn = document.getElementById('saveBtn');
const timeLeftDisplay = document.getElementById('timeLeft');

// Load current settings
chrome.storage.local.get(['breakInterval'], (res) => {
  if (res.breakInterval) {
    intervalInput.value = res.breakInterval;
  }
});

// Update countdown
function updateCountdown() {
  chrome.alarms.get('fatCatBreak', (alarm) => {
    if (alarm) {
      const diff = Math.round((alarm.scheduledTime - Date.now()) / 1000 / 60);
      timeLeftDisplay.textContent = diff > 0 ? `${diff} mins remaining` : 'Any second now...';
    } else {
      chrome.storage.local.get(['isBreakActive'], (res) => {
        timeLeftDisplay.textContent = res.isBreakActive ? 'BREAK IN PROGRESS' : 'Timer Inactive';
      });
    }
  });
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Save settings
saveBtn.onclick = () => {
  const mins = parseInt(intervalInput.value);
  if (mins > 0) {
    chrome.storage.local.set({ breakInterval: mins }, () => {
      chrome.runtime.sendMessage({ action: "RESET_TIMER", minutes: mins });
      alert('Interval updated! The cat is reset.');
    });
  }
};

// Test Break
document.getElementById('testBtn').onclick = () => {
  chrome.runtime.sendMessage({ action: "START_BREAK_NOW" });
};
