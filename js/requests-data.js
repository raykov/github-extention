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
      items = items.concat(Object.values(this.providers[key]));
      // items = Object.assign({}, items, this.providers[key]);
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

  mergeProviderData(provider, data) {
    this.setProviderLoaded(provider);

    this.providers[provider] = Object.assign({}, this.providers[provider], data);

    this._updateViews();
  }

  resetProviderData(provider) {
    this.setProviderLoaded(provider);
    this.providers[provider] = {};
  }

  setProviderError(provider, error) {
    this.setProviderLoaded(provider);
    this.errors[provider] = error;

    this._updateViews();
  }

  _updateViews() {
    if (this.isLoading()) return;

    let errors = this._errors();
    let items = this.items();

    if (Object.keys(this.errors).length !== 0) {
      this._errorBadge(errors);
    } else {
      this._updateBadge(items);
    }

    this._notifications(items);
    this._updatePopupWithErrors(items, errors);
  }

  isLoading() {
    return Object.keys(this.loading).length > 0
  }

  setLoadingBadge() {
    this.badge.loading();
  }

  setProviderLoading(provider) {
    if (this.loading[provider] === undefined) this.loading[provider] = 0;
    this.loading[provider] ++;
  }

  setProviderLoaded(provider) {
    if (this.loading[provider] > 0) this.loading[provider] --;
    if (this.loading[provider] < 1) delete this.loading[provider];
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

  _errorBadge(errors) {
    if (this.badge === undefined) return;
    if (this.isLoading()) return;

    this.badge.error(errors)
  }

  _updatePopupWithErrors(items, errors) {
    if (this.popup === undefined) return;
    if (this.isLoading()) return;

    this.popup.showWithErrors(items, errors);
  }

  _errors() {
    let errors = [];

    Object.keys(this.errors).forEach(key => {
      let err = this.errors[key];

      errors.push(
        {
          provider: key,
          status: err.status,
          message: err.message,
          details: err.details
        }
      );
    });

    return errors;
  }
}

window.requestsData = new RequestsData();
