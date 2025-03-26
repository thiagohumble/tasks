'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const db = {};

let sequelize;
const env = process.env.NODE_ENV || 'development';

if (process.env.DATABASE_URL) {
  // Usa DATABASE_URL se estiver disponível (como no Render)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else if (process.env.PG_DATABASE && process.env.PG_USER && process.env.PG_PASSWORD && process.env.PG_HOST && process.env.PG_PORT) {
  // Usa as variáveis PG_* se DATABASE_URL não estiver definido
  const connectionString = 'postgres://' + process.env.PG_USER + ':' + process.env.PG_PASSWORD + '@' + process.env.PG_HOST + ':' + process.env.PG_PORT + '/' + process.env.PG_DATABASE;
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
  // Configuração padrão do arquivo config
  const config = require(__dirname + '/../config/config.js')[env];
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Carregar modelos
fs.readdirSync(__dirname)
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

// Configurar associações
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;