'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      // definir associações aqui se necessário
    }
  }
  
  Task.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    done: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Task', // Nome no singular
    tableName: 'tasks' // Nome da tabela no plural (opcional)
  });
  
  return Task;
};