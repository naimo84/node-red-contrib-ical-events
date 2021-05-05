# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.0.0-beta.8](https://github.com/naimo84/node-red-contrib-ical-events/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2021-05-05)


### Bug Fixes

* issue [#86](https://github.com/naimo84/node-red-contrib-ical-events/issues/86), Concurrent / overlapping events ([57d8241](https://github.com/naimo84/node-red-contrib-ical-events/commit/57d82413ab33ee3417857a5232759c0d119a5c56))

## [1.0.0-beta.7](https://github.com/naimo84/node-red-contrib-ical-events/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2021-05-04)


### Bug Fixes

* issue [#87](https://github.com/naimo84/node-red-contrib-ical-events/issues/87), node emits identical message for different events ([1057a7b](https://github.com/naimo84/node-red-contrib-ical-events/commit/1057a7b4974c7943fd8596710c4a40779bf68086))

## [1.0.0-beta.6](https://github.com/naimo84/node-red-contrib-ical-events/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-04-26)


### Bug Fixes

* issue [#86](https://github.com/naimo84/node-red-contrib-ical-events/issues/86), Concurrent / overlapping events ([d1cb7ed](https://github.com/naimo84/node-red-contrib-ical-events/commit/d1cb7ed2abb2ff4088ac86087375d8c27bd172a7))

## [1.0.0-beta.5](https://github.com/naimo84/node-red-contrib-ical-events/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-04-15)


### Features

* add timezone for output ([#84](https://github.com/naimo84/node-red-contrib-ical-events/issues/84)), add luxon ([#79](https://github.com/naimo84/node-red-contrib-ical-events/issues/79)) ([b56821a](https://github.com/naimo84/node-red-contrib-ical-events/commit/b56821aa88f31b4717d7402505124fbf2377d9b6))

## [1.0.0-beta.4](https://github.com/naimo84/node-red-contrib-ical-events/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-03-25)


### Features

* issue [#83](https://github.com/naimo84/node-red-contrib-ical-events/issues/83), combine Response of sensor node ([80490fc](https://github.com/naimo84/node-red-contrib-ical-events/commit/80490fcecc8832a44958c6af3a953b330695e3a5))

## [1.0.0-beta.3](https://github.com/naimo84/node-red-contrib-ical-events/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2021-03-25)


### Bug Fixes

* issue [#78](https://github.com/naimo84/node-red-contrib-ical-events/issues/78), update kalender-events lib to 0.2.4 ([3d3dc7d](https://github.com/naimo84/node-red-contrib-ical-events/commit/3d3dc7dee60f8630acad9dabfefd8b1382f2dd85))

## [1.0.0-beta.2](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.23.0...v1.0.0-beta.2) (2021-02-15)


### Features

* configurable timestamp to check as payload ([71547e3](https://github.com/naimo84/node-red-contrib-ical-events/commit/71547e3a963a5eba80cd606e2fa9a047d2bbdf4f))

## [1.0.0-beta.1](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.22.0...v1.0.0-beta.1) (2021-01-17)


### Features

* display v1 hint, only when credentials were entered ([ff73c38](https://github.com/naimo84/node-red-contrib-ical-events/commit/ff73c3813a126ca47d389ea740cab61adc764c9f))
* outsourced the whole fetching logic into an external library ([4fed9db](https://github.com/naimo84/node-red-contrib-ical-events/commit/4fed9db0a16c507b4d9bdf9151dd3fd7be78b89d))

## [0.23.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.22.0...v0.23.0) (2021-01-17)


### Bug Fixes

* issue [#72](https://github.com/naimo84/node-red-contrib-ical-events/issues/72), set calenderName = config.name if not set ([a7ba7b5](https://github.com/naimo84/node-red-contrib-ical-events/commit/a7ba7b535feab034503e8cfecc180e7681048ea7))
* issue [#76](https://github.com/naimo84/node-red-contrib-ical-events/issues/76), trigger cronjob event in past ([bd381cf](https://github.com/naimo84/node-red-contrib-ical-events/commit/bd381cf35799cb083b2aae7d61b6adcce9b62e6d))
## [1.0.0-beta.1](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.22.0...v1.0.0-beta.1) (2021-01-17)


### Features

* display v1 hint, only when credentials were entered ([ff73c38](https://github.com/naimo84/node-red-contrib-ical-events/commit/ff73c3813a126ca47d389ea740cab61adc764c9f))
* outsourced the whole fetching logic into an external library ([4fed9db](https://github.com/naimo84/node-red-contrib-ical-events/commit/4fed9db0a16c507b4d9bdf9151dd3fd7be78b89d))

### Bug Fixes

* date in past for cronjob ([29c1196](https://github.com/naimo84/node-red-contrib-ical-events/commit/29c1196204b90d277dc1d4135ca05de4a806c56c))

## [0.22.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.21.0...v0.22.0) (2021-01-03)


### Bug Fixes

* issue [#72](https://github.com/naimo84/node-red-contrib-ical-events/issues/72), fetch all concurrent ([f98bd09](https://github.com/naimo84/node-red-contrib-ical-events/commit/f98bd09156d0249957cb460b3331bd18b136f115))
* issue [#72](https://github.com/naimo84/node-red-contrib-ical-events/issues/72), fetch all concurrent ([2a90523](https://github.com/naimo84/node-red-contrib-ical-events/commit/2a90523edc4647170b1ae75f47adbc50c4c6626e))

## [0.21.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.20.0...v0.21.0) (2020-12-26)


### Features

* [#75](https://github.com/naimo84/node-red-contrib-ical-events/issues/75),[#74](https://github.com/naimo84/node-red-contrib-ical-events/issues/74): webcal support ([4d9b062](https://github.com/naimo84/node-red-contrib-ical-events/commit/4d9b062f900088badbbbbd73021b3b7e4adc948c))

## [0.20.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.19.0...v0.20.0) (2020-12-05)


### Features

* [#73](https://github.com/naimo84/node-red-contrib-ical-events/issues/73), categories to payload ([4dd8b4e](https://github.com/naimo84/node-red-contrib-ical-events/commit/4dd8b4e81539aebea3ab7c19da7a03521506b7ee))

## [0.19.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.18.0...v0.19.0) (2020-11-18)


### Features

* issue [#65](https://github.com/naimo84/node-red-contrib-ical-events/issues/65), message in case of failed request ([78850ab](https://github.com/naimo84/node-red-contrib-ical-events/commit/78850ab736751cefd8bcdbd2ff81b572c942a8c7))

## [0.18.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.17.6...v0.18.0) (2020-11-18)

### [0.17.6](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.17.5...v0.17.6) (2020-11-18)


### Features

* [#63](https://github.com/naimo84/node-red-contrib-ical-events/issues/63), filter destination ([09e3cad](https://github.com/naimo84/node-red-contrib-ical-events/commit/09e3cad2b521cec368f3bbbdaa8429778b020a80))
* [#70](https://github.com/naimo84/node-red-contrib-ical-events/issues/70), added app specific password hint ([d6ec8f5](https://github.com/naimo84/node-red-contrib-ical-events/commit/d6ec8f5e1c5800b0544bab8c52200de9aa3e60b1))


### Bug Fixes

*  issue [#69](https://github.com/naimo84/node-red-contrib-ical-events/issues/69), do not trigger Date in past ([39363a9](https://github.com/naimo84/node-red-contrib-ical-events/commit/39363a910c8b2de968d5f04b2b1820bca2c43470))
* issue [#71](https://github.com/naimo84/node-red-contrib-ical-events/issues/71), Sensor duplicate msgid ([a73b998](https://github.com/naimo84/node-red-contrib-ical-events/commit/a73b998bdaab21a0b5a3936cd7c69c3362688125))

### [0.17.5](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.17.3...v0.17.5) (2020-08-28)


### Bug Fixes

* issue [#62](https://github.com/naimo84/node-red-contrib-ical-events/issues/62), events not detected ([c019030](https://github.com/naimo84/node-red-contrib-ical-events/commit/c01903086902e9ef3e7df9ca09ff8dbe55b9946e))
* issue [#64](https://github.com/naimo84/node-red-contrib-ical-events/issues/64), rrule not found because 2.6.5 is broken ([5a1914d](https://github.com/naimo84/node-red-contrib-ical-events/commit/5a1914daf10078b01d136841fe43de74e218fc54))

### [0.17.4](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.17.3...v0.17.4) (2020-08-20)


### Bug Fixes

* issue [#62](https://github.com/naimo84/node-red-contrib-ical-events/issues/62), events not detected ([c019030](https://github.com/naimo84/node-red-contrib-ical-events/commit/c01903086902e9ef3e7df9ca09ff8dbe55b9946e))

### [0.17.3](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.17.2...v0.17.3) (2020-08-07)


### Bug Fixes

* issue [#62](https://github.com/naimo84/node-red-contrib-ical-events/issues/62), regex for trigger ([85e3b8c](https://github.com/naimo84/node-red-contrib-ical-events/commit/85e3b8c5767a50dec6f92981401ddd486a8e2a1f))

### [0.17.2](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.17.0...v0.17.2) (2020-08-03)


### Bug Fixes

* [#58](https://github.com/naimo84/node-red-contrib-ical-events/issues/58), undefined console.log ([7e14159](https://github.com/naimo84/node-red-contrib-ical-events/commit/7e14159589ceae9a9929f44cbc8bbb95653d516c))
* issue [#59](https://github.com/naimo84/node-red-contrib-ical-events/issues/59), url not defined exception ([52f68e8](https://github.com/naimo84/node-red-contrib-ical-events/commit/52f68e8897fb0c20fea7e1ae0cd6f0c318087599))
* issue [#61](https://github.com/naimo84/node-red-contrib-ical-events/issues/61), fix for mailcow ([682eed1](https://github.com/naimo84/node-red-contrib-ical-events/commit/682eed14c77eee278edc18e4ce7e4f57c0927920))

### [0.17.1](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.17.0...v0.17.1) (2020-07-20)


### Bug Fixes

* [#58](https://github.com/naimo84/node-red-contrib-ical-events/issues/58), undefined console.log ([7e14159](https://github.com/naimo84/node-red-contrib-ical-events/commit/7e14159589ceae9a9929f44cbc8bbb95653d516c))

## [0.17.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.16.0...v0.17.0) (2020-07-17)


### Features

* [#52](https://github.com/naimo84/node-red-contrib-ical-events/issues/52), fetch all configs concurrent ([3c95e2f](https://github.com/naimo84/node-red-contrib-ical-events/commit/3c95e2fa089183f1e722f2d867407d3e9175f426))


### Bug Fixes

* issues [#57](https://github.com/naimo84/node-red-contrib-ical-events/issues/57) [#56](https://github.com/naimo84/node-red-contrib-ical-events/issues/56), object.assign ([6a77b42](https://github.com/naimo84/node-red-contrib-ical-events/commit/6a77b42e499e06f4ef2b0b6e041c76320fe586b0))

## [0.16.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.15.3...v0.16.0) (2020-07-04)


### Features

* [#54](https://github.com/naimo84/node-red-contrib-ical-events/issues/54), calendarName for output message ([142a5dc](https://github.com/naimo84/node-red-contrib-ical-events/commit/142a5dc5dd6b51aa57c54ec9567c49147cacb0b5))


### Bug Fixes

* issue [#53](https://github.com/naimo84/node-red-contrib-ical-events/issues/53), forward input to output msg ([d2e4b61](https://github.com/naimo84/node-red-contrib-ical-events/commit/d2e4b6106d653b2b31a83a38a41eb040b955478b))

### [0.15.3](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.15.2...v0.15.3) (2020-07-01)


### Bug Fixes

* [#50](https://github.com/naimo84/node-red-contrib-ical-events/issues/50), event sensor not working correct ([56956f3](https://github.com/naimo84/node-red-contrib-ical-events/commit/56956f3e44a6cfe4a560e2b22964791bebcaf03e))

### [0.15.2](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.15.1...v0.15.2) (2020-06-27)


### Features

* issue [#48](https://github.com/naimo84/node-red-contrib-ical-events/issues/48), describe filter property ([01553e9](https://github.com/naimo84/node-red-contrib-ical-events/commit/01553e93146b982222cce4cf7850bbf54be1c0b2))


### Bug Fixes

* issue [#50](https://github.com/naimo84/node-red-contrib-ical-events/issues/50), EndCronjob had wrong date ([46c3d76](https://github.com/naimo84/node-red-contrib-ical-events/commit/46c3d76b5af31484fc4ca2081a747d9151ff5ab5))

### [0.15.1](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.15.0...v0.15.1) (2020-05-13)


### Bug Fixes

* issue [#48](https://github.com/naimo84/node-red-contrib-ical-events/issues/48), removed deprecated timezone from moment ([96a9048](https://github.com/naimo84/node-red-contrib-ical-events/commit/96a9048ae0f3d1c79cd525dfc8a4654a0063407f))

## [0.15.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.14.5...v0.15.0) (2020-05-07)


### ⚠ BREAKING CHANGES

* default before was true, now it's false

### Features

* using cache in case of an error is configurable ([f336cfe](https://github.com/naimo84/node-red-contrib-ical-events/commit/f336cfe2ee2e455ec4a18a3feb226ba4a87b63e7))

### [0.14.5](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.14.4...v0.14.5) (2020-04-18)


### Bug Fixes

* issue [#47](https://github.com/naimo84/node-red-contrib-ical-events/issues/47), returning correct current sensor value ([39a29c3](https://github.com/naimo84/node-red-contrib-ical-events/commit/39a29c3a84d77d818bf1a57d1bde8e8672bbbd18))

### [0.14.4](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.14.3...v0.14.4) (2020-04-15)


### Bug Fixes

* issue [#45](https://github.com/naimo84/node-red-contrib-ical-events/issues/45), corrected rrule for events and trigger node ([2c4079c](https://github.com/naimo84/node-red-contrib-ical-events/commit/2c4079c5a712376c0a301fe875983b32ee32e9b6))

### [0.14.3](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.14.2...v0.14.3) (2020-04-07)


### Bug Fixes

* issue [#44](https://github.com/naimo84/node-red-contrib-ical-events/issues/44), synology caldav server, added scrapegoat as fallback ([4fa8df6](https://github.com/naimo84/node-red-contrib-ical-events/commit/4fa8df69984a8d4161f24fe9129061d9e760b07e))

### [0.14.2](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.14.1...v0.14.2) (2020-04-06)


### Bug Fixes

* issue [#44](https://github.com/naimo84/node-red-contrib-ical-events/issues/44), synology caldav server, added scrapegoat as fallback ([972e583](https://github.com/naimo84/node-red-contrib-ical-events/commit/972e5832bc20fbefc83c9ef3eb8199e504005092))
* issue [#45](https://github.com/naimo84/node-red-contrib-ical-events/issues/45), wrong rrule events ([cc5709f](https://github.com/naimo84/node-red-contrib-ical-events/commit/cc5709febf9c6fe0e1335c7f9a94c12b91d62e4b))

### [0.14.1](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.14.0...v0.14.1) (2020-03-27)


### Bug Fixes

* issue [#42](https://github.com/naimo84/node-red-contrib-ical-events/issues/42), handle null pointer exceptions ([e272c1e](https://github.com/naimo84/node-red-contrib-ical-events/commit/e272c1e565344d435d57857a2a1fefc593f596e7))

## [0.14.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.13.0...v0.14.0) (2020-03-24)


### ⚠ BREAKING CHANGES

* pastweek and futureweeks are now available as preview and pastview setting
* pastweek and futureweeks are now available as preview and pastview setting

### Bug Fixes

* issue [#43](https://github.com/naimo84/node-red-contrib-ical-events/issues/43), rrule only shows last event ([f7ef763](https://github.com/naimo84/node-red-contrib-ical-events/commit/f7ef763b92d587bc3005aac0d9652506d8a0f446))


* move caldav pastweek and futureweeks ([492860c](https://github.com/naimo84/node-red-contrib-ical-events/commit/492860c32e7f7e7cc1239f5435129e7514a08c53))
* move caldav pastweek and futureweeks ([34733d9](https://github.com/naimo84/node-red-contrib-ical-events/commit/34733d9f62c598841464aad3815216986cf747a5))

## [0.13.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.12.2...v0.13.0) (2020-03-19)


### Features

* [#35](https://github.com/naimo84/node-red-contrib-ical-events/issues/35), cache events in case of error ([38db1ac](https://github.com/naimo84/node-red-contrib-ical-events/commit/38db1aca2d066e7a993be75d5c83a996d8b7f2b5))
* node-cache ([b292109](https://github.com/naimo84/node-red-contrib-ical-events/commit/b292109070c03afad2a1cce18d1ec4d9cb0b05e1))

### [0.12.2](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.12.1...v0.12.2) (2020-03-13)


### Features

* [#31](https://github.com/naimo84/node-red-contrib-ical-events/issues/31), no default config is needed ([beb2676](https://github.com/naimo84/node-red-contrib-ical-events/commit/beb26767535d4728baa9368f9a6bff427ef5deec))


### Bug Fixes

* issue [#37](https://github.com/naimo84/node-red-contrib-ical-events/issues/37), wrong day calculation ([abcfc7f](https://github.com/naimo84/node-red-contrib-ical-events/commit/abcfc7f5ebd4882d2d551cbc220148de6eb3f020))
* issue [#38](https://github.com/naimo84/node-red-contrib-ical-events/issues/38), error-circular ([ee44153](https://github.com/naimo84/node-red-contrib-ical-events/commit/ee441536b591a91d1e2180f0f2167b744eb31cf0))

### [0.12.1](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.12.0...v0.12.1) (2020-03-05)


### Bug Fixes

* [#34](https://github.com/naimo84/node-red-contrib-ical-events/issues/34), unneeded blank removed ([9fe05a6](https://github.com/naimo84/node-red-contrib-ical-events/commit/9fe05a6ff8fdd4d5b4f4643ad76466bc74068182))
* issue [#33](https://github.com/naimo84/node-red-contrib-ical-events/issues/33), events.occurrences not correctly mapped ([b6f61e6](https://github.com/naimo84/node-red-contrib-ical-events/commit/b6f61e620569c99675a514b5b5728433dfb51561))

## [0.12.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.11.4...v0.12.0) (2020-03-02)


### Features

* [#31](https://github.com/naimo84/node-red-contrib-ical-events/issues/31) final configuralbe payload ([0bcc332](https://github.com/naimo84/node-red-contrib-ical-events/commit/0bcc33203405ad00b5edd3b9cf2d3a6e5ffb4ded))


### Bug Fixes

* toLowerCase calendar.displayName ([f1a2575](https://github.com/naimo84/node-red-contrib-ical-events/commit/f1a2575eb0f241378b5c1ca777201c2b337cfbf0))

### [0.11.4](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.11.3...v0.11.4) (2020-02-13)


### Bug Fixes

* issue [#29](https://github.com/naimo84/node-red-contrib-ical-events/issues/29), Fullday events from past have wrong date ([a4d56aa](https://github.com/naimo84/node-red-contrib-ical-events/commit/a4d56aa443c315c40825c4f48432a8ec6679d563))

### [0.11.3](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.11.2...v0.11.3) (2020-02-10)


### Bug Fixes

* correcting pastview from config ([536aa81](https://github.com/naimo84/node-red-contrib-ical-events/commit/536aa818dea24297ace2d8b401d2ac7e50ae3934))
* remove node_modules ([4b1d2af](https://github.com/naimo84/node-red-contrib-ical-events/commit/4b1d2af82e7e174ac480be78c630a5f6eb42ca92))
* remove node_modules ([65b7eb7](https://github.com/naimo84/node-red-contrib-ical-events/commit/65b7eb7c0d9034fb804879ca6a5da955d9ac91a1))

### [0.11.2](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.11.0...v0.11.2) (2020-01-25)


### Bug Fixes

* **package.json:** standard-version not bumping version ([92fdb7b](https://github.com/naimo84/node-red-contrib-ical-events/commit/92fdb7b05944a30c3826c968f8c94eae4f7d0222))
* corrected test ([024d741](https://github.com/naimo84/node-red-contrib-ical-events/commit/024d741aca948a4e26223a0601001d9e36aa4a9a))
* default values for end- and pastview ([9b3d6ea](https://github.com/naimo84/node-red-contrib-ical-events/commit/9b3d6eae42e90524b95f810ece5397bb83f7c9f4))
* issue [#27](https://github.com/naimo84/node-red-contrib-ical-events/issues/27), deleted recurring events still in output msg ([273c942](https://github.com/naimo84/node-red-contrib-ical-events/commit/273c942a3ba71604211e3d75ad2d36366a67f9f2))
* issue [#28](https://github.com/naimo84/node-red-contrib-ical-events/issues/28), Empty Summary ([f279d61](https://github.com/naimo84/node-red-contrib-ical-events/commit/f279d610f7c1d7e5ec4c6818b66936f40f62e2a1))
* issue 28, Empty Summary ([866384b](https://github.com/naimo84/node-red-contrib-ical-events/commit/866384b747fe8331904ca0020915a7ee7d9f1ede))
* upcoming tests reactivated ([074a86b](https://github.com/naimo84/node-red-contrib-ical-events/commit/074a86bd83b732586cd2878786ee2bbb3c80d6be))

### [0.11.1](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.11.0...v0.11.1) (2020-01-25)


### Bug Fixes

* **package.json:** standard-version not bumping version ([92fdb7b](https://github.com/naimo84/node-red-contrib-ical-events/commit/92fdb7b05944a30c3826c968f8c94eae4f7d0222))
* corrected test ([024d741](https://github.com/naimo84/node-red-contrib-ical-events/commit/024d741aca948a4e26223a0601001d9e36aa4a9a))
* default values for end- and pastview ([9b3d6ea](https://github.com/naimo84/node-red-contrib-ical-events/commit/9b3d6eae42e90524b95f810ece5397bb83f7c9f4))
* issue [#27](https://github.com/naimo84/node-red-contrib-ical-events/issues/27), deleted recurring events still in output msg ([273c942](https://github.com/naimo84/node-red-contrib-ical-events/commit/273c942a3ba71604211e3d75ad2d36366a67f9f2))
* issue [#28](https://github.com/naimo84/node-red-contrib-ical-events/issues/28), Empty Summary ([f279d61](https://github.com/naimo84/node-red-contrib-ical-events/commit/f279d610f7c1d7e5ec4c6818b66936f40f62e2a1))
* issue 28, Empty Summary ([866384b](https://github.com/naimo84/node-red-contrib-ical-events/commit/866384b747fe8331904ca0020915a7ee7d9f1ede))
* upcoming tests reactivated ([074a86b](https://github.com/naimo84/node-red-contrib-ical-events/commit/074a86bd83b732586cd2878786ee2bbb3c80d6be))

## [0.11.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.10.7...v0.11.0) (2020-01-22)


### Bug Fixes

* [#26](https://github.com/naimo84/node-red-contrib-ical-events/issues/26), recurring appointments caldav not working ([eeeab61](https://github.com/naimo84/node-red-contrib-ical-events/commit/eeeab616f3476d49cf6f124a92c2175b00ac08c0))
* issue [#22](https://github.com/naimo84/node-red-contrib-ical-events/issues/22), icloud upcoming timezone fix ([99def58](https://github.com/naimo84/node-red-contrib-ical-events/commit/99def586fb45852a0e7d19ad90bfea4db6060233))

### [0.10.8](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.10.7...v0.10.8) (2020-01-21)


### Bug Fixes

* issue [#22](https://github.com/naimo84/node-red-contrib-ical-events/issues/22), icloud upcoming timezone fix ([99def58](https://github.com/naimo84/node-red-contrib-ical-events/commit/99def586fb45852a0e7d19ad90bfea4db6060233))

### [0.10.7](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.10.6...v0.10.7) (2020-01-20)


### Bug Fixes

* [#25](https://github.com/naimo84/node-red-contrib-ical-events/issues/25), circular error when saving context ([1f540bb](https://github.com/naimo84/node-red-contrib-ical-events/commit/1f540bb2804b8596b7ca61456148de9a5191cffb))

### [0.10.6](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.10.5...v0.10.6) (2020-01-18)


### Bug Fixes

* issue [#22](https://github.com/naimo84/node-red-contrib-ical-events/issues/22), pastview icloud ([f59f7f4](https://github.com/naimo84/node-red-contrib-ical-events/commit/f59f7f450e5510e25df431070bf27d87cebe6fe7))

### [0.10.5](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.10.3...v0.10.5) (2020-01-14)


### Bug Fixes

* [#23](https://github.com/naimo84/node-red-contrib-ical-events/issues/23) added caldav config options ([188ed72](https://github.com/naimo84/node-red-contrib-ical-events/commit/188ed72252340e94e7b85aa04e90c5088ae5a7a5))
* [#23](https://github.com/naimo84/node-red-contrib-ical-events/issues/23), RED.validators.number() reuwires a number, undefined is not allowed ([1cf58f7](https://github.com/naimo84/node-red-contrib-ical-events/commit/1cf58f7f77416c4fcb284c9363b79fe2b7728ffc))
* issue [#21](https://github.com/naimo84/node-red-contrib-ical-events/issues/21), recurrent event in the past ([80e12ae](https://github.com/naimo84/node-red-contrib-ical-events/commit/80e12aedff17ed5440cccf18da47cb84c5990b1c))
* issue [#22](https://github.com/naimo84/node-red-contrib-ical-events/issues/22), correct pastpreview ([7c3bdc3](https://github.com/naimo84/node-red-contrib-ical-events/commit/7c3bdc3fe4fb6fc27cf52b682123dc76ec8b97e0))
* issue [#22](https://github.com/naimo84/node-red-contrib-ical-events/issues/22), correct pastpreview ([8ebddc7](https://github.com/naimo84/node-red-contrib-ical-events/commit/8ebddc7783aa1b2e3039475f3aeabaa5691e9bfc))

### [0.10.4](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.10.3...v0.10.4) (2020-01-08)


### Bug Fixes

* issue [#21](https://github.com/naimo84/node-red-contrib-ical-events/issues/21), recurrent event in the past ([80e12ae](https://github.com/naimo84/node-red-contrib-ical-events/commit/80e12aedff17ed5440cccf18da47cb84c5990b1c))

### [0.10.3](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.10.2...v0.10.3) (2020-01-06)


### Bug Fixes

* issue [#21](https://github.com/naimo84/node-red-contrib-ical-events/issues/21), sensor node RRules not working ([a334bd3](https://github.com/naimo84/node-red-contrib-ical-events/commit/a334bd3a7c7d4bba5161d8cbba22f71ee91d46d7))
* issue [#22](https://github.com/naimo84/node-red-contrib-ical-events/issues/22), Upcoming events - no past view ([148f0ae](https://github.com/naimo84/node-red-contrib-ical-events/commit/148f0ae8b76443093608b96fdcc2efd1e2640bdc))

### [0.10.2](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.10.1...v0.10.2) (2019-12-22)


### Features

* issue [#19](https://github.com/naimo84/node-red-contrib-ical-events/issues/19) Report calendar name in msg.payloa ([498ee9e](https://github.com/naimo84/node-red-contrib-ical-events/commit/498ee9e03631bed562e6157606415894091a3a07))

### [0.10.1](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.10.0...v0.10.1) (2019-12-18)


### Features

* [#17](https://github.com/naimo84/node-red-contrib-ical-events/issues/17) countdown to event in days, hours, minutes ([c3fd336](https://github.com/naimo84/node-red-contrib-ical-events/commit/c3fd33635d7895f8aa1508cff17065f7e5f6b657))


### Bug Fixes

* issue [#18](https://github.com/naimo84/node-red-contrib-ical-events/issues/18), Repeating events for icloud secure ([1f8a572](https://github.com/naimo84/node-red-contrib-ical-events/commit/1f8a57272be8c5b8ac8f3d7c73f4c1b8da6b9cd2))

## [0.10.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.9.2...v0.10.0) (2019-12-05)


### Features

* looking in the past :) ([94c0dca](https://github.com/naimo84/node-red-contrib-ical-events/commit/94c0dca937d36413f1643aacee5f470ef1a9ebab))

### [0.9.2](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.9.0...v0.9.2) (2019-12-04)


### Features

* issue [#15](https://github.com/naimo84/node-red-contrib-ical-events/issues/15), a bit more help texts ([a07c461](https://github.com/naimo84/node-red-contrib-ical-events/commit/a07c461c003d0fb3f0612ca67453ab725cce36fe))


### Bug Fixes

* issue [#15](https://github.com/naimo84/node-red-contrib-ical-events/issues/15), fixing strange bahaviour with caldav ([df5dff3](https://github.com/naimo84/node-red-contrib-ical-events/commit/df5dff370b217cbb9da3d28dec22b38234e6780e))
* issue [#16](https://github.com/naimo84/node-red-contrib-ical-events/issues/16), caldav not working correctly ([7953e0f](https://github.com/naimo84/node-red-contrib-ical-events/commit/7953e0f03e5bc57272ec60e74120274e79fcf0a7))

### [0.9.1](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.9.0...v0.9.1) (2019-11-30)


### Bug Fixes

* issue [#15](https://github.com/naimo84/node-red-contrib-ical-events/issues/15), fixing strange bahaviour with caldav ([df5dff3](https://github.com/naimo84/node-red-contrib-ical-events/commit/df5dff3))


### Features

* issue [#15](https://github.com/naimo84/node-red-contrib-ical-events/issues/15), a bit more help texts ([a07c461](https://github.com/naimo84/node-red-contrib-ical-events/commit/a07c461))

## [0.9.0](https://github.com/naimo84/node-red-contrib-ical-events/compare/v0.8.0...v0.9.0) (2019-11-19)


### Features

* [#13](https://github.com/naimo84/node-red-contrib-ical-events/issues/13), regex filter for upcoming node ([339c0d3](https://github.com/naimo84/node-red-contrib-ical-events/commit/339c0d329afed10fa7278cc1d9c1e56914da0da7))
* check every for upcoming node ([2d976c3](https://github.com/naimo84/node-red-contrib-ical-events/commit/2d976c3bf42d2dc571ded71782a612a328060ba5))

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