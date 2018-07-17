const { DrawerRemoval } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(DrawerRemoval, function(existingDrawerRemoval, drawerRemoval) {

    existingDrawerRemoval.id = drawerRemoval.id;
    existingDrawerRemoval.version = drawerRemoval.version;

    existingDrawerRemoval.drawerId = drawerRemoval.drawerId;
    existingDrawerRemoval.userId = drawerRemoval.userId;
    existingDrawerRemoval.removedAmount = drawerRemoval.removedAmount;

});
