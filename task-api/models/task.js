'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      // Defina associações aqui se necessário
    }
  }
  
  Task.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    done: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks'
  });
  
  return Task;
};


