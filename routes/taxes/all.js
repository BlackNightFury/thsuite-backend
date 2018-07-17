const { Tax } = alias.require('@models');


module.exports = async function() {

    let taxes = await Tax.findAll({

    });

    return taxes.map(t => t.id);
};
