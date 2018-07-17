
const {ErrorLog} = alias.require('@models');

module.exports = async function(error){

    await ErrorLog.create(error)

};