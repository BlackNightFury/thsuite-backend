module.exports = async (csvString, filename) => {
    return await new Promise((resolve, reject) => {

        const AWS = require('aws-sdk');
        const config = alias.require('@root/config/index');

        const s3 = new AWS.S3({
            accessKeyId: config.etc.s3.key,
            secretAccessKey: config.etc.s3.secret,
            region: 'us-east-1'
        });

        filename = (process.env.NODE_ENV || 'development')+'.'+filename;

        s3.putObject({
            Bucket: config.etc.s3.bucket,
            Key: filename,
            Body: csvString
        }, (err, data) => {
            if(err){
                console.error("Error saving csv to AWS");
                console.error(err);
                reject();
            }else{
                const url = 'https://' + config.etc.s3.bucket + '.s3.amazonaws.com/' + filename;
                resolve({ Location: url });
            }
        });
    });
}