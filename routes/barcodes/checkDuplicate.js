
const {Barcode} = alias.require('@models');

module.exports = async function(barcode){

    let duplicate = await Barcode.find({
        attributes: ['id'],
        where: {
            barcode: barcode
        }
    });

    return !!duplicate;

}