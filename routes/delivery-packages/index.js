const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {DeliveryPackage} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(DeliveryPackage));
router.on('getMissing', require('../common/getMissing')(DeliveryPackage));
router.on('getByPackageId', require('./getByPackageId'));

module.exports = router;
