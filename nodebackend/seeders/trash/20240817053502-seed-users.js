'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('User', [
      {
        id:1,
        name: 'John Doe',
        email: 'john@example.com',
        password_hash: bcrypt.hashSync('password123', 10),
        is_admin: false,
        is_owner: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:2,
        name: 'Admin User',
        email: 'admin@example.com',
        password_hash: bcrypt.hashSync('adminpass', 10),
        is_admin: true,
        is_owner: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:3,
        name: 'Owner User',
        email: 'owner@example.com',
        password_hash: bcrypt.hashSync('ownerpass', 10),
        is_admin: false,
        is_owner: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', null, {});
  }
};
