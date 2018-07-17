const { Receipt } = alias.require('@models');
const config = require('../../config');
const metrcVoid = require('./void-receipt-metrc');
module.exports = async function(args){

    let receiptId;
    let notes = '';

    if (typeof args == 'string') {
        receiptId = args;
    } else {
        receiptId = args.receiptId;
        notes = args.notes || '';
    }

    const object = await Receipt.findOne({
        where: {
            id: receiptId
        }
    });

    if (notes) {
        object.voidNotes = notes;
        await object.save();
    }

    await object.destroy();

    //Void in metrc if config set
    let throwMetrcError = false;
    if(config.environment.realTimeTransactionReporting && config.environment.transactionSubmissionMode == 'receipts'){
        try{
            await metrcVoid(receiptId);
        }catch(e){
            console.log('ERR VOIDING');
            console.log(e.message);
            throwMetrcError = true;

        }
    }

    this.broadcast.emit('remove', object.get());
    this.emit('remove', object.get());

    return {success: true, metrcError: throwMetrcError};
}
