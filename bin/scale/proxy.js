const SocketIO = require('socket.io-client');
const SerialPort = require('serialport');
const uuid = require('uuid');

const Listener = require('./listen');

let proxyId;

let socket = SocketIO('http://localhost:3000/device-proxy');

socket.on('connect', function() {
    console.log('Connected to socket');
    onConnect(socket);
});

socket.on('refresh', function(){
    console.log("Got refresh");
    onRefresh(socket);
});

socket.on('disconnect', function() {
    console.log('Disconnected from socket');
});


function onRefresh(socket){

    let type = 'scale';

    socket.emit('getRegisteredDevices', {proxyId, type}, function(devices){
        console.log("Got devices");
        for(let device of devices.data){
            let port = device.port;
            let deviceId = device.id;
            Listener({deviceId, port, socket});
        }
    })

}


async function onConnect(socket) {

    let ports = await SerialPort.list();

    let scales = [];

    for(let port of ports){
        if(port.comName.substr(0,3) === "COM"){
            scales.push({
                name: port.manufacturer,
                portName: port.comName
            })
        }
    }

    let registerOptions = {
        id: uuid.v4(),
        name: 'Scale Proxy',

        devices: scales,
        type: 'scale'
    };

    proxyId = registerOptions.id;

    socket.emit('register', registerOptions, function() {
        console.log("Successfully registered")
    });

}