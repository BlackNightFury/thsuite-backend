const {Receipt} = alias.require('@models');

module.exports = async function(barcode){

    let barcodeString = barcode.barcode;

    let receipt = await Receipt.findOne({
        where: {
            barcode: barcodeString
        }
    });

    if(!receipt){
        return null;
    }else{
        return receipt.id;
    }


}
