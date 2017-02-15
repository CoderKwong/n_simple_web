/**
 * Created by kwonghinho on 2016/10/2.
 */
var mysql = require('mysql');
var connection = mysql.createConnection({
   host:'localhost',
    port:'3306',
    user:'root',
    password:'root'
});
//创建连接
connection.connect(function (err) {
    if(err){
        console.log('[query] - :'+err);
        return;
    }
    console.log('[connection connect]  succeed!');
});