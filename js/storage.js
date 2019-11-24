class Storage {
  constructor() {
    if (!!Storage.instance) {
      return Storage.instance;
    }

    Storage.instance = this;

    return this;
  }

  load(callback = () => {}){
    chrome.storage.local.get("configs", result => {
      backgrounds.githubConfigs = result.configs.github || {};
      backgrounds.azureConfigs = result.configs.azure || {};

      callback();
    });
  }

  save(){

  }
}
