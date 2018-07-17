const {DrawerLog} = alias.require('@models');

module.exports = async function({drawerId}){

    let drawerLogs = await DrawerLog.findAll({ where: { drawerId }})

    return drawerLogs.map(r => r.id);
};
