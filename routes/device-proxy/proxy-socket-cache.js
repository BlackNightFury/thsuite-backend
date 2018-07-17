
let cache = Object.create(null);

let socketIdDeviceProxyMap = Object.create(null);

module.exports = {

    register: function(id, socket) {

        if(cache[id]){
            let sockets = cache[id];
            let existingSocket = sockets.find(s => s.id === socket.id);
            if(!existingSocket){
                cache[id].push(socket);
            }
        }else{
            cache[id] = [socket];
        }

        if(socketIdDeviceProxyMap[socket.id]){
            if(socketIdDeviceProxyMap[socket.id].indexOf(id) === -1){
                socketIdDeviceProxyMap[socket.id].push(id);
            }
        }else{
            socketIdDeviceProxyMap[socket.id] = [id];
        }

    },

    unregister: function(socketId){
        if(socketIdDeviceProxyMap[socketId]) {
            delete cache[socketIdDeviceProxyMap[socketId]];
            delete socketIdDeviceProxyMap[socketId];
        }
    },

    get: function(id) {
        return cache[id];
    },

    getDeviceProxyId: function(id){
        return socketIdDeviceProxyMap[id];
    },

    showCaches: function(){
        console.log(cache);
        console.log(socketIdDeviceProxyMap);
    }
};