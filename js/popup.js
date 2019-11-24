class Popup {
  constructor() {
    if (!!Popup.instance) {
      return Popup.instance;
    }

    Popup.instance = this;

    return this;
  }

  loading() {
    return `<div class="loading">LOADING...</div>`;
  }

  error(errors) {
    // let error_message;
    //
    // switch (status) {
    //   case 422:
    //     error_message = "Something went wrong. Please check your username and/or token.";
    //     break;
    //   default:
    //     error_message = "Something went wrong.";
    //     break;
    // }

    const reviewRequests = document.getElementById("review-requests");
    reviewRequests.innerHTML = `<div class="errors">${errors.join("<br />")}</div>`;
  }

  show(items) {
    const reviewRequests = document.getElementById("review-requests");

    if (items.length === 0) {
      reviewRequests.innerHTML = this._youAreCool();
    } else {
      reviewRequests.innerHTML = this._notifications(items);
      this._allPRsListener(items);
    }
  }

  _youAreCool() {
    let names = [];
    let gu = backgrounds.githubConfigs.username;
    let au = backgrounds.azureConfigs.user;
    if (gu !== undefined && gu !== null && gu !== "") names.push(gu);
    if (au !== undefined && au !== null && au !== "" && au !== gu) names.push(au);

    return `<div class="you-are-doing-well">@<b>${names[0]}</b> you are doing really well!</div>`
  }

  _allPRsListener(items) {
    if (items.length === 0) return;

    document.getElementById("all-prs-button").addEventListener("click", () => {
      items.forEach(item => chrome.tabs.create({ url: item.htmlUrl }));
    });
  }

  _topButton() {
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

  _notifications(items) {
    let self = this;
    let requests = [];

    items.forEach(item => requests.push(self._notification(item)));

      return `
<ul class="requests">
  ${items > 1 ? this._topButton() : ""}
  ${requests.join("")}
</ul>
`;
  }

  _notification(item) {
    return `
<li class="item">
    <div class="notify">
      <div class="header-wrapper">
        <span class="title">${item.repo}</span>
        <span class="notifications">${item.userLogin}</span>
      </div>
      <div class="content-wrapper">
        <div class="floatleft floatleft-0-padding">
          <img src="${item.userAvatarUrl}" />
        </div>
        <div class="floatleft pdtop">
          <a href="${item.htmlUrl}" target="_blank">${item.title}</a><BR>
          <strong>${timeAgo(item.createdAt)}</strong>
        </div>
        <div class="floatright">
          <a href="${item.htmlUrl}" target="_blank">
            <span class="number">
              <img src="${ item.provider === "azure" ? "/img/azure-git.png" : "/img/icon_128.png" }" />
            </span>
          </a>
        </div>
      </div>
    </div>
</li>`
  }

}
