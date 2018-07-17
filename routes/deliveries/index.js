const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const { Delivery } = alias.require('@models')
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('../common/get')(Delivery));
router.on('getMany', require('../common/getMany')(Delivery));
router.on('getMissing', require('../common/getMissing')(Delivery));
module.exports = router;
