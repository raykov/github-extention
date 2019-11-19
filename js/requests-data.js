class RequestsData {
  constructor() {
    this.providers = {};
    this.loading = {};
    this.badge = new Badge();
    this.notifications = new Notifications();
  }

  items() {
    let items = [];

    Object.keys(this.providers).forEach(key => {
      items = items.concat(this.providers[key]);
    });

    return items;
  }

  length() {
    return this.items().length;
  }

  forEach(callback) {
    return this.items().forEach(callback);
  }

  setProviderData(provider, data) {
    this.setProviderLoaded(provider);
    this.providers[provider] = data;

    this._updateBadge();
    this._notifications();
  }

  isLoading() {
    return Object.keys(this.loading).length > 0
  }

  setProviderLoading(provider) {
    this.badge.loading();
    this.loading[provider] = true;
  }

  setProviderLoaded(provider) {
    delete this.loading[provider];
  }

  _updateBadge() {
    if (this.isLoading()) return;

    this.badge.requests(this.length());
  }

  _notifications() {
    if (this.isLoading()) return;

    this.notifications.show(this.items());
  }
}
