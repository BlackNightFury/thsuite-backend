require('../../init');
const config = require('../../config');
const Promise = require('bluebird');
const {Package, Item, Store} = alias.require('@models');
const Metrc = alias.require('@lib/metrc');

const syncPackages = async function(store) {

    // How many records to process per one run.
    // Right now it's 1 per 1min (cron job)
    const limit = 1;

    const packages = await Package.findAll({
        where: {
            // Converted packages will have metric id as -1
            MetrcId: config.METRC_CONVERTED_PACKAGE_ID
        },
        include: [
            { model: Item },
        ],
        limit: limit
    });

    for (const _package of packages) {

        console.log(`Syncing converted package ${_package.Label}`);

        // Change the MetrcId so that the next cron run won't sync it
        _package.MetrcId = config.METRC_CONVERTED_PACKAGE_ID_IN_PROGRESS;
        await _package.save();

        //Create new strain here

        //Hey I know this is kinda ugly but I'm writing this on a plane and it needs to work first thing tomorrow morning
        let strainName = _package.Item.name ? _package.Item.name
            .replace(/\s*Buds\s*|\s*Bud\s*/g, '')
            .replace(/\s*Flowers\s*|\s*Flower\s*/g,'')
            .replace(/\s*Bulk\s*/g, '') : "Strain";

        try{

            //First check if a strain like this exists

            let strains = await Metrc.Strain.listActive(store.licenseNumber);

            let strainExists = false;

            for(let strain of strains){
                if(strain.Name == strainName){
                    strainExists = true;
                    break;
                }
            }

            if(!strainExists) {

                console.log(`Now creating strain with name: ${strainName}`);

                await Metrc.Strain.create(store.licenseNumber, [
                    {
                        Name: strainName,
                        TestingStatus: "None",
                        ThcLevel: _package.thcPercent,
                        CbdLevel: _package.cbdPercent,
                        IndicaPercentage: _package.strainType == 'hybrid' ? 50.0 : (_package.strainType == 'indica' ? 100.0 : 0),
                        SativaPercentage: _package.strainType == 'hybrid' ? 50.0 : (_package.strainType == 'sativa' ? 100.0 : 0)
                    }
                ])
            }else{
                console.log(`Strain with name ${strainName} already exists`);
            }

        } catch (e) {
            console.log("Failed to create strain");
            console.error(e);
            _package.MetrcId = config.METRC_CONVERTED_PACKAGE_ID_FAILED;
            await _package.save();
            continue;
        }

        //Create new item here

        let itemName = (_package.Item.name ? (_package.Item.name + ' ') : '') + 'Shake/Trim';

        try{

            let items = await Metrc.Item.listActive(store.licenseNumber);

            let itemExists = false;
            for(let item of items){
                if(item.Name == itemName){
                    itemExists = true;
                    break;
                }
            }

            if(!itemExists){

                console.log(`Now creating new item with name: ${itemName}`);

                await Metrc.Item.create(store.licenseNumber, [
                    {
                        "ItemCategory": "Shake/Trim (by strain)",
                        "Name": itemName,
                        "UnitOfMeasure": "Grams",
                        "AdministrationMethod": null,
                        "Strain": strainName,
                        "UnitCbdPercent": null,
                        "UnitCbdContent": null,
                        "UnitCbdContentUnitOfMeasure": null,
                        "UnitThcPercent": null,
                        "UnitThcContent": null,
                        "UnitThcContentUnitOfMeasure": null,
                        "UnitVolume": null,
                        "UnitVolumeUnitOfMeasure": null,
                        "UnitWeight": 1,
                        "UnitWeightUnitOfMeasure": "Grams",
                        "ServingSize": null,
                        "SupplyDurationDays": null,
                        "Ingredients": null
                    }
                ])

            }else{
                console.log(`Item with name ${itemName} already exists`)
            }


        }catch(e){
            console.log("Failed to create item");
            console.error(e);
            _package.MetrcId = config.METRC_CONVERTED_PACKAGE_ID_FAILED;
            await _package.save();
            continue;
        }

        let convertedPackageDetails;
        try {
            convertedPackageDetails = JSON.parse(_package.convertedFromPackageIds);
        } catch (e) {
            // do nothing
        }

        if (convertedPackageDetails) {
            for (let pckg of convertedPackageDetails) {
                const originalPackage = await Package.findOne({
                    attributes: ['Label', 'UnitOfMeasureName'],
                    where: {
                        id: pckg.packageId
                    }
                });

                pckg.Label = originalPackage.Label;
                pckg.UnitOfMeasureName = originalPackage.UnitOfMeasureName;
            }

            try {
                console.log(`Now creating package ${_package.Label} with item ${itemName} and strain ${strainName}`);
                await Metrc.Package.create(store.licenseNumber, [
                    {
                        Tag: _package.Label,
                        Item: itemName,
                        Quantity: _package.Quantity,
                        UnitOfMeasure: _package.UnitOfMeasureName,
                        IsProductionBatch: false,
                        ProductionBatchNumber: null,
                        ProductRequiresRemediation: false,
                        ActualDate: _package.createdAt,
                        Ingredients: convertedPackageDetails.map(pckg => {
                            return {
                                Package: pckg.Label,
                                Quantity: pckg.quantity,
                                UnitOfMeasure: pckg.UnitOfMeasureName
                            }
                        })
                    }
                ]);
            } catch (e) {
                console.error(e);
                _package.MetrcId = config.METRC_CONVERTED_PACKAGE_ID_FAILED;
                await _package.save();
                continue;
            }

            // Retry 5 times, each time wait more and more
            const retries = Array(5).fill().map((_, i) => i);
            for (const i of retries) {
                const metrcPackage = await Metrc.Package.getByLabel(store.licenseNumber, _package.Label);

                if (metrcPackage && metrcPackage.Id) {
                    _package.MetrcId = metrcPackage.Id;
                    await _package.save();
                    break;

                } else {
                    await Promise.delay(i*2000);
                }
            }

            // MetrcId should be positive integer received from the Metrc
            if (_package.MetrcId < 0) {
                _package.MetrcId = config.METRC_CONVERTED_PACKAGE_ID_FAILED;
                await _package.save();
            }


        } else {
            // No details about converted package, just skip it
            _package.MetrcId = config.METRC_CONVERTED_PACKAGE_ID_FAILED;
            await _package.save();
        }

    }

    console.log(`Imported ${packages.length} Packages`);
};

module.exports = async function(){
    Store.findAll().then(async (stores) => {
        for (const store of stores) {
            await syncPackages(store);
        }
    });
};

if (require.main == module) {
    module.exports();
}

