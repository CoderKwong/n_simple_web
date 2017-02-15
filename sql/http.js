/**
 * Created by kwonghinho on 2017/2/5.
 */
var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
const dbconfig = require('./dbconfig.js');
const mysql = require('mysql');
const pool = mysql.createPool(dbconfig.mysql);
// var outputFilename = './my.json';
//封装查询方法
function once(sql,cb){
    pool.getConnection(function(err,con){
        if(!con || err){
            cb(err,null)
        }else{
            con.query(sql,function(err,result){
                con.release();
                cb(err,result);
            })
        }
    });
}

module.exports = {
    getUserinfo:function (page) {
        //json转换为字符串
        var data = querystring.stringify({
            token:'2680zpzaDfjDBco+gEqxool4AKV8Lo36O3viufJKx3pTxrb8',
            page:page
        });
        var options = {
            host: 'app.wanxiaohao.cn',
            path:'/Api/Fans/index',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data)
            }
        };
        var jsonStr = '';
        var outputFilename = './my.json';
        var req = http.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                jsonStr += chunk;
            });
            res.on('end',function(chunk){
                var userArray = JSON.parse(jsonStr).data.rmd_list;//用户数据列表
                for(var i in userArray){
                    var sql = 'select * from userinfo_app where id=\''+userArray[i].id+'\'';
                    (function (i) {
                        once(sql,function (err, result) {
                            if(result.length>=1){
                                console.log('已存在,不执行插入操作');
                            }else{
                                console.log(userArray[i].id);
                                var userinfo = userArray[i];
                                var sql = 'insert into userinfo_app(id,username,weixin,qrcode,qrdata,province,city,headimgurl,description,nickname,view,a_id,b_id,c_id,member) values' +
                                    '(\'' + userinfo.id + '\',\'' + userinfo.username + '\',\'' + userinfo.weixin + '\',\'' + userinfo.qrcode + '\',\'' + userinfo.qrdata + '\',\'' + userinfo.province + '\',\'' + userinfo.city + '\',\'' + userinfo.headimgurl + '\',\'' + userinfo.description + '\',\'' + userinfo.nickname + '\',\'' + userinfo.view + '\',\'' + userinfo.a_id + '\',\'' + userinfo.b_id + '\',\'' + userinfo.c_id + '\',\'' + userinfo.member + '\')';
                                once(sql,function (err,result) {
                                    if(err){
                                        console.log('[query] - : '+err);
                                    }else{
                                        console.log('不存在,执行插入操作,插入成功');
                                    }
                                })
                            }
                        })
                    })(i)
                }
            })
        });
        req.write(data);
        req.end();
    }
}