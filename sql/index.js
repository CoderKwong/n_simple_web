/**
 * Created by kwonghinho on 2017/2/5.
 */
const http = require('./http.js');
var count = 1;
function getInfo() {
    // for(var i=1;i<=50;i++){
    http.getUserinfo(1);
    // }
    console.log('这是第 '+ count +' 次,自动运行');
    count++;
}
setInterval(getInfo,5000);