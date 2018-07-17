'use strict';

const MetrcModel = require('./MetrcModel');

class Employee extends MetrcModel {

    constructor({
        FullName,
        License
    }) {
        super();

        this.FullName = FullName;
        this.License = License;
    }

    static list() {
        return this.makeRequest('GET', '/employees/v1')
            .map(employee => new Employee(employee));
    }
}

module.exports = Employee;