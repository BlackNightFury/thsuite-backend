const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('getByPatientMedicalId', require('./getByPatientMedicalId'));

module.exports = router;
