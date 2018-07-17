const { sequelize } = alias.require('@models');
const moment = require('moment');
const Utils = alias.require('@lib/Utils');
const uploadPdfToAws = alias.require('@lib/aws/uploadPdfToAws');
const fs = require('fs');

module.exports = async function(args) {
  const date = moment().format('YYYYMMDDHHmmss');
  const html = args.blob ? args.blob.toString('utf8') : '';

  let response = false;

  if (html) {
      // Temporary save file for debug purpose
      fs.writeFileSync("/tmp/patients-report-overall-"+date+".html", html, 'utf8');

      try {
          response = await uploadPdfToAws(html, "patients-report-overall-"+date+".pdf");
      } catch (e) {
          response = false;
      }
  }

  return response;
};