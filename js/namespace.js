window.backgrounds = {
  configs: {},
  githubConfigs: {}
};

function loadGithubConfigsFromStorage(callback = () => {}) {
  chrome.storage.local.get('githubConfigs', result => {
    backgrounds.githubConfigs = result.githubConfigs || { updateEvery: 60 };

    if (wrongUpdateEvery()) {
      backgrounds.githubConfigs.updateEvery = 60;
    }

    callback();
  });
}

function wrongUpdateEvery() {
  return typeof(backgrounds.githubConfigs.updateEvery) === "undefined" ||
    backgrounds.githubConfigs.updateEvery === null ||
    backgrounds.githubConfigs.updateEvery < 60 ||
    backgrounds.githubConfigs.updateEvery > 600
}
