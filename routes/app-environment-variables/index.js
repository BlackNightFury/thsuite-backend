const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();

router.on('patient-check-in', require('./patient-check-in'));

module.exports = router;

