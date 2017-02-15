/**
 * Created by kwonghinho on 16/4/26.
 */
//events 是一个模块,名字是固定的,并不是随便起的
var events = require('events');
//创建eventsEmitter对象来监听触发事件, on 是绑定事件,emit 是触发事件
var eventsEmitter = new events.EventEmitter();
//1
var listener1 = function () {
    console.log('------- 1 --------');
}
//2
var listener2 = function () {
    console.log('------- 2 --------');
}

eventsEmitter.addListener('connection',listener1);

eventsEmitter.on('connection',listener2);

var eventsListeners = require('events').EventEmitter.listenerCount(eventsEmitter,'connection');
console.log(eventsListeners+'个监听器监听 connection 事件');

eventsEmitter.emit('connection');

//移除绑定的 listener1 的函数
eventsEmitter.removeListener('connection',listener1);
console.log('listener1 不受监听了');

eventsEmitter.emit('connection');
eventsListeners = require('events').EventEmitter.listenerCount(eventsEmitter,'connection');
console.log(eventsListeners+'个监听器监听 connection 事件');
eventsEmitter.emit('error');