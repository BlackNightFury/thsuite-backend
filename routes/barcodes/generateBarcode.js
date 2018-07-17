
const {Barcode} = alias.require('@models');

module.exports = async function(){

    //Generate random barcode of length 9
    let generateBarcode = function() {
        const barcodeLength = 9;

        let characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        let barcode = '';

        for (let i = 0; i < barcodeLength; i++) {

            barcode += characters[Math.floor(Math.random() * characters.length)];

        }

        return barcode;
    }

    let duplicate = true;
    const maxAttempts = 100;
    let attempts = 0;
    let validBarcode = '';
    while(duplicate){

        //Create new barcode, check for uniqueness
        let barcode = generateBarcode();

        let duplicateBarcode = await Barcode.find({
            attributes: ['id', 'barcode'],
            where: {
                barcode: barcode
            }
        });

        if(!duplicateBarcode){
            validBarcode = barcode;
            duplicate = false;
        }

        attempts++;

        if(attempts == maxAttempts){
            break;
        }


    }

    if(!validBarcode){

        return false;

    }else{
        return validBarcode;

    }

}