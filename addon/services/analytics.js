import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Service.extend({

  app: {
    name: 'untitled',
    version: '0.0.0',
  },
  trackingId: null,
  trackErrors: false,
  debug: false,

  insertScript: function(id) {
    /* jshint ignore:start */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    /* jshint ignore:end */

    /* global ga */
    ga('create', id, 'auto');
  },

  prepare: function() {
    var id = this.get('trackingId');
    if(this.get('debug')) {
      console.debug('ember-cli-analytics trackingID', id);
    }
    if(!id) {
      return;
    }
    this.insertScript(id);
  }.on('init'),

  send: function(type, args) {
    if(this.get('debug')) {
      console.debug('ember-cli-analytics send', type, args);
    }
    if(!window.ga) {
      return;
    }
    ga('send', type, args);
  },

  notifyTransition: function(url) {
    this.send('pageview', {
      page: url,
      title: url,
    });
  },

  notifyException: function(url, message) {
    if(!this.get('trackErrors')) {
      return;
    }
    var app = this.get('app');
    this.send('exception', {
      exDescription: message,
      exFatal: true,
      appName: app.name,
      appVersion: app.version
    });
  },

  notifyError: function(url, error) {
    var message;
    if(error instanceof DS.AdapterError) {
      error = error.errors[0];
      message = `AdapterError: ${error.status} ${error.title} ${error.detail}`;
    } else {
      message = error.message;
    }
    this.notifyException(url, message);
  }

});