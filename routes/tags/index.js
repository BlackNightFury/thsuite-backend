const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {Tag} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(Tag));
router.on('getMissing', require('../common/getMissing')(Tag));
router.on('search', require('./search'));
router.on('update', require('./update'));
router.on('remove', require('./remove'));
router.on('getByStoreId', require('./getByStoreId'));
router.on('getByProductVariationId', require('./getByProductVariationId'));
router.on('getByLoyaltyRewardId', require('./getByLoyaltyRewardId'));
router.on('getByProductId', require('./getByProductId'));

module.exports = router;
