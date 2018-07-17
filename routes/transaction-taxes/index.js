const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {TransactionTax} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(TransactionTax));
router.on('getMissing', require('../common/getMissing')(TransactionTax));
router.on('update', require('./update'));
router.on('getByTransactionId', require('./getByTransactionId'));
router.on('remove', require('./remove'));

module.exports = router;
