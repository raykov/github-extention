window.backgrounds = {
  configs: {},
  githubConfigs: {}
};

function loadGithubConfigsFromStorage(callback = () => {}) {
  chrome.storage.local.get('githubConfigs', result => {
    backgrounds.githubConfigs = result.githubConfigs || {};
    callback();
  });
}
