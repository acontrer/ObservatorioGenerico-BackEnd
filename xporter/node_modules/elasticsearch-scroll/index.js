'use strict';

var curry = require('lodash.curry');

module.exports = function (client) {
  var scrollToEnd = curry(function (resultTransform, results, res) {
    results = results.concat(resultTransform(res.hits.hits));

    if (results.length < res.hits.total) {
      return client.scroll({
        /* eslint-disable no-underscore-dangle */
        scrollId: res._scroll_id,
        scroll: '30s'
        /* eslint-enable no-underscore-dangle */
      })
        .then(scrollToEnd(resultTransform, results));
    }
    else {
      return results;
    }
  });

  return scrollToEnd;
};
