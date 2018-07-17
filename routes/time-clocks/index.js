const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {TimeClock} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(TimeClock));
router.on('getMissing', require('../common/getMissing')(TimeClock));
router.on('search', require('./search'));
router.on('update', require('./update'));
router.on('remove', require('./remove'));
router.on('getMostRecentActiveForUser', require('./getMostRecentActiveForUser'));
router.on('getMostRecentForAllUsers', require('./getMostRecentForAllUsers'));
router.on('getByUserId', require('./getByUserId'));
router.on('overall-report', require('./overall-report'));

module.exports = router;
