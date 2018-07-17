require("../../init");
let models = require("../../models");

(async function() {
    //node bin/barcodes/init-barcodes 1234567890 4
    let barcode = process.argv[2];
    let pageNumber = parseInt(process.argv[3]);
    let bwipjs = require('bwip-js');
    const AWS = require('aws-sdk');
    const config = alias.require('@root/config/index');
    let s3Stream = require('s3-upload-stream')(new AWS.S3({
        accessKeyId: config.etc.s3.key,
        secretAccessKey: config.etc.s3.secret,
        region: 'us-east-1'
    }));

    try {
        let png = await Promise.fromCallback(callback => {
            return bwipjs.toBuffer({
                bcid:        'code39ext',       // Barcode type
                text:        barcode,    // Text to encode
                scale:       2,               // 3x scaling factor
                height:      20,              // Bar height, in millimeters
                includetext: true,            // Show human-readable text
                textxalign:  'center',        // Always good to set this
                textsize:    10,             // Font size, in points
                monochrome: true,
            }, callback)
        });

        let html = await Promise.fromCallback(callback => {
            let ejs = require('ejs');
            return ejs.renderFile(__dirname + '/../../view/barcodes/barcode.ejs', {"barcode": barcode, "pageNumber": pageNumber, "png":png}, callback);
        })

        await Promise.fromCallback(callback => {
            console.log("Barcode HTML Saved Successfully!");
            let wkhtmltopdf = require('wkhtmltopdf');
            let read = wkhtmltopdf(html, {
                //output: "./bin/barcodes/barcode.pdf",
                pageSize: 'letter',
                orientation: 'portrait',
            });

            let upload = s3Stream.upload({
                "Bucket": config.etc.s3.bucket,
                "Key": "barcodes/" + barcode + "-" + pageNumber + ".pdf",
            });
            upload.on('error', function (error) {
                console.log(error);
            });
            upload.on('uploaded', function (details) {
                //TODO details.location
                console.log(details);
            });
            read.pipe(upload);
        });
    }
    catch(e) {
        console.log(e);
    }

})().catch(err => console.error(err));