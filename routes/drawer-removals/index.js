const {DrawerRemoval} = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('../common/get')(DrawerRemoval));
router.on('getMany', require('../common/getMany')(DrawerRemoval));
router.on('getMissing', require('../common/getMissing')(DrawerRemoval));
router.on('getByDrawerId', require('./getByDrawerId'));
router.on('update', require('./update'));

module.exports = router;
