const {DrawerRemoval} = alias.require('@models');

module.exports = async function({drawerId}){
    console.log("passed to backend")
    let drawerRemoval = await DrawerRemoval.findAll({ where: { drawerId }})
    console.log("drawerRemovals queried");
    return drawerRemoval.map(r => r.id);
};
