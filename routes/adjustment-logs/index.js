const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {AdjustmentLog} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('./get'));
router.on('getMany', require('./getMany'));
router.on('getMissing', require('../common/getMissing')(AdjustmentLog))
router.on('update', require('./update'));
router.on('getByAdjustmentId', require('./getByAdjustmentId'));

module.exports = router;