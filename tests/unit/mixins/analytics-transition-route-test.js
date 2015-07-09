import Ember from 'ember';
import AnalyticsTransitionRouteMixin from '../../../mixins/analytics-transition-route';
import { module, test } from 'qunit';

module('Unit | Mixin | analytics transition route');

// Replace this with your real tests.
test('it works', function(assert) {
  var AnalyticsTransitionRouteObject = Ember.Object.extend(AnalyticsTransitionRouteMixin);
  var subject = AnalyticsTransitionRouteObject.create();
  assert.ok(subject);
});
