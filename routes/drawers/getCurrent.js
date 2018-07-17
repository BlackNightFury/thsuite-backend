const {Drawer} = alias.require('@models');
const moment = require('moment');

module.exports = async function({deviceId}){

    let drawers = await Drawer.findAll({
        order: [ [ 'createdAt', 'DESC' ] ],
        where: {
            deviceId,
            endingAmount: null
        }
    });

    if(!drawers.length){
        return null;
    }else{
        return drawers[0].id;
    }


}
