const moment = require('moment');
require('moment-timezone');
const thermalPrinter = require('node-thermal-printer');
const {Store, Printer, Device, TimeClock, User} = alias.require('@models');

const config = require('../../config');

const ProxySocketCache = require('./proxy-socket-cache');

module.exports = async function(args){

    let printerId = args.printerId;
    let deviceId = args.posDeviceId;

    let printerObj = await Printer.findOne({
        where: {
            id: printerId
        }
    });

    //Get pos device
    let device = await Device.findOne({
        where: {
            id: deviceId
        }
    });

    let mostRecentTimeClock = args.timeClock;

    let recentClockIn = moment(mostRecentTimeClock.clockIn);
    let recentClockOut = moment(mostRecentTimeClock.clockOut);

    let hours = recentClockOut.diff(recentClockIn, 'hours');
    let minutes = recentClockOut.diff(recentClockIn, 'minutes') % 60;

    let minutesFrac = (minutes / 60.0);

    let currentTimeWorked = Math.round((hours + minutesFrac) * 100) / 100;


    let userId = args.userId;

    let user = await User.findOne({
        where: {
            id: userId
        }
    });

    let storeId = args.storeId;

    let store = await Store.findOne({
        attributes: ['timeZone'],
        where: {
            id: storeId
        }
    });


    let timeZone = store.timeZone;

    //LOCAL
    let endTime = moment(mostRecentTimeClock.clockIn).tz(timeZone).endOf('day');
    let startTime = moment(mostRecentTimeClock.clockIn).tz(timeZone).subtract(6, 'days').startOf('day');

    let startTimeUTC = startTime.utc();
    let endTimeUTC = endTime.utc();


    //Get all time clocks from today -6 days to today
    let where = {
        clockIn: {
            $between: [
                startTimeUTC.toDate(),
                endTimeUTC.toDate()
            ]
        },
        userId: userId
    };

    let clocks = await TimeClock.findAll({
        where: where,
        order: [['clockIn', 'ASC']],
        logging: console.log
    });

    let byDate = {};

    //Init by date
    let day = startTime.clone();
    for(let i = 0; i < 6; i++){
        byDate[day.format('MM/DD/YYYY')] = 0;
        day = day.add(1,'day');
    }

    let total = 0;

    for(let clock of clocks){

        let clockIn = clock.clockIn;

        //Get hours worked
        let clockInMoment = moment(clockIn);
        let clockOutMoment = moment(clock.clockOut);

        let hours = clockOutMoment.diff(clockInMoment, 'hours');
        let minutes = clockOutMoment.diff(clockInMoment, 'minutes') % 60;

        let minutesFrac = (minutes / 60.0);

        let timeWorked = Math.round((hours + minutesFrac) * 100) / 100;

        let local = moment(clockIn).tz(timeZone).format("MM/DD/YYYY");
        if(!byDate[local]){
            byDate[local] = timeWorked;
        }else{
            byDate[local] += timeWorked;
        }

        total += timeWorked;
    }

    let reportData = {
        recentClockIn: moment(mostRecentTimeClock.clockIn).tz(timeZone).format("MM/DD/YYYY hh:mm a"),
        recentClockOut: moment(mostRecentTimeClock.clockOut).tz(timeZone).format("MM/DD/YYYY hh:mm a"),
        currentTimeWorked: currentTimeWorked,
        byDate: byDate,
        total: total,
        user: user,
        printerObj: printerObj,
        posDevice: device
    };

    let sockets = ProxySocketCache.get(printerObj.deviceProxyId);

    let connected = sockets.filter(socket => socket.connected);

    if(connected.length == 0){
        console.log("NO CONNECTED SOCKETS");
        ProxySocketCache.showCaches();
    }else {
        if (connected.length >= 2) {
            console.log("MULTIPLE CONNECTED SOCKETS");
            console.log(connected);
        }

        let {
            recentClockIn,
            recentClockOut,
            currentTimeWorked,
            byDate,
            total,
            user,
            printerObj,
            posDevice
        } = reportData;

        thermalPrinter.init({
            type: 'epson',
            width: 56
        });

        thermalPrinter.clear();

        thermalPrinter.alignCenter();

        thermalPrinter.println(config.environment.companyName);
        thermalPrinter.println("Time Clock Details");
        thermalPrinter.drawLine();

        thermalPrinter.alignLeft();
        thermalPrinter.println(`User: ${user.firstName} ${user.lastName}`);
        thermalPrinter.println("Clock In:   " + recentClockIn);
        thermalPrinter.println("Clock Out:  " + recentClockOut);
        thermalPrinter.println("Hours Worked: " + currentTimeWorked);
        thermalPrinter.drawLine();

        thermalPrinter.alignCenter();
        thermalPrinter.println("Hours Worked by Day Over Last 7 Days");

        thermalPrinter.alignLeft();
        Object.keys(byDate).forEach((date) => {
            let value = byDate[date].toFixed(2);

            thermalPrinter.println(`${date}: ${value} hours`);
        });

        thermalPrinter.drawLine();

        thermalPrinter.alignCenter();
        thermalPrinter.println("Aggregate Total Over Last 7 Days");

        thermalPrinter.alignLeft();
        thermalPrinter.println(`TOTAL: ${total.toFixed(2)} hours`);

        thermalPrinter.cut();


        let buffer = thermalPrinter.getBuffer();

        printerObj = printerObj.get({plain: true});

        for(let socket of connected){
            socket.emit('printTimeClockReport', {printerObj, buffer});
        }
    }


}
