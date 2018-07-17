const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {Item} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('get', require('./get'));
router.on('getMany', require('../common/getMany')(Item));
router.on('getMissing', require('../common/getMissing')(Item));
router.on('search', require('./search'));
router.on('update', require('./update'));
router.on('export', require('./export'));
router.on('remove', require('./remove'));
router.on('getByBarcodeId', require('./getByBarcodeId'));
router.on('saveThcWeight', require('./saveThcWeight'));

module.exports = router;
