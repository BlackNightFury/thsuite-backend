const {PatientGroup} = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);

router.on('get', require('../common/get')(PatientGroup));
router.on('getMany', require('../common/getMany')(PatientGroup));
router.on('getMissing', require('../common/getMissing')(PatientGroup));
router.on('search', require('./search'));
router.on('update', require('./update'));
router.on('patientsInGroup', require('./patientsInGroup'));
router.on('remove', require('./remove'));

module.exports = router;
