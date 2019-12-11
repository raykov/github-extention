class Badge {
  constructor() {
    if (!!Badge.instance) {
      return Badge.instance;
    }

    Badge.instance = this;

    return this;
  }

  loading() {
    this.set(
      "O_O",
      "Checking for new PR's",
      this.colors.black
    )
  }

  error(errors) {
    this.set(
      "Error",
      errors.join("\n"),
      this.colors.red
    )
  }

  show(count) {
    let title;
    let color;

    switch(count) {
      case 0:
        title = "No new code review requests";
        color = this.colors.black;
        break;
      case 1:
        title = "One new code review request";
        color = this.colors.red;
        break;
      default:
        title = `${count} new code review requests`;
        color = this.colors.red;
        break;
    }

    this.set(
      count > 0 ? `${count}` : "",
      title,
      color
    )
  }

  async set(text, title, color) {
    chrome.browserAction.setBadgeText({ text: text });
    chrome.browserAction.setTitle({ title: title });
    chrome.browserAction.setBadgeBackgroundColor({ color: color });
  }

  colors = {
    red: [255,0,0, 255],
    black: [0,0,0, 255]
  }
}
