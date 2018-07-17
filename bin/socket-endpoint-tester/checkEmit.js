const SocketIO = require('socket.io-client');
(async function(){

    let namespace = process.argv[2];

    let socket = SocketIO(`http://localhost:3008/${namespace}`, {transports: ['websocket']});

    socket.on('connect', () => {
        console.log(`Successfully connected to socket on ${namespace} namespace`);
    });

    let event = process.argv[3];

    console.log(`Now listening for ${event} on the socket`);
    socket.on(event, (data) => {
        console.log(`${event} emitted`);
        console.log(data);
    });

    setInterval(()=>{}, 10000);

    // let endpoint = process.argv[3];
    //
    // let data;
    //
    // try{
    //     data = JSON.parse(process.argv[4]);
    // }catch(e){
    //     data = process.argv[4];
    // }
    //
    // console.log(data);
    //
    // socket.emit(endpoint, data, (result) => {
    //     console.log("Received result");
    //     console.log(result);
    //     return;
    // })

})();

