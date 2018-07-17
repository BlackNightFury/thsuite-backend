const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {Package} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(Package));
router.on('getMissing', require('../common/getMissing')(Package));
router.on('search', require('./search'));
router.on('getByTag', require('./getByTag'));
router.on('getByItemId', require('./getByItemId'));
router.on('getByBarcodeId', require('./getByBarcodeId'));
router.on('getByReceiptBarcode', require('./getByReceiptBarcode'));
router.on('update', require('./update'));
router.on('inventory-report', require('./inventory-report'));
router.on('inventory-breakdown-report', require('./inventory-breakdown-report'));
router.on('download-report', require('./download-report'));
router.on('package-audit', require('./package-audit'));
router.on('export', require('./export'));
router.on('get-barcode-ids', require('./getBarcodeIds'));
router.on('get-has-price', require('./getHasPrice'));
router.on('add-quantity', require('./addQuantity'));
router.on('convert-package', require('./convertPackage'));
router.on('getLowInventoryPackage', require('./getLowInventoryPackage'));
router.on('export-packages', require('./export-packages'));

module.exports = router;
