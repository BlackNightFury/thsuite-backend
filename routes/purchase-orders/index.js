const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {PurchaseOrder} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('./get'));
router.on('getMany', require('./getMany'));
router.on('getMissing', require('../common/getMissing')(PurchaseOrder))
router.on('update', require('./update'));
router.on('getByPackageId', require('./getByPackageId'));
router.on('auditByItemId', require('./auditByItemId'));

module.exports = router;