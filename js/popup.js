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
          <strong>${""}</strong>
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

function openAllPRsButton() {
  return `
<li>
    <div class="all-prs-button" id="all-prs-button">
      <div class="wrapper">
        <span class="title">Open all PR's in new tabs</span>
      </div>
    </div>
</li>
  `
}

function openAllPRs() {
  backgrounds.requestsData.forEach(item => chrome.tabs.create({ url: item.html_url }));
}

function updateGithubView() {
  const github = document.getElementById("github");
  let requests = [];

  if (backgrounds.requestsData.length === 0) {
    github.innerHTML = `
<div class="you-are-doing-well">@<b>${backgrounds.githubConfigs.username}</b> you are doing really well!</div>
    `;
  } else {
    backgrounds.requestsData.forEach(item => requests.push(notificationTemplate(item)));

    github.innerHTML = `
<ul class="requests">
  ${backgrounds.requestsData.length > 1 ? openAllPRsButton() : ""}
  ${requests.join("")}
</ul>
`;

    if (backgrounds.requestsData.length > 1) {
      document.getElementById("all-prs-button").addEventListener("click", openAllPRs);
    }
  }
}

loadGithubConfigsFromStorage(() => requestReviewRequests(() => {
  updateGithubView();
}));
