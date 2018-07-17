"use strict";

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const Sequelize = require('sequelize');
const mysql = require('mysql');
const extend = require('extend');

const basename = path.basename(module.filename);
const config = extend(true, {}, require(__dirname + '/../config'));
const db = {};

const sequelize = new Sequelize(config.sequelize);

Sequelize.Promise.config({
    longStackTraces: true
});

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function (file) {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
