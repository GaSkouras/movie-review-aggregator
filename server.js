// server.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { sequelize } = require('./models');
const errorHandlingMiddleware = require('./errors/errorHandlingMiddleware');

// Middleware
app.use(express.json());

// Routes
app.use('/api', require('./routes/movie')); 

app.use(errorHandlingMiddleware);

// Start the server
sequelize.sync({ force: false })
  .then(() => {
    console.log('Tables created successfully.');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error creating tables:', error);
  });