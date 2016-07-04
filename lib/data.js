var mongoose = require('mongoose');
var dbconfig = require('../config/db');

mongoose.connect(dbconfig.url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (err) {
    if(err)
        return console.error(err);

    console.log('数据库连接成功');
})

//管理员数据模型
var adminSchema = mongoose.Schema({
    name : String,
    password: String,
    carlist : [String]
})
var Admin = mongoose.model('Admin', adminSchema);

//监控数据模型
var whatchSchema = mongoose.Schema({
    //司机信息
    id : String,
    name : String,
    sex : String,
    age : Number,
    phone : String,

    //车辆信息
    licence : String,
    operalist : [{date:String, location:String, operation:String, mapnumber:Number}],
    maplist : [{lng:Number ,lat:Number}]
})

var Watch = mongoose.model('Watch', whatchSchema);


module.exports = {
    Admin:Admin,
    Watch:Watch
};