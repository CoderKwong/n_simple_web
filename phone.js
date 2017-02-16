/**
 * Created by kwonghinho on 2017/2/14.
 */
var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
const dbconfig = require('./dbconfig.js');
const mysql = require('mysql');
const pool = mysql.createPool(dbconfig.mysql);
var count = 1;
var insertCount = 0;
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
//
function getPhone() {
    //json转换为字符串
    var data = querystring.stringify({
        token:'2680zpzaDfjDBco+gEqxool4AKV8Lo36O3viufJKx3pTxrb8',
        num:100
    });
    var options = {
        host: 'app.wanxiaohao.cn',
        path:'/Api/Tool/area',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };
    var jsonStr = '';
    var req = http.request(options,function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            jsonStr += chunk;
        });
        res.on('end',function (chunk) {
            var phoneList = JSON.parse(jsonStr).data.list,phonelistStr='';
            console.log('正在执行第 '+count+' 次查询');count++;
            for(var i in phoneList){
                var sql = 'select * from wechat where phone = \''+phoneList[i]+'\'';
                (function (i) {
                    once(sql,function (err, result) {
                        if(result.length>0){
                            // console.log(phoneList[i]+'----已存在,不执行插入操作');
                        }else{
                            once('insert into wechat(phone) values(\''+phoneList[i]+'\')',function (err, result) {
                                if(err){
                                    console.log('[query] - : '+err);
                                }else{
                                    console.log('不存在,执行插入操作,插入成功');
                                    insertCount++;
                                    if(i==phoneList.length-1){
                                        console.log('已插入: '+insertCount+' 条');
                                    }
                                }
                            });
                        }
                    });
                })(i);
            }
        })
    });
    req.write(data);
    req.end();
}
// getPhone();
setInterval(function () {
    getPhone();
},5000)