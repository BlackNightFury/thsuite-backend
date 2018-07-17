const models = alias.require('@models');

module.exports = async function(args) {
    let order = [];
    if (args.sortBy && args.sortBy.sortBy) {
        order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
        order.push(args.sortBy.direction);

        order = [order];
    }

    const where = {};
    const $like = `%${args.query}%`

    if (args.field){
        where[args.field] = { $like };
    } else if (args.query) {
        where['Label'] = { $like };
    }

    where['$Package.id$'] = {$is: null};

    const {count, rows} = await models.PackageUnusedLabel.findAndCountAll({
        attributes: ['id'],

        include: [
            { model: models.Package, on: { '$PackageUnusedLabel.Label$' : {$col: 'Package.Label'}}, required: false, paranoid: false }
        ],

        where: where,

        order: order,

        limit: 12,
        offset: args.page * 12
    });

    return {
        objects: rows.map(p => p.id),
        numPages: Math.ceil(count / 12)
    }
}
