"use strict";

const allConfigs = require('./config');
const extend = require('extend');
const env = process.env.NODE_ENV || 'development';
let metrcConfig;
try{
    metrcConfig = require('./metrc');
}catch(e){
    if(env != 'development'){
        console.log("Metrc config missing. If this is not production, you can ignore.");
    }
    metrcConfig = {};
}
const globalConfig = extend(true, {}, allConfigs.all);

module.exports = extend(true, globalConfig, allConfigs[env], metrcConfig[env]);