# Node RED ical events

This Node RED module gets the events from an ical-URL, a caldav-server or from iCloud via [kalender-events](https://github.com/naimo84/kalender-events).
<a href="https://github.com/naimo84/kalender-events"><img src="https://github.com/naimo84/kalender-events/blob/master/docs/logo.png" align="right" width="200" alt="kalender-events"></a>

**Please Note** that:

* v1+ requires Node.js v10+ and recommends Node-RED v1+


<img src="https://img.shields.io/npm/dy/node-red-contrib-ical-events?style=for-the-badge"/>

## :question: Get Help

For bug reports and feature requests, open issues. :bug:


# :memo: Documentation

<a href="https://naimo84.github.io/kalender-events" target="_blank">
<img src="https://img.shields.io/badge/doku-naimo84.github.io-0078D6?style=for-the-badge&logo=github&logoColor=white"/>
</a>  

<br>

## :sparkling_heart: Support my projects

I open-source almost everything I can, and I try to reply to everyone needing help using these projects. Obviously,
this takes time. You can integrate and use these projects in your applications _for free_! You can even change the source code and redistribute (even resell it).

Thank you to all my backers!
### People

- [fflorent](https://github.com/fflorent)
- [Speeedy0815](https://github.com/Speeedy0815)
- Ralf S.
- Enno L.
- Jürgen G.
- Mark MC G.
- Kay-Uwe M.
- Craig O.
- Manuel G.

### Become a backer


However, if you get some profit from this or just want to encourage me to continue creating stuff, there are few ways you can do it:

- Starring and sharing the projects you like :rocket:
- **Crypto.&#65279;com** &nbsp;—&nbsp; Use my referral link https://crypto.com/app/f2smbah8fm to sign up for Crypto.&#65279;com and we both get $25 USD :)  

- [![PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg?style=for-the-badge)][paypal-donations] &nbsp; — &nbsp; You can make one-time donations via PayPal. I'll probably buy a ~~coffee~~ tea. :tea:
- [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/T6T412CXA) &nbsp;—&nbsp; I'll buy a ~~tea~~ coffee. :coffee: :wink:

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


## :bug: How to debug


<a href="https://naimo84.github.io/kalender-events/guide/debug.html" target="_blank">
<img src="https://img.shields.io/badge/DEBUG-naimo84.github.io-0078D6?style=for-the-badge&logo=github&logoColor=white"/>
</a>  

<br>

# :scroll: Credits

-   The whole module is inspired by ioBroker's adapter https://github.com/iobroker-community-adapters/ioBroker.ical. Many many thanks folks ;)


[paypal-donations]: https://paypal.me/NeumannBenjamin
[contributing]: /CONTRIBUTING.md
