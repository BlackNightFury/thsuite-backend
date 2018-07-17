const {StoreSettings} = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('../common/get')(StoreSettings));
router.on('getMany', require('../common/getMany')(StoreSettings));
router.on('getByStoreId', require('./getByStoreId'));

module.exports = router;
