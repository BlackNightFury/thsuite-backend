const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {ProductType} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('all', require('./all'));
router.on('export', require('./export'));
router.on('download-report', require('./download-report'));
router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(ProductType));
router.on('getMissing', require('../common/getMissing')(ProductType));
router.on('sales-data', require('./sales-data'));
router.on('search', require('./search'));
router.on('update', require('./update'));
router.on('canRemove', require('./canRemove'));
router.on('remove', require('./remove'));

module.exports = router;
