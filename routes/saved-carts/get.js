const { SavedCart } = alias.require('@models');


module.exports = async function(savedCartId) {

    const savedCart = await SavedCart.findOne({
        where: {
            id: savedCartId
        }
    });

    if (savedCart) {
        return savedCart.get({plain: true});
    }
};