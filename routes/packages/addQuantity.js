const { Package } = alias.require('@models');

module.exports = async function({ packageId, amount }) {

    console.log('inside', { packageId, amount });

    let existingPackage = await Package.find({
        where: {
            id: packageId,
            //TODO clientId: req.user.clientId
        }
    });

    if (!existingPackage) {
        return;
    }

    existingPackage.Quantity += amount;
    existingPackage.availableQuantity += amount;

    await existingPackage.save();

    return existingPackage
};