const {Drawer} = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('../common/get')(Drawer));
router.on('getMany', require('./getMany'));
router.on('getMissing', require('../common/getMissing')(Drawer));
router.on('create', require('./create'));
router.on('update', require('./update'));
router.on('getCurrent', require('./getCurrent'));
router.on('get-user-drawers-for-day', require('./getUserDrawersForDay'));

router.on('drawer-closing-report', require('./drawer-closing-report'));



module.exports = router;
