import Ember from 'ember';

export default {
  name: 'analytics-track-errors',
  initialize: function(app) {
    var analytics = app.container.lookup('service:analytics');
    if(!analytics.get('trackErrors')) {
      return;
    }
    Ember.onerror = function(error) {
      console.error(error);
      var url = window.location.pathname;
      analytics.notifyError(url, error);
    };
  }
};
