
const { Package } = alias.require('@models');


module.exports = async function(packageId) {

    let _package = await Package.findOne({
        where: {
            id: packageId
        }
    });

    return _package.get()
};