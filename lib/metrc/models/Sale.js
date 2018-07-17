'use strict';

const Transaction = require("./Transaction");

const MetrcModel = require('./MetrcModel');

class Sale extends MetrcModel {

    constructor({
        Id,
        ReceiptNumber,
        SalesDateTime,
        SalesCustomerType,
        PatientLicenseNumber,
        TotalPackages,
        TotalPrice,
        ArchivedDate,
        Transactions,
        LastModified
    }) {
        super();

        this.Id = Id;
        this.ReceiptNumber = ReceiptNumber;
        this.SalesDateTime = SalesDateTime;
        this.SalesCustomerType = SalesCustomerType;
        this.PatientLicenseNumber = PatientLicenseNumber;
        this.TotalPackages = TotalPackages;
        this.TotalPrice = TotalPrice;
        this.Transactions = Transactions.map(transaction => new Transaction(transaction));
        this.ArchivedDate = ArchivedDate;
        this.LastModified = LastModified;
    }

    static createReceipt(facilityLicense, receipts) {
        if(!Array.isArray(receipts)) {
            receipts = [receipts];
        }

        return this.makeRequest('POST', `/sales/v1/receipts?licenseNumber=${facilityLicense}`, receipts)
    }

    static updateReceipt(facilityLicense, receipts){
        if(!Array.isArray(receipts)) {
            receipts = [receipts];
        }

        return this.makeRequest('PUT', `/sales/v1/receipts?licenseNumber=${facilityLicense}`, receipts)
    }

    static listReceipts(facilityLicense){
        return this.makeRequest('GET', `/sales/v1/receipts?licenseNumber=${facilityLicense}`);
    }

    static deleteReceipt(facilityLicense, id){

        return this.makeRequest('DELETE', `/sales/v1/receipts/${id}?licenseNumber=${facilityLicense}`, id);
    }

    static createTransaction(facilityLicense, receipts) {
        if(!Array.isArray(receipts)) {
            receipts = [receipts];
        }

        return this.makeRequest('POST', `/sales/v1/receipts?licenseNumber=${facilityLicense}`, receipts)
    }

    static listTransactions(facilityLicense) {
        return this.makeRequest('GET', `/sales/v1/transactions/2016-04-12?licenseNumber=${facilityLicense}`)
    }

    static createDelivery(facilityLicense, deliveries){
        if(!Array.isArray(deliveries)){
            deliveries = [deliveries];
        }

        return this.makeRequest('POST', `/sales/v1/deliveries?licenseNumber=${facilityLicense}`, deliveries);
    }

    static putDelivery(facilityLicense, deliveries){
        if(!Array.isArray(deliveries)){
            deliveries = [deliveries];
        }

        return this.makeRequest('PUT', `/sales/v1/deliveries?licenseNumber=${facilityLicense}`, deliveries);
    }

    static completeDelivery(facilityLicense, deliveries){
        if(!Array.isArray(deliveries)){
            deliveries = [deliveries];
        }

        return this.makeRequest('PUT', `/sales/v1/deliveries/complete?licenseNumber=${facilityLicense}`, deliveries);
    }

    static deleteDelivery(facilityLicense, id){

        return this.makeRequest('DELETE', `/sales/v1/delivery/${id}?licenseNumber=${facilityLicense}`);

    }
}

module.exports = Sale;