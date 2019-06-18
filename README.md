# Github review requests list

### Installation 

* Clone this repo.
* Go to chrome://extensions/
* Turn on "Developer mode" on the top right corner. 
* Click "Load unpacked" on left top corner.
* Find the path where you cloned this repo.
* Install it
* Go to https://github.com/settings/tokens and create a new token with "repo" access
* Open a new tab in your browser
* Open a developer console
* Execute this js code with corresponding data
 ```js
chrome.storage.local.set({ githubConfigs: { authToken: "YOUR_TOKEN", username: "YOUR_GITHUB_USERNAME" } }, function() {});
```
* Reload your page
* Enjoy.
