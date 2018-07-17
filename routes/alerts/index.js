const {Alert} = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('getMany', require('../common/getMany')(Alert));
router.on('get', require('../common/get')(Alert));
router.on('getMissing', require('../common/getMissing')(Alert));
router.on('search', require('./search'));
router.on('get-alert-count', require('./get-alert-count'));

module.exports = router;
