const { Scale } = alias.require('@models');


module.exports = async function(scaleId) {

    let scale = await Scale.findOne({
        where: {
            id: scaleId
        }
    });

    return scale.get({plain: true})
};
