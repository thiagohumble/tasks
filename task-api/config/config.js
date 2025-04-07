require('dotenv').config();

console.log("config.js is being executed!");

const isProduction = process.env.NODE_ENV === 'production';

let config;

if (isProduction) {
  // Configuração de produção (usando DATABASE_URL)
  config = {
    dialect: 'postgres',
    use_env_variable: 'DATABASE_URL',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  };
} else {
  // Configuração local (usando config.json)
  config = {
    username: process.env.DB_USER || 'postgres', // Use variáveis de ambiente ou defaults
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'tasks',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432, // Adicione a porta 5432
  };
}

module.exports = {
  development: config,
  production: config,
};