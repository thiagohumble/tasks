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