window.backgrounds = {
  configs: {},
  githubConfigs: {}
};

function loadGithubConfigsFromStorage(callback = () => {}) {
  chrome.storage.local.get('githubConfigs', result => {
    backgrounds.githubConfigs = result.githubConfigs || { updateEvery: 60 };

    if (backgrounds.githubConfigs.updateEvery < 60 || backgrounds.githubConfigs.updateEvery > 600) {
      backgrounds.githubConfigs.updateEvery = 60;
    }

    callback();
  });
}
