const models = alias.require('@models');

module.exports = async function(args) {
    let order = [];
    if(args.sortBy && args.sortBy.sortBy) {
        order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
        order.push(args.sortBy.direction);

        order = [order];
    }

    let where = args.queueType === 'queue' ? { enteredAt: null } : { enteredAt: { $ne: null } }
	let patientWhere = args.query
		? { $or: {
                firstName: {$like: `%${args.query}%`},
                lastName: {$like: `%${args.query}%`},
        } }
        : { }
    ;

    let {count, rows} = await models.PatientQueue.findAndCountAll({
        where,
        include: [
            { model: models.Patient,
              where: patientWhere
            }
        ],

        order: order,

        limit: 12,
        offset: args.page * 12
    });

	console.log(rows.length)
    return {
        objects: rows.map(p => p.id),
        numPages: Math.ceil(count / 12)
    }
}
