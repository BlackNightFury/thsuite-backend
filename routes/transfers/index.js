const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {Transfer} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('search', require('./search'));
router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(Transfer));
router.on('getMissing', require('../common/getMissing')(Transfer));
router.on('inbound-report', require('./inbound-report'));
router.on('packages', require('./packages'));
router.on('export', require('./export'));

module.exports = router;
