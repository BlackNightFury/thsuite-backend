const { DrawerLog } = alias.require('@models');

module.exports = async function({drawerLog}) {

    let drawerLogToSave = DrawerLog.build(drawerLog);

    const savedDrawerLog = await drawerLogToSave.save();

    return {success: true, savedDrawerLog}
};
