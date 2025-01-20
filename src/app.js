const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3080;
async function startServer() {
    try {
      await sequelize.authenticate();
      console.log('Database connection established successfully.');
      await sequelize.sync({ force: false });
      
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Unable to start server:', error);
    }
  }
  
  startServer();
  
  module.exports = app;