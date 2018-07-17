const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();


// router.on('get', require('./get'));
router.on('update', require('./update'));
// router.on('search', require('./search'));
router.on('getByCustomerPhone', require('./getByCustomerPhone'));

module.exports = router;
