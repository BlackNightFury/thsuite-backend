const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {Adjustment} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('./get'));
router.on('getMany', require('./getMany'));
router.on('getMissing', require('../common/getMissing')(Adjustment))
router.on('update', require('./update'));
router.on('getByPackageId', require('./getByPackageId'));

module.exports = router;