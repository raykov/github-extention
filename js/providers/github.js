// Github.prototype = Object.create(BaseProvider.prototype)

// Github.new(backgrounds.githubConfigs).request(callback, onErrorCallback)
class Github {
  constructor(configuration = {}) {
    this.configuration = configuration;

    this.name = "github";
    this.baseUrl = "https://api.github.com/search/issues";
    this.userTeamsUrl = "https://api.github.com/user/teams";
    // this.url = `${this.baseUrl}?q=${this._requestParams()}`;
  }

  request() {
    let self = this;

    if (!self.isEnabled()) {
      return
    }

    window.requestsData.setProviderLoading(self.name);
    window.requestsData.resetProviderData(self.name)

    self._getUserReviewRequested();
    self._getTeamsReviewRequested();
  }

  isEnabled() {
    return !this._misconfigured()
  }

  _misconfigured() {
    let conf = this.configuration;

    return conf.username === undefined || conf.username === null || conf.username === "" ||
      conf.authToken === undefined || conf.authToken === null || conf.authToken === ""
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

  _urlForUser(){
    return `${this.baseUrl}?q=${this._requestParamsForUser()}`;
  }

  _urlForTeam(teamName){
    return `${this.baseUrl}?q=${this._requestParamsForTeam(teamName)}`;
  }

  _requestParamsForUser() {
    return this._requestParams(`review-requested:${this.configuration.username}`);
  }

  _requestParamsForTeam(team) {
    return this._requestParams(`team-review-requested:${team}`);
  }

  _requestParams(reviewRequestedFrom) {
    let data = [];
    // is:pr+is:open+review-requested:${backgrounds.githubConfigs.username}+user:raykov

    data.push(`is:${this.configuration.is}`);
    data.push(`state:${this.configuration.state}`);
    data.push(reviewRequestedFrom);
    if (this.configuration.user     !== "") data.push(`user:${this.configuration.user}`);
    if (this.configuration.repo     !== "") data.push(`repo:${this.configuration.repo}`);
    if (this.configuration.author   !== "") data.push(`author:${this.configuration.author}`);
    if (this.configuration.mentions !== "") data.push(`mentions:${this.configuration.mentions}`);

    return data.join("+")
  }

  _getUserReviewRequested() {
    let self = this;
    const request = new XMLHttpRequest();
    request.open('GET', self._urlForUser(), true);
    request.setRequestHeader("Authorization", self._authorization());
    request.setRequestHeader("Accept", "application/vnd.github.v3+json");

    request.onload = function() {
      if (this.status < 200 || this.status >= 400) {
        const errorBody = JSON.parse(this.response);
        window.requestsData.setProviderError(self.name, { message: errorBody.message, status: this.status, details: errorBody && errorBody.errors ? errorBody.errors[0].message : this.response });
        return;
      }

      const body = JSON.parse(this.response);

      window.requestsData.mergeProviderData(self.name, body.items.map(item => (self._prepareData(item))));
    };

    request.onerror = function(event) {
      window.requestsData.setProviderError(self.name, { message: "Error happened", status: event.target.status, details: "" });
      // window.requestsData.setProviderData(self.name, []);
    };

    request.ontimeout = function() {
      window.requestsData.setProviderError(self.name, { message: "Timeout error", status: "", details: "" });
      // window.requestsData.setProviderData(self.name, []);
    }

    request.send();
  }

  _getTeamsReviewRequested() {
    let self = this;
    const request = new XMLHttpRequest();
    request.open('GET', self.userTeamsUrl, true);
    request.setRequestHeader("Authorization", self._authorization());
    request.setRequestHeader("Accept", "application/vnd.github.v3+json");

    request.onload = function() {
      if (this.status < 200 || this.status >= 400) {
        return;
      }

      const body = JSON.parse(this.response);

      body.map(team => {
        let teamName = `${team.organization.login}/${team.slug}`;

        self._getTeamReviewRequested(teamName);
      })
    };

    request.send();
  }

  _getTeamReviewRequested(teamName) {
    let self = this;
    const request = new XMLHttpRequest();
    request.open('GET', self._urlForTeam(teamName), true);
    request.setRequestHeader("Authorization", self._authorization());
    request.setRequestHeader("Accept", "application/vnd.github.v3+json");

    request.onload = function() {
      if (this.status < 200 || this.status >= 400) {
        return;
      }

      const body = JSON.parse(this.response);

      let data = [];

      body.items.forEach(item => {
        if (item.user.login !== self.configuration.username) data.push(self._prepareData(item));
      })

      window.requestsData.mergeProviderData(self.name, data);
    };

    request.send();
  }
}

