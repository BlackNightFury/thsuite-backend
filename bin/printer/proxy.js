const SocketIO = require('socket.io-client');
const printer = require('printer');
const uuid = require('uuid');
const fs = require('fs');
const AsyncLock = require('async-lock');

const lock = new AsyncLock();

const idFilePath = 'id.txt';

const printReceipt = require('./print-receipt');

let socket = SocketIO('wss://stagingapi.thsuite.com/device-proxy', {transports: ['websocket']});

socket.on('connect', function() {
    console.log('Connected to socket');
    onConnect(socket);
});

socket.on('disconnect', function() {
    console.log('Disconnected from socket');
});



async function onConnect(socket) {

    socket.on('doPrint', function(msg, ack) {

        console.log('Received print request');
        console.log(msg);

        lock.acquire('key', function(){
            return printReceipt(msg);
        });

    });

    let printers = printer.getPrinters().filter(printer => printer.portName.substr(0, 3) == 'USB');

    //Check if id file exists
    let proxyId;
    if(fs.existsSync(idFilePath)){
        //Read id from file
        proxyId = fs.readFileSync(idFilePath, 'utf8');
    }else{
        //Generate new uuid
        proxyId = uuid.v4();
        fs.writeFileSync(idFilePath, proxyId);
    }

    let registerOptions = {
        id: proxyId,
        name: 'Test Printer Proxy',

        devices: printers,
        type: 'printer'
    };

    socket.emit('register', registerOptions, function() {
        console.log("Successfully registered")
    });

}