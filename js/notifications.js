class Notifications {
  constructor() {
    if (!!Notifications.instance) {
      return Notifications.instance;
    }

    Notifications.instance = this;

    return this;
  }

  show(items){
    let self = this;

    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      items.forEach(item => self._show(item))
    } else if (Notification.permission !== "denied" || Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") items.forEach(item => self._show(item))
      });
    }
  }

  _show(item) {
    const title = `${item.repo} :: ${item.userLogin}`;
    const body = `${item.title}`;
    const tag = `${item.id}-${item.nodeId}-github-notification`;

    let notification = new Notification(
      title,
      {
        actions: [],
        badge: "/img/icon_128.png",
        body: body,
        tag: tag,
        icon: item.userAvatarUrl,
        image: "/img/icon_128.png",
      }
    );

    notification.onclick = event => {
      event.preventDefault();
      window.open(item.htmlUrl, "_blank");
    };
  }

}

// function triggerNotifications() {
//   backgrounds.requestsData.forEach(item => triggerNotification(item))
// }
//
// function triggerNotification(item) {
//   if (!("Notification" in window)) {
//     console.log("This browser does not support desktop notification");
//   } else if (Notification.permission === "granted") {
//     notification(item)
//   } else if (Notification.permission !== "denied" || Notification.permission === "default") {
//     Notification.requestPermission().then(permission => {
//       if (permission === "granted") {
//         notification(item)
//       }
//     });
//   }
// }
//
// function notification(item) {
//   const title = `${item.repo} :: ${item.userLogin}`;
//   const body = `${item.title}`;
//   const tag = `${item.id}-${item.nodeId}-github-notification`;
//
//   let notification = new Notification(
//     title,
//     {
//       actions: [],
//       badge: "/img/icon_128.png",
//       body: body,
//       tag: tag,
//       icon: item.userAvatarUrl,
//       image: "/img/icon_128.png",
//     }
//   );
//
//   notification.onclick = event => {
//     event.preventDefault();
//     window.open(item.htmlUrl, "_blank");
//   };
// }
