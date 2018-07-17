const { Visitor } = alias.require('@models');
const updateCommon = require('../common/update');

module.exports = updateCommon(Visitor, async function(existingVisitor, visitor) {

    existingVisitor.firstName = visitor.firstName;
    existingVisitor.lastName = visitor.lastName;
    existingVisitor.visitReason = visitor.visitReason;
    existingVisitor.idImage = visitor.idImage;
    existingVisitor.signature = visitor.signature;
    existingVisitor.clockIn = visitor.clockIn;
    existingVisitor.clockOut = visitor.clockOut;
    existingVisitor.autoClockedOut = visitor.autoClockedOut;
});
