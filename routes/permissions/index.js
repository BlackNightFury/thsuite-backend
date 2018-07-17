const {Permission} = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);

router.on('get', require('../common/get')(Permission));
router.on('getMany', require('../common/getMany')(Permission));
router.on('getByUserId', require('./getByUserId'));
router.on('search', require('../common/search')(Permission));
router.on('update', require('./update'));

module.exports = router;
