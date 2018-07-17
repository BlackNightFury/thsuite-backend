const { PosDevice } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(PosDevice, function(existingPosDevice, posDevice) {

    existingPosDevice.id = posDevice.id;
    existingPosDevice.userId = posDevice.userId;

});
