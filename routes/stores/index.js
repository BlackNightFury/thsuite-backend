const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {Store} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('all', require('./all'));
router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(Store));
router.on('getMissing', require('../common/getMissing')(Store));
router.on('search', require('./search'));
router.on('update', require('./update'));

module.exports = router;
