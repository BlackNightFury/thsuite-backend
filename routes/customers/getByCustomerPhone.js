const { Customer } = alias.require('@models');


module.exports = async function(customer) {
    let customerPhone = customer.phone;
    let _customers = await Customer.findOne({
        where: {
            phone: customerPhone
        },
    });//comment
    
    if(!_customers){
        console.log("new customer");
        let  newCustomer = Customer.build({});
        newCustomer.id = customer.id;
        newCustomer.firstName = customer.firstName;
        newCustomer.lastName = customer.lastName;
        newCustomer.email = customer.email;
        newCustomer.phone = customer.phone;
        await newCustomer.save();

        _customers = newCustomer;
    }
    return _customers.get();
};