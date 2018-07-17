module.exports = function(Object) {
    return async function(objectIds) {

        let objects = await Object.findAll({
            where: {
                id: {
                    $in: objectIds
                }
            },
            paranoid: false
        });

        return objects.map(object => object.get({plain: true}));
    };
};
