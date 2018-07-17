
const models = alias.require('@models');
const { User } = models;


module.exports = async function(args) {

    let order = [];
    if(args.sortBy && args.sortBy.sortBy) {
        order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
        order.push(args.sortBy.direction);

        order = [order];
    }

    let where = {
        $or: [
            {email: {$like: `%${args.query}%`}},
            {firstName: {$like: `%${args.query}%`}},
            {lastName: {$like: `%${args.query}%`}}
        ]
    };

    if(args.employeeToggle && args.employeeToggle == 'active'){
        where.isActive = true;
    } else if (args.employeeToggle && args.employeeToggle == 'inactive'){
        where.isActive = false;
    }
    console.log(where);

    let {count, rows} = await User.findAndCountAll({
        attributes: ['id'],

        where: where,

        order: order,

        limit: 12,
        offset: args.page * 12
    });

    return {
        objects: rows.map(p => p.get({plain: true})).map(p => p.id),
        numPages: Math.ceil(count / 12)
    }
};