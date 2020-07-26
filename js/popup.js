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

  showWithErrors(items, errors) {
    const reviewRequests = document.getElementById("review-requests");

    if (items.length === 0) {
      reviewRequests.innerHTML = this._youAreCool(errors);
    } else {
      reviewRequests.innerHTML = this._notifications(items, errors);
      this._allPRsListener(items);
    }
  }

  _youAreCool(errors) {
    let names = [];
    let self = this;
    let gu = backgrounds.githubConfigs.username;
    let au = backgrounds.azureConfigs.user;
    if (gu !== undefined && gu !== null && gu !== "") names.push(gu);
    if (au !== undefined && au !== null && au !== "" && au !== gu) names.push(au);

    if (errors.length === 0) {
      return `<div class="you-are-doing-well">@<b>${names[0]}</b> you are doing really well!</div>`
    } else {
      let problems = [];
      errors.forEach(error => problems.push(self._error(error)));
      return `
        <div class="you-are-doing-well">
          @<b>${names[0]}</b> you have some problems, despite this are doing really well!
         </div>
        <ul class="requests">
          ${problems.join("")}
        </ul>`
    }

  }

  _allPRsListener(items) {
    if (items.length < 2) return;

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

  _notifications(items, errors) {
    let self = this;
    let requests = [];
    let problems = [];

    items.forEach(item => requests.push(self._notification(item)));
    errors.forEach(error => problems.push(self._error(error)));

      return `
<ul class="requests">
  ${problems.join("")}
  ${items.length > 1 ? this._topButton() : ""}
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
          <a href="${item.htmlUrl}" target="_blank">${item.title}</a><br>
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

  _error(error) {
    return `
<li class="item error">
    <div class="notify">
      <div class="header-wrapper">
        <span class="title">${error.provider}</span>
        <span class="notifications">${error.status}</span>
      </div>
      <div class="content-wrapper">
        <div class="floatleft floatleft-0-padding">
          <img src="${ error.provider === "azure" ? "/img/azure-git.png" : "/img/icon_128.png" }" />
        </div>
        <div class="floatleft pdtop">
          <a href="javascript:void(0);" target="_blank">${error.message}</a><br>
          <strong>${error.details}</strong>
        </div>
        <div class="floatright">
        </div>
      </div>
    </div>
</li>`
  }

}
