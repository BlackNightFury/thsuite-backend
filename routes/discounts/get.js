
const { Discount } = alias.require('@models');


module.exports = async function(discountId) {

    let discount = await Discount.findOne({
        where: {
            id: discountId
        }
    });

    if(!discount) return null;

    discount = discount.get();
    discount.days = discount.days ? discount.days.split(',') : [];

    return discount
};
