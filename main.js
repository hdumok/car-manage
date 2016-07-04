var path           = require('path');
var express        = require('express');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var methodOverride = require('method-override');
var index          = require('./routers/index.js');
var debug          = require('./routers/debug.js');
var client          = require('./lib/client.js');


var app  = express();
var port = 9999;

app.set('views', path.join(__dirname, 'views')); //视图模版目录
app.set('view engine', 'ejs');//视图模版引擎
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname));

app.listen(port);

app.use('/debug', debug);
app.use('/', index);

console.log('HTTP Server listening on port ' + port);

app.use(function(req, res, next) {  //对根目录的错处理，只有找不到是才会运行到这里
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);  //status不存在就设为500，然后将错误对象返回
    res.render('error', {
        message: err.message,
        error: err
    });
});

process.on('uncaughtException', function(err) {
    console.error("uncaughtException: \n" + err.stack);
});
