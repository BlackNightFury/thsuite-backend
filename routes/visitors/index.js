const {Visitor} = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();

router.on('get', require('../common/get')(Visitor));
router.on('getMany', require('../common/getMany')(Visitor));
router.on('getMissing', require('../common/getMissing')(Visitor));
router.on('search', require('./search'));
router.on('update', require('./update'));
router.on('remove', require('./remove'));
router.on('get-s3-upload-params', require('./get-s3-upload-params'));
router.on('addIdImage', require('./addIdImage'));
router.on('addVisitorSignature', require('./addVisitorSignature'));

module.exports = router;
