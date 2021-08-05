const EventEmitter = require('events');

class MyEmitter extends EventEmitter { }

const customEvent = new MyEmitter();

module.exports = {
    customEvent
}