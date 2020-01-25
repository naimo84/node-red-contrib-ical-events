# should-sinon
[Sinon.js](http://sinonjs.org/) bindings for should.js.

## Install

```bash
$ npm install should-sinon --save-dev
```

## Example

```js
var sinon = require('sinon');
var should = require('should');
require('should-sinon');

it('should get number of calls', function() {
  var callback = sinon.spy();
  callback();
  callback.should.be.calledOnce();
});
```
