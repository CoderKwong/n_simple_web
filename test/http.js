/**
 * Created by kwonghinho on 16/6/18.
 */
var http = require('http');
var fs = require('fs');
http.createServer(function(request,resp){
    fs.readFile('../html/index.html', function (err, data) {
        if(err){
            console.log(err);
            resp.writeHead(404,{'Content-Type':'text/html'});
        }else{
            resp.writeHead(200,{'Content-Type':'text/html'});
            resp.write(data.toString());
        }
        resp.end();
    })
}).listen(8888);
console.log('This Server running at http://127.0.0.1:8888');