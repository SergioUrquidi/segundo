const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require(path.join(__dirname, 'routes'));
const { sequelize } = require(path.join(__dirname, 'models'));

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