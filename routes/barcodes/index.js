const {Barcode} = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('generate', require('./generate'));
router.on('get', require('./get'));
router.on('getMany', require('./getMany'));
router.on('getMissing', require('../common/getMissing')(Barcode));
router.on('search', require('./search'));
router.on('update', require('./update'));
router.on('getAllBarcodesMap', require('./getAllBarcodesMap'));
router.on('getByProductVariationId', require('./getByProductVariationId'));
router.on('getByPackageId', require('./getByPackageId'));
router.on('getByBarcodeString', require('./getByBarcodeString'));
router.on('generateBarcode', require('./generateBarcode'));
router.on('checkDuplicate', require('./checkDuplicate'));
router.on('generatePDF', require('./generatePDF'));
router.on('remove', require('./remove'));


module.exports = router;
