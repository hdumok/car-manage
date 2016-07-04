var express = require('express');
var http = require('http');
var async = require('async');
var Admin = require('../lib/data').Admin;
var Watch = require('../lib/data').Watch;

var router = express.Router();
var usersCache = {};

router.use('/', function (req, res, next) {
    var username = req.cookies['username'];
    var user = usersCache[username];

    if(user == null && req.url != '/login' && req.url != '/register')
        return res.redirect(302, '/login');

    next();
});

router.get('/index', function (req, res, next) {
    var username = req.cookies['username'];
    var user = usersCache[username];

    var cbs = [];
    for(var i in user.carlist){
        if(typeof user.carlist[i] !== 'string') continue;
        var func = (function(licence){
            return function(cb){
                Watch.findOne({licence:licence}, cb)
            }
        })(user.carlist[i]);

        cbs.push(func);
    }

    async.parallel(cbs, function(err, cars){
        if(err) return console.error(err);
        for(var i = 0, len = cars.length; i< len; i++){
            if(cars[i] == null) {
                delete cars[i];
                continue;
            }
            cars[i].operalist = cars[i].operalist.slice(0, 5);
        }

        res.render('index', {
            admin:user.name,
            cars:cars
        });
    });
});

router.get('/addwatch', function (req, res, next) {
    var username = req.cookies['username'];
    var user = usersCache[username];

    res.render('addwatch', {
        admin:user.name
    });
});

router.get('/delwatch', function (req, res, next) {
    var username = req.cookies['username'];
    var user = usersCache[username];
    var licence = req.query.licence;

    user.carlist.splice(user.carlist.indexOf(licence));
    user.save(function(err){
        if(err) return console.error(err);
        res.render('info', {
            admin:user.name,
            message:'删除车辆成功'
        });
    })
});

router.post('/addwatch', function (req, res, next) {
    var username = req.cookies['username'];
    var user = usersCache[username];

    var licence = req.body.licence;
    var id = req.body.id;
    var name = req.body.name;
    var sex = req.body.sex;
    var age = req.body.age;
    var phone = req.body.phone;
    var address = req.body.address;

    Watch.findOne({licence : licence}, function(err, car){
        if(car !== null){
            if(err) return console.error(err);
            user.carlist.push(licence);
            user.save()
            res.render('info', {
                admin:user.name,
                message:'项目已经存在, 直接添加到监控列表'
            });
            return;
        }

        var watch = new Watch({
            licence : licence,
            id : id,
            name : name,
            sex : sex,
            age : age,
            phone : phone,
            address : address
        });

        watch.save(function(err){
            if(err) return console.error(err);
            user.carlist.push(licence);
            user.save()
            res.render('info', {
                admin:user.name,
                message:'添加监控：' + JSON.stringify(watch)
            });
        })
    })
});

router.get('/maplist', function (req, res, next) {
    var username = req.cookies['username'];
    var user = usersCache[username];
    var carCache = user.carCache;

    Watch.findOne({licence:carCache}, function(err, car){
        if(car == null){
            console.error('car不存在!');
            return res.redirect('/index');
        }

        res.write(JSON.stringify({
            operalist:car.operalist,
            maplist:car.maplist
        }));
        res.end()
    })
});

router.get('/carinfo', function (req, res, next) {
    var username = req.cookies['username'];
    var user = usersCache[username];
    var licence = req.query.licence;
    user.carCache = licence;

    Watch.findOne({licence:licence}, function(err, car){
        if(car == null){
            console.error('car不存在!');
            return res.redirect('/index');
        }

        res.render('carinfo', {
            admin:user.name,
            car:car
        });
    })
});

router.get('/userinfo', function (req, res, next) {
    var username = req.cookies['username'];
    var user = usersCache[username];
    var name = req.query.name;

    Watch.findOne({name:name}, function(err, car){
        if(car == null){
            console.error('car不存在!');
            return res.redirect('/index');
        }

        delete car.operalist;
        delete car.maplist;
        res.render('userinfo', {
            admin:user.name,
            car:car
        });
    })
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/login', function (req, res) {//检查用户是否存在
    var username = req.body.username;
    var password = req.body.password;
    Admin.findOne({name:username}, function (err, user) {
        if(user == null){
            console.error('用户不存在!');
            return res.redirect('/login');
        }

        //用户存在，则检查密码是否一致
        if (user.password != password) {
            console.error('密码错误!');
            return res.redirect('/login');
        }

        //用户名密码都匹配后，将用户信息存入
        usersCache[username] = user;
        console.log('登陆成功!');

        res.cookie('username', username, { maxAge: 600000 });
        res.redirect('/index');
    });
});

router.get('/unlogin', function (req, res) {
    res.clearCookie('username');
    return res.redirect(302, '/login');
});

router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', function (req, res) {//检查用户是否存在
    var username = req.body.username;
    var password = req.body.password;
    Admin.findOne({name:username}, function (err, user) {
        console.log(arguments)
        if(user != null){
            console.error('注册失败!用户已存在!');
            return res.redirect('/register');
        }

        user = new Admin({
            name : username,
            password : password
        });

        user.save(function(err){
            if(err) return console.error(err);

            usersCache[username] = user;
            console.log('注册登陆成功!');

            res.cookie('username', username, { maxAge: 600000 });
            res.redirect('/index');
        })
    });
});

module.exports = router;
