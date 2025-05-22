// close blocked tabs on update (if somehow they weren't closed on creation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      chrome.storage.local.get({ blockedSites: [] }, ({ blockedSites }) => {
        if (blockedSites.some(site => changeInfo.url.includes(site))) {
          chrome.tabs.remove(tabId);
        }
      });
    }
  });
  // close blocked tabes on creation
  chrome.tabs.onCreated.addListener((tab) => {
    const url = tab.pendingUrl || tab.url;
    if (url) {
      chrome.storage.local.get({ blockedSites: [] }, ({ blockedSites }) => {
        if (blockedSites.some(site => url.includes(site))) {
          chrome.tabs.remove(tab.id);
        }
      });
    }
  });
  