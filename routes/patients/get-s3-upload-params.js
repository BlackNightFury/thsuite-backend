const {S3} = require('aws-sdk');
const config = alias.require('@config/index');
const shortid = require('shortid');
const crypto = require('crypto');
const moment = require('moment');

module.exports = async function(args) {

    let {contentType} = args;

    if(!contentType){
        throw new Error("Cannot generate params. No contentType specified");
    }

    const policy = {
        expiration: moment.utc().add(1, 'hour').toISOString(),
        conditions: [
            {bucket: config.etc.s3.bucket},
            ["starts-with", "$key", "patients/"],
            ["starts-with", "$Content-Type", ""],
            {success_action_status: '201'}
        ]
    };

    const policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');

    const hmac = crypto.createHmac('sha1', config.etc.s3.secret);
    hmac.update(policyBase64);

    return {
        bucket: config.etc.s3.bucket,
        action: `https://${config.etc.s3.bucket}.s3.amazonaws.com`,
        name: `patients/${+new Date()}_\${filename}`,
        key: config.etc.s3.key,
        acl: 'private',
        policy: policyBase64,
        signature: hmac.digest('base64'),
        contentType: contentType
    }
};
