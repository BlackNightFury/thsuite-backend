const { Scale } = alias.require('@models');


module.exports = async function() {

    let scales = await Scale.findAll({
        where: {
            isEnabled: true
        }
    });

    return scales.map(t => t.id);
};

