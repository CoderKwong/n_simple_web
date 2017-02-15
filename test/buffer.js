/**
 * Created by kwonghinho on 16/4/26.
 */
var buf1 = new Buffer('hello world');
var buf2 = new Buffer('kwong');
//拼接字符串
var buf3 = Buffer.concat([buf1,buf2]);
console.log(buf3.toString());
console.log(buf3.toJSON());
//比较buf2和buf1是否相同
console.log(buf2.equals(buf1));
//拷贝
buf1.copy(buf2);
console.log('拷贝之后:'+buf2.toString());