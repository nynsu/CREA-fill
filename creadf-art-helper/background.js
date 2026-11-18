chrome.runtime.onInstalled.addListener(() => {
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (chrome.sidePanel && chrome.sidePanel.open && tab && tab.windowId !== undefined) {
    try {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    } catch (_) {
      // Fallback handled by setPanelBehavior
    }
  }
});
