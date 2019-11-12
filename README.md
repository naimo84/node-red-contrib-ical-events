# Node RED ical events 

This Node RED module gets the events from an ical-URL or from a caldav-server.

> Node-RED is a tool for wiring together hardware devices, APIs and online services in new and interesting ways.

## :question: Get Help

 For bug reports and feature requests, open issues. :bug: 

## :sparkling_heart: Support my projects

I open-source almost everything I can, and I try to reply to everyone needing help using these projects. Obviously,
this takes time. You can integrate and use these projects in your applications *for free*! You can even change the source code and redistribute (even resell it).

However, if you get some profit from this or just want to encourage me to continue creating stuff, there are few ways you can do it:

 - Starring and sharing the projects you like :rocket:
 - [![PayPal][badge_paypal]][paypal-donations] **PayPal**— You can make one-time donations via PayPal. I'll probably buy a ~~coffee~~ tea. :tea:
 - [![Support me on using Brave Browser][badge_brave]][brave] **Brave**— It's free for you. Brave is a browser that improves the security and the access time of websites by blocking ads, trackers and scripts. Give the new Brave Browser a try and Brave will contribute to me on your behalf. :wink:
 - [![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/T6T412CXA) **Ko-fi**— I'll buy a ~~tea~~ coffee. :coffee: :wink:
 - ![](./examples/bitcoin.png) **Bitcoin**—You can send me bitcoins at this address (or scanning the code): `3KDjCmXsGFYawmycXRsVwfFbphog117N8P`
 

Thanks! :heart:

## :cloud: Installation

First of all install [Node-RED](http://nodered.org/docs/getting-started/installation)

```sh
$ sudo npm install -g node-red
# Then open  the user data directory  `~/.node-red`  and install the package
$ cd ~/.node-red
$ npm install node-red-contrib-ical-events
```

Or search for ical-events in the manage palette menu

Then run

```
node-red
```

## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].

```sh
git clone https://github.com/naimo84/node-red-contrib-ical-events.git
cd node-red-contrib-ical-events
npm install
gulp
cd ~/.node-red 
npm install /path/to/node-red-contrib-ical-events
```

## :memo: Documentation

### node explanation

#### events: 

The calendar is checked for new events on input or cronjob. For events in the future within the preview timespan, a separated cronjob is generated. It's fired on the start datetime of the ical event. So, on input or check-cronjob, no output is generated. Only when an event starts.

#### upcoming:

As of the events node, its checked on input or cronjob. The msg.payload contains a list of upcoming events.
Additional msg properties are:

* msg.today - number of upcoming events today
* msg.tomorrow - number of upcoming events tomorrow
* msg.total - number of upcoming events totally
* msg.htmlTable - a html formated table of upcoming events
* msg.payload - arraylist of upcoming events
  * date
  * summary
  * event
  * eventStart
  * eventEnd
  * description
  * id
  * allDay
  * rule
  * location

### Configuration:
- ***URL*** URL to Calendar
- ***Replace Dates with name*** Dates are formated in a readable way, like today, tommorrow, in 3 weeks,...
- ***Language*** if dates are replaced with names, the following languages are available at the moment Deutsch, English, русский, polski, Nederlands, français, Italiano, Espanol
- ***Cron*** cron-expression for checking the url, if no cron is specified, it's only checked on input.
- ***Username*** HTTP Basic authentication user
- ***Password*** HTTP Basic authentication user
- ***Type*** Type can be ical or caldav

instead of cron-expression, an input node can be used.

![example.png](https://github.com/naimo84/node-red-contrib-ical-events/raw/master/examples/example.png)

## :scroll: Credits
* Thanks to https://github.com/kelektiv/node-cron
* Thanks to https://github.com/jens-maus/node-ical
* The whole module is inspired by ioBroker's adapter https://github.com/iobroker-community-adapters/ioBroker.ical. Many many thanks folks ;)

## :scroll: The MIT License
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Coded with :heart: in :cloud:


[badge_brave]: ./examples/support_banner.png
[badge_paypal]: https://img.shields.io/badge/Donate-PayPal-blue.svg

[paypal-donations]: https://paypal.me/NeumannBenjamin
[brave]: https://brave.com/nai412
[contributing]: /CONTRIBUTING.md