saveOptions = () => {
  const username = document.getElementById("username").value;
  const authToken = document.getElementById("token").value;

  chrome.storage.local.set(
    {
      githubConfigs:
        {
          authToken: authToken,
          username: username
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
  });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
