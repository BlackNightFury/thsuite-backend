const { Printer } = alias.require('@models');


module.exports = async function() {

    let printers = await Printer.findAll({

    });

    return printers.map(t => t.id);
};
