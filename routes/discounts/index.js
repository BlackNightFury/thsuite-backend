const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {Discount} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);

router.on('all', require('./all'));
router.on('get', require('./get'));
router.on('getMany', require('./getMany'));
router.on('search', require('./search'));
router.on('update', require('./update'));
router.on('discount-data-overall', require('./overall-report-data'));
router.on('discount-data-type', require('./type-report-data'));
router.on('discount-data-product', require('./product-report-data'));
router.on('discount-data-product-type', require('./product-type-report-data'));
router.on('discount-data-employee', require('./employee-report-data'));
router.on('download-report', require('./download-report'));
router.on('getByCode', require('./getByCode'));
router.on('allAutomatic', require('./allAutomatic'));
router.on('remove', require('./remove'));

module.exports = router;
