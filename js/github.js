function requestReviewRequests() {
  const baseUrl = "https://api.github.com/search/issues";
  const url = `${baseUrl}?q=is:pr+is:open+review-requested:${backgrounds.githubConfigs.username}`;

  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.setRequestHeader("Authorization", `token ${backgrounds.githubConfigs.authToken}`);

  request.onload = function() {
    setTimeout(requestReviewRequests, 60 * 1000);

    if (this.status < 200 || this.status >= 400) {
      return;
    }

    const body = JSON.parse(this.response);

    updateGithubView(body);
  };

  request.send();
}

function notificationTemplate(item) {
  const repo = item.repository_url.substring(item.repository_url.lastIndexOf("/") + 1);

  return `
<li class="item">
    <div class="notify">
      <div class="header-wrapper">
        <span class="title">${repo}</span>
        <span class="notifications">${item.user.login}</span>
      </div>
      <div class="content-wrapper">
        <div class="floatleft floatleft-0-padding">
          <img src="${item.user.avatar_url}" />
        </div>
        <div class="floatleft pdtop">
          <a href="${item.html_url}" target="_blank">${item.title}</a><BR>
          <strong>${timeago().format(item.created_at)}</strong>
        </div>
        <div class="floatright">
          <a href="${item.html_url}" target="_blank">
            <span class="number">
              <img src="/img/icon_128.png" />
            </span>
          </a>
        </div>
      </div>
    </div>
</li>`
}

function updateGithubView(requestsData) {
  const github = document.getElementById("github");
  let requests = [];

  requestsData.items.forEach(item => requests.push(notificationTemplate(item)));

  github.innerHTML = `<ul class="requests">${requests.join("")}</ul>`;
}

loadGithubConfigsFromStorage(() => { requestReviewRequests(); });
