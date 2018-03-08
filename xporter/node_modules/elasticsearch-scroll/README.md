elasticsearch-scroll
=======
[![Build Status][build-image]][build]

This helps out when you [scan & scroll][scan-scroll]. This manages the
scrolling so that you are returned all of the hits.

Installation
------------

```bash
npm install --save elasticsearch-scroll
```

Usage
-----

If I start with an index `foo` with 20 documents of type `bar`,

```javascript
var elasticsearch = require('elasticsearch'),
  client = new elasticsearch.Client(),
  identity = require('lodash.identity'),
  scrollToEnd = require('../index')(client);

client.search({
  index: 'foo',
  type: 'bar',
  scroll: '30s'
})
  .then(scrollToEnd(identity, []))
  .tap(function (results) {
    console.log(results);
  });
```
will yield an array containing all 20 of your documents. Without `scrollToEnd`
you would just get 10 documents.

API
---

- `module(client)`: a function which accepts an [`elasticsearch`] client and returns
  a function, `scrollToEnd`.
- `scrollToEnd(mapper, initial, response)`: a curried function which takes
  a `mapper` (a function which maps results from elastic search), the `initial`
  value of the results to return and a response from elasticsearch.

Testing
-------

Run [elasticsearch][elasticsearch-install] locally and `npm test`.

[build-image]: https://travis-ci.org/lanetix/node-elasticsearch-scroll.svg?branch=master
[build]: https://travis-ci.org/lanetix/node-elasticsearch-scroll
[scan-scroll]: http://www.elasticsearch.org/guide/en/elasticsearch/guide/current/scan-scroll.html
[elasticsearch-client]: https://www.npmjs.com/package/elasticsearch
[elasticsearch-install]: http://www.elasticsearch.org/overview/elkdownloads/
