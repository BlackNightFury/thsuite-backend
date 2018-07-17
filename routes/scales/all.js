const { Scale } = alias.require('@models');


module.exports = async function() {

    let scales = await Scale.findAll({

    });

    return scales.map(t => t.id);
};
