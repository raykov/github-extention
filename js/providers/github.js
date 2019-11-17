// Github.prototype = Object.create(BaseProvider.prototype)

// Github.new(backgrounds.githubConfigs).request(callback, onErrorCallback)
class Github {
  constructor(configuration = {}) {
    this.configuration = configuration;

    this.name = "github";
    this.baseUrl = "https://api.github.com/search/issues";
    this.url = `${this.baseUrl}?q=${this._requestParams()}`;
  }

  request(callback = () => {}, onError = status => {}) {
    let self = this;

    backgrounds.requestsData.setProviderLoading(self.name);

    const request = new XMLHttpRequest();
    request.open('GET', self.url, true);
    request.setRequestHeader("Authorization", self._authorization());

    request.onload = function() {
      if (this.status < 200 || this.status >= 400) {
        onError(this.status);
        return;
      }

      const body = JSON.parse(this.response);

      backgrounds.requestsData.setProviderData(self.name, body.items.map(item => (self._prepareData(item))));

      callback();
    };

    request.send();

  }

  _authorization() {
    return `token ${this.configuration.authToken}`; // should be this.configuration.token
  }

  _prepareData(item) {
    return {
      id:             item.id,
      nodeId:         item.node_id,
      repo:           item.repository_url.substring(item.repository_url.lastIndexOf("/") + 1),
      userLogin:      item.user.login,
      userAvatarUrl:  item.user.avatar_url,
      htmlUrl:        item.html_url,
      title:          item.title,
      createdAt:      item.created_at,
      provider:       this.name
    }
  }

  _requestParams() {
    let data = [];
    // is:pr+is:open+review-requested:${backgrounds.githubConfigs.username}+user:raykov

    data.push(`is:${this.configuration.is}`);
    data.push(`state:${this.configuration.state}`);
    data.push(`review-requested:${this.configuration.username}`);
    if (this.configuration.user     !== "") data.push(`user:${this.configuration.user}`);
    if (this.configuration.repo     !== "") data.push(`repo:${this.configuration.repo}`);
    if (this.configuration.author   !== "") data.push(`author:${this.configuration.author}`);
    if (this.configuration.mentions !== "") data.push(`mentions:${this.configuration.mentions}`);

    return data.join("+")
  }
}

