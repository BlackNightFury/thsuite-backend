'use strict';

const MetrcModel = require('./MetrcModel');

class Transaction extends MetrcModel {

    constructor({
        PackageId,
        PackageLabel,
        ProductName,
        QuantitySold,
        UnitOfMeasureName,
        UnitOfMeasureAbbreviation,
        TotalPrice,
        SalesDeliveryState,
        ArchivedDate,
        LastModified
    }) {
        super();

        this.PackageId = PackageId;
        this.PackageLabel = PackageLabel;
        this.ProductName = ProductName;
        this.QuantitySold = QuantitySold;
        this.UnitOfMeasureName = UnitOfMeasureName;
        this.UnitOfMeasureAbbreviation = UnitOfMeasureAbbreviation;
        this.TotalPrice = TotalPrice;
        this.SalesDeliveryState = SalesDeliveryState;
        this.ArchivedDate = ArchivedDate;
        this.LastModified = LastModified;

    }

    static listDateSummary(facilityLicense) {
        return this.makeRequest('GET', `/sales/v1/transactions?licenseNumber=${facilityLicense}`);
    }

    static listDate(facilityLicense, date) {
        return this.makeRequest('GET', `/sales/v1/transactions/${date}?licenseNumber=${facilityLicense}`)
            .map(transaction => new Transaction(transaction));
    }

    static create(facilityLicense, date, transactions) {
        if(!Array.isArray(transactions)) {
            transactions = [transactions];
        }

        return this.makeRequest('POST', `/sales/v1/transactions/${date}?licenseNumber=${facilityLicense}`, transactions)
    }

    static put(facilityLicense, date, transactions){
        if(!Array.isArray(transactions)) {
            transactions = [transactions];
        }

        return this.makeRequest('PUT', `/sales/v1/transactions/${date}?licenseNumber=${facilityLicense}`, transactions)
    }
}

module.exports = Transaction;