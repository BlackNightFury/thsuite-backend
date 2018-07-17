const { Printer } = alias.require('@models');


module.exports = async function(printerId) {

    let printer = await Printer.findOne({
        where: {
            id: printerId
        }
    });

    return printer.get({plain: true})
};
