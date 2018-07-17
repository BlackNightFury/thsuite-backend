
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
        const query = args.query.trim();
        const tokens = query.split(/[\s]+/);

        //If exactly two search terms try to match as a fullname - exact first name and like surname
        if(tokens.length == 2){
            where['$and'] = {
                firstName: tokens[0],
                lastName: {$like: `%${tokens[1]}%`, $ne: 'Patient'}
            };
        } else {
            where['$or'] = [
                {
                    firstName: {$like: `%${query}%`},
                    lastName: {$ne: `Patient`},
                    medicalStateId: {$ne: ``}

                },
                {
                    firstName: {$ne: `Guest`},
                    lastName: {$like: `%${query}%`},
                    medicalStateId: {$ne: ``}
                },
                {
                    firstName: {$ne: `Guest`},
                    lastName: {$ne: `Patient`},
                    medicalStateId: {$like: `%${query}%`}
                }
            ]
        }

    }else if(args.field != 'medicalStateId'){
        where[args.field] = {$like: `%${args.query}%`};

    }else{
        where[args.field] = {$like: `%${args.query.replace(/[^a-zA-Z0-9]/g, '')}%`};
    }

    if(args.patientGroupId){
        where.patientGroupId = args.patientGroupId;
    }

    console.log("routes/patients/search.js...\nwhere:");
    console.log(where);

    let {count, rows} = await models.Patient.findAndCountAll({
        attributes: ['id'],

        where: where,

        order: order,

        limit: 12,
        offset: args.page * 12,
        logging: console.log
    });

    return {
        objects: rows.map(p => p.id),
        numPages: Math.ceil(count / 12)
    }
}
