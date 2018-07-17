require('../../../init');

const {Package, Transaction, Discount, User, Tax} = alias.require('@models');
const moment = require('moment');
const uuid = require('uuid');

module.exports = async function(){

    //This handles all post processing of data that is needed when using development/sandbox data from Metrc

    //Transaction dummy dates, discount IDs and amount, user IDs
    console.log("Creating taxes for transactions");

    let transactions = await Transaction.findAll();
    let taxes = await Tax.findAll();

    for(let transaction of transactions) {

        for(let tax of taxes) {
            await transaction.createTransactionTax({
                id: uuid.v4(),
                taxId: tax.id,
                amount: transaction.TotalPrice * tax.percent / 100
            })
        }

    }

};

if(require.main == module) {
    module.exports()
}

