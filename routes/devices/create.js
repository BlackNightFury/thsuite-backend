const { Device } = alias.require('@models');
const moment = require('moment');

module.exports = async function({device}) {

    device.createdAt = moment().format();

    let deviceToSave = Device.build(device);

    await deviceToSave.save();

    return {success: true, device};

};
