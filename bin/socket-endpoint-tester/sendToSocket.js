const SocketIO = require('socket.io-client');
(async function(){

    const sendMessage = () => {
        let namespace = process.argv[2];

        let socket = SocketIO(`http://localhost:3000/${namespace}`, {transports: ['websocket']});

        let endpoint = process.argv[3];

        let data;

        try{
            data = JSON.parse(process.argv[4]);
        }catch(e){
            console.log("Failed to parse JSON");
            data = process.argv[4];
        }

        console.log(data);

        socket.emit(endpoint, data, (result) => {
            console.log("Received result");
            console.log(result);
            return;
        })
    };
    if(parseInt(process.argv[5])) {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBhODhlYTY2LWY0ZGUtNDk5Yi1hYzUzLTNmNjgwYzE4ZGQ1NCIsImVtYWlsIjoiYXBpQG1pZHdlc3Rjb21wYXNzaW9uLmNvbSIsImlhdCI6MTUyNTM3Njk4MCwiZXhwIjoxNTQwOTI4OTgwfQ.0vCgERGCZWCLxbjIJBm2PKHKDSSweivwXUaI2FsABms';

        let s = SocketIO('http://localhost:3008/users', {transports: ['websocket']});

        s.on('connect', () => {
            s.emit('loginWithToken', {loginToken: token}, (result) => {
                if (result) {
                    console.log('successfully authenticated');
                    sendMessage();
                }
            });
        })
    }else{
        sendMessage();
    }



})();
