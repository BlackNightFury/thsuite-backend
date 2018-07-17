const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {PosDevice} = alias.require('@models');

router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(PosDevice));
router.on('update', require('./update'));

module.exports = router;
