const {Receipt} = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);

router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(Receipt));
router.on('getMissing', require('../common/getMissing')(Receipt));
router.on('search', require('./search'));
router.on('create', require('./create'));
router.on('update', require('./update'));
router.on('getByBarcode', require('./getByBarcode'));
router.on('getByDateRange', require('./getByDateRange'));
router.on('getByDrawerId', require('./getByDrawerId'));
router.on('remove', require('./remove'));
router.on('getByPatientId', require('./getByPatientId'));

module.exports = router;
