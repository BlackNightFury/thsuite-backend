const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {Scale} = alias.require('@models');

router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(Scale));
router.on('all', require('./all'));
router.on('allEnabled', require('./allEnabled'));


module.exports = router;
