const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);

router.on('sales-by-transaction-time-report', require('./sales-by-transaction-time-report'));
router.on('download-transaction-time-report', require('./download-transaction-time-report'));
router.on('sales-breakdown-report-by-package', require('./sales-breakdown-report-by-package'));
router.on('sales-breakdown-report', require('./sales-breakdown-report'));
router.on('download-breakdown-report', require('./download-breakdown-report'));
router.on('drawer-report', require('./drawer-report'));
router.on('download-drawer-report', require('./download-drawer-report'));

module.exports = router;
