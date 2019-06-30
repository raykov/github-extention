saveOptions = () => {
  const username = document.getElementById("username").value;
  const authToken = document.getElementById("token").value;
  const updateEvery = document.getElementById("update-every").value;

  chrome.storage.local.set(
    {
      githubConfigs:
        {
          authToken: authToken,
          username: username,
          updateEvery: updateEvery
        }
    },
    () => {
      const status = document.getElementById("status");
      status.innerHTML = "Options saved";

      setTimeout(() => status.innerHTML = "&nbsp;", 750);
      loadGithubConfigsFromStorage();
    });
};

restoreOptions = () => {
  loadGithubConfigsFromStorage(() => {
    document.getElementById("username").value = backgrounds.githubConfigs.username || "";
    document.getElementById("token").value = backgrounds.githubConfigs.authToken || "";
    document.getElementById("update-every").value = backgrounds.githubConfigs.updateEvery || 60;
  });
};

showAdvancedOptions = () => {
  document.getElementById("advanced-options").style.display = "";
  document.getElementById("advanced-options-link").style.display = "none";
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
document.getElementById("advanced-options-link").addEventListener("click", showAdvancedOptions);
