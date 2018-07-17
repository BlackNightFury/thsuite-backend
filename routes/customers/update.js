
const { Customer } = alias.require('@models');


module.exports = async function(customer) {

    let existingCustomer = await Customer.find({
        where: {
            id: customer.id,
            //TODO clientId: req.user.clientId
        }
    });

    if(!existingCustomer) {
        existingCustomer = Customer.build({});
    }

    let isNewRecord = existingCustomer.isNewRecord;

    existingCustomer.id = customer.id;

    existingCustomer.firstName = customer.firstName;
    existingCustomer.lastName = customer.lastName;
    existingCustomer.email = customer.email;
    existingCustomer.phone = customer.phone;
    existingCustomer.points = customer.points;

    await existingCustomer.save();

    if(isNewRecord) {
        this.broadcast.emit('create', existingCustomer.get());
    }
    else {
        this.broadcast.emit('update', existingCustomer.get());
    }

    return existingCustomer
};