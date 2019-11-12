# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.8.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.7.0...v0.8.0) (2019-11-12)


### Bug Fixes

* [#12](https://github.com/naimo84/node-red-contrib-ical-events/issues/12), if no event, send on: false in payload ([bd46d00](https://github.com/naimo84/node-red-contrib-ical-events/commit/bd46d00))


### Features

* [#12](https://github.com/naimo84/node-red-contrib-ical-events/issues/12), output on every tick and output only on changes ([7695ee3](https://github.com/naimo84/node-red-contrib-ical-events/commit/7695ee3))
* [#12](https://github.com/naimo84/node-red-contrib-ical-events/issues/12), regex filter for sensor node ([bbdb26f](https://github.com/naimo84/node-red-contrib-ical-events/commit/bbdb26f))

## [0.7.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.6.0...v0.7.0) (2019-11-10)


### ⚠ BREAKING CHANGES

* output is in payload, not in msg

### Bug Fixes

* issue [#12](https://github.com/naimo84/node-red-contrib-ical-events/issues/12), sensor output to payload ([22ed787](https://github.com/naimo84/node-red-contrib-ical-events/commit/22ed787))


### Features

* filehandling ([842310d](https://github.com/naimo84/node-red-contrib-ical-events/commit/842310d))

## [0.6.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.5.2...v0.6.0) (2019-11-07)


### Features

* first try to implement sensor node ([c93b273](https://github.com/naimo84/node-red-contrib-ical-events/commit/c93b273))
* sensor node final ([9b7fb6c](https://github.com/naimo84/node-red-contrib-ical-events/commit/9b7fb6c))

### [0.5.2](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.5.1...v0.5.2) (2019-10-31)


### Bug Fixes

* forgot gulp task, js was not built ([1dbbeb3](https://github.com/naimo84/node-red-contrib-ical-events/commit/1dbbeb3))

### [0.5.1](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.5.0...v0.5.1) (2019-10-30)


### Bug Fixes

* built ([ea55e57](https://github.com/naimo84/node-red-contrib-ical-events/commit/ea55e57))
* icloud config also for events ([6fe7854](https://github.com/naimo84/node-red-contrib-ical-events/commit/6fe7854))


### Features

* handle deleted calendar entries ([60e4738](https://github.com/naimo84/node-red-contrib-ical-events/commit/60e4738))

## [0.5.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.4.4...v0.5.0) (2019-10-29)


### Features

* additional end events ([e05caad](https://github.com/naimo84/node-red-contrib-ical-events/commit/e05caad))
* first try to implement icloud, issue [#8](https://github.com/naimo84/node-red-contrib-ical-events/issues/8) ([7b1744c](https://github.com/naimo84/node-red-contrib-ical-events/commit/7b1744c))

### [0.4.4](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.4.3...v0.4.4) (2019-10-27)


### Bug Fixes

* issue [#6](https://github.com/naimo84/node-red-contrib-ical-events/issues/6), Calendar Event fails to start ([14f6f4d](https://github.com/naimo84/node-red-contrib-ical-events/commit/14f6f4d))

### [0.4.3](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.4.2...v0.4.3) (2019-10-24)


### Features

* issue [#4](https://github.com/naimo84/node-red-contrib-ical-events/issues/4) and [#5](https://github.com/naimo84/node-red-contrib-ical-events/issues/5), supporting RRules ([1051ed6](https://github.com/naimo84/node-red-contrib-ical-events/commit/1051ed6))

### [0.4.2](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.4.1...v0.4.2) (2019-10-24)


### Bug Fixes

* issue [#5](https://github.com/naimo84/node-red-contrib-ical-events/issues/5), Repeating Events are Ignored ([3de7d5e](https://github.com/naimo84/node-red-contrib-ical-events/commit/3de7d5e))
* updated readme ([d989bb0](https://github.com/naimo84/node-red-contrib-ical-events/commit/d989bb0))

### [0.4.1](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.4.0...v0.4.1) (2019-10-21)


### Features

* caldav also implemented for events ([ce70782](https://github.com/naimo84/node-red-contrib-ical-events/commit/ce70782))

## [0.4.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.3.1...v0.4.0) (2019-10-20)

### [0.3.1](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.3.0...v0.3.1) (2019-10-20)


### Features

* expand CalDav functionality, fix issue [#3](https://github.com/naimo84/node-red-contrib-ical-events/issues/3) ([057ce72](https://github.com/naimo84/node-red-contrib-ical-events/commit/057ce72))

## [0.3.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.2.3...v0.3.0) (2019-10-16)


### Bug Fixes

* issue [#3](https://github.com/naimo84/node-red-contrib-ical-events/issues/3), CalDav with Basic Auth ([608d489](https://github.com/naimo84/node-red-contrib-ical-events/commit/608d489))

### [0.2.3](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.2.2...v0.2.3) (2019-10-15)


### Bug Fixes

* issue [#4](https://github.com/naimo84/node-red-contrib-ical-events/issues/4), make preview days configurable ([7a58486](https://github.com/naimo84/node-red-contrib-ical-events/commit/7a58486))

### 0.2.2 (2019-10-11)


### Bug Fixes

* [#2](https://github.com/naimo84/node-red-contrib-ical-events/issues/2), Events are checked by input OR cron ([8ec3e14](https://github.com/naimo84/node-red-contrib-ical-events/commit/8ec3e14))


### Features

* standard-version ([1977f16](https://github.com/naimo84/node-red-contrib-ical-events/commit/1977f16))

<a name="0.0.1"></a>
## [0.0.1] (2019-08-08)

### Features

* **ical-events:** initial commit