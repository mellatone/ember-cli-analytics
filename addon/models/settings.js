import LocalStorageObject from 'ember-local-storage/local/object';

export default LocalStorageObject.extend({
  storageKey: 'ember-cli-analytics',

  initialContent: {
    debug: false,
    userId: null
  },

});