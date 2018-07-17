const config = require('../config');
module.exports = async function(...args){
    let next = args[args.length - 1];

    if(!config.environment.requireAuthenticated || this.client.authenticated){
        return await next();
    }else{
        throw new Error('Unauthorized');
    }
}
