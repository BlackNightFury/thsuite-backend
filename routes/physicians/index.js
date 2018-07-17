const {Physician} = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('../common/get')(Physician));
router.on('getMany', require('../common/getMany')(Physician));
router.on('getMissing', require('../common/getMissing')(Physician));
router.on('search', require('./search'));
router.on('update', require('./update'));
router.on('remove', require('./remove'));

module.exports = router;
