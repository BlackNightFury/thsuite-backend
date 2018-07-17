module.exports = function(Object){
    return async function(objectIds){
        let objects = await Object.findAll({
            where: {
                id: {
                    $notIn: objectIds
                }
            },
            paranoid: false
        });

        return objects.map(object => object.get({plain: true}));
    }
}