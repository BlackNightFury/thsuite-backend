const {PatientQueue} = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);

router.on('get', require('../common/get')(PatientQueue));
router.on('getMany', require('../common/getMany')(PatientQueue));
router.on('search', require('./search'));
router.on('update', require('./update'));
router.on('addToQueue', require('./addToQueue'));
router.on('remove', require('./remove'));
router.on('removeByPatientId', require('./removeByPatientId'));
router.on('getByPatientId', require('./getByPatientId'));
router.on('getQueuePosition', require('./getQueuePosition'));
router.on('isPatientInQueue', require('./isPatientInQueue'));
router.on('releasePatientFromBudtender', require('./releasePatientFromBudtender'));
router.on('getAll', require('./getAll'));

module.exports = router;
