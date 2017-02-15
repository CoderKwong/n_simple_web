/**
 * Created by kwonghinho on 2017/2/5.
 */
const http = require('./new.js');
var page = 1;
var count = 1;
function getInfo() {
    http.getUserinfo(page);
    console.log('这是第 '+ count +' 次,自动运行');
    count++;
}
setInterval(getInfo,5000);
// function getInfo(count) {
//     http.getUserinfo(count);
//     console.log('正在抓取第 '+ count +' 页的记录');
//     page++;
// }
// setInterval(function () {
//     getInfo(page);
// },500)