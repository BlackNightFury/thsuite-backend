
const { Supplier } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(Supplier, function(existingSupplier, supplier) {

    existingSupplier.id = supplier.id;
    existingSupplier.version = supplier.version;
    existingSupplier.name = supplier.name;

    existingSupplier.streetAddress = supplier.streetAddress;
    existingSupplier.city = supplier.city;
    existingSupplier.state = supplier.state;
    existingSupplier.zip = supplier.zip;
    existingSupplier.phone = supplier.phone;
    existingSupplier.contactName = supplier.contactName;


});