'use strict';

const request = require('request-promise');
const promiseRetry = require('promise-retry');

const config = require('../config');

let _request;

class MetrcModel {

    constructor() {

    }

    static makeRequest(method, url, body) {

        if(!_request){
            _request = request.defaults({
                baseUrl: config.baseUrl,
                auth: {
                    user: config.vendorKey,
                    pass: config.userKey,
                    sendImmediately: true
                },
                json: true
            });
        }

        return promiseRetry((retry, number) => {
            return _request({
                url: url,
                method: method,
                body: body
            }).catch(err => {
                if(err.error && err.error.code === 'ETIMEDOUT') {
                    console.log("Retrying after timeout");
                    return retry(err);
                }
                else {
                    console.log("Not retrying after error")
                    console.log(err);
                }

                throw err;
            })
        });
    }
}

module.exports = MetrcModel;