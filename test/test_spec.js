


function calliCloud(body, host, path,depth, cb) {
 var request = require('https').request({
  host: host,
  port: 443,
  method: 'PROPFIND',
  path:path,
  headers: {
   "Authorization": "Basic " + Buffer.from("tyrisflare@gmx.de:rvpx-zstf-muxd-qytq").toString('base64'),
   "Depth": depth
  }
 }, function (res) {
  let _data = "";
  //console.log(res)
  console.log(res.rawHeaders)
  res.on('data', data => {
   _data += data.toString()

  });
  res.on('end', () => {
   var parseString = require('xml2js').parseString;
console.log(_data)
   parseString(_data, function (err, result) {
    cb(result);

   });

  });
  res.resume();
 });

 request.write(body)
 request.end();
}

describe('test ', function () {

 it('ical - on = true', function (done) {


  calliCloud("<propfind xmlns='DAV:'><prop><current-user-principal/></prop></propfind>", 'caldav.icloud.com',  "", 0, account_record => {
   calliCloud("<propfind xmlns='DAV:' xmlns:cd='urn:ietf:params:xml:ns:caldav'><prop><cd:calendar-home-set/></prop></propfind>", 'caldav.icloud.com', account_record.multistatus.response[0].propstat[0].prop[0]["current-user-principal"][0].href[0]._, 1,cluster  => {
   console.log(cluster )
   done();
   })
  })

 })

})