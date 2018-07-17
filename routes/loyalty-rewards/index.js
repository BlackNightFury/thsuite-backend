const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {LoyaltyReward} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(LoyaltyReward));
router.on('getMissing', require('../common/getMissing')(LoyaltyReward));
router.on('search', require('./search'));
router.on('update', require('./update'));
router.on('remove', require('./remove'));


module.exports = router;