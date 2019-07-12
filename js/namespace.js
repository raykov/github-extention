window.backgrounds = {
  configs: {},
  githubConfigs: {},
  requestsData: [],
  alarms: {
    UPDATE_BADGE: "UPDATE_BADGE"
  }
};

function loadGithubConfigsFromStorage(callback = () => {}) {
  chrome.storage.local.get("githubConfigs", result => {
    backgrounds.githubConfigs = result.githubConfigs || {};

    callback();
  });
}
