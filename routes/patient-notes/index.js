const {PatientNote} = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);

router.on('get', require('../common/get')(PatientNote));
router.on('getMany', require('../common/getMany')(PatientNote));
router.on('getMissing', require('../common/getMissing')(PatientNote));
router.on('update', require('./update'));
router.on('remove', require('./remove'));
router.on('getByPatientId', require('./getByPatientId'));

module.exports = router;
