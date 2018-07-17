"use strict";

const Alias = require('require-alias');
global.alias = new Alias({
    root: __dirname,
    aliases: {
        '@root': '/',
        '@config': '/config',
        '@models': '/models',
        '@lib': '/lib'
    }
});


const SocketIOServer = require('socket.io');
const SocketIOSocket = require('socket.io/lib/socket');
const SocketIONamespace = require('socket.io/lib/namespace');

const SocketIOSocketOldOn = SocketIOSocket.prototype.on;

Object.defineProperties(SocketIOServer.prototype, {
    bindTo: {
        value: function(router) {
            this.use(function(socket, next) {
                router.bind(socket);
                next();
            });
        }
    }
});
Object.defineProperties(SocketIONamespace.prototype, {
    bindTo: {
        value: function(router) {
            this.use(function(socket, next) {
                router.bind(socket);
                next();
            });
        }
    }
});
Object.defineProperties(SocketIOSocket.prototype, {
    on: {
        value: function(event, handler) {
            let socket = this;

            SocketIOSocketOldOn.call(this, event, async function() {
                let ack = typeof arguments[arguments.length - 1] == 'function' && arguments[arguments.length - 1];

                //TODO: If you are trying to throw synchronous errors add a try catch here
                let maybePromise = handler.apply(socket, arguments);

                if(maybePromise && maybePromise.then && maybePromise.catch) {
                    try {
                        let result = await maybePromise;

                        if(typeof ack === 'function') {
                            ack({
                                success: true,
                                data: result
                            })
                        }
                    }
                    catch(err) {
                        console.error(err);
                        ack({
                            success: false,
                            error: err && {name: err.name, message: err.message, stack: err.stack}
                        })
                    }
                }
            });
        }
    }
});



// let ejs = require('ejs');
// ejs.filters = {};
// ejs.filters.formatDollars = function(dollars) {
//     let opts = { format: '%s%v', code: 'USD', symbol: '$' };
//     return formatCurrency(dollars, opts);
// };

const formatCurrency = require('format-currency');
const commaNumber = require('comma-number');
Object.defineProperties(String.prototype, {
    commify: {
        value: function(){
            return commaNumber(this);
        }
    },
    formatCurrency: {
        value: function(){
            let options = {format: '%s%v', code: 'USD', symbol: '$'};
            return formatCurrency(this, options);
        }
    },
    lpad: {
        value: function(padString, length){
            let str = this;
            while(str.length < length){
                str = padString + str;
            }

            return str;
        }
    }
});

Object.defineProperties(Number.prototype, {
    commify: {
        value: function(){
            return this.toString().commify();
        }
    },
    formatCurrency: {
        value: function(){
            return this.toString().formatCurrency();
        }
    },
});

global.Promise = require('bluebird');