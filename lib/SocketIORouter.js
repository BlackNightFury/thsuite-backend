'use strict';

class SocketIORouter {
    constructor() {
        this.events = Object.create(null);
        this.globalHandlers = [];
    }
    use(handler) {
        this.globalHandlers.push(handler);
    }
    on(event, ...handlers) {

        handlers = handlers.reverse();

        for(let handler of this.globalHandlers) {
            handlers.push(handler);
        }

        this.events[event] = function(...args){
            let handlerProxy = () => {};
            for(let handler of handlers) {
                let nextHandlerProxy = handlerProxy;
                handlerProxy = () => {
                    let innerArgs = args.slice();
                    innerArgs.push(nextHandlerProxy);
                    return handler.apply(this, innerArgs);
                }
            }
            return handlerProxy.apply(this);
        }
    }
    bind(socket) {
        console.log("New Socket Connection " + socket.id);

        Object.keys(this.events).forEach(event => {
            socket.on(event, this.events[event])
        });

        socket.use(function(packet, next) {
            console.log(socket.nsp.name, packet);

            next();
        });
    }
}

module.exports = SocketIORouter;