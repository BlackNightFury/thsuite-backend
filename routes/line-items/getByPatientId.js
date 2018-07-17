const {Receipt, LineItem} = alias.require('@models');

module.exports = async function(patientId){

    let receipts = await Receipt.findAll({
        where: {
            patientId: patientId
        }
    });

    if(receipts){
        let lineItems = await LineItem.findAll({
            where: {
                receiptId: {
                    $in: receipts.map(receipt => receipt.id)
                }
            }
        });

        if(!lineItems){
            return [];
        }else{
            return lineItems.map(lineItem => lineItem.id);
        }

    }else{
        return [];
    }
}
