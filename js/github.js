function requestReviewRequests(callback = () => {}, onError = status => {}) {
  const baseUrl = "https://api.github.com/search/issues";
  const url = `${baseUrl}?q=${requestParams()}`;

  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.setRequestHeader("Authorization", `token ${backgrounds.githubConfigs.authToken}`);

  request.onload = function() {
    if (this.status < 200 || this.status >= 400) {
      onError(this.status);
      return;
    }

    const body = JSON.parse(this.response);

    backgrounds.requestsData = body.items;
    callback();
  };

  request.send();
}

function requestParams(){
  let data = [];
  // is:pr+is:open+review-requested:${backgrounds.githubConfigs.username}+user:raykov

  data.push(`is:${backgrounds.githubConfigs.is}`);
  data.push(`state:${backgrounds.githubConfigs.state}`);
  data.push(`review-requested:${backgrounds.githubConfigs.username}`);
  if (backgrounds.githubConfigs.user !== "") data.push(`user:${backgrounds.githubConfigs.user}`);
  if (backgrounds.githubConfigs.repo !== "") data.push(`repo:${backgrounds.githubConfigs.repo}`);
  if (backgrounds.githubConfigs.author !== "") data.push(`author:${backgrounds.githubConfigs.author}`);
  if (backgrounds.githubConfigs.mentions !== "") data.push(`mentions:${backgrounds.githubConfigs.mentions}`);

  return data.join("+")
}
