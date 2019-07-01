function triggerNotification(item) {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    notification(item)
  } else if (Notification.permission !== "denied" || Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        notification(item)
      }
    });
  }
}

function notification(item) {
  const repo = item.repository_url.substring(item.repository_url.lastIndexOf("/") + 1);
  const title = `${repo} :: ${item.user.login}`;
  const body = `${item.title}`;
  const tag = `${item.id}-${item.node_id}-github-notification`;

  let notification = new Notification(
    title,
    {
      actions: [],
      badge: "/img/icon_128.png",
      body: body,
      tag: tag,
      icon: item.user.avatar_url,
      image: "/img/icon_128.png",
    }
  );

  notification.onclick = event => {
    event.preventDefault();
    window.open(item.html_url, "_blank");
  };
}

