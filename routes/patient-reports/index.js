const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('download-report', require('./download-report'));
router.on('sales-data', require('./sales-data'));

module.exports = router;