const {SavedCart} = alias.require('@models');

module.exports = async function(patientQueueId) {
    const savedCart = await SavedCart.findOne( {
        attributes: ['id'],
        where: {
            patientQueueId: patientQueueId
        }
    } );

    return savedCart ? savedCart.id : null;
}