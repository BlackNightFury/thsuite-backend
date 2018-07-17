
const { StoreOversaleLimit } = alias.require('@models');


module.exports = async function(oversaleLimitId) {

    let oversaleLimit = await StoreOversaleLimit.findOne({
        where: {
            id: oversaleLimitId
        }
    });

    return oversaleLimit.get({plain: true});

};