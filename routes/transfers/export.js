const { Supplier, Transfer } = alias.require('@models');
const moment = require('moment');
const Baby = require('babyparse');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');

module.exports = async function( { supplierId } ) {

    const where = supplierId ? { id: supplierId } : { }

    //TODO probably should chunk this up
    let data = await Transfer.findAll({
        //TODO consider using raw: true
        include: [ { model: Supplier, where } ]
    });

    let reportData = [];

    for(let row of data){
        let reportObj = {
            "Was Received": row.ReceivedDateTime ? 'Received' : 'Not Received',
            "Manifest Number": row.ManifestNumber,
            "Supplier": row.Supplier.name,
            "Delivery Package Count": row.DeliveryPackageCount,
            "Received Package Count": row.ReceivedPackageCount,
            "Estimated Arrival Date": moment( row.EstimatedArrivalDateTime ).format('ddd MMM D YYYY HH:mm:ss'),
            "Received Date": moment( row.ReceivedDateTime ).format('ddd MMM D YYYY HH:mm:ss')
        };

        reportData.push(reportObj);
    }

    let csv = Baby.unparse(reportData);

    const currentDate = moment().format('YYYYMMDDHHmmss');
    return await uploadCSVToAws(csv, "reports/transfers-export-" + currentDate +  ".csv");

};
