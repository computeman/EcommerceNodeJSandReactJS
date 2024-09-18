// db.js

const { Sequelize } = require('sequelize');
require('dotenv').config(); // To load environment variables from .env file

// Create a new Sequelize instance with your database configuration
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres', // or 'mysql' | 'sqlite' | 'mariadb' | 'mssql'
  logging: false,      // Disable logging; default: console.log
});

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
