// Azure.prototype = Object.create(BaseProvider.prototype)

// Azure.new(backgrounds.azureConfigs).request(callback, onErrorCallback)
class Azure {
  constructor(configuration = {}) {
    this.configuration = configuration;

    this.name = "azure";
    this.baseUrl = "https://dev.azure.com/" + this.configuration.workspace +  "/_apis/git/pullrequests";
    this.url = `${this.baseUrl}?api-version=5.1&searchCriteria.status=all`;
  }

  request() {
    let self = this;

    if (!self.isEnabled()) {
      return
    }

    window.requestsData.setProviderLoading(self.name);

    if (self.configuration.token === "" || self.configuration.token === null || self.configuration.token === undefined) {
      return
    }

    const request = new XMLHttpRequest();
    request.open('GET', self.url, true);
    request.setRequestHeader("Authorization", self._authorization());

    request.onload = function() {
      if (this.status < 200 || this.status >= 400) {
        window.requestsData.setProviderError(self.name, { message: "Something went wrong", status: this.status, details: "" });
        return;
      }

      if (this.status === 203) {
        window.requestsData.setProviderError(self.name, { message: "Authorization error", status: this.status, details: "Please check your username and/or token" });
        return;
      }

      const body = JSON.parse(this.response);

      let items = {};
      body["value"].forEach(pr => {
        if (pr["status"] === "active" &&
            pr["reviewers"].filter(reviewer => {
              // could be -10, -5, 0, 5, 10
              return reviewer["vote"] === 0 &&
                reviewer["uniqueName"] === self.configuration.user
            }).length > 0) {

          let data = self._prepareData(pr)

          items[data[0]] = data[1];
        }
      })

      window.requestsData.setProviderData(self.name, items);
    };

    request.onerror = function(event) {
      window.requestsData.setProviderError(self.name, { message: "Error happened", status: event.target.status, details: "" });
      window.requestsData.setProviderData(self.name, []);
    };

    request.ontimeout = function() {
      window.requestsData.setProviderError(self.name, { message: "Timeout error", status: "", details: "" });
      window.requestsData.setProviderData(self.name, []);
    }

    request.send();
  }

  isEnabled() {
    return !this._misconfigured()
  }

  _misconfigured() {
    let conf = this.configuration;

    return conf.user === undefined || conf.user === null || conf.user === "" ||
      conf.token === undefined || conf.token === null || conf.token === "" ||
      conf.workspace === undefined || conf.workspace === null || conf.workspace === ""
  }

  _authorization() {
    return `Basic ${window.btoa(this.configuration.user + ":" + this.configuration.token)}`
  }

  _prepareData(pr) {
    return [pr.pullRequestId, {
      id:             pr.pullRequestId,
      nodeId:         pr.pullRequestId,
      repo:           pr.repository.name,
      userLogin:      pr.createdBy.displayName,
      userAvatarUrl:  pr.createdBy._links.avatar.href, // pr.createdBy.imageUrl,
      htmlUrl: [
        "https://dev.azure.com",
        encodeURIComponent(this.configuration.workspace),
        encodeURIComponent(pr.repository.project.name),
        "_git",
        encodeURIComponent(pr.repository.name),
        "pullrequest",
        pr.pullRequestId
      ].join("/"),
      title:          pr.title,
      createdAt:      pr.creationDate,
      provider:       this.name
    }]
  }
}
