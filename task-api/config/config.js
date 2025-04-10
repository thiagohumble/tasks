require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

let config;

if (isProduction) {
  // Configuração para HostGator
  config = {
    username: process.env.DB_USER || 'humble80_usuario', 
    password: process.env.DB_PASSWORD || 'W)ss)z1}7vH3', 
    database: process.env.DB_NAME || 'humble80_tasks',
    host: process.env.DB_HOST || 'br1020.hostgator.com.br', 
    dialect: 'mysql', 
    port: process.env.DB_PORT || 3306 
  };
} else {
  // Configuração local (desenvolvimento)
  config = {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'tasks',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
  };
}

module.exports = {
  development: config,
  production: config,
  test: config
};