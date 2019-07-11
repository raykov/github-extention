function requestReviewRequests(callback = () => {}) {
  const baseUrl = "https://api.github.com/search/issues";
  const url = `${baseUrl}?q=is:pr+is:open+review-requested:${backgrounds.githubConfigs.username}`;

  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.setRequestHeader("Authorization", `token ${backgrounds.githubConfigs.authToken}`);

  request.onload = function() {
    setTimeout(
      () => { requestReviewRequests(callback) },
      backgrounds.githubConfigs.updateEvery * 1000
    );

    if (this.status < 200 || this.status >= 400) {
      return;
    }

    const body = JSON.parse(this.response);

    backgrounds.requestsData = body.items;

    callback();
  };

  request.send();
}
