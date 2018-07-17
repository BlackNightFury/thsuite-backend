
module.exports = function(Object) {
    return async function(objectId) {

        let object = await Object.findOne({
            where: {
                id: objectId
            },
            paranoid: false
        });

        if(!object) return {}

        return object.get({plain: true})
    };
};
