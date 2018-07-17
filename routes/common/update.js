
const { Product } = alias.require('@models');

module.exports = function(Object, updatePropertiesCallback) {
    return async function(object) {

        let existingObject = await Object.find({
            where: {
                id: object.id,
                //TODO clientId: req.user.clientId
            }
        });

        if(!existingObject) {
            existingObject = Object.build({});
        }

        let isNewRecord = existingObject.isNewRecord;

        if(!isNewRecord) {
            // if(existingObject.version !== object.version) {
            //     throw new Error("Version mismatch");
            // }

            object.version++;
        }

        existingObject.id = object.id;
        existingObject.version = object.version;

        let promise = updatePropertiesCallback(existingObject, object);

        if (promise && promise.then) {
            await promise;
        }

        await existingObject.save();

        if(isNewRecord) {
            this.broadcast.emit('create', existingObject.get());
        }
        else {
            this.broadcast.emit('update', existingObject.get());
        }

        return existingObject
    };
}