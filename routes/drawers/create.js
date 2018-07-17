const { Drawer } = alias.require('@models');

module.exports = async function({drawer}) {

    let drawerToSave = Drawer.build(drawer);

    const savedDrawer = await drawerToSave.save();

    return {success: true, savedDrawer: savedDrawer.get()}
};
