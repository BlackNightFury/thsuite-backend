const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {EmailSettings} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(EmailSettings));
router.on('getByUserId', require('./getByUserId'));
router.on('update', require('./update'));

module.exports = router;