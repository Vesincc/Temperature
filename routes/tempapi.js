/**
 * Created by HanQi on 16/5/20.
 */
var router = require('express').Router();
var AV = require('leanengine');
var moment = require("moment");
var TempInfo = AV.Object.extend('TempInfo');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Todo = AV.Object.extend('Todo');

router.get('/addinfo', function(req, res, next) {
    var post = req.query.post;
    var temp = req.query.temp;
    var tempInfo = new TempInfo();
    tempInfo.set('post', post);
    tempInfo.set('temp', temp);
    tempInfo.save().then(function () {
        var result = {
            code : 200,
            message : '操作成功'
        }
        res.send(result);
    });
});

router.get('/getinfo', function(req, res, next) {
    var date = req.query.date == null ? null : req.query.date;
    var post = req.query.post == null ? null : req.query.post;

    var query = new AV.Query('TempInfo');
    query.addDescending('updatedAt');
    if (post != null) {
        query.equalTo('post', post);
    }
    if (date != null) {
        console.log(date);
        query.greaterThan('updatedAt', new Date(date + ' 00:00:00'));
        query.lessThan('updatedAt', new Date(date + ' 23:59:59'));
    }
    query.find().then(function (resultes) {
        console.log();
        for (var i = 0 ; i < resultes.length; i++) {
            resultes[i].updatedAt = moment(resultes[i].updatedAt).format("YYYY-MM-DD HH:mm:ss");
            resultes[i].createdAt = moment(resultes[i].createdAt).format("YYYY-MM-DD HH:mm:ss");
        }
        var data = {
            code : 200,
            data : resultes,
            message : '操作成功'
        }
        res.send(data);
    });

});



module.exports = router;
