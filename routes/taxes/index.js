const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const { Tax } = alias.require('@models');
const commonGet = require('../common/get');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);
router.on('all', require('./all'));
router.on('get', commonGet(Tax));
router.on('getMany', require('../common/getMany')(Tax));
router.on('getMissing', require('../common/getMissing')(Tax));
router.on('search', require('./search'));
router.on('update', require('./update'));
router.on('remove', require('./remove'));
router.on('getByType', require('./getByType'));
router.on('export', require('./export'));
//Included deleted taxes -- used for tax report
router.on('allTaxesDeleted', require('./allTaxesDeleted'));

module.exports = router;
