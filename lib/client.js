var net = require('net');
var http = require('http');
var Watch = require('./data').Watch;
var events = require('../config/events');

var PORT = 6969;
net.createServer(function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

    sock.on('data', function(data) {
        var pointInfo = data.toString("utf-8").slice(0,-1).split(',');
        console.log(pointInfo)
        var event = pointInfo[0];
        var gpsLng = pointInfo[3];
        var gpsLat = pointInfo[2];
        var licence = pointInfo[4];

        http.get("http://api.map.baidu.com/geoconv/v1/?coords="+gpsLng+','+gpsLat+
            "&from=1&to=5&ak=VimjcFL6r1p1TjGsfSGCeqs6wpXo9CDN", function(response){
            response.setEncoding('utf8');
            var postdata = '';

            response.on('data', function (chunk){
                postdata += chunk;
            });

            response.on('end', function() {
                var msg = JSON.parse(postdata);
                if(!msg.result) return;

                var lng = msg.result[0].x;
                var lat = msg.result[0].y;

                if(lng > 125 || lng < 115) return;
                if(lat > 35 || lng < 25) return;

                Watch.findOne({licence:licence}, function(err, car){
                    if(car == null){
                        console.error('car不存在!');
                        return;
                    }

                    var len = car.maplist.push({lng:lng, lat:lat});

                    if(event == '0'){
                        car.save();
                        return;
                    }

                    http.get('http://api.map.baidu.com/geocoder?location=' + lat +','+ lng +'&coord_type=gcj02&output=json', function(response) {
                        response.setEncoding('utf8');
                        var postdata = '';

                        response.on('data', function (chunk){
                            postdata += chunk;
                        });

                        response.on('end', function() {
                            var msg = JSON.parse(postdata);
                            var address = msg.result.formatted_address;

                            var opera = {
                                date: new Date().toString().slice(4, 24),
                                location: address.slice(6),
                                operation: events[event],
                                mapnumber: len-1
                            }

                            car.operalist.unshift(opera)
                            car.save();
                        })
                    })
                });
            });
        })
    })

    sock.on('close', function(data) {
        console.log('CLOSED: ' +  sock.remoteAddress + ' ' + sock.remotePort);
    });

}).listen(PORT);

console.log('TCP Server listening on port' +  PORT);
