const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {Transaction} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(Transaction));
router.on('getMissing', require('../common/getMissing')(Transaction));
router.on('create', require('./create'));
router.on('get-sales-data', require('./get-sales-data'));
router.on('download-report', require('./download-report'));
router.on('get-daily-sales', require('./get-daily-sales'));
router.on('sales-breakdown-report', require('./sales-breakdown-report'));
router.on('get-employee-sales-data', require('./get-employee-sales-data'));
router.on('get-peak-sales', require('./get-peak-sales'));
router.on('get-sales-over-time', require('./get-sales-over-time'));
router.on('getByReceiptId', require('./getByReceiptId'));
router.on('getByLineItemId', require('./getByLineItemId'));
router.on('send-to-metrc', require('./send-to-metrc'));
router.on('download-day-transactions', require('./download-day-transactions'));
router.on('void', require('./void'));
router.on('update', require('./update'));

module.exports = router;
