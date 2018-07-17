const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();


router.on('log-error', require('./log-error'));

module.exports = router;
