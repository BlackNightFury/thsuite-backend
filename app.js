const logger = require('morgan');
const ipc = require('node-ipc');

process.on('unhandledRejection', error => {
    console.error('Unhandled Rejection', error);
})

//Disable all devices on server start up
require('./routes/device-proxy/disableAll')();

const io = require('./lib/io');

io.origins(function(origin, callback) {
    callback(null, true);
});


io.of('/users').bindTo(require('./routes/users'));
io.of('/customers').bindTo(require('./routes/customers'));
io.of('/permissions').bindTo(require('./routes/permissions'));
io.of('/products').bindTo(require('./routes/products'));
io.of('/product-variations').bindTo(require('./routes/product-variations'));
io.of('/items').bindTo(require('./routes/items'));
io.of('/product-types').bindTo(require('./routes/product-types'));
io.of('/packages').bindTo(require('./routes/packages'));
io.of('/suppliers').bindTo(require('./routes/suppliers'));
io.of('/transactions').bindTo(require('./routes/transactions'));
io.of('/transfers').bindTo(require('./routes/transfers'));
io.of('/delivery-packages').bindTo(require('./routes/delivery-packages'));
io.of('/stores').bindTo(require('./routes/stores'));
io.of('/devices').bindTo(require('./routes/devices'));
io.of('/discounts').bindTo(require('./routes/discounts'));
io.of('/barcodes').bindTo(require('./routes/barcodes'));
io.of('/adjustments').bindTo(require('./routes/adjustments'));
io.of('/purchase-orders').bindTo(require('./routes/purchase-orders'));
io.of('/adjustment-logs').bindTo(require('./routes/adjustment-logs'));
io.of('/visitors').bindTo(require('./routes/visitors'));
io.of('/patients').bindTo(require('./routes/patients'));
io.of('/patient-notes').bindTo(require('./routes/patient-notes'));
io.of('/patient-groups').bindTo(require('./routes/patient-groups'));
io.of('/drawers').bindTo(require('./routes/drawers'));
io.of('/drawer-logs').bindTo(require('./routes/drawer-logs'));
io.of('/drawer-removals').bindTo(require('./routes/drawer-removals'));
io.of('/receipts').bindTo(require('./routes/receipts'));
io.of('/line-items').bindTo(require('./routes/line-items'));
io.of('/alerts').bindTo(require('./routes/alerts'));
io.of('/taxes').bindTo(require('./routes/taxes'));
io.of('/transaction-taxes').bindTo(require('./routes/transaction-taxes'));
io.of('/loyalty-rewards').bindTo(require('./routes/loyalty-rewards'));
io.of('/package-price-adjustments').bindTo(require('./routes/package-price-adjustments'));
io.of('/package-unused-labels').bindTo(require('./routes/package-unused-labels'));
io.of('/receipt-adjustments').bindTo(require('./routes/receipt-adjustments'));
io.of('/store-settings').bindTo(require('./routes/store-settings'));
io.of('/store-oversale-limits').bindTo(require('./routes/store-oversale-limits'));
io.of('/patient-oversale-limits').bindTo(require('./routes/patient-oversale-limits'));
io.of('/email-settings').bindTo(require('./routes/email-settings'));
io.of('/pricing-tiers').bindTo(require('./routes/pricing-tiers'));
io.of('/pricing-tier-weights').bindTo(require('./routes/pricing-tier-weights'));
io.of('/time-clocks').bindTo(require('./routes/time-clocks'));
io.of('/pos-devices').bindTo(require('./routes/pos-devices'));
io.of('/deliveries').bindTo(require('./routes/deliveries'));
io.of('/printers').bindTo(require('./routes/printers'));
io.of('/scales').bindTo(require('./routes/scales'));
io.of('/logs').bindTo(require('./routes/logs'));
io.of('/saved-carts').bindTo(require('./routes/saved-carts'));
io.of('/lab-test-results').bindTo(require('./routes/lab-test-results'));

io.of('/inventory-reports').bindTo(require('./routes/inventory-reports'));
io.of('/tax-reports').bindTo(require('./routes/tax-reports'));
io.of('/sales-reports').bindTo(require('./routes/sales-reports'));
io.of('/patient-reports').bindTo(require('./routes/patient-reports'));

io.of('/device-proxy').bindTo(require('./routes/device-proxy'));
io.of('/tags').bindTo(require('./routes/tags'));
io.of('/patient-queue').bindTo(require('./routes/patient-queue'));
io.of('/physicians').bindTo(require('./routes/physicians'));
io.of('/caregivers').bindTo(require('./routes/caregivers'));

//App Environment Variables
io.of('/app-environment-variables').bindTo(require('./routes/app-environment-variables'));

//Auto refresher
io.of('/reload').bindTo(require('./routes/reload'));
//Set up IPC listener to trigger reload
ipc.config.id = `backend-${process.env.NODE_ENV ? process.env.NODE_ENV : 'development'}`;

ipc.serve(() => {
    console.log(`IPC server started at backend-${process.env.NODE_ENV ? process.env.NODE_ENV : 'development'}`);
    ipc.server.on('reload', (data, socket) => {
        console.log("IPC server got reload message");

        io.of('/reload').emit('refresh');

        ipc.server.emit(socket, 'complete');
    })
});

ipc.server.start();

module.exports = io;
