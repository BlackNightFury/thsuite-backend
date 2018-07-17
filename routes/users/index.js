const SocketIORouter = require("../../lib/SocketIORouter");
const router = new SocketIORouter();
const {User} = alias.require('@models');
const ensureAuthenticated = require('../../lib/ensureAuthenticated');


router.on('login', require('./login'));
router.on('loginWithToken', require('./loginWithToken'));
router.on('logout', require('./logout'));

router.use(ensureAuthenticated);

router.on('getCurrentUser', require('./getCurrentUser'));
router.on('get', require('./get'));
router.on('getMany', require('./getMany'));
router.on('getMissing', require('../common/getMissing')(User));
router.on('update', require('./update'));
router.on('search', require('./search'));
router.on('send-reset-email', require('./send-reset-email'));
router.on('send-create-password-email', require('./send-create-password-email'));
router.on('check-activation-code', require('./check-activation-code'));
router.on('update-password', require('./update-password'));
router.on('get-s3-upload-params', require('./get-s3-upload-params'));
router.on('confirm-pin', require('./confirm-pin'));
router.on('confirm-pos-pin', require('./confirm-pos-pin'));
router.on('confirm-manager-pin', require('./confirm-manager-pin'));
router.on('confirm-user-pin', require('./confirm-user-pin'));
router.on('validateEmail', require('./validateEmail'));
router.on('checkDuplicateEmail', require('./checkDuplicateEmail'));
router.on('checkDuplicatePin', require('./checkDuplicatePin'));
router.on('checkDuplicatePosPin', require('./checkDuplicatePosPin'));
router.on('sendHelpRequest', require('./sendHelpRequest'));
router.on('generateToken', require('./generateToken'));
router.on('refreshToken', require('./refreshToken'));

module.exports = router;
