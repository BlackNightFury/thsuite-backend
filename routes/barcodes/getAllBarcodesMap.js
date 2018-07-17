const { Barcode } = alias.require('@models');

let lastBarcodesMap = [];
let lastBarcodesMapUpdated = 0;

module.exports = async function() {

    const now = Math.floor(new Date().getTime()/1000);

    // Cache barcodes for 5 minutes
    if (!lastBarcodesMap || (lastBarcodesMapUpdated+300) < now) {
        const barcodes = await Barcode.findAll({
            attributes: ['id', 'barcode'],
        });

        lastBarcodesMap = barcodes.map(b => {
            return { id: b.id, barcode: b.barcode }
        });

        lastBarcodesMapUpdated = now;
    }

    return lastBarcodesMap;
};