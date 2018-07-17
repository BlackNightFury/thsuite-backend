const { Printer } = alias.require('@models');


module.exports = async function() {

    let printers = await Printer.findAll({
        where: {
            isEnabled: true
        }
    });

    return printers.map(t => t.id);
};

