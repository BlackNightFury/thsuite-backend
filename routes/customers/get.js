
const { Customer } = alias.require('@models');


module.exports = async function(customerId) {

    let customer = await Customer.findOne({
        attributes: {
            exclude: ['password']
        },
        where: {
            id: customerId
        }
    });

    return customer.get({plain: true})
};