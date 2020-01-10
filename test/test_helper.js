const fs = require('fs');

exports.getEvents = function (){
    let rawdata = fs.readFileSync('./test/mocks/testical.json');
    let data = JSON.parse(rawdata);
    return data;
  }