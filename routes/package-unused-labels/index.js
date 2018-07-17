const { PackageUnusedLabel } = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();

router.on('import', require('./import'));
router.on('get', require('../common/get')(PackageUnusedLabel));
router.on('getMany', require('../common/getMany')(PackageUnusedLabel));
router.on('getUnusedLabels', require('./getUnusedLabels'));
router.on('update', require('./update'));
router.on('search', require('./search'));

module.exports = router;
