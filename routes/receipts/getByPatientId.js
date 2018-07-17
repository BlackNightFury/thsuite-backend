const {Receipt} = alias.require('@models');

module.exports = async function(patientId){

    let receipts = await Receipt.findAll({
        where: {
            patientId: patientId
        },
        order: [['createdAt', 'DESC']]
    });

    if(!receipts){
        return null;
    }else{
        return receipts.map(receipt => receipt.id)
    }
}
