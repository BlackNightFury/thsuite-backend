const SocketIO = require('socket.io-client');
const SerialPort = require('serialport');
const printer = require('printer');
const uuid = require('uuid');
const fs = require('fs');
const AsyncLock = require('async-lock');

const lock = new AsyncLock();

const idFilePath = 'id.txt';

//ACTIONS
const printReceipt = require('./print-receipt');
const openDrawer = require('./open-drawer');
const printTestLabel = require('./print-test-label');
const printTestReceipt = require('./print-test-receipt');
const printProductLabel = require('./print-product-label');
const printBarcodeLabel = require('./print-barcode-label');
const printTimeClockReport = require('./print-time-clock');
const printCloseDrawerReport = require('./print-close-drawer-report');

//LISTENERS
const ScaleListener = require('./scale-listen');

module.exports = class Proxy{

    socket;
    connected;
    disconnected;
    devices;
    proxyId;
    scales;
    scaleListeners;

    init(connected, disconnected, devices){
        //Testing
        let socket = SocketIO('http://localhost:3000/device-proxy', {transports: ['websocket']});
        // let socket = SocketIO('wss://stagingapi.thsuite.com/device-proxy', {transports: ['websocket']});
        // let socket = SocketIO('wss://co-grow-api.thsuite.com/device-proxy', {transports: ['websocket']});
        // let socket = SocketIO('wss://karing-kind-api.thsuite.com/device-proxy', {transports: ['websocket']});
        // let socket = SocketIO('wss://other-place-api.thsuite.com/device-proxy', {transports: ['websocket']});
        // let socket = SocketIO('wss://herban-legends-api.thsuite.com/device-proxy', {transports: ['websocket']});
        // let socket = SocketIO('wss://amedicanna-api.thsuite.com/device-proxy', {transports: ['websocket']});
        // let socket = SocketIO('wss://mana-supply-api.thsuite.com/device-proxy', {transports: ['websocket']});

        this.socket = socket;
        this.connected = connected;
        this.disconnected = disconnected;
        this.devices = devices;
        this.scales = [];
        this.scaleListeners = [];

        socket.on('connect', () => {
            console.log('Connected to socket');
            this.connected();
            this.initProxyId();
            this.registerPrinters(socket);
            this.onConnectScales(socket);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket');
            this.disconnected();
        });

        socket.on('refresh', () => {
            console.log("Got refresh");
            this.onRefreshScales(socket);
        });

        this.onConnectPrinters(socket);

    }

    restart(){
        this.socket.disconnect();
        this.init(this.connected, this.disconnected, this.devices);
    }

    initProxyId(){
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

        this.proxyId = proxyId;
    }

    async registerPrinters(socket){
        let printers = printer.getPrinters().filter(printer => printer.portName.substr(0, 3) == 'USB' || printer.portName.substr(0,6) == 'ESDPRT');


        let registerOptions = {
            id: this.proxyId,
            name: 'Test Printer Proxy',

            devices: printers,
            type: 'printer'
        };

        socket.emit('register', registerOptions, () => {
            console.log("Successfully registered");
            this.devices({type: 'printer', devices: printers});
        });
    }

    async onConnectPrinters(socket){
        socket.on('doPrint', function(msg, ack) {

            console.log('Received print request');
            console.log(msg);

            lock.acquire('key', function(){
                return printReceipt(msg);
            });

        });

        socket.on('openDrawer', function(msg, ack){
            console.log("Received open drawer request");
            console.log(msg);

            lock.acquire('key', function(){
                return openDrawer(msg);
            })

        });

        socket.on('printTransactionLabel', function(msg, ack){
            console.log("Received print transaction labels request");
            console.log(msg);

            lock.acquire('key', function(){
                return printProductLabel(msg);
            })
        });

        socket.on('printBarcodeLabel', function(msg, ack){
            console.log("Received print barcode labels request");
            console.log(msg);

            lock.acquire('key', function(){
                return printBarcodeLabel(msg);
            })
        });

        socket.on('printTimeClockReport', function(msg, ack){
            console.log("Received print time clock report request");
            console.log(msg);

            lock.acquire('key', function(){
                return printTimeClockReport(msg);
            })
        });

        socket.on('printCloseDrawerReport', function(msg, ack){
            console.log("Received print close drawer report request");
            console.log(msg);

            lock.acquire('key', function(){
                return printCloseDrawerReport(msg);
            })

        });

        socket.on('printTestReceipt', function(msg, ack){
            console.log("Received print test receipt request");
            console.log(msg);
            lock.acquire('key', function(){
                return printTestReceipt(msg);
            })
        });

        socket.on('printTestLabel', function(msg, ack){
            console.log("Received print test label request");
            console.log(msg);
            lock.acquire('key', function(){
                return printTestLabel(msg);
            })
        });
    }

    async onConnectScales(socket){
        let ports = await SerialPort.list();

        let scales = [];

        for(let port of ports){
            if(port.comName.substr(0,3) === "COM"){
                scales.push({
                    name: port.manufacturer,
                    portName: port.comName,
                    status: true
                })
            }
        }

        let registerOptions = {
            id: this.proxyId,
            name: 'Scale Proxy',

            devices: scales,
            type: 'scale'
        };

        socket.emit('register', registerOptions, () => {
            console.log("Successfully registered");
            this.scales = scales;
            this.devices({type: 'scale', devices: scales});
        });
    }

    async onRefreshScales(socket){
        let type = 'scale';
        let proxyId = this.proxyId;
        socket.emit('getRegisteredDevices', {proxyId, type}, async (devices) => {
            console.log("Got devices from backend");
            //Disconnect old ports
            for(let listener of this.scaleListeners){
                listener.close();
            }

            this.scaleListeners = [];

            for(let device of devices.data){
                let port = device.port;
                let deviceId = device.id;
                let listener = new ScaleListener();
                try{
                    let result = await listener.open({deviceId, port, socket});
                }catch(err){
                    for(let scale of this.scales){
                        if(scale.portName === port){
                            scale.status = false;
                        }
                    }
                }
                this.scaleListeners.push(listener);
            }
            console.log("Proxy sending devices ", this.scales);
            this.devices({type: 'scale', devices: this.scales});
        })
    }

    async printTestLabel(printer){
        console.log(printer);
        printTestLabel({name: printer});
    }

    async printTestReceipt(printer){
        console.log(printer);
        printTestReceipt({name: printer});
    }

}

