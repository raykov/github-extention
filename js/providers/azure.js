// Azure.prototype = Object.create(BaseProvider.prototype)

// Azure.new(backgrounds.azureConfigs).request(callback, onErrorCallback)
class Azure {
  constructor(configuration = {}) {
    this.configuration = configuration;

    this.name = "azure";
    this.baseUrl = "https://dev.azure.com/depositsolutions/_apis/git/pullrequests";
    this.url = `${this.baseUrl}?api-version=5.1&searchCriteria.status=all`;
  }

  request(callback = () => {}, onError = status => {}) {
    let self = this;

    backgrounds.requestsData.setProviderLoading(self.name);

    if (self.configuration.token === "" || self.configuration.token === null || self.configuration.token === undefined) {
      callback();
      return
    }

    const request = new XMLHttpRequest();
    request.open('GET', self.url, true);
    request.setRequestHeader("Authorization", self._authorization());

    request.onload = function() {
      if (this.status < 200 || this.status >= 400) {
        onError(this.status);
        return;
      }

      const body = JSON.parse(this.response);

      const toReview = body["value"].filter(pr => (pr["reviewers"].filter(reviewer => (reviewer["uniqueName"] === self.configuration.user)).length > 0));

      backgrounds.requestsData.setProviderData(self.name, toReview.map(pr => (self._prepareData(pr))));

      callback();
    };

    request.send();
  }

  _authorization() {
    return `Basic ${window.btoa(this.configuration.user + ":" + this.configuration.token)}`
  }

  _prepareData(pr) {
    return {
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
    }
  }
}
