const { Drawer, Device } = alias.require('@models');

module.exports = async function(drawerIds) {

    const drawers = await Drawer.findAll({
        include: [ Device ],
        where: {
            id: {
                $in: drawerIds
            }
        }
    });

    return drawers.map(drawer => drawer.get({plain: true}));
};