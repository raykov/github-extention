saveOptions = () => {
  chrome.storage.local.set(
    { githubConfigs: fieldsToData() },
    () => {
      const status = document.getElementById("status");
      status.innerHTML = "Options saved";

      setTimeout(() => status.innerHTML = "&nbsp;", 750);
      loadGithubConfigsFromStorage();
    });
};

const FIELDS = ["review-requested", "is", "state", "user", "repo", "author", "mentions", "token"];
const FIELDS_MAPPING = {
  "token": "authToken",
  "review-requested": "username"
};
const FIELD_DEFAULTS = {
  "is": "pr",
  "state": "open"
};

function fieldsToData() {
  let data = {};

  FIELDS.forEach(field => {
    data[FIELDS_MAPPING[field] || field] = document.getElementById(field).value
  });

  return data
}

function fieldValue(field) {
  return backgrounds.githubConfigs[FIELDS_MAPPING[field] || field] || defaultFieldValue(field);
}

function defaultFieldValue(field) {
  return FIELD_DEFAULTS[field] || ""
}

restoreOptions = () => {
  loadGithubConfigsFromStorage(() => {
    FIELDS.forEach(field => {
      document.getElementById(field).value = fieldValue(field);
    });
  });
};

showAdvancedOptions = () => {
  document.getElementById("advanced-options").style.display = "";
  document.getElementById("advanced-options-link").style.display = "none";
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
document.getElementById("advanced-options-link").addEventListener("click", showAdvancedOptions);
