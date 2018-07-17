
const { Supplier } = alias.require('@models');


module.exports = async function(supplierId) {

    let supplier = await Supplier.findOne({
        where: {
            id: supplierId
        }
    });

    if(supplier) {
        return supplier.get({plain: true});
    }
};