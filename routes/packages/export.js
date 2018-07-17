const { Package, Item, PackagePriceAdjustment } = alias.require('@models');
const Common = require('./common')
const moment = require('moment');
const Baby = require('babyparse');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');
const Utils = alias.require('@lib/Utils')


module.exports = async function(args) {
    let data = await Common.handleSearch(args)

    let reportData = [];

    console.log(data.length);
    for(let row of data){
        const totalPriceAdjustment = row.PackagePriceAdjustments ? row.PackagePriceAdjustments.reduce((curTotal, adjustment) => curTotal + adjustment.amount, 0) : 0
        let reportObj = {
            "Package Label": row.Label,
            "Date": moment(row.createdAt).tz(args.timeZone).format('ddd MMM D YYYY HH:mm:ss'),
            "Item Name": row.Item ? row.Item.name : '',
            "Original Wholesale Price": Utils.toDollarValue(row.wholesalePrice),
            "Total Price Adjustment": Utils.toDollarValue(totalPriceAdjustment),
            "Adjusted Wholesale Price": Utils.toDollarValue(row.wholesalePrice - totalPriceAdjustment)
        };

        reportData.push(reportObj);
    }

    let csv = Baby.unparse(reportData);

    const currentDate = moment().format('YYYYMMDDHHmmss');
    return await uploadCSVToAws(csv, "reports/wholesale-package-adjustment-export-" + currentDate +  ".csv");

};
