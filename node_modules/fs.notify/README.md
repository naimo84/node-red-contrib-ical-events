# fs.notify

**fs.notify** was born out of annoyance. The state of the fs#watch API in
Node.js is sad, it assumes that you as developer build your own abstraction on
top of it, because it basically can't guarantee file names or that it even works
on all platforms. And all other "simple" watching modules had to much bugs and
performance issues. oh and it pleases my
[NIH](http://en.wikipedia.org/wiki/Not_invented_here) syndrome.

## tl;dr

**fs.notify** is file watching module for Node.js that doesn't suck hairy monkey
balls and actually works.

## API

```js
var Notify = require('fs.notify');

var files = [
  '/path/to/file',
  '/file/i/want/to/watch'
];

var notifications = new Notify(files);
notifications.on('change', function (file, event, path) {
  console.log('caught a ' + event + ' event on ' + path);
});

// if you want to add more files you can use the
notifications.add([path, morepaths]);

// kill everything
notifications.close();
```

## LICENSE (MIT)

Copyright (c) 2012 Observe.it (http://observe.it) <opensource@observe.it>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions: 

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
