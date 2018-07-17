const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {SavedCart} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('./get'));
router.on('getByPatientQueueId', require('./getByPatientQueueId'));
router.on('getMany', require('../common/getMany')(SavedCart));
router.on('getMissing', require('../common/getMissing')(SavedCart));
router.on('update', require('./update'));

module.exports = router;
