function notificationTemplate(pullRequest) {
  return `
<li class="item">
    <div class="notify">
      <div class="header-wrapper">
        <span class="title">${pullRequest.repo}</span>
        <span class="notifications">${pullRequest.userLogin}</span>
      </div>
      <div class="content-wrapper">
        <div class="floatleft floatleft-0-padding">
          <img src="${pullRequest.userAvatarUrl}" />
        </div>
        <div class="floatleft pdtop">
          <a href="${pullRequest.htmlUrl}" target="_blank">${pullRequest.title}</a><BR>
          <strong>${timeAgo(pullRequest.createdAt)}</strong>
        </div>
        <div class="floatright">
          <a href="${pullRequest.htmlUrl}" target="_blank">
            <span class="number">
              <img src="${ pullRequest.provider === "azure" ? "/img/azure-git.png" : "/img/icon_128.png" }" />
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
  backgrounds.requestsData.forEach(item => chrome.tabs.create({ url: item.htmlUrl }));
}

function updateReviewRequestsView() {
  const reviewRequests = document.getElementById("review-requests");
  let requests = [];

  if (backgrounds.requestsData.length() === 0) {
    reviewRequests.innerHTML = `
<div class="you-are-doing-well">@<b>${backgrounds.githubConfigs.username}</b> you are doing really well!</div>
    `;
  } else {
    backgrounds.requestsData.forEach(item => requests.push(notificationTemplate(item)));

    reviewRequests.innerHTML = `
<ul class="requests">
  ${backgrounds.requestsData.length() > 1 ? openAllPRsButton() : ""}
  ${requests.join("")}
</ul>
`;

    if (backgrounds.requestsData.length() > 1) {
      document.getElementById("all-prs-button").addEventListener("click", openAllPRs);
    }
  }
}

function updateReviewRequestsViewWithError(status) {
  let error_message;

  switch (status) {
    case 422:
      error_message = "Something went wrong. Please check your username and/or token.";
      break;
    default:
      error_message = "Something went wrong.";
      break;
  }

  const reviewRequests = document.getElementById("review-requests");
  reviewRequests.innerHTML = `<div class="errors">${error_message}</div>`;
}

loadConfigsFromStorage(() => requestReviewRequests(() => {
  updateReviewRequestsView();
}, updateReviewRequestsViewWithError));
