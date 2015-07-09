import Ember from 'ember';
const { on } = Ember;

export default Ember.Mixin.create({

  analytics: Ember.inject.service(),

  notifyTransition: on('didTransition', function() {
    this.get("analytics").notifyTransition(this.get("url"));
  }),

});
