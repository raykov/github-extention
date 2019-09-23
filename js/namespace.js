class RequestsData {
  constructor() {
    this.github = [];
    this.azure = [];
  }

  items() {
    return this.github.concat(this.azure);
  }

  length(){
    return this.items().length;
  }

  forEach(callback) {
    return this.items().forEach(callback)
  }
}

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
  requestReviewRequestsGithub(callback, onError);
  requestReviewRequestsAzure(callback, onError);
}
