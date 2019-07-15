async function badgeLoading() {
  chrome.browserAction.setBadgeText({ text: "O_O" });
  chrome.browserAction.setTitle({ title: "Checking for new PR's" });
  chrome.browserAction.setBadgeBackgroundColor({ color: [0,0,0, 255] });
}

async function badgeError(status) {
  chrome.browserAction.setBadgeText({ text: "Error" });
  chrome.browserAction.setTitle({ title: "Something went wrong" });
  chrome.browserAction.setBadgeBackgroundColor({ color: [255,0,0, 255] });
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
