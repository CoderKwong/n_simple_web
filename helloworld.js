/**
 * Created by kwonghinho on 16/4/26.
 */
//阻塞代码例子,需要等文件读取完成之后才执行代码
//var fs = require('fs');
//data = fs.readFileSync('input');
//console.log(data.toString());
//console.log('程序强制结束');

//非阻塞代码例子,不需要等文件读取完成,在读取文件的同时就可以执行代码,提高程序的性能
var fs = require('fs');
fs.readFile('input', function (err, data) {
    if(err) {
        return console.log(err);
    }
    console.log(data.toString());
});
console.log('程序强制结束');