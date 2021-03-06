async function firstInstall() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
}

chrome.runtime.onInstalled.addListener(async details => {
  if (details.reason === "install" ) {
    firstInstall();
  } else if (details.reason === "update") {

  }
});

if (chrome.alarms) {
  chrome.alarms.create(backgrounds.alarms.UPDATE_BADGE, { periodInMinutes: 1 }); // one minute

  chrome.alarms.onAlarm.addListener(alarm => {
    switch(alarm.name) {
      case backgrounds.alarms.UPDATE_BADGE:
        callProviders();
        break;
      default:
        break;
    }
  })
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

function callProviders() {
  new Storage().load(() => {
    new Github(backgrounds.githubConfigs).request();
    new Azure(backgrounds.azureConfigs).request();
  });
}

// Call it first time
callProviders();
