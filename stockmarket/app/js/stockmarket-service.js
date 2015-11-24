'use strict';

class StockMarketService {
  constructor(appToken, bus) {
    var self = this;
    var url = "http://stockmarket.streamdata.io/prices";

    this.bus = bus;
    this.streamdata =
      streamdataio.createEventSource(url, appToken, [], null);

    this.streamdata.onOpen(function() {
      self.data = [];
      self.bus.trigger('connectionOpenStocksEvent');

    }).onData(function(data) {
      self.data = data;
      self.bus.trigger('newStocksEvent', data);

    }).onPatch(function(patches) {
      jsonpatch.apply(self.data, patches);
      self.bus.trigger('newStocksEvent', self.data);

    }).onError(function(error) {
      console.error(error);
      self.bus.trigger('errorStocksEvent', error);
      self.streamdata.close();

    });
  }

  fetchJson() {
    this.streamdata.open();
  }

  stopFetchJson() {
    this.streamdata.close();
  }
}
