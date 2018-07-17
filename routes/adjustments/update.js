const uuid = require('uuid');

const { Adjustment, AdjustmentLog, Package, Store } = alias.require('@models');

const {Package: MetrcPackage} = alias.require('@lib/metrc');

module.exports = async function(adjustment){

    let existingAdjustment = await Adjustment.find({
        where: {
            id: adjustment.id
        }
    });

    if(!existingAdjustment){
        existingAdjustment = Adjustment.build({});
    }

    let isNewRecord = existingAdjustment.isNewRecord;

    if(!isNewRecord){
        //Shouldn't be possible, just including for completeness
        existingAdjustment.version++;
    }

    existingAdjustment.id = adjustment.id;
    existingAdjustment.userId = adjustment.userId;
    existingAdjustment.packageId = adjustment.packageId;
    existingAdjustment.amount = adjustment.amount;
    existingAdjustment.reason = adjustment.reason;
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

        if (isNewRecord && _package && _package.id) {
            await saveLog(existingAdjustment, _package);
        }

        if(isNewRecord) {
            this.broadcast.emit('create', existingAdjustment.get());
        }
        else {
            this.broadcast.emit('update', existingAdjustment.get());
        }

        return existingAdjustment;
    }else{
        //Need to submit to metrc first

        //Need store license
        let store = await Store.find({
            attributes: ['licenseNumber'],
            where: {
                id: _package.storeId
            }
        });

        let adjustmentToMetrc = {
            Label: _package.Label,
            Quantity: existingAdjustment.amount,
            UnitOfMeasure: _package.UnitOfMeasureName,
            AdjustmentReason: existingAdjustment.reason,
            AdjustmentDate: existingAdjustment.date,
            ReasonNote: existingAdjustment.notes
        };

        try{

            await MetrcPackage.adjust(store.licenseNumber, adjustmentToMetrc);

            //After successful save, save to db

            await existingAdjustment.save();

            if (isNewRecord && _package && _package.id) {
                await saveLog(existingAdjustment, _package);
            }

            if(isNewRecord) {
                this.broadcast.emit('create', existingAdjustment.get());
            }
            else {
                this.broadcast.emit('update', existingAdjustment.get());
            }

            return existingAdjustment;

        }catch(e){
            console.log(e);
            throw new Error('Unable to submit adjustment to Metrc');

        }
    }
};

async function saveLog(existingAdjustment, _package) {
  const log = AdjustmentLog.build({});

  log.id = uuid.v4();
  log.adjustmentId = existingAdjustment.id;
  log.quantityBefore = _package.Quantity;
  log.quantityAfter = _package.Quantity + existingAdjustment.amount;

  console.log('Saving adjustment log', log.get({plain: true}));

  await log.save();
}
