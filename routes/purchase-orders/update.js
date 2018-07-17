const uuid = require('uuid');

const { PurchaseOrder, AdjustmentLog, Package, Store } = alias.require('@models');

module.exports = async function(adjustment){
    let existingAdjustment = await PurchaseOrder.find({
        where: {
            id: adjustment.id
        }
    });

    if(!existingAdjustment){
        existingAdjustment = PurchaseOrder.build({});
    }

    let isNewRecord = existingAdjustment.isNewRecord;

    if(!isNewRecord){
        //Shouldn't be possible, just including for completeness
        existingAdjustment.version++;
    }

    existingAdjustment.id = adjustment.id;
    existingAdjustment.userId = adjustment.userId;
    existingAdjustment.packageId = adjustment.packageId;
    existingAdjustment.itemId = adjustment.itemId;
    existingAdjustment.amount = adjustment.amount;
    existingAdjustment.price = adjustment.price;
    existingAdjustment.notes = adjustment.notes;
    existingAdjustment.date = adjustment.date;

    const _package = await Package.findOne({
        where: {
            id: existingAdjustment.packageId
        }
    });


    if(_package.MetrcId === 0){
        //No submit to metrc
        await existingAdjustment.save();

        if(isNewRecord) {
            this.broadcast.emit('create', existingAdjustment.get());
        }
        else {
            this.broadcast.emit('update', existingAdjustment.get());
        }

        return existingAdjustment;
    }
};