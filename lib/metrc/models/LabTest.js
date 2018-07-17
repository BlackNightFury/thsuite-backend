'use strict';

const MetrcModel = require('./MetrcModel');

class UnitOfMeasure extends MetrcModel {


    static create(facilityLicense, tests) {
        if(!Array.isArray(tests)) {
            tests = [tests];
        }

        this.makeRequest('POST', `/labtests/v1/record?licenseNumber=${facilityLicense}`, tests);
    }

    static listTypes() {
        return this.makeRequest('GET', '/labtests/v1/types')
    }

    static listStates() {
        return this.makeRequest('GET', '/labtests/v1/states')
    }
}

module.exports = UnitOfMeasure;