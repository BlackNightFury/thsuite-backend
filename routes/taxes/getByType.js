const { Tax } = alias.require('@models');


module.exports = async function(cannabisOnly) {

    let taxes = await Tax.findAll({
        where: {
            cannabisOnly: cannabisOnly
        }
    });

    return taxes.map(t => t.id);
};