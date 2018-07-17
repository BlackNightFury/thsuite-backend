const {Patient} = alias.require('@models');

const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const ensureAuthenticated = require('../../lib/ensureAuthenticated');

router.use(ensureAuthenticated);

router.on('get', require('./get'));
router.on('getMany', require('./getMany'));
router.on('getMissing', require('../common/getMissing')(Patient));
router.on('search', require('./search'));
router.on('update', require('./update'));
router.on('remove', require('./remove'));
router.on('validateEmail', require('./validateEmail'));
router.on('export', require('./export'));
router.on('findByIdentifier', require('./findByIdentifier'));
router.on('get-s3-upload-params', require('./get-s3-upload-params'));
router.on('addAttestationForm', require('./addAttestationForm'));
router.on('addIdImage', require('./addIdImage'));
router.on('validateUniqueIds', require('./validateUniqueIds'));
router.on('updateLoyaltyPoints', require('./updateLoyaltyPoints'));
router.on('getMetrcLimits', require('./getMetrcLimits'));
router.on('getByCaregiverId', require('./getByCaregiverId'));
router.on('setGramLimit', require('./setGramLimit'));
router.on('setMedicalId', require('./setMedicalId'));


module.exports = router;
