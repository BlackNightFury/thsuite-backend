const {LineItem} = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);

router.on('get', require('../common/get')(LineItem));
router.on('getMany', require('../common/getMany')(LineItem));
router.on('getMissing', require('../common/getMissing')(LineItem));
router.on('search', require('../common/search')(LineItem));
router.on('getByPatientId', require('./getByPatientId'));
router.on('getByReceiptId', require('./getByReceiptId'));
router.on('update', require('./update'));
router.on('void', require('./void'));

module.exports = router;
