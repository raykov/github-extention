window.backgrounds = {
  configs: {},
  githubConfigs: {},
  azureConfigs: {},
  requestsData: new RequestsData(),
  alarms: {
    UPDATE_BADGE: "UPDATE_BADGE"
  }
};

function loadConfigsFromStorage(callback = () => {}) {
  chrome.storage.local.get("configs", result => {
    backgrounds.githubConfigs = result.configs.github || {};
    backgrounds.azureConfigs = result.configs.azure || {};

    callback();
  });
}

function requestReviewRequests(callback = () => {}, onError = status => {}) {
  new Github(backgrounds.githubConfigs).request(callback, onError)
  new Azure(backgrounds.azureConfigs).request(callback, onError)
}
