const { SavedCart } = alias.require('@models');
const uuid = require('uuid');

module.exports = async function(savedCart) {

    let existingSavedCart = await SavedCart.find({
        where: {
            patientQueueId: savedCart.patientQueueId,
        }
    });

    if (existingSavedCart) {
        await existingSavedCart.destroy();
    }

    existingSavedCart = SavedCart.build({});
    existingSavedCart.id = uuid.v4();
    existingSavedCart.patientId = savedCart.patientId;
    existingSavedCart.patientQueueId = savedCart.patientQueueId;
    existingSavedCart.cartData = savedCart.cartData;

    await existingSavedCart.save();

    // this.broadcast.emit('create', existingSavedCart.get());

    return existingSavedCart;
};
