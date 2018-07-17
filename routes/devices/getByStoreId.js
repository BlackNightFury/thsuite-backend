const {Device} = alias.require('@models');

module.exports = async function({storeId}){

    let devices = await Device.findAll({ where: { storeId } } )

    return devices.map(r => r.id);
}
