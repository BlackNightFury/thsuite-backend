const ipc = require('node-ipc');
(function(){

    let env = process.argv[2];

    if(!env){
        console.log("Environment must be specified. Cannot refresh all envs at once!");
        process.exit(0);
    }

    let backendId = `backend-${env}`;

    ipc.config.id = 'reloader';
    ipc.config.maxRetries = 5;
    ipc.connectTo(`backend-${env}`, () => {
        ipc.of[`${backendId}`].on('connect', () => {
            console.log(`## connected to ${env} backend ##`);
            console.log("Sending reload...");
            ipc.of[`${backendId}`].emit('reload');
        });

        ipc.of[`${backendId}`].on('disconnect', () => {
            console.log(`## disconnected from ${env} backend ##`);
        });

        ipc.of[`${backendId}`].on('complete', () => {
            console.log('Backend confirmed reload emitted...');
            process.exit(0);
        })
    })

})();
