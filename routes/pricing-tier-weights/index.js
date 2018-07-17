const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {PricingTierWeight} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(PricingTierWeight));
router.on('getMissing', require('../common/getMissing')(PricingTierWeight));
router.on('update', require('./update'));
router.on('search', require('./search'));
router.on('getByPricingTierId', require('./getByPricingTierId'));
router.on('delete', require('./delete'));

module.exports = router;