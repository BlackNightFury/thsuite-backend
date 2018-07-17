const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {Product} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(Product));
router.on('getMissing', require('../common/getMissing')(Product));
router.on('search', require('./search'));
router.on('update', require('./update'));
router.on('remove', require('./remove'));
router.on('get-s3-upload-params', require('./get-s3-upload-params'));
router.on('sales-data', require('./sales-data'));
router.on('download-report', require('./download-report'));
router.on('export', require('./export'));
router.on('getByPackageId', require('./getByPackageId'));
router.on('getByItemId', require('./getByItemId'));

module.exports = router;
