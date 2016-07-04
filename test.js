var Watch = require('./lib/data').Watch;
var Admin = require('./lib/data').Admin;
var admin = new Admin({
    name : 'admin',
    password: '123456'
})
admin.save()
 /*Watch.findOne({licence:'B'}, function (err, car) {
    if(car == null){
        console.error('用户不存在!');
        return;
    }

    console.log(car)
    for(var i = 0; i<20; i++){
        car.operalist.unshift({
            date:new Date().toString().slice(4,24),
            location:'文泽路',
            operation:'倒垃圾'
        })
    }
    */
    /*
    car.maplist.push({lng:120.347522 ,lat:30.321208})
    car.maplist.push({lng:120.348096 ,lat:30.321177})
    car.maplist.push({lng:120.348492 ,lat:30.321177})
    car.maplist.push({lng:120.348618 ,lat:30.321177})
    car.maplist.push({lng:120.348833 ,lat:30.321067})
    car.maplist.push({lng:120.349174 ,lat:30.321005})
    car.maplist.push({lng:120.349435 ,lat:30.320997})
    car.maplist.push({lng:120.35027 ,lat:30.321208})
    car.maplist.push({lng:120.350585 ,lat:30.32099})
    car.maplist.push({lng:120.350729,lat:30.321138})
    car.maplist.push({lng:120.35125,lat:30.321223})
    car.maplist.push({lng:120.351501,lat:30.321192})
    car.maplist.push({lng:120.351474,lat:30.320888})
    car.maplist.push({lng:120.351465,lat:30.320467})
    car.maplist.push({lng:120.351465,lat:30.32035})
    car.maplist.push({lng:120.351582,lat:30.320249})
    car.maplist.push({lng:120.351519,lat:30.320117})
    car.maplist.push({lng:120.35142,lat:30.320023})
    car.maplist.push({lng:120.351393,lat:30.319322})
    car.maplist.push({lng:120.351312,lat:30.318729})

    car.save()
});
Admin.findOne({name:'admin'}, function (err, user) {
    if(user == null){
        console.error('用户不存在!');
    }

    console.log(user)
    user.carlist.pop();
    user.carlist.pop();
    user.carlist.pop();
    user.save()
});*/
