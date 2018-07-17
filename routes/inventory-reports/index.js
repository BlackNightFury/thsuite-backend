const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);

router.on('inventory-breakdown-report', require('./inventory-breakdown-report'));
router.on('inventory-daily-report', require('./inventory-daily-report'));

module.exports = router;
