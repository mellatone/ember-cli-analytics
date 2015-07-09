'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    'ember-cli-analytics': {
      version: require('../package.json').version
    }
  };
};
