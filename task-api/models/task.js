'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      // Defina associações aqui se necessário
    }
  }
  
  Task.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'O título é obrigatório'
        },
        len: {
          args: [1, 255],
          msg: 'O título deve ter entre 1 e 255 caracteres'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'A descrição é obrigatória'
        }
      }
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks'
  });
  
  return Task;
};


