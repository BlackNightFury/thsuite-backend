
const { Device } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(Device, function(existingDevice, device) {

    existingDevice.id = device.id;
    existingDevice.storeId = device.storeId;
    existingDevice.version = device.version;
    existingDevice.name = device.name;
});
