require('../../../init');
const {Package, Transaction, Discount, User} = alias.require('@models');
const moment = require('moment');
const uuid = require('uuid');

module.exports = async function(){

    //This handles all post processing of data that is needed when using development/sandbox data from Metrc

    //Package reconciliation
    console.log('Reconciling package quantities');
    let packages = await Package.findAll();

    for(let _package of packages) {
        //If this package has a negative quantity, 0 it out
        if(_package.Quantity < 0) {
            _package.Quantity = 0;
            _package.availableQuantity = 0;
        }

        //Generate adjustment for package
        let transactions = await Transaction.findAll({
            attributes: ['QuantitySold'],
            where: {
                packageId: _package.id
            }
        });

        let transactionSum = transactions.reduce((sum, transaction) => {

            return sum + transaction.QuantitySold;

        }, 0);

        let adjustmentAmount = (_package.Quantity + transactionSum) - _package.ReceivedQuantity;

        if(adjustmentAmount) {
            await _package.createAdjustment({
                id: uuid.v4(),
                amount: adjustmentAmount,
                reason: 'Entry Error',
                notes: 'Import reconciliation',
                date: new Date()
            });
        }

        //Give package randome wholesalePrice
        let wholesale;
        if (_package.ReceivedQuantity > 100){
            wholesale = 1000 + Math.floor(Math.random() * 600);
        } else {
            wholesale = 150 + Math.floor(Math.random() * 50);
        }

        _package.wholesalePrice = wholesale;


        //Save the updated package
        await _package.save();
    }

};