const { Printer, Scale } = alias.require('@models');
module.exports = async function(){

    //Set isEnabled to 0 for all devices
    await Printer.update({
        isEnabled: 0
    }, {
        where: {
            isEnabled: 1
        }
    });

    await Scale.update({
        isEnabled: 0
    }, {
        where: {
            isEnabled: 1
        }
    });

}
