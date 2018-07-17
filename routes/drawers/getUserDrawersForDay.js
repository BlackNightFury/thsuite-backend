const { Drawer, Store, User } = alias.require('@models');
const moment = require('moment');
require('moment-timezone')

module.exports = async function({userId}){

    let user = await User.findOne( { include: [ Store ], where: { id: userId } } )

    let drawers = await Drawer.findAll({
        order: [ [ 'createdAt', 'ASC' ] ],
        where: {
            userId,
            createdAt: { $between: [ moment().tz(user.Store.timeZone).startOf('day').utc().format(), moment().tz(user.Store.timeZone).endOf('day').utc().format() ] }
        }
    });

    return drawers.map(d => d.id)
}
