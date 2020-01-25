"use strict";

var EventEmitter = require('events').EventEmitter
  , async = require('async')
  , retry = require('retry')
  , pathy = require('path')
  , fs = require('fs');

/**
 * Watch for file changes.
 *
 * @constructor
 * @param {Array} files
 */

function Notify (files) {
  this.FSWatchers = {};       // stores the watchers
  this.FStats = {};           // latest file stats
  this.retry = {};            // files we are retrying

  this.maxRetries = 10;       // amount of retries we can do per file

  if (files) this.add(files);
}

Notify.prototype.__proto__ = EventEmitter.prototype;

/**
 * Add files that need to be watched for changes. It filters out all non
 * existing paths from the array and it currently does not give a warning for
 * that. So make sure that your stuff is in place.
 *
 * @param {Array} files files to watch
 * @api public
 */

Notify.prototype.add = function add(files) {
  var self = this;

  // edge case where files isn't an array
  if (!Array.isArray(files)) files = [files];

  // filter out any non existing files
  async.filter(files, fs.exists, function (files) {
    files.forEach(self.watch, self);
  });

  return this;
};

/**
 * Close the file notifications.
 *
 * @api public
 */

Notify.prototype.close = function close() {
  var watcher, FSWatcher;

  // close all FSWatches
  for (watcher in this.FSWatchers) {
    FSWatcher = this.FSWatchers[watcher];
    FSWatcher.removeAllListeners();

    if ('close' in FSWatcher) FSWatcher.close();
  }

  // release the watches from memory
  this.FSWatchers = {};
  this.FStats = {};

  this.emit('close');
  return this;
};

/**
 * Start watching the path for changes.
 *
 * @param {String} path
 * @api private
 */

Notify.prototype.watch = function watch(path) {
  var self = this
    , FSWatcher;

  // resolve the path this allows us to prevent duplicates of ./index.js and
  // index.js
  path = pathy.resolve(path);

  // check for duplicates
  if (this.FSWatchers[path]) return this;

  // update the fs stat
  fs.stat(path, function stats(err, stat) {
    if (stat) self.FStats[path] = stat;
  });

  // store the file watcher and add the path to where we are watching, this does
  // create a hidden class for it.. So it's a bit slower, but we need an easy
  // way to find the path for the watcher
  FSWatcher = this.FSWatchers[path] = fs.watch(path);
  FSWatcher.path = path;

  // add the FSWatcher event listeners
  FSWatcher.on('change', this.change.bind(this, FSWatcher));
  FSWatcher.on('error', this.error.bind(this, FSWatcher));

  return this;
};

/**
 * Manually search for file changes.
 *
 * @param {FSWatcher} FSWatcher
 * @param {String} event the name of the event
 * @api public
 */

Notify.prototype.manually = function manually(FSWatcher, event) {
  var self = this
    , files = FSWatcher && FSWatcher.path
        ? [FSWatcher.path]
        : Object.keys(this.FStats);

  // loop over the files and compare the fs.Stat's
  files.forEach(function test(file) {
    var current = self.FStats[file];
    if (!current) return;

    // make sure that the file we are going to check actually exists.. or we
    // will get a failed fs.stat operation
    self.ensure(file, function existance(exists) {
      if (!exists) return;

      fs.stat(file, function stats(err, stat) {
        if (!stat || err) return;

        // check if the modification time has changed
        if (+current.mtime !== +stat.mtime) {
          self.emit('change', file, event);
        }
      });
    });
  });

  return this;
};

/**
 * Re-attach the watch process.
 *
 * @api private
 */

Notify.prototype.reset = function reset(path) {
  var self = this
    , FSWatcher = this.FSWatchers[path];

  // close it
  if (FSWatcher) {
    FSWatcher.close();
    FSWatcher.removeAllListeners();
  }

  // clear it from our queue
  delete this.FSWatchers[path];
  delete this.FStats[path];

  // check if we already have a retry operation running, as multiple events can
  // trigger this call..
  if (this.retry[path]) return this;

  this.retry[path] = true;
  return this.ensure(path, function existance(exists) {
    delete self.retry[path];

    if (!exists) {
      return self.emit('error', new Error('File ' + path + ' is gone'), path);
    }

    self.watch(path);
  });
};

/**
 * Small helper function to ensure that a file available.. As IDE's could be
 * writing the new result to a new file, remove the current file and put the new
 * file in to place. So during that operation it could be that we do a fs.stat
 * and get a missing file.
 *
 * It could still happen here.. but it's less likely that the file is removed
 * after we have detected it's existance again.
 *
 * @param {String} path
 * @param {Function} fn
 * @api private
 */

Notify.prototype.ensure = function ensure(path, fn) {
  var operation = retry.operation({
      retries: this.maxRetries
    , factor: 3
    , minTimeout: 100
    , maxTimeout: 60 * 100
    , randomize: true
  });

  // do some fault tolerant existance checking
  operation.attempt(function attempt() {
    fs.exists(path, function existance(exists) {
      // we are using .exists, and that doens't return an error just a boolean,
      // so we need to create a fake error object for your retry operation
      var fakeErr = exists ? undefined : new Error();
      if (operation.retry(fakeErr)) return;

      fn(exists);
    });
  });

  return this;
};

/**
 * A file change has been triggered.
 *
 * @param {FSWatcher} FSWatcher
 * @param {String} event changed, renamed
 * @param {String} filename filename of the change
 * @api private
 */

Notify.prototype.change = function change(FSWatcher, event, filename) {
  if (!filename) return this.manually(FSWatcher, event).reset(FSWatcher.path);

  this.emit('change', filename, event, FSWatcher.path);
  this.reset(FSWatcher.path);

  return this;
};

/**
 * Handle watching errors.
 *
 * @param {FSWatcher} FSWatcher
 * @param {Error} err
 * @api private
 */

Notify.prototype.error = function error(FSWatcher, err) {
  return this.reset(FSWatcher.path);
};

// expose the notifier
module.exports = Notify;

/**
 * Expose a fs.watch that doesn't suck hairy monkey balls.
 *
 * @param {String} file file to watch
 * @param {Function} callback callback
 * @api public
 */

Notify.watch = function watch(file, callback) {
  var notification = new Notify([file]);

  return notification.on('change', callback);
};

/**
 * Expose version number.
 *
 * @type {String}
 * @api private
 */

Notify.version = require('./package.json').version;
