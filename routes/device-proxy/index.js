const {Permission} = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();

router.on('register', require('./register'));
router.on('disconnect', require('./disconnect'));
router.on('getRegisteredDevices', require('./getRegisteredDevices'));
router.on('scaleData', require('./scaleData'));
router.on('doPrint', require('./doPrint'));
router.on('openDrawer', require('./openDrawer'));
router.on('printTransactionLabels', require('./printTransactionLabels'));
router.on('printBulkFlowerLabels', require('./printBulkFlowerLabels'));
router.on('printPatientLabels', require('./printPatientLabels'));
router.on('printPatientLabelsTest', require('./printPatientLabelsTest'));
router.on('printBulkFlowerBarcodeLabels', require('./printBulkFlowerBarcodeLabels'));
router.on('printBarcodeLabels', require('./printBarcodeLabels'));
router.on('printBulkFlowerLabelsTest', require('./printBulkFlowerLabelsTest'));
router.on('printTimeClockReport', require('./printTimeClockReport'));
router.on('printCloseDrawerReport', require('./printCloseDrawerReport'));
router.on('printTestReceipt', require('./printTestReceipt'));
router.on('printTestLabel', require('./printTestLabel'));
module.exports = router;
