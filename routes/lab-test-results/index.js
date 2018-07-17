const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {LabTestResult} = alias.require('@models');

router.on('get', require('../common/get')(LabTestResult));
router.on('getMany', require('../common/getMany')(LabTestResult));
router.on('update', require('./update'));
router.on('getByPackageId', require('./getByPackageId'));

module.exports = router;

