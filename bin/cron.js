const {CronJob} = require('cron');


new CronJob({
    //Fire at 3:58am eastern
    cronTime: '58 8 * * *',
    onTick: function(){
        process.exit(0);
    },
    start: true
});

new CronJob({
    cronTime: '*/15 * * * *',
    onTick: function() {
        require('./metrc-sync/index')();
    },
    start: true
});

new CronJob({
    // Every minute
    cronTime: '* * * * *',
    onTick: function() {
        require('./metrc-sync/sync-converted-packages')();
    },
    start: true
});

new CronJob({
    //Fire at 3:05am eastern
    cronTime: '5 8 * * *',
    onTick: function(){
        require('./sales-report-email/index')();
    },
    start: true
});

new CronJob({
    // Fire each hour
    cronTime: '1 * * * *',
    onTick: function() {
        require('./auto-clockout')();
        require('./visitor-auto-clockout')();
        require('./metrc-sync/resend-to-metrc')();
    },
    start: true
});
