const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {Supplier} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('search', require('./search'));
router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(Supplier));
router.on('getMissing', require('../common/getMissing')(Supplier));
router.on('all', require('./all'));
router.on('update', require('./update'));
router.on('sales-data', require('./sales-data'));
router.on('download-report', require('./download-report'));

module.exports = router;
