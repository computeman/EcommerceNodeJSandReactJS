'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Address', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
          key: 'id'
        },
        allowNull: false
      },
      street: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      zip_code: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Address');
  }
};
