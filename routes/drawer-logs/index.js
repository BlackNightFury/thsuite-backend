const {DrawerLog} = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('../common/get')(DrawerLog));
router.on('getMany', require('../common/getMany')(DrawerLog));
router.on('create', require('./create'));
router.on('getByDrawerId', require('./getByDrawerId'));

module.exports = router;
