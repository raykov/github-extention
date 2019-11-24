class RequestsData {
  constructor() {
    this.providers = {};
    this.errors = {};
    this.loading = {};
    this.badge = new Badge();
    if (typeof Notifications !== "undefined") this.notifications = new Notifications();
    if (typeof Popup !== "undefined") this.popup = new Popup();
  }

  load() {
    this.providers = {};
    this.errors = {};
    this.loading = {};
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

    this._updateViews();
  }

  setProviderError(provider, error) {
    this.setProviderLoaded(provider);
    this.errors[provider] = error;

    this._updateViews();
  }

  _updateViews() {
    if (this.isLoading()) return;

    if (Object.keys(this.errors).length !== 0) {
      let errors = this._errors();

      this._errorBadge(errors);
      this._errorPopup(errors);
    } else {
      let items = this.items();

      this._updateBadge(items);
      this._notifications(items);
      this._updatePopup(items);
    }
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

  _updateBadge(items) {
    if (this.badge === undefined) return;
    if (this.isLoading()) return;

    this.badge.show(items.length);
  }

  _notifications(items) {
    if (this.notifications === undefined) return;
    if (this.isLoading()) return;

    this.notifications.show(items);
  }

  _updatePopup(items) {
    if (this.popup === undefined) return;
    if (this.isLoading()) return;

    this.popup.show(items);
  }

  _errorBadge(errors) {
    if (this.badge === undefined) return;
    if (this.isLoading()) return;

    this.badge.error(errors)
  }

  _errorPopup(errors) {
    if (this.popup === undefined) return;
    if (this.isLoading()) return;

    this.popup.error(errors)
  }

  _errors() {
    let errors = [];

    Object.keys(this.errors).forEach(key => {
      let err = this.errors[key];

      errors.push(`${key}: Status: ${err.status} | ${err.message} | ${err.details}`);
    });

    return errors;
  }
}

window.requestsData = new RequestsData();
