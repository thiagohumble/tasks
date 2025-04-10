'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tasks', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    
    await queryInterface.addIndex('tasks', ['userId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tasks', 'userId');
  }
};