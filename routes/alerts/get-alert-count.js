
const models = alias.require('@models');

module.exports = async function(args) {

    let count = await models.Alert.count({
        attributes: ['id'],

        where: {
            // name: {$like: `%${args.query}%`},
        },
    });

    return count;
}