const express = require('express');
const Sequelize = require('sequelize');
const routes = express.Router();
const allConfig = require('../../config/config');
const models = require('../../models');

routes.post('/resolve-environment', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const { username, password, allEnvironments } = req.body;

  if (!username || !password) {
    res.status(400).send(JSON.stringify({ error: 'Bad Request' }));
  } else {

    let environments = [];

    for (let environment in allConfig) {

      if(environment == 'development'){
        continue;
      }

      const { sequelize } = allConfig[environment];

      if (sequelize && sequelize.host && sequelize.username && sequelize.password && sequelize.database) {

        const seq = new Sequelize(sequelize);

        const user = await seq.query(
            'SELECT id FROM users WHERE email=? AND password=? LIMIT 1',
            { replacements: [username, models.User.hash(password)], type: seq.QueryTypes.SELECT }
        );

        if (user && user[0] && user[0].id) {
          console.log(`Adding ${environment} to returned environments`);
          environments.push({
            name: environment,
            domain: allConfig[environment].express.apiDomain,
            frontendDomain: allConfig[environment].express.domain
            // port: allConfig[environment].express.port,
          });

          if (!allEnvironments) {
            break;
          }
        }
      }
    }

    res.send(JSON.stringify({ environments }));
  }
});

module.exports = routes;