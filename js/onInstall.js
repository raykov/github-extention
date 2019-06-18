function onInit(event) {
}

/**
 * Add event listeners
 */
if (chrome.runtime && chrome.runtime.onInstalled) {
  chrome.runtime.onInstalled.addListener(onInit);
}
if (chrome.runtime && chrome.runtime.onSuspend) {
  // chrome.runtime.onSuspend.addListener(onSuspend);
}
