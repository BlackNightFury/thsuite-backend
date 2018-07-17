/**
 * Execute this file in DRY RUN mode by running:
 * NODE_ENV=staging node ./bin/karing-kind-export-processor/import-wholesale-prices.js --dry-run 2>&1 | tee /tmp/wholesale-import.log
 * If you're happy with the results just skip --dry-run option
 * NODE_ENV=staging node ./bin/karing-kind-export-processor/import-wholesale-prices.js 2>&1 | tee /tmp/wholesale-import.log
 */

const BabyParse = require('babyparse');
const Promise = require('bluebird');
const {Package} = require('../../models');

(async (file, dryRun) => {

    console.log(`Processing "${file}" (${dryRun ? "DRY RUN" : "DB UPDATE"})`);

    // Give user 5sec to change his mind
    if (!dryRun) {
        console.log(`You have 5s. to cancel operation.`);
        await Promise.delay(5000);
    }

    const {data, meta} = BabyParse.parseFiles(file, {
        header: true
    });

    data.forEach( async(row) => {

        if (row['Package']) {
            const package = row['Package'].trim();
            const receiverDollarAmount = row['Receiver Dollar Amount'].trim();
            const shipperDollarAmount = row['Shipper Dollar Amount'].trim();

            if (package && (receiverDollarAmount || shipperDollarAmount)) {

                // Print out a warning if don't match
                if (receiverDollarAmount !== shipperDollarAmount) {
                    console.error(`ERR: Receiver "${receiverDollarAmount}" and Shipper ${shipperDollarAmount} don't match!`);
                }

                // Prefer receiverDollarAmount
                const wholesalePrice = receiverDollarAmount ? receiverDollarAmount : shipperDollarAmount;

                const localPackage = await Package.findOne({
                    where: {
                        Label: package
                    }
                });

                if (localPackage) {
                    console.log(`OK: Package "${package}" wholesalePrice set from "${localPackage.wholesalePrice}" to "${wholesalePrice}"`);

                    if (!dryRun) {
                        localPackage.wholesalePrice = wholesalePrice;
                        await localPackage.save();
                    }
                } else {
                    console.error(`ERR: Couldn't find package for ${package}`);
                }
            }
        }
    });
})(`${__dirname}/TransfersReport2.27.17.csv`, !!(process.argv.find((arg) => arg == '--dry-run')));