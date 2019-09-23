function requestReviewRequestsAzure(callback = () => {}, onError = status => {}) {
  if (backgrounds.azureConfigs.token === "" || backgrounds.azureConfigs.token === null || backgrounds.azureConfigs.token === undefined) {

    callback();
    return
  }

  const baseUrl = "https://dev.azure.com/depositsolutions/_apis/git/pullrequests";
  const url = `${baseUrl}?api-version=5.1&searchCriteria.status=all`;

  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.setRequestHeader("Authorization", `Basic ${window.btoa(backgrounds.azureConfigs.user + ":" + backgrounds.azureConfigs.token)}`);

  request.onload = function() {
    if (this.status < 200 || this.status >= 400) {
      onError(this.status);
      return;
    }

    const body = JSON.parse(this.response);

    const toReview = body["value"].filter(pr => (pr["reviewers"].filter(reviewer => (reviewer["uniqueName"] === backgrounds.azureConfigs.user)).length > 0));

    backgrounds.requestsData.azure = toReview.map(pr => (prepareAzurePr(pr)));

    callback();
  };

  request.send();
}

function prepareAzurePr(pr) {
  return {
    id: pr.pullRequestId,
    nodeId: pr.pullRequestId,
    repo: pr.repository.name,
    userLogin: pr.createdBy.displayName,
    userAvatarUrl: pr.createdBy._links.avatar.href, // pr.createdBy.imageUrl,
    htmlUrl: [
      "https://dev.azure.com",
      encodeURIComponent(backgrounds.azureConfigs.workspace),
      encodeURIComponent(pr.repository.project.name),
      "_git",
      encodeURIComponent(pr.repository.name),
      "pullrequest",
      pr.pullRequestId
    ].join("/"),
    title: pr.title,
    createdAt: pr.creationDate,
    provider: "azure"
  }
}
