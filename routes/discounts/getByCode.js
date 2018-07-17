const { Discount } = alias.require('@models');

module.exports = async function(code){

    let discount = await Discount.findOne({
        where: {
            code: code
        }
    });


    return discount ? discount.id : null;

}