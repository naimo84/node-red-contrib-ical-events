# Debug node-red-contrib-ical-events

My library [kalender-events](https://github.com/niamo84/kalender-events) uses the [debug](https://www.npmjs.com/package/debug) package to put out some more informations, when collecting ical events from the calender.

To activate the additional logging, you have to set the environment variable ``DEBUG`` to ``kalender-events``.

To do so, you have serveral options:
(The following should also work with the Raspberry Pi commands, described here: https://nodered.org/docs/getting-started/raspberrypi)

- add the environment variable directly before the node-red command: 
  ````sh
  DEBUG=kalender-events* node-red
  ````
- add the environment variable for the current session before executing the node-red command: 
  ````sh
  export DEBUG=kalender-events* 
  node-red
  ````
- add the environment variable at the top of the settings.js file of node-red and restart node-red:
  ````javascript
  process.env.DEBUG="kalender-events*"
  module.exports = {
    // the tcp port that the Node-RED web server is listening on
    uiPort: process.env.PORT || 1880,
  ````
- add the environment variable the docker envs and restart it:
    ````docker
    ################################################################################
    # Node-RED Stack or Compose
    ################################################################################
    # docker stack deploy node-red --compose-file docker-compose-node-red.yml
    # docker-compose -f docker-compose-node-red.yml -p myNoderedProject up
    ################################################################################
    version: "3.7"

    services:
    node-red:
        image: nodered/node-red:latest
        environment:
        - TZ=Europe/Amsterdam
        - DEBUG=kalender-events*
        ports:
        - "1880:1880"
        networks:
        - node-red-net
        volumes:
        - node-red-data:/data

    volumes:
    node-red-data:

    networks:
    node-red-net:
               
    ````
    or: 

    ````sh
    docker run -it -p 1880:1880 --env DEBUG=kalender-events* -v node_red_data:/data --name mynodered nodered/node-red
    ````
    