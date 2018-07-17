
const { Supplier } = alias.require('@models');


module.exports = async function(args) {


    let suppliers = await Supplier.findAll({
        attributes: ['id'],

    });

    return suppliers.map(supplier => supplier.id);
};