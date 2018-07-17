const {Device} = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();

router.on('create', require('./create'));
router.on('get', require('../common/get')(Device));
router.on('getMany', require('../common/getMany')(Device));
router.on('getMissing', require('../common/getMissing')(Device));
router.on('getByStoreId', require('./getByStoreId'));
router.on('update', require('./update'));
router.on('isRegistered', require('./isRegistered'));

module.exports = router;
