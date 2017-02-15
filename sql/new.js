/**
 * Created by kwonghinho on 2017/2/5.
 */
var http = require('http');
var querystring = require('querystring');
const dbconfig = require('./dbconfig.js');
const mysql = require('mysql');
const pool = mysql.createPool(dbconfig.mysql);
var fs = require('fs');
var outputFilename = './my.json';
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
        var data = querystring.stringify({
            g:'Home',
            m:'Fans',
            a:'getfans',
            page:page
        });
        var options = {
            host:'80zs.cn',
            path:'/index.php?'+data,
            method:'GET',
            headers: { // 必选信息, 如果不知道哪些信息是必须的, 建议用抓包工具看一下, 都写上也无妨...
                'Content-Type': 'application/json',
                'Cookie':'PHPSESSID=6up9vt5lou1bh5ui60ip2efk36; encode_uid=8d08wJBLNANpe4bqZnyu%2BHZBG08yJLaFttjQG7HGKAJ8nEb6; fans_count=10; scan_total=0; CNZZDATA1259871451=34715933-1486285235-null%7C1486285235'
            }
        }
        var jsonStr = '';
        var req = http.request(options,function (res) {
            res.on('data',function (chunk) {
                jsonStr += chunk;
            });
            res.on('end',function (chunk) {
                // console.log(jsonStr);
                var userArray = JSON.parse(jsonStr).flist;
                // console.log(userArray[0].id);
                for(var i = 0;i<userArray.length;i++){
                    var sql = 'select * from userinfo where weixin =\'' + userArray[i].weixin + '\'';
                    //解决闭包
                    (function (i) {
                        once(sql,function (err,result) {
                            if(result.length>=1){
                                console.log('微信号:'+userArray[i].weixin+'---已存在,不执行插入操作');
                            }else{
                                var userinfo = userArray[i];
                                var sql = 'insert into userinfo(id,username,weixin,qrcode,qrdata,province,city,headimgurl,description,nickname,view,a_id,b_id,c_id,member) values' +
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
                    })(i);
                }
            })
        })
        req.write(data);
        req.end();
    }
}