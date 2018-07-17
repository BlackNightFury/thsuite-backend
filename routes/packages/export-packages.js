const { Supplier, Store } = alias.require('@models');
const Common = require('./common')
const moment = require('moment');
const Baby = require('babyparse');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');
const uploadPdfToAws = alias.require('@lib/aws/uploadPdfToAws');


module.exports = async function(args) {
    let data = await Common.handleSearch(args)
    // TODO: visitor should be tied to the store?
    const store = await Store.findOne();

    let reportData = [];
    for(let row of data){
        // const supplier = row.supplierId && await Supplier.findOne({
        //     where: {
        //         id: row.supplierId
        //     }
        // });
        let reportObj = {
            "Received": !!row.ReceivedDateTime ? moment(row.ReceivedDateTime).tz(store.timeZone).format('M/D/YYYY, h:mm A') : '!!!!!',
            "Package": row.Label,
            "Product": row.Item && row.Item.Product ? row.Item.Product.name : '',
            // "Supplier": supplier ? supplier.name : '',
            "Supplier": '',
            "QTY Rem.": row.Quantity,
        };

        reportData.push(reportObj);
    }
    const currentDate = moment().format('YYYYMMDDHHmmss');

    if (args.type && args.type === 'pdf') {
        const html = await Promise.fromCallback(callback => {
            const ejs = require('ejs');
            return ejs.renderFile(__dirname + '/../../view/reports/inventory-packages.ejs', { reportData }, callback);
        });
        return await uploadPdfToAws(html, "wholesale-package-adjustment-export-" + currentDate + ".pdf");
    } else {
        return await uploadCSVToAws(Baby.unparse(reportData), "reports/wholesale-package-adjustment-export-" + currentDate +  ".csv");
    }
};
