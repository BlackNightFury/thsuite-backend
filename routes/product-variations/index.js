const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {ProductVariation} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('./get'));
router.on('getMany', require('./getMany'));
router.on('getMissing', require('../common/getMissing')(ProductVariation));
router.on('getByProductId', require('./getByProductId'));
router.on('getProductVariationsByItemId', require('./getProductVariationsByItemId'));
router.on('update', require('./update'));
router.on('search', require('./search'));
router.on('canRemove', require('./canRemove'));
router.on('remove', require('./remove'));

module.exports = router;
