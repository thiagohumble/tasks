'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tasks extends Model {

    static associate(models) {
      // definir deopis associação
    }
  }
  Tasks.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    done: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Tasks',
  });
  return Tasks;
};