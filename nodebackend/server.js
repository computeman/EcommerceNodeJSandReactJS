// server.js

const express = require('express');
const sequelize = require('./db'); // Import the Sequelize instance
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

// Register your routes
app.use('/api/users', userRoutes);

// Sync all models and start the server
sequelize.sync({ force: false }).then(() => { // force: true will drop the table if it already exists
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}).catch(error => {
  console.error('Unable to start the server:', error);
});
