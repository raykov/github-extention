new Storage().load(() => {
  new Github(backgrounds.githubConfigs).request();
  new Azure(backgrounds.azureConfigs).request();
});
