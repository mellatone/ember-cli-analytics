# ember-cli-analytics

Basic Google Analytics ember-cli addon.

## Install

    $ npm install @ampatspell/ember-cli-analytics

## Configure

Subclass analytics service:

    // app/services/analytics.js
    import { Service } from 'analytics';
    import ENV from '../config/environment';

    const app = {
      name: ENV.APP.name,
      version: ENV.APP.version
    };

    const trackingId = ENV.APP.trackingId;

    export default Service.extend({

      trackingId: trackingId,
      trackErrors: true,  // track also errors (sets Ember.onerror)
      app: app,           // only for tracking errors

    });

Add router mixin:

    // app/router.js
    import Ember from 'ember';
    import { AnalyticsTransitionRouterMixin } from 'analytics';

    var Router = Ember.Router.extend(AnalyticsTransitionRouterMixin, {
    });

Add Tracking ID to your production environment configuration and setup content security policy:

    // config/environment.js

    ENV.contentSecurityPolicy: {
      // ...
      'script-src': "'self' www.google-analytics.com",
      'img-src': "'self' www.google-analytics.com"
    },

    if(environment === 'production') {
      ENV.APP.trackingId = 'UA-0000000-00';
    }

If you also want track exceptions (Google Analytics is almost useless for this), set `trackErrors:true` in service subclass and:

    // app/route/application.js
    import Ember from 'ember';

    export default Route.extend(StandaloneRedirectMixin, {

      actions: {
        error: function(error) {
          Ember.onerror(error); // also route errors
          return true;
        }
      }

    });
