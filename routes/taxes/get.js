const { Tax } = alias.require('@models');


module.exports = async function(taxId) {

    let tax = await Tax.findOne({
        where: {
            id: taxId
        }
    });

    if(tax){
        return tax.get({plain: true})
    }
};