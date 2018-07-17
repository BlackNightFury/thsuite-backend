const {Receipt} = alias.require('@models');

module.exports = async function({drawerId}){

    let receipts = await Receipt.findAll({ where: { drawerId } } )

    return receipts.map(r => r.id);
}
