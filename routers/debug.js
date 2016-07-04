var express = require('express');
var http = require('http');
var Watch = require('../lib/data').Watch;
var events = require('../config/events');
var router = express.Router();

var lastlng = null;
var lastlat = null;
var event = null;
var licence = null;

router.get('/addpoint', function (req, res, next) {
    var lng = req.query.lng;
    var lat = req.query.lat;

    if(lng == lastlng && lat == lastlat){
        if(event == '0')
            return res.end();

        Watch.findOne({licence:licence}, function(err, car){
            if(car == null){
                console.error('car不存在!');
                return res.redirect('/index');
            }

			if(car.operalist.length != 0){
				car.operalist[0].mapnumber = car.maplist.length - 1;
			}
			car.save();
            res.end();
        })
    }

    Watch.findOne({licence:licence}, function(err, car){
        if(car == null){
            console.error('car不存在!');
            return res.redirect('/index');
        }
        console.error(car)
        var len = car.maplist.push({lng:lng, lat:lat});
        if(event == '0'){
            car.save();
            res.end();
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
                res.end();
            })
        })
    });
    res.end();
    lastlat = req.query.lat;
    lastlng = req.query.lng;
});

router.post('/addpoint', function (req, res, next) {
	console.log(req.body)
    event = req.body.event;
    licence = req.body.licence;
});

module.exports = router;
