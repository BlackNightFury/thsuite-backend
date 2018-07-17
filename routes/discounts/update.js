
const { Discount } = alias.require('@models');

const moment = require('moment');

module.exports = async function(discount) {

    let existingDiscount = await Discount.find({
        where: {
            id: discount.id,
            //TODO clientId: req.user.clientId
        }
    });

    if(!existingDiscount) {
        existingDiscount = Discount.build({});
    }

    let isNewRecord = existingDiscount.isNewRecord;

    if(!isNewRecord) {
        // if(existingDiscount.version !== existingDiscount.version) {
        //     throw new Error("Version mismatch");
        // }

        existingDiscount.version++;
    }

    existingDiscount.id = discount.id;
    existingDiscount.version = discount.version;
    existingDiscount.name = discount.name;
    existingDiscount.code = discount.code;
    existingDiscount.amountType = discount.amountType;
    existingDiscount.amount = discount.amount;
    existingDiscount.minimumType = discount.minimumType;
    existingDiscount.minimum = discount.minimum;
    existingDiscount.maximum = discount.maximum;
    existingDiscount.startDate = discount.startDate && moment.utc(discount.startDate).format('YYYY-MM-DD');
    existingDiscount.endDate = discount.endDate && moment.utc(discount.endDate).format('YYYY-MM-DD');
    existingDiscount.startTime = discount.startTime && moment.utc(discount.startTime).format('HH:mm:ss');
    existingDiscount.endTime = discount.endTime && moment.utc(discount.endTime).format('HH:mm:ss');
    existingDiscount.days = discount.days.join(',');
    existingDiscount.patientType = discount.patientType;
    existingDiscount.patientGroupId = discount.patientGroupId;
    existingDiscount.productTypeId = discount.productTypeId || null;
    existingDiscount.productId = discount.productId || null;
    existingDiscount.packageId = discount.packageId || null;
    existingDiscount.lineItemId = discount.lineItemId || null;
    existingDiscount.supplierId = discount.supplierId || null;
    existingDiscount.isActive = discount.isActive;
    existingDiscount.isAutomatic = discount.isAutomatic;
    existingDiscount.isCustom = discount.isCustom;
    existingDiscount.isOverride = discount.isOverride;
    existingDiscount.managerApproval = discount.managerApproval;
    existingDiscount.thcType = discount.thcType;
    existingDiscount.notes = discount.notes;
    
    await existingDiscount.save();

    if(isNewRecord) {
        this.broadcast.emit('create', existingDiscount.get());
    }
    else {
        this.broadcast.emit('update', existingDiscount.get());
    }

    return existingDiscount
};
