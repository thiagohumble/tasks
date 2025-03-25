'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const db = {};

let sequelize;
if (process.env.PG_DATABASE && process.env.PG_USER && process.env.PG_PASSWORD && process.env.PG_HOST && process.env.PG_PORT) {
  const connectionString = 'postgres://' + process.env.PG_USER + ':' + process.env.PG_PASSWORD + '@' + process.env.PG_HOST + ':' + process.env.PG_PORT + '/' + process.env.PG_DATABASE;
  console.log("Connection String:", connectionString);
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  console.error("Error: Required PostgreSQL environment variables are not defined.");
  try {
    const env = process.env.NODE_ENV || 'development';
    const config = require(__dirname + '/../config/config.json')[env];
    if (config && config.database) {
      sequelize = new Sequelize(config.database, config.username, config.password, config);
      console.log("Connection String (config.json):", config.database);
    } else {
      console.error("Error: config.json or database property not found in local configuration.");
    }
  } catch (error) {
    console.error("Error loading config.json:", error);
  }
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;