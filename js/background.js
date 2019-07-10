async function firstInstall() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
}

chrome.runtime.onInstalled.addListener(async details => {
  if (details.reason == "install" ) {
    firstInstall();
  } else if (details.reason == "update") {

  }
});

if (chrome.alarms) {
  //
}

if (chrome.gcm) {
  //
}

if (chrome.notifications) {
  // clicked anywhere
  chrome.notifications.onClicked.addListener(function(notificationId) {

  });
  // buttons clicked
  chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {

  });
  // closed notif
  chrome.notifications.onClosed.addListener(function(notificationId, byUser) {

  });
}

async function setBadgeText() {
  let count = backgrounds.requestsData.length;
  let text;
  let color;

  switch(count) {
    case 0:
      text = "No new code review requests";
      color = [0,0,0, 255];
      break;
    case 1:
      text = "One new code review request";
      color = [255,0,0, 255];
      break;
    default:
      text = `${count} new code review requests`;
      color = [255,0,0, 255];
      break;
  }

  chrome.browserAction.setBadgeText({ text: count > 0 ? `${count}` : "" });
  chrome.browserAction.setTitle({ title: text });
  chrome.browserAction.setBadgeBackgroundColor({ color: color });
}

loadGithubConfigsFromStorage(() => requestReviewRequests(() => {
  setBadgeText();
  triggerNotifications();
}));
