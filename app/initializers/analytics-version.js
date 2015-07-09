import Ember from 'ember';
import ENV from '../config/environment';

export function initialize() {
  Ember.libraries.register('@ampatspell/ember-cli-analytics', ENV['ember-cli-analytics'].version);
}

export default {
  name: 'analytics-version',
  initialize: initialize
};
