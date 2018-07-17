const { Drawer } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(Drawer, function(existingDrawer, drawer) {

    existingDrawer.id = drawer.id;
    existingDrawer.deviceId = drawer.deviceId;
    existingDrawer.version = drawer.version;
    existingDrawer.startingAmount = drawer.startingAmount;
    existingDrawer.openedBy = drawer.openedBy;
    existingDrawer.closedAt = drawer.closedAt;
    existingDrawer.closedByUserId = drawer.closedByUserId;
    existingDrawer.notesForCloser = drawer.notesForCloser;
    existingDrawer.currentUserId = drawer.currentUserId;
    existingDrawer.endingAmount = drawer.endingAmount;
});
