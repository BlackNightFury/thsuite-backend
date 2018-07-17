const { sequelize, User } = alias.require('@models');
const moment = require('moment');
require('moment-timezone')
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');
const Utils = alias.require('@lib/Utils')
const Baby = require('babyparse');

module.exports = async function(args){

    const startDate = moment(args.dateRange.startDate).tz(args.timeZone).startOf('day').utc().format(),
        endDate = moment(args.dateRange.endDate).tz(args.timeZone).endOf('day').utc().format()

    const queryOptions = {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            startDate,
            endDate
        }
    }

    const startDay = moment(args.dateRange.startDate).format('MMM Do'),
        endDay = moment(args.dateRange.endDate).tz(args.timeZone).format('MMM Do')

    let data = [ ]

    const query = `
        SELECT userId, clockIn as workDay, IFNULL(clockOut,now()) as endHour, (SELECT TIMESTAMPDIFF(MINUTE, clockIn, IFNULL(clockOut,now()))) as minutesWorked, autoClockedOut
        FROM time_clocks
        WHERE clockIn BETWEEN :startDate AND :endDate AND deletedAt IS NULL
        ORDER BY clockIn ASC`

    let [ timeData, users ] = await Promise.all( [ sequelize.query( query, queryOptions ), User.findAll( { select: ['firstName','lastName'] } ) ] )

    let total = {
        firstName: 'Total',
        minutesWorked: 0,
    };

    let timeDataByUser = timeData.reduce( ( memo, datum ) => {
        datum.startHour = moment(datum.workDay).tz(args.timeZone).format('h:mma')
        datum.workDay = moment(datum.workDay).tz(args.timeZone).format('MMM Do')
        datum.endHour = moment(datum.endHour).tz(args.timeZone).format('h:mma')
        datum.autoClockedOut = datum.autoClockedOut ? true : false
        if( !memo[datum.userId] ) memo[datum.userId] = { times: [ ], minutesWorked: 0 }
        memo[datum.userId].times.push( datum )
        memo[datum.userId].minutesWorked += datum.minutesWorked
        total.minutesWorked += datum.minutesWorked
        return memo
    }, { } )

    data = users.map( user =>
        Object.assign( { id: user.id, firstName: user.firstName, lastName: user.lastName, startDay, endDay }, timeDataByUser[user.id] || { minutesWorked: 0 } )
    )

    if( !args.export ) {
        data.push(total);
    }

    if( args.export ) {
        const reportData = []
        if( args.reportType === 'aggregate' ) {
            for(let row of data){
                let reportObj = {
                    "Employee Name": `${row.firstName} ${row.lastName}`,
                    "Date Range": `${startDay} - ${endDay}`,
                    "Hours Worked": (row.minutesWorked / 60).toFixed(3)
                }

                reportData.push(reportObj);
            }
        } else if( args.reportType === 'detail' ) {

            for(let row of data){
                let reportObj = {
                    "Employee Name": `${row.firstName} ${row.lastName}`,
                    "Date": `${startDay} - ${endDay}`,
                    "Time Range": '',
                    "Hours Worked": (row.minutesWorked / 60).toFixed(3)
                }
                reportData.push(reportObj);

                if( row.times ) {
                    row.times.forEach( time => {
                        let reportObjTime = {
                            "Employee Name": `${row.firstName} ${row.lastName}`,
                            "Date": time.workDay,
                            "Time Range": `${time.startHour} - ${time.endHour}`,
                            "Hours Worked": (time.minutesWorked / 60).toFixed(3)
                        }
                        reportData.push(reportObjTime);
                    } )
                }
            }
        }

        let csv = Baby.unparse(reportData);
        return await uploadCSVToAws(csv, `reports/${args.reportType}-employee-time-clocks-${moment(args.dateRange.startDate).tz(args.timeZone).format('YYYYMMDD')}-${moment(args.dateRange.endDate).tz(args.timeZone).format('YYYYMMDD')}.csv`);

    } else {
        return data;
    }
}
