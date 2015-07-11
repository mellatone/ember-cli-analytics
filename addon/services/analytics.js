import Ember from 'ember';
import DS from 'ember-data';
import Settings from '../models/settings';

const {
  computed
} = Ember;

export default Ember.Service.extend({

  app: {
    name: 'untitled',
    version: '0.0.0',
  },

  trackingId: null,
  trackErrors: false,

  settings: computed(function() {
    this.__settings = this.__settings || Settings.create();
    return this.__settings;
  }),

  userId: computed('settings.userId', {
    get: function() {
      return this.get('settings.userId');
    },
    set: function(key, value) {
      this.set('settings.userId', value);
      return value;
    }
  }),

  insertScript: function(id) {
    this.log('ember-cli-analytics trackingID', id);

    var userId = this.get('settings.userId');
    this.log('ember-cli-analytics initial userId', userId);

    if(!id) {
      return;
    }

    /* jshint ignore:start */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    /* jshint ignore:end */

    /* global ga */
    ga('create', id, userId || 'auto');
  },

  log: function() {
    if(!this.get('settings.debug')) {
      return;
    }
    console.debug.apply(console, arguments);
  },

  userIdDidChange: function() {
    var userId = this.get('settings.userId');
    this.log('ember-cli-analytics userId', userId);
    if(!window.ga || !userId) {
      return;
    }
    ga('set', 'userId', userId);
  }.observes('settings.userId'),

  prepare: function() {
    var id = this.get('trackingId');
    this.insertScript(id);
  }.on('init'),

  send: function(type, args) {
    this.log('ember-cli-analytics send', type, args);
    if(!window.ga) {
      return;
    }
    ga('send', type, args);
  },

  event: function(category, action, label) {
    this.log('ember-cli-analytics send event', category, action, label);
    if(!window.ga) {
      return;
    }
    ga('send', 'event', category, action, label);
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