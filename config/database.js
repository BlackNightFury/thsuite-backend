"use strict";

// Wrapper script for db-migrate tool

const config = require('./config');
const databaseConfig = {
    "sql-file": true
};

Object.keys(config).forEach(envConfig => {

    if (config[envConfig].sequelize) {
        databaseConfig[envConfig] = {
            "driver": "mysql",
            "user": config[envConfig].sequelize.username,
            "password": config[envConfig].sequelize.password,
            "host": config[envConfig].sequelize.host,
            "database": config[envConfig].sequelize.database
        };
    }
});

module.exports = databaseConfig;
