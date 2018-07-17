const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {StoreOversaleLimit} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);

router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(StoreOversaleLimit));
router.on('getByStoreId', require('./getByStoreId'));

module.exports = router;

