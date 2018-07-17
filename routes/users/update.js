const models = require("../../models");
const { User } = alias.require('@models');
const moment = require('moment');


module.exports = async function(user) {

    let existingUser = await User.find({
        where: {
            id: user.id,
            //TODO clientId: req.user.clientId
        }
    });

    if(!existingUser) {
        existingUser = User.build({});
    }

    let isNewRecord = existingUser.isNewRecord;

    if(!isNewRecord) {
        // if(existingUser.version !== user.version) {
        //     throw new Error("Version mismatch");
        // }

        user.version++;
    }

    existingUser.id = user.id;
    existingUser.version = user.version;

    existingUser.storeId = user.storeId;
    existingUser.firstName = user.firstName;
    existingUser.lastName = user.lastName;
    existingUser.email = user.email;
    existingUser.phone = user.phone;
    existingUser.licenseNumber = user.licenseNumber;

    existingUser.dob  = user.dob ? moment(user.dob).format("YYYY-MM-DD") : '';
    existingUser.gender  = user.gender;
    existingUser.badgeId  = user.badgeId;
    existingUser.badgeExpiration  = moment(user.badgeExpiration).format("YYYY-MM-DD");
    existingUser.stateId  = user.stateId;
    existingUser.stateIdExpiration  = moment(user.stateIdExpiration).format("YYYY-MM-DD");

    existingUser.pin = user.pin;
    existingUser.posPin = user.posPin;

    existingUser.type = user.type;
    existingUser.status = user.status;
    existingUser.activation = user.activation;
    existingUser.image = user.image;
    existingUser.isActive = user.isActive;

    if(user.password){
        existingUser.password = models.User.hash(user.password);
    }

    await existingUser.save();

    if(isNewRecord) {

        let posPermissions = {
            canScanItems: true,
            canManuallyAddCannabisItems: false,
            canManuallyAddNonCannabisItems: true,
            canVoidItems: true,
            canAcceptReturns: true,
            canManuallyDiscount: true,
            canManuallyVerifyAge: true,
            canAddNotesToPatient: true
        };

        await existingUser.createPermission(posPermissions);
        await existingUser.createEmailSetting();

        // await existingUser.sendTemporaryPasswordEmail();

        this.broadcast.emit('create', existingUser.get());
    }
    else {
        this.broadcast.emit('update', existingUser.get());
    }

    return existingUser
};
