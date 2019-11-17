class RequestsData {
  constructor() {
    this.providers = {};
    this.loading = {};
  }

  items() {
    let items = [];

    Object.keys(this.providers).forEach(key => {
      items.concat(this.providers[key])
    });

    return items
  }

  length() {
    return this.items().length;
  }

  forEach(callback) {
    return this.items().forEach(callback)
  }

  setProviderData(provider, data) {
    this.setProviderLoaded(provider);
    this.providers[provider] = data
  }

  isLoading() {
    return Object.keys(this.loading).length > 0
  }

  setProviderLoading(provider) {
    this.loading[provider] = true
  }

  setProviderLoaded(provider) {
    delete this.loading[provider]
  }
}
