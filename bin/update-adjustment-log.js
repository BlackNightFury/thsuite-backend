require("../init");

const {Package, Adjustment, AdjustmentLog} = alias.require('@models');
const getAudit = require('../routes/packages/package-audit');
const moment = require('moment');
const uuid = require('uuid');

(async function(){

    // Get unique packages which has adjustments
    const adjustments = await Adjustment.findAll({
        attributes: ['id', 'packageId'],
        group: ['packageId']
    })

    for (let i=0, len=adjustments.length; i<len; i++) {
        console.log(`[${i+1}/${len}] ${adjustments[i].packageId}`);

        let audit = await getAudit({packageId: adjustments[i].packageId});
        audit = audit.changes.filter(row => row.type == 'adjustment');

        for (let a=0; a<audit.length; a++) {
            const log = AdjustmentLog.build({});

            log.id = uuid.v4();
            log.adjustmentId = adjustments[i].id;
            log.quantityBefore = audit[a].newQuantity - audit[a].change;
            log.quantityAfter = audit[a].newQuantity;

            await log.save();
        }

        console.log(`Created ${audit.length} log entries`);
    };

    console.log('DONE');
    process.exit();
})();