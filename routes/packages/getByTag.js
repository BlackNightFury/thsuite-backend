
const { Package } = alias.require('@models');


module.exports = async function(packageTag) {

    let package = await Package.findOne({
        where: {
            Label: packageTag
        }
    });

    return package.id;
};