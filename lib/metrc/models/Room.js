'use strict';

const MetrcModel = require("./MetrcModel");

class Room extends MetrcModel {

    constructor({
        Id,
        Name
    }) {
        super();

        this.Id = Id;
        this.Name = Name;
    }

    static get(id) {
        return this.makeRequest('GET', `/rooms/v1/${id}`)
            .then(room => new Room(room))
    }

    static listActive(facilityLicense) {
        return this.makeRequest('GET', `/rooms/v1/active?licenseNumber=${facilityLicense}`)
            .map(room => new Room(room));
    }

    static create(facilityLicense, rooms) {
        if(!Array.isArray(rooms)) {
            rooms = [rooms];
        }

        return this.makeRequest('POST', `/rooms/v1/create?licenseNumber=${facilityLicense}`, rooms)
    }

    static update(facilityLicense, rooms) {
        if(!Array.isArray(rooms)) {
            rooms = [rooms];
        }

        return this.makeRequest('POST', `/rooms/v1/update?licenseNumber=${facilityLicense}`, rooms)
    }

    static delete(facilityLicense, id) {
        return this.makeRequest('DELETE', `/rooms/v1/${id}?licenseNumber=${facilityLicense}`)
    }
}

module.exports = Room;