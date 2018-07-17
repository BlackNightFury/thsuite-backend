
const models = alias.require('@models');

module.exports = async function(args) {
    let order = [];
    if(args.sortBy && args.sortBy.sortBy) {
        order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
        order.push(args.sortBy.direction);

        order = [order];
    }

    let where = {};

    if(!args.field){
        where['$or'] = {
            firstName: {$like: `%${args.query}%`},
            lastName: {$like: `%${args.query}%`},
            medicalStateId: {$like: `%${args.query}%`}
        };
    }else if(args.field != 'medicalStateId'){
        where[args.field] = {$like: `%${args.query}%`};
    }else{
        where[args.field] = {$like: `%${args.query.replace(/[^a-zA-Z0-9]/g, '')}%`};
    }

    let {count, rows} = await models.Caregiver.findAndCountAll({
        attributes: ['id'],

        where: where,

        order: order,

        limit: 12,
        offset: args.page * 12,
    });

    return {
        objects: rows.map(p => p.id),
        numPages: Math.ceil(count / 12)
    }
}

