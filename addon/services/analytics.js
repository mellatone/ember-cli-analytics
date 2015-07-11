import Ember from 'ember';
import DS from 'ember-data';

// http://diveintohtml5.info/storage.html
function hasLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function localStorageLoad(key) {
  if(hasLocalStorage()) {
    try {
      return window.localStorage.getItem(key);
    } catch(e) {
      console.error("Failed to load " + key + " from local storage", e);
    }
  }
}

function localStorageSave(key, value) {
  if(hasLocalStorage()) {
    try {
      window.localStorage.setItem(key, value);
    } catch(e) {
      console.error("Failed to save " + key + " in local storage", e);
    }
  }
}

export default Ember.Service.extend({

  app: {
    name: 'untitled',
    version: '0.0.0',
  },
  trackingId: null,
  trackErrors: false,
  debug: false,

  userId: null,
  userIdLocalStorageKey: 'ember-cli-analytics/userid',

  insertScript: function(id) {
    if(!id) {
      return;
    }

    /* jshint ignore:start */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    /* jshint ignore:end */

    var userId = this.get('userId');

    /* global ga */
    ga('create', id, userId || 'auto');
  },

  userIdDidChange: function() {
    var userId = this.get('userId');
    this.saveUserId();

    if(this.get('debug')) {
      console.debug('ember-cli-analytics userID', userId);
    }

    if(!window.ga || !userId) {
      return;
    }
    
    ga('set', 'userId', userId);
  }.observes('userId'),

  loadUserId: function() {
    return localStorageLoad(this.get('userIdLocalStorageKey'));
  },

  saveUserId: function() {
    localStorageSave(this.get('userIdLocalStorageKey'), this.get('userId'));
  },

  prepare: function() {
    var id = this.get('trackingId');
    
    if(this.get('debug')) {
      console.debug('ember-cli-analytics trackingID', id);
    }
    
    if(!this.get('userId')) {
      var userId = this.loadUserId();
      this.set('userId', userId);
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

  event: function(category, action, label) {
    if(this.get('debug')) {
      console.debug('ember-cli-analytics send event', category, action, label);
    }
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