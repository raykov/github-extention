saveOptions = () => {

  chrome.storage.local.set(
    {
      configs: {
        github: fieldsToData("github"),
        azure: fieldsToData("azure")
      }
    },
    () => {
      const status = document.getElementById("status");
      status.innerHTML = "Options saved";

      restoreOptions()

      setTimeout(() => status.innerHTML = "&nbsp;", 750);
      new Storage().load();
    });
};

const FIELDS = {
  github: ["review-requested", "is", "state", "user", "repo", "author", "mentions", "token"],
  azure: ["user", "token", "workspace"]
};

const FIELDS_MAPPING = {
  github: {
    "token": "authToken",
    "review-requested": "username"
  },
  azure: {}
};
const FIELD_DEFAULTS = {
  github: {
    "is": "pr",
    "state": "open"
  },
  azure: {}
};

function fieldsToData(provider) {
  let data = {};

  FIELDS[provider].forEach(field => {
    data[FIELDS_MAPPING[provider][field] || field] = document.getElementById(`${provider}-${field}`).value
  });

  return data
}

function fieldValue(field, provider) {
  return backgrounds[configByProvider(provider)][FIELDS_MAPPING[provider][field] || field] || defaultFieldValue(field, provider);
}

function configByProvider(provider) {
  return provider === "github" ? "githubConfigs": "azureConfigs"
}

function defaultFieldValue(field, provider) {
  return FIELD_DEFAULTS[provider][field] || ""
}

function providerByName(provider) {
  return provider === "github" ? new Github(backgrounds[configByProvider(provider)]) : new Azure(backgrounds[configByProvider(provider)])
}

function validOrNot(provider) {
  document.getElementById(provider + "-tab-label").className = providerByName(provider).isEnabled() ? "valid" : "invalid";
}

restoreOptions = () => {
  new Storage().load(() => {
    ["github", "azure"].forEach(provider => {
      FIELDS[provider].forEach(field => {
        document.getElementById(`${provider}-${field}`).value = fieldValue(field, provider);
      });

      validOrNot(provider);
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
