const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {PricingTier} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);

router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(PricingTier));
router.on('getMissing', require('../common/getMissing')(PricingTier));
router.on('update', require('./update'));
router.on('search', require('./search'));
router.on('canRemove', require('./canRemove'));
router.on('remove', require('./remove'));

module.exports = router;