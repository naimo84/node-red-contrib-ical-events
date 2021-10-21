(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{409:function(e,t,n){"use strict";n.r(t);var a=n(15),s=Object(a.a)({},(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[n("h1",{attrs:{id:"debug-node-red-contrib-ical-events"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#debug-node-red-contrib-ical-events"}},[e._v("#")]),e._v(" Debug node-red-contrib-ical-events")]),e._v(" "),n("p",[e._v("My library "),n("a",{attrs:{href:"https://github.com/niamo84/kalender-events",target:"_blank",rel:"noopener noreferrer"}},[e._v("kalender-events"),n("OutboundLink")],1),e._v(" uses the "),n("a",{attrs:{href:"https://www.npmjs.com/package/debug",target:"_blank",rel:"noopener noreferrer"}},[e._v("debug"),n("OutboundLink")],1),e._v(" package to put out some more informations, when collecting ical events from the calender.")]),e._v(" "),n("p",[e._v("To activate the additional logging, you have to set the environment variable "),n("code",[e._v("DEBUG")]),e._v(" to "),n("code",[e._v("kalender-events")]),e._v(".")]),e._v(" "),n("p",[e._v("To do so, you have serveral options:\n(The following should also work with the Raspberry Pi commands, described here: https://nodered.org/docs/getting-started/raspberrypi)")]),e._v(" "),n("ul",[n("li",[n("p",[e._v("add the environment variable directly before the node-red command:")]),e._v(" "),n("div",{staticClass:"language-sh extra-class"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[n("span",{pre:!0,attrs:{class:"token assign-left variable"}},[e._v("DEBUG")]),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v("kalender-events node-red\n")])])])]),e._v(" "),n("li",[n("p",[e._v("add the environment variable for the current session before executing the node-red command:")]),e._v(" "),n("div",{staticClass:"language-sh extra-class"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("export")]),e._v(" "),n("span",{pre:!0,attrs:{class:"token assign-left variable"}},[e._v("DEBUG")]),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v("kalender-events \nnode-red\n")])])])]),e._v(" "),n("li",[n("p",[e._v("add the environment variable at the top of the settings.js file of node-red and restart node-red:")]),e._v(" "),n("div",{staticClass:"language-javascript extra-class"},[n("pre",{pre:!0,attrs:{class:"language-javascript"}},[n("code",[e._v("process"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),e._v("env"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),n("span",{pre:!0,attrs:{class:"token constant"}},[e._v("DEBUG")]),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),n("span",{pre:!0,attrs:{class:"token string"}},[e._v('"kalender-events"')]),e._v("\nmodule"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),e._v("exports "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n  "),n("span",{pre:!0,attrs:{class:"token comment"}},[e._v("// the tcp port that the Node-RED web server is listening on")]),e._v("\n  uiPort"),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" process"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),e._v("env"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),n("span",{pre:!0,attrs:{class:"token constant"}},[e._v("PORT")]),e._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("||")]),e._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[e._v("1880")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n")])])])]),e._v(" "),n("li",[n("p",[e._v("add the environment variable the docker envs and restart it:")]),e._v(" "),n("div",{staticClass:"language-docker extra-class"},[n("pre",{pre:!0,attrs:{class:"language-docker"}},[n("code",[n("span",{pre:!0,attrs:{class:"token comment"}},[e._v("################################################################################")]),e._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Node-RED Stack or Compose")]),e._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[e._v("################################################################################")]),e._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# docker stack deploy node-red --compose-file docker-compose-node-red.yml")]),e._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# docker-compose -f docker-compose-node-red.yml -p myNoderedProject up")]),e._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[e._v("################################################################################")]),e._v('\nversion: "3.7"\n\nservices:\nnode-red:\n    image: nodered/node-red:latest\n    environment:\n    - TZ=Europe/Amsterdam\n    - DEBUG=kalender-events\n    ports:\n    - "1880:1880"\n    networks:\n    - node-red-net\n    volumes:\n    - node-red-data:/data\n\nvolumes:\nnode-red-data:\n\nnetworks:\nnode-red-net:\n           \n')])])]),n("p",[e._v("or:")]),e._v(" "),n("div",{staticClass:"language-sh extra-class"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[e._v("docker run -it -p "),n("span",{pre:!0,attrs:{class:"token number"}},[e._v("1880")]),e._v(":1880 --env "),n("span",{pre:!0,attrs:{class:"token assign-left variable"}},[e._v("DEBUG")]),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v("kalender-events -v node_red_data:/data --name mynodered nodered/node-red\n")])])])])])])}),[],!1,null,null,null);t.default=s.exports}}]);