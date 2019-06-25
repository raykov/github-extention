onInit = () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
};

/**
 * Add event listeners
 */
if (chrome.runtime && chrome.runtime.onInstalled) {
  chrome.runtime.onInstalled.addListener(onInit);
}
if (chrome.runtime && chrome.runtime.onSuspend) {
  // chrome.runtime.onSuspend.addListener(onSuspend);
}
