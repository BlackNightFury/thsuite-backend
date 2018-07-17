const { ProductType } = alias.require('@models');
const moment = require('moment');
const Baby = require('babyparse');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');

module.exports = async function() {

    //TODO probably should chunk this up
    let data = await ProductType.findAll({
        //TODO consider using raw: true
        include: []
    });

    let reportData = [];

    for(let row of data){
        let reportObj = {
            "Category": row.category,
            "Name": row.name,
            "Measurement": row.unitOfMeasure,
            "Notes": row.notes
        };

        reportData.push(reportObj);
    }

    let csv = Baby.unparse(reportData);

    const currentDate = moment().format('YYYYMMDDHHmmss');
    return await uploadCSVToAws(csv, "reports/product-type-export-" + currentDate +  ".csv");

};
