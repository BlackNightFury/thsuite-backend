
const {StoreOversaleLimit} = alias.require('@models');

module.exports = async function(storeId){

    let oversaleLimit = await StoreOversaleLimit.findOne({
        where: {
            storeId: storeId
        }
    });

    return oversaleLimit.get({plain: true});

}
