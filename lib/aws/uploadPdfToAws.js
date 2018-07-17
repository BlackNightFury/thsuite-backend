module.exports = async (html, filename) => {
    return await new Promise((resolve, reject) => {

        const wkhtmltopdf = require('wkhtmltopdf');
        const read = wkhtmltopdf(html, {
            //output: "./bin/barcodes/barcode.pdf",
            pageSize: 'letter',
            orientation: 'portrait',
        });

        console.log("Report Generated Successfully");

        const AWS = require('aws-sdk');
        const config = alias.require('@root/config/index');

        const s3Stream = require('s3-upload-stream')(new AWS.S3({
            accessKeyId: config.etc.s3.key,
            secretAccessKey: config.etc.s3.secret,
            region: 'us-east-1'
        }));

        filename = (process.env.NODE_ENV || 'development')+'.'+filename;

        const upload = s3Stream.upload({
            "Bucket": config.etc.s3.bucket,
            "Key": filename,
        });

        upload.on('error', function (error) {
            console.log(error);
            reject(error);
        });

        upload.on('uploaded', function (details) {
            //TODO details.location
            console.log(details);
            resolve(details);
        });

        read.pipe(upload);
    });
}